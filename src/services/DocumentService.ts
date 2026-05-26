import type { Document } from "../models/Document";
import type { StorageProvider } from "../storage/StorageProvider";

export class DocumentService {
  constructor(private readonly storageProvider: StorageProvider) {}

  readDocument(path: string): Promise<Document> {
    return this.storageProvider.readDocument(path);
  }

  async saveDocument(document: Document): Promise<void> {
    await this.storageProvider.writeDocument(document);
  }
}
