import type { Document, DocumentMetadata } from "../models/Document";
import type { Workspace } from "../models/Workspace";

export interface OpenWorkspaceResult {
  workspace: Workspace;
  documents: Array<Omit<DocumentMetadata, "updatedAt"> & { updatedAt?: string }>;
}

export type OpenDocumentResult = OpenWorkspaceResult & {
  document: ReadDocumentResult;
};

export type ReadDocumentResult = Omit<Document, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export interface DocumentMutationResult {
  document: ReadDocumentResult;
  documents: OpenWorkspaceResult["documents"];
}

export interface DeleteDocumentResult {
  documents: OpenWorkspaceResult["documents"];
}

declare global {
  interface Window {
    markdownEditor?: {
      platform: NodeJS.Platform;
      openWorkspace: () => Promise<OpenWorkspaceResult | null>;
      openDocument: () => Promise<OpenDocumentResult | null>;
      readDocument: (documentPath: string) => Promise<ReadDocumentResult>;
      writeDocument: (documentPath: string, content: string) => Promise<ReadDocumentResult>;
      createDocument: (documentPath: string) => Promise<DocumentMutationResult>;
      renameDocument: (currentPath: string, nextPath: string) => Promise<DocumentMutationResult>;
      deleteDocument: (documentPath: string) => Promise<DeleteDocumentResult>;
      onOpenWorkspaceRequested: (callback: () => void) => () => void;
      onOpenDocumentRequested: (callback: () => void) => () => void;
      onSaveDocumentRequested: (callback: () => void) => () => void;
    };
  }
}
