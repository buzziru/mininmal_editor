import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LocalFileStorage } from "./LocalFileStorage";

describe("LocalFileStorage", () => {
  let workspaceRoot: string;
  let storage: LocalFileStorage;

  beforeEach(async () => {
    workspaceRoot = await mkdtemp(path.join(os.tmpdir(), "mark-editor-"));
    storage = new LocalFileStorage(workspaceRoot);
  });

  afterEach(async () => {
    await rm(workspaceRoot, { recursive: true, force: true });
  });

  it("lists markdown documents recursively and ignores other files", async () => {
    await writeFile(path.join(workspaceRoot, "notes.md"), "# Notes", "utf8");
    await writeFile(path.join(workspaceRoot, "todo.txt"), "Not markdown", "utf8");
    await mkdir(path.join(workspaceRoot, "research"));
    await writeFile(path.join(workspaceRoot, "research", "papers.md"), "# Papers", "utf8");

    const documents = await storage.listDocuments();

    expect(documents.map((document) => document.path)).toEqual(["notes.md", "research/papers.md"]);
    expect(documents.map((document) => document.title)).toEqual(["notes", "papers"]);
  });

  it("reads document content and uses the first h1 as the title", async () => {
    await writeFile(path.join(workspaceRoot, "daily.md"), "# Daily Notes\n\nBody", "utf8");

    const document = await storage.readDocument("daily.md");

    expect(document).toMatchObject({
      path: "daily.md",
      title: "Daily Notes",
      content: "# Daily Notes\n\nBody",
    });
    expect(document.createdAt).toBeInstanceOf(Date);
    expect(document.updatedAt).toBeInstanceOf(Date);
  });

  it("writes existing markdown documents", async () => {
    await writeFile(path.join(workspaceRoot, "daily.md"), "Before", "utf8");

    await storage.writeDocument({
      path: "daily.md",
      title: "daily",
      content: "After",
    });

    await expect(readFile(path.join(workspaceRoot, "daily.md"), "utf8")).resolves.toBe("After");
  });

  it("creates markdown documents in nested folders", async () => {
    const document = await storage.createDocument("ideas/startup.md", "# Startup");

    expect(document).toMatchObject({
      path: "ideas/startup.md",
      title: "Startup",
      content: "# Startup",
    });
    await expect(readFile(path.join(workspaceRoot, "ideas", "startup.md"), "utf8")).resolves.toBe(
      "# Startup",
    );
  });

  it("does not overwrite an existing document when creating", async () => {
    await writeFile(path.join(workspaceRoot, "daily.md"), "Existing", "utf8");

    await expect(storage.createDocument("daily.md", "New")).rejects.toThrow("already exists");
    await expect(readFile(path.join(workspaceRoot, "daily.md"), "utf8")).resolves.toBe("Existing");
  });

  it("renames markdown documents without overwriting the destination", async () => {
    await writeFile(path.join(workspaceRoot, "old.md"), "Content", "utf8");
    await writeFile(path.join(workspaceRoot, "existing.md"), "Existing", "utf8");

    const renamed = await storage.renameDocument("old.md", "archive/new.md");

    expect(renamed).toMatchObject({
      path: "archive/new.md",
      title: "new",
    });
    await expect(readFile(path.join(workspaceRoot, "archive", "new.md"), "utf8")).resolves.toBe(
      "Content",
    );
    await expect(storage.renameDocument("archive/new.md", "existing.md")).rejects.toThrow(
      "already exists",
    );
  });

  it("deletes markdown documents", async () => {
    const filePath = path.join(workspaceRoot, "daily.md");
    await writeFile(filePath, "Content", "utf8");

    await storage.deleteDocument("daily.md");

    await expect(stat(filePath)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("rejects unsupported and unsafe document paths", async () => {
    await expect(storage.readDocument("notes.txt")).rejects.toThrow("Only .md");
    await expect(storage.readDocument("../outside.md")).rejects.toThrow("inside the workspace");
    await expect(storage.readDocument(path.join(workspaceRoot, "absolute.md"))).rejects.toThrow(
      "relative to the workspace",
    );
  });
});
