import type { DocumentMetadata } from "../models/Document";
import type { Workspace } from "../models/Workspace";

export interface OpenWorkspaceResult {
  workspace: Workspace;
  documents: Array<Omit<DocumentMetadata, "updatedAt"> & { updatedAt?: string }>;
}

declare global {
  interface Window {
    markdownEditor?: {
      platform: NodeJS.Platform;
      openWorkspace: () => Promise<OpenWorkspaceResult | null>;
    };
  }
}
