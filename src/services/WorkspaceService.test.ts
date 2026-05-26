import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Workspace } from "../models/Workspace";
import type { StorageProvider } from "../storage/StorageProvider";
import { WorkspaceService } from "./WorkspaceService";

describe("WorkspaceService", () => {
  let workspaceRoot: string;

  beforeEach(async () => {
    workspaceRoot = await mkdtemp(path.join(os.tmpdir(), "mark-editor-workspace-"));
  });

  afterEach(async () => {
    await rm(workspaceRoot, { recursive: true, force: true });
  });

  it("opens a workspace and exposes its document metadata", async () => {
    await writeFile(path.join(workspaceRoot, "notes.md"), "# Notes", "utf8");

    const service = new WorkspaceService();
    const workspace = await service.openWorkspace(workspaceRoot);
    const documents = await service.listDocuments();

    expect(workspace).toEqual({ rootPath: workspaceRoot });
    expect(service.getCurrentWorkspace()).toEqual({ rootPath: workspaceRoot });
    expect(documents.map((document) => document.path)).toEqual(["notes.md"]);
  });

  it("does not replace the current workspace when opening fails", async () => {
    const existingWorkspace: Workspace = { rootPath: workspaceRoot };
    const storageProvider = createStorageProvider();
    const service = new WorkspaceService((workspace) => {
      if (workspace.rootPath === workspaceRoot) {
        return storageProvider;
      }

      return createStorageProvider(new Error("missing folder"));
    });

    await service.openWorkspace(workspaceRoot);

    await expect(service.openWorkspace(path.join(workspaceRoot, "missing"))).rejects.toThrow(
      "Unable to open workspace",
    );
    expect(service.getCurrentWorkspace()).toEqual(existingWorkspace);
  });

  it("requires an open workspace before listing documents", async () => {
    const service = new WorkspaceService();

    await expect(service.listDocuments()).rejects.toThrow("No workspace is open.");
  });

  it("reloads document metadata through the active storage provider", async () => {
    const storageProvider = createStorageProvider();
    const service = new WorkspaceService(() => storageProvider);

    await service.openWorkspace(workspaceRoot);
    await service.listDocuments();

    expect(storageProvider.listDocuments).toHaveBeenCalledTimes(2);
  });
});

function createStorageProvider(listError?: Error): StorageProvider {
  return {
    listDocuments: vi.fn(async () => {
      if (listError) {
        throw listError;
      }

      return [];
    }),
    readDocument: vi.fn(),
    writeDocument: vi.fn(),
    createDocument: vi.fn(),
    renameDocument: vi.fn(),
    deleteDocument: vi.fn(),
  };
}
