import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { Document, DocumentMetadata } from "../../models/Document";
import type { Theme } from "../../models/Theme";
import type { Workspace } from "../../models/Workspace";
import { LinkService } from "../../services/LinkService";
import { TagService } from "../../services/TagService";
import { ThemeService } from "../../services/ThemeService";

const sampleDocuments = ["notes.md", "projects.md", "ideas/startup.md"];

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

  const toggleTheme = (): void => {
    setTheme((currentTheme) => themeService.getNextTheme(currentTheme));
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
      setSelectedDocument(undefined);
      setDocumentContent("");

      const nextDocuments = hydrateDocuments(result.documents);

      setDocuments(nextDocuments);

      if (nextDocuments[0]) {
        await loadDocument(nextDocuments[0].path, { skipUnsavedCheck: true });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open workspace.");
    }
  };

  const canDiscardUnsavedChanges = (): boolean => {
    return !hasUnsavedChanges || window.confirm("Discard unsaved changes?");
  };

  const loadDocument = async (
    documentPath: string,
    options: { skipUnsavedCheck?: boolean } = {},
  ): Promise<void> => {
    if (documentPath === selectedDocument?.path) {
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

  const createDocument = async (): Promise<void> => {
    if (!workspace || !canDiscardUnsavedChanges()) {
      return;
    }

    const documentPath = window.prompt("New Markdown file path", "untitled.md");

    if (!documentPath) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.createDocument(documentPath);

      if (!result) {
        throw new Error("Unable to create document.");
      }

      const nextDocument = hydrateDocument(result.document);

      setDocuments(hydrateDocuments(result.documents));
      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create document.");
    }
  };

  const renameDocument = async (): Promise<void> => {
    if (!selectedDocument || !canDiscardUnsavedChanges()) {
      return;
    }

    const nextPath = window.prompt("Rename Markdown file", selectedDocument.path);

    if (!nextPath || nextPath === selectedDocument.path) {
      return;
    }

    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.renameDocument(selectedDocument.path, nextPath);

      if (!result) {
        throw new Error("Unable to rename document.");
      }

      const nextDocument = hydrateDocument(result.document);

      setDocuments(hydrateDocuments(result.documents));
      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to rename document.");
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

      if (nextDocuments[0]) {
        await loadDocument(nextDocuments[0].path, { skipUnsavedCheck: true });
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

  return (
    <main className="workspace-shell" aria-label="Markdown editor workspace">
      <aside className="pane file-pane" aria-label="File list">
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
                void createDocument();
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
                void renameDocument();
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

      <section className="pane editor-pane" aria-label="Markdown editor">
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
    </main>
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
