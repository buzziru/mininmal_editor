import type { Document, DocumentMetadata } from "../models/Document";

export interface StorageProvider {
  listDocuments(): Promise<DocumentMetadata[]>;
  readDocument(path: string): Promise<Document>;
  writeDocument(document: Document): Promise<void>;
  createDocument(path: string, content: string): Promise<Document>;
  renameDocument(currentPath: string, nextPath: string): Promise<DocumentMetadata>;
  deleteDocument(path: string): Promise<void>;
}
