import type { DocumentMetadata } from "../models/Document";
import type { Workspace } from "../models/Workspace";
import { LocalFileStorage } from "../storage/LocalFileStorage";
import type { StorageProvider } from "../storage/StorageProvider";

export type StorageProviderFactory = (workspace: Workspace) => StorageProvider;

export class WorkspaceService {
  private currentWorkspace?: Workspace;
  private storageProvider?: StorageProvider;

  constructor(
    private readonly createStorageProvider: StorageProviderFactory = (workspace) =>
      new LocalFileStorage(workspace.rootPath),
  ) {}

  async openWorkspace(rootPath: string): Promise<Workspace> {
    const workspace: Workspace = { rootPath };
    const storageProvider = this.createStorageProvider(workspace);

    try {
      await storageProvider.listDocuments();
    } catch (error) {
      throw new Error(`Unable to open workspace: ${rootPath}`, { cause: error });
    }

    this.currentWorkspace = workspace;
    this.storageProvider = storageProvider;

    return workspace;
  }

  getCurrentWorkspace(): Workspace | undefined {
    return this.currentWorkspace;
  }

  async listDocuments(): Promise<DocumentMetadata[]> {
    return this.requireStorageProvider().listDocuments();
  }

  private requireStorageProvider(): StorageProvider {
    if (!this.storageProvider) {
      throw new Error("No workspace is open.");
    }

    return this.storageProvider;
  }
}
