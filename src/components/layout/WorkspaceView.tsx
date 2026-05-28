import type { KeyboardEvent, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { Document, DocumentMetadata } from "../../models/Document";
import type { Theme } from "../../models/Theme";
import type { Workspace } from "../../models/Workspace";
import { LinkService } from "../../services/LinkService";
import { TagService } from "../../services/TagService";
import { ThemeService } from "../../services/ThemeService";

const sampleDocuments = ["notes.md", "projects.md", "ideas/startup.md"];
const minFilePanelWidth = 220;
const maxFilePanelWidth = 420;
const defaultFilePanelWidth = 260;
const minEditorPaneWidth = 360;
const minPreviewPaneWidth = 320;
const resizeHandleWidth = 6;
type FileFormMode = "create" | "rename";

type ResizeDragState = {
  startX: number;
  startWidth: number;
};

export function WorkspaceView() {
  const themeService = useMemo(() => new ThemeService(window.localStorage), []);
  const linkService = useMemo(() => new LinkService(), []);
  const tagService = useMemo(() => new TagService(), []);
  const [theme, setTheme] = useState<Theme>(() => themeService.getInitialTheme());
  const [workspace, setWorkspace] = useState<Workspace>();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [documentContent, setDocumentContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [fileFormMode, setFileFormMode] = useState<FileFormMode>();
  const [newDocumentPath, setNewDocumentPath] = useState("untitled.md");
  const [renameDocumentPath, setRenameDocumentPath] = useState("");
  const [isFilePanelOpen, setIsFilePanelOpen] = useState(true);
  const [filePanelWidth, setFilePanelWidth] = useState(defaultFilePanelWidth);
  const [editorPaneWidth, setEditorPaneWidth] = useState<number>();
  const [isResizingFilePanel, setIsResizingFilePanel] = useState(false);
  const [isResizingEditorPane, setIsResizingEditorPane] = useState(false);
  const fileResizeDragState = useRef<ResizeDragState | undefined>(undefined);
  const editorResizeDragState = useRef<ResizeDragState | undefined>(undefined);
  const workspaceLayoutRef = useRef<HTMLDivElement | null>(null);
  const editorPaneRef = useRef<HTMLElement | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isSavingDocument, setIsSavingDocument] = useState(false);
  const hasUnsavedChanges = selectedDocument ? documentContent !== selectedDocument.content : false;
  const editorTitle = selectedDocument
    ? `${selectedDocument.title}${hasUnsavedChanges ? " *" : ""}`
    : "Editor";
  const visibleDocuments = workspace ? documents.map((document) => document.path) : sampleDocuments;
  const previewContent = useMemo(
    () => linkService.renderInternalLinks(documentContent, documents),
    [documentContent, documents, linkService],
  );
  const currentTags = useMemo(
    () => tagService.extractTags(documentContent),
    [documentContent, tagService],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeService.saveTheme(theme);
  }, [theme, themeService]);

  useEffect(() => {
    if (!isResizingFilePanel) {
      return;
    }

    const handlePointerMove = (event: PointerEvent): void => {
      if (!fileResizeDragState.current) {
        return;
      }

      const nextWidth =
        fileResizeDragState.current.startWidth + event.clientX - fileResizeDragState.current.startX;

      const clampedWidth = clampFilePanelWidth(nextWidth);

      setFilePanelWidth(clampedWidth);
      setEditorPaneWidth((currentWidth) =>
        currentWidth ? clampEditorPaneWidth(currentWidth, clampedWidth) : currentWidth,
      );
    };

    const stopResizing = (): void => {
      fileResizeDragState.current = undefined;
      setIsResizingFilePanel(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
    };
  }, [isResizingFilePanel]);

  useEffect(() => {
    if (!isResizingEditorPane) {
      return;
    }

    const handlePointerMove = (event: PointerEvent): void => {
      if (!editorResizeDragState.current) {
        return;
      }

      const nextWidth =
        editorResizeDragState.current.startWidth +
        event.clientX -
        editorResizeDragState.current.startX;

      setEditorPaneWidth(clampEditorPaneWidth(nextWidth));
    };

    const stopResizing = (): void => {
      editorResizeDragState.current = undefined;
      setIsResizingEditorPane(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
    };
  }, [isResizingEditorPane]);

  const toggleTheme = (): void => {
    setTheme((currentTheme) => themeService.getNextTheme(currentTheme));
  };

  const startFilePanelResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    fileResizeDragState.current = {
      startX: event.clientX,
      startWidth: filePanelWidth,
    };
    setIsResizingFilePanel(true);
  };

  const resizeFilePanelWithKeyboard = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    setFilePanelWidth((currentWidth) => {
      const nextWidth = clampFilePanelWidth(currentWidth + (event.key === "ArrowRight" ? 16 : -16));

      setEditorPaneWidth((currentEditorWidth) =>
        currentEditorWidth ? clampEditorPaneWidth(currentEditorWidth, nextWidth) : currentEditorWidth,
      );

      return nextWidth;
    });
  };

  const clampEditorPaneWidth = (width: number, nextFilePanelWidth = filePanelWidth): number => {
    const layoutWidth = workspaceLayoutRef.current?.getBoundingClientRect().width;
    const fixedWidth = isFilePanelOpen
      ? nextFilePanelWidth + resizeHandleWidth * 2
      : resizeHandleWidth;
    const maxEditorPaneWidth = layoutWidth
      ? layoutWidth - fixedWidth - minPreviewPaneWidth
      : width;

    return Math.min(
      Math.max(width, minEditorPaneWidth),
      Math.max(minEditorPaneWidth, maxEditorPaneWidth),
    );
  };

  const startEditorPaneResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    editorResizeDragState.current = {
      startX: event.clientX,
      startWidth: editorPaneRef.current?.getBoundingClientRect().width ?? minEditorPaneWidth,
    };
    setIsResizingEditorPane(true);
  };

  const resizeEditorPaneWithKeyboard = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    setEditorPaneWidth((currentWidth) =>
      clampEditorPaneWidth(
        (currentWidth ?? editorPaneRef.current?.getBoundingClientRect().width ?? minEditorPaneWidth) +
          (event.key === "ArrowRight" ? 16 : -16),
      ),
    );
  };

  const openWorkspace = async (): Promise<void> => {
    if (!canDiscardUnsavedChanges()) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.openWorkspace();

      if (!result) {
        return;
      }

      setWorkspace(result.workspace);

      const nextDocuments = hydrateDocuments(result.documents);

      setDocuments(nextDocuments);
      setSelectedDocument(undefined);
      setDocumentContent("");
      setFileFormMode(undefined);

      if (nextDocuments[0]) {
        await loadDocument(nextDocuments[0].path, { forceReload: true, skipUnsavedCheck: true });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open workspace.");
    }
  };

  const openDocument = async (): Promise<void> => {
    if (!canDiscardUnsavedChanges()) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.openDocument();

      if (!result) {
        return;
      }

      const nextDocument = hydrateDocument(result.document);

      setWorkspace(result.workspace);
      setDocuments(hydrateDocuments(result.documents));
      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
      setFileFormMode(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open document.");
    }
  };

  const canDiscardUnsavedChanges = (): boolean => {
    return !hasUnsavedChanges || window.confirm("Discard unsaved changes?");
  };

  const loadDocument = async (
    documentPath: string,
    options: { forceReload?: boolean; skipUnsavedCheck?: boolean } = {},
  ): Promise<void> => {
    if (!options.forceReload && documentPath === selectedDocument?.path) {
      return;
    }

    if (!options.skipUnsavedCheck && !canDiscardUnsavedChanges()) {
      return;
    }

    setErrorMessage(undefined);
    setIsLoadingDocument(true);

    try {
      const result = await window.markdownEditor?.readDocument(documentPath);

      if (!result) {
        return;
      }

      const nextDocument = hydrateDocument(result);

      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
      setFileFormMode(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to read document.");
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const saveDocument = async (): Promise<void> => {
    if (!selectedDocument || !hasUnsavedChanges) {
      return;
    }

    setErrorMessage(undefined);
    setIsSavingDocument(true);

    try {
      const result = await window.markdownEditor?.writeDocument(selectedDocument.path, documentContent);

      if (!result) {
        throw new Error("Unable to save document.");
      }

      const savedDocument = hydrateDocument(result);

      setSelectedDocument(savedDocument);
      setDocumentContent(savedDocument.content);
      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          document.path === savedDocument.path
            ? {
                ...document,
                title: savedDocument.title,
                updatedAt: savedDocument.updatedAt,
              }
            : document,
        ),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save document.");
    } finally {
      setIsSavingDocument(false);
    }
  };

  const createDocument = async (documentPath: string): Promise<void> => {
    if (!workspace || !canDiscardUnsavedChanges()) {
      return;
    }

    const requestedPath = documentPath.trim();

    if (!requestedPath) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.createDocument(requestedPath);

      if (!result) {
        throw new Error("Unable to create document.");
      }

      const nextDocument = hydrateDocument(result.document);

      setDocuments(hydrateDocuments(result.documents));
      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
      setNewDocumentPath("untitled.md");
      setFileFormMode(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create document.");
    }
  };

  const renameDocument = async (nextPath: string): Promise<void> => {
    if (!selectedDocument || !canDiscardUnsavedChanges()) {
      return;
    }

    const requestedPath = nextPath.trim();

    if (!requestedPath || requestedPath === selectedDocument.path) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.renameDocument(selectedDocument.path, requestedPath);

      if (!result) {
        throw new Error("Unable to rename document.");
      }

      const nextDocument = hydrateDocument(result.document);

      setDocuments(hydrateDocuments(result.documents));
      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
      setRenameDocumentPath(nextDocument.path);
      setFileFormMode(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to rename document.");
    }
  };

  const submitFileForm = (): void => {
    if (fileFormMode === "create") {
      void createDocument(newDocumentPath);
      return;
    }

    if (fileFormMode === "rename") {
      void renameDocument(renameDocumentPath);
    }
  };

  const deleteDocument = async (): Promise<void> => {
    if (!selectedDocument || !canDiscardUnsavedChanges()) {
      return;
    }

    if (!window.confirm(`Delete ${selectedDocument.path}? This cannot be undone.`)) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.deleteDocument(selectedDocument.path);

      if (!result) {
        throw new Error("Unable to delete document.");
      }

      const nextDocuments = hydrateDocuments(result.documents);

      setDocuments(nextDocuments);
      setSelectedDocument(undefined);
      setDocumentContent("");
      setFileFormMode(undefined);

      if (nextDocuments[0]) {
        await loadDocument(nextDocuments[0].path, { forceReload: true, skipUnsavedCheck: true });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete document.");
    }
  };

  const openInternalLink = async (href: string): Promise<void> => {
    const linkPrefix = "#internal-link/";

    if (!href.startsWith(linkPrefix)) {
      return;
    }

    const [, rawTargetName] = href.slice(linkPrefix.length).split("/");
    const targetName = rawTargetName ? decodeURIComponent(rawTargetName) : "";
    const targetDocument = linkService.resolveDocumentLink(targetName, documents);

    if (!targetDocument) {
      setErrorMessage(`No document found for internal link: ${targetName}`);
      return;
    }

    await loadDocument(targetDocument.path);
  };

  const handlePreviewLinkClick = (event: MouseEvent<HTMLAnchorElement>, href?: string): void => {
    if (!href?.startsWith("#internal-link/")) {
      return;
    }

    event.preventDefault();
    void openInternalLink(href);
  };

  useEffect(() => {
    const removeOpenWorkspaceListener = window.markdownEditor?.onOpenWorkspaceRequested(() => {
      void openWorkspace();
    });
    const removeOpenDocumentListener = window.markdownEditor?.onOpenDocumentRequested(() => {
      void openDocument();
    });
    const removeSaveDocumentListener = window.markdownEditor?.onSaveDocumentRequested(() => {
      void saveDocument();
    });

    return () => {
      removeOpenWorkspaceListener?.();
      removeOpenDocumentListener?.();
      removeSaveDocumentListener?.();
    };
  });

  return (
    <main className="workspace-shell" aria-label="Markdown editor workspace">
      <nav className="activity-bar" aria-label="Workspace views">
        <button
          type="button"
          className="activity-bar-button"
          title="Explorer"
          aria-label="Toggle file explorer"
          aria-pressed={isFilePanelOpen}
          aria-controls="file-side-panel"
          onClick={() => {
            setIsFilePanelOpen((currentValue) => !currentValue);
          }}
        >
          <FolderIcon />
        </button>
      </nav>

      <div
        ref={workspaceLayoutRef}
        className={
          [
            "workspace-layout",
            isFilePanelOpen ? undefined : "file-panel-closed",
            isResizingFilePanel ? "is-resizing-file-panel" : undefined,
            isResizingEditorPane ? "is-resizing-editor-pane" : undefined,
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        {isFilePanelOpen ? (
          <aside
            id="file-side-panel"
            className="pane file-pane"
            aria-label="File list"
            style={{ flexBasis: filePanelWidth }}
          >
            <header className="pane-header">
              <h1>Files</h1>
              <div className="file-header-actions">
                <button type="button" className="pane-action" onClick={openWorkspace}>
                  Open
                </button>
                <button
                  type="button"
                  className="pane-action"
                  disabled={!workspace}
                  onClick={() => {
                    setFileFormMode("create");
                  }}
                >
                  New
                </button>
              </div>
            </header>
            {workspace ? <p className="workspace-path">{workspace.rootPath}</p> : null}
            {workspace ? (
              <div className="file-actions">
                <button
                  type="button"
                  className="pane-action"
                  disabled={!selectedDocument}
                  onClick={() => {
                    if (selectedDocument) {
                      setRenameDocumentPath(selectedDocument.path);
                    }
                    setFileFormMode("rename");
                  }}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="pane-action danger-action"
                  disabled={!selectedDocument}
                  onClick={() => {
                    void deleteDocument();
                  }}
                >
                  Delete
                </button>
              </div>
            ) : null}
            {workspace && fileFormMode ? (
              <form
                className="file-edit-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitFileForm();
                }}
              >
                <input
                  className="file-path-input"
                  value={fileFormMode === "create" ? newDocumentPath : renameDocumentPath}
                  aria-label={fileFormMode === "create" ? "New Markdown file path" : "Renamed Markdown file path"}
                  autoFocus
                  onChange={(event) => {
                    if (fileFormMode === "create") {
                      setNewDocumentPath(event.target.value);
                      return;
                    }

                    setRenameDocumentPath(event.target.value);
                  }}
                />
                <div className="file-form-actions">
                  <button type="submit" className="pane-action">
                    {fileFormMode === "create" ? "Create" : "Apply"}
                  </button>
                  <button
                    type="button"
                    className="pane-action"
                    onClick={() => {
                      setFileFormMode(undefined);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
            {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
            <nav className="file-list" aria-label="Markdown files">
              {visibleDocuments.map((documentPath) => (
                <button
                  key={documentPath}
                  type="button"
                  className={
                    documentPath === selectedDocument?.path ? "file-list-item is-selected" : "file-list-item"
                  }
                  onClick={() => {
                    void loadDocument(documentPath);
                  }}
                >
                  {documentPath}
                </button>
              ))}
              {workspace && visibleDocuments.length === 0 ? (
                <p className="empty-state">No Markdown files found.</p>
              ) : null}
            </nav>
          </aside>
        ) : null}

        {isFilePanelOpen ? (
          <div
            className="file-panel-resizer"
            role="separator"
            tabIndex={0}
            aria-label="Resize file panel"
            aria-orientation="vertical"
            aria-valuemin={minFilePanelWidth}
            aria-valuemax={maxFilePanelWidth}
            aria-valuenow={filePanelWidth}
            onPointerDown={startFilePanelResize}
            onKeyDown={resizeFilePanelWithKeyboard}
          />
        ) : null}

        <section
          ref={editorPaneRef}
          className="pane editor-pane"
          aria-label="Markdown editor"
          style={editorPaneWidth ? { flex: `0 0 ${editorPaneWidth}px` } : undefined}
        >
          <header className="pane-header">
            <h2>{editorTitle}</h2>
            {selectedDocument ? (
              <div className="editor-actions">
                <span className="save-status" aria-live="polite">
                  {isSavingDocument ? "Saving..." : hasUnsavedChanges ? "Unsaved" : "Saved"}
                </span>
                <button
                  type="button"
                  className="pane-action"
                  disabled={!hasUnsavedChanges || isSavingDocument}
                  onClick={() => {
                    void saveDocument();
                  }}
                >
                  Save
                </button>
              </div>
            ) : null}
          </header>
          {selectedDocument ? (
            <textarea
              className="editor-input"
              value={documentContent}
              spellCheck="false"
              readOnly={isSavingDocument}
              aria-label="Markdown content"
              onChange={(event) => {
                setDocumentContent(event.target.value);
              }}
            />
          ) : (
            <div className="editor-empty-state">
              {isLoadingDocument ? "Loading document..." : "Open a workspace and select a Markdown file."}
            </div>
          )}
        </section>

        <div
          className="editor-preview-resizer"
          role="separator"
          tabIndex={0}
          aria-label="Resize editor and preview panes"
          aria-orientation="vertical"
          aria-valuemin={minEditorPaneWidth}
          aria-valuenow={Math.round(
            editorPaneWidth ?? editorPaneRef.current?.getBoundingClientRect().width ?? minEditorPaneWidth,
          )}
          onPointerDown={startEditorPaneResize}
          onKeyDown={resizeEditorPaneWithKeyboard}
        />

        <section className="pane preview-pane" aria-label="Markdown preview">
          <header className="pane-header">
            <h2>Preview</h2>
            <button
              type="button"
              className="pane-action"
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </header>
          {selectedDocument && currentTags.length > 0 ? (
            <div className="tag-list" aria-label="Current document tags">
              {currentTags.map((tag) => (
                <span key={tag.name} className="tag-chip">
                  #{tag.name}
                </span>
              ))}
            </div>
          ) : null}
          <article className="preview-content">
            {selectedDocument ? (
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => {
                    const isInternalLink = href?.startsWith("#internal-link/");
                    const isMissingInternalLink = href?.startsWith("#internal-link/missing/");

                    return (
                      <a
                        href={href}
                        className={isInternalLink ? "internal-link" : undefined}
                        aria-invalid={isMissingInternalLink || undefined}
                        title={isMissingInternalLink ? "Missing document" : undefined}
                        onClick={(event) => {
                          handlePreviewLinkClick(event, href);
                        }}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {previewContent}
              </ReactMarkdown>
            ) : (
              <p className="empty-state">Select a document to preview its content.</p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

function clampFilePanelWidth(width: number): number {
  return Math.min(Math.max(width, minFilePanelWidth), maxFilePanelWidth);
}

function FolderIcon() {
  return (
    <svg className="activity-bar-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
    </svg>
  );
}

function hydrateDocuments(
  documents: Array<Omit<DocumentMetadata, "updatedAt"> & { updatedAt?: string }>,
): DocumentMetadata[] {
  return documents.map((document) => ({
    ...document,
    updatedAt: document.updatedAt ? new Date(document.updatedAt) : undefined,
  }));
}

function hydrateDocument(
  document: Omit<Document, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  },
): Document {
  return {
    ...document,
    createdAt: document.createdAt ? new Date(document.createdAt) : undefined,
    updatedAt: document.updatedAt ? new Date(document.updatedAt) : undefined,
  };
}
