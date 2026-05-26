import { describe, expect, it, vi } from "vitest";

import type { Document } from "../models/Document";
import type { StorageProvider } from "../storage/StorageProvider";
import { DocumentService } from "./DocumentService";

describe("DocumentService", () => {
  it("reads documents through the storage provider", async () => {
    const document: Document = {
      path: "notes.md",
      title: "Notes",
      content: "# Notes",
    };
    const storageProvider = createStorageProvider({ readDocument: vi.fn(async () => document) });
    const service = new DocumentService(storageProvider);

    await expect(service.readDocument("notes.md")).resolves.toEqual(document);
    expect(storageProvider.readDocument).toHaveBeenCalledWith("notes.md");
  });

  it("saves documents through the storage provider", async () => {
    const document: Document = {
      path: "notes.md",
      title: "Notes",
      content: "# Updated",
    };
    const storageProvider = createStorageProvider();
    const service = new DocumentService(storageProvider);

    await service.saveDocument(document);

    expect(storageProvider.writeDocument).toHaveBeenCalledWith(document);
  });
});

function createStorageProvider(overrides: Partial<StorageProvider> = {}): StorageProvider {
  return {
    listDocuments: vi.fn(),
    readDocument: vi.fn(),
    writeDocument: vi.fn(),
    createDocument: vi.fn(),
    renameDocument: vi.fn(),
    deleteDocument: vi.fn(),
    ...overrides,
  };
}
