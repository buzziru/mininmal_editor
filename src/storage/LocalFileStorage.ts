import { mkdir, readdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Document, DocumentMetadata } from "../models/Document";
import type { StorageProvider } from "./StorageProvider";

export class LocalFileStorage implements StorageProvider {
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  async listDocuments(): Promise<DocumentMetadata[]> {
    const documents = await this.listMarkdownFiles(this.workspaceRoot);

    return documents.sort((left, right) => left.path.localeCompare(right.path));
  }

  async readDocument(documentPath: string): Promise<Document> {
    const filePath = this.resolveDocumentPath(documentPath);
    const [content, fileStats] = await Promise.all([readFile(filePath, "utf8"), stat(filePath)]);

    return {
      path: this.toDocumentPath(filePath),
      title: getDocumentTitle(content, filePath),
      content,
      createdAt: fileStats.birthtime,
      updatedAt: fileStats.mtime,
    };
  }

  async writeDocument(document: Document): Promise<void> {
    const filePath = this.resolveDocumentPath(document.path);
    await stat(filePath);
    await writeFile(filePath, document.content, "utf8");
  }

  async createDocument(documentPath: string, content: string): Promise<Document> {
    const filePath = this.resolveDocumentPath(documentPath);

    if (await pathExists(filePath)) {
      throw new Error(`Document already exists: ${documentPath}`);
    }

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");

    return this.readDocument(documentPath);
  }

  async renameDocument(currentPath: string, nextPath: string): Promise<DocumentMetadata> {
    const currentFilePath = this.resolveDocumentPath(currentPath);
    const nextFilePath = this.resolveDocumentPath(nextPath);

    if (await pathExists(nextFilePath)) {
      throw new Error(`Document already exists: ${nextPath}`);
    }

    await mkdir(path.dirname(nextFilePath), { recursive: true });
    await rename(currentFilePath, nextFilePath);

    const fileStats = await stat(nextFilePath);

    return {
      path: this.toDocumentPath(nextFilePath),
      title: getFileTitle(nextFilePath),
      updatedAt: fileStats.mtime,
    };
  }

  async deleteDocument(documentPath: string): Promise<void> {
    const filePath = this.resolveDocumentPath(documentPath);
    await unlink(filePath);
  }

  private async listMarkdownFiles(directoryPath: string): Promise<DocumentMetadata[]> {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const documents: DocumentMetadata[] = [];

    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        documents.push(...(await this.listMarkdownFiles(entryPath)));
        continue;
      }

      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".md") {
        continue;
      }

      const fileStats = await stat(entryPath);
      documents.push({
        path: this.toDocumentPath(entryPath),
        title: getFileTitle(entryPath),
        updatedAt: fileStats.mtime,
      });
    }

    return documents;
  }

  private resolveDocumentPath(documentPath: string): string {
    if (path.isAbsolute(documentPath)) {
      throw new Error(`Document path must be relative to the workspace: ${documentPath}`);
    }

    if (path.extname(documentPath).toLowerCase() !== ".md") {
      throw new Error(`Only .md documents are supported: ${documentPath}`);
    }

    const resolvedPath = path.resolve(this.workspaceRoot, documentPath);
    const relativePath = path.relative(this.workspaceRoot, resolvedPath);

    if (relativePath === "" || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      throw new Error(`Document path must stay inside the workspace: ${documentPath}`);
    }

    return resolvedPath;
  }

  private toDocumentPath(filePath: string): string {
    return path.relative(this.workspaceRoot, filePath).split(path.sep).join("/");
  }
}

function getDocumentTitle(content: string, filePath: string): string {
  const heading = content
    .split(/\r?\n/)
    .map((line) => line.match(/^#\s+(.+?)\s*$/)?.[1]?.trim())
    .find((title): title is string => Boolean(title));

  return heading ?? getFileTitle(filePath);
}

function getFileTitle(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
