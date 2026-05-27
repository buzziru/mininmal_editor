import type { Document, DocumentMetadata } from "../models/Document";
import type { Workspace } from "../models/Workspace";

export interface OpenWorkspaceResult {
  workspace: Workspace;
  documents: Array<Omit<DocumentMetadata, "updatedAt"> & { updatedAt?: string }>;
}

export type ReadDocumentResult = Omit<Document, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

declare global {
  interface Window {
    markdownEditor?: {
      platform: NodeJS.Platform;
      openWorkspace: () => Promise<OpenWorkspaceResult | null>;
      readDocument: (documentPath: string) => Promise<ReadDocumentResult>;
      writeDocument: (documentPath: string, content: string) => Promise<ReadDocumentResult>;
    };
  }
}
