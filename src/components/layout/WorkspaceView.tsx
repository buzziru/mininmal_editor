import { useState } from "react";

import type { Document, DocumentMetadata } from "../../models/Document";
import type { Workspace } from "../../models/Workspace";

const sampleDocuments = ["notes.md", "projects.md", "ideas/startup.md"];

export function WorkspaceView() {
  const [workspace, setWorkspace] = useState<Workspace>();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [documentContent, setDocumentContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const visibleDocuments = workspace ? documents.map((document) => document.path) : sampleDocuments;

  const openWorkspace = async (): Promise<void> => {
    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.openWorkspace();

      if (!result) {
        return;
      }

      setWorkspace(result.workspace);
      setSelectedDocument(undefined);
      setDocumentContent("");

      const nextDocuments = result.documents.map((document) => ({
        ...document,
        updatedAt: document.updatedAt ? new Date(document.updatedAt) : undefined,
      }));

      setDocuments(nextDocuments);

      if (nextDocuments[0]) {
        await loadDocument(nextDocuments[0].path);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open workspace.");
    }
  };

  const loadDocument = async (documentPath: string): Promise<void> => {
    setErrorMessage(undefined);
    setIsLoadingDocument(true);

    try {
      const result = await window.markdownEditor?.readDocument(documentPath);

      if (!result) {
        return;
      }

      const nextDocument: Document = {
        ...result,
        createdAt: result.createdAt ? new Date(result.createdAt) : undefined,
        updatedAt: result.updatedAt ? new Date(result.updatedAt) : undefined,
      };

      setSelectedDocument(nextDocument);
      setDocumentContent(nextDocument.content);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to read document.");
    } finally {
      setIsLoadingDocument(false);
    }
  };

  return (
    <main className="workspace-shell" aria-label="Markdown editor workspace">
      <aside className="pane file-pane" aria-label="File list">
        <header className="pane-header">
          <h1>Files</h1>
          <button type="button" className="pane-action" onClick={openWorkspace}>
            Open
          </button>
        </header>
        {workspace ? <p className="workspace-path">{workspace.rootPath}</p> : null}
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
          <h2>{selectedDocument ? selectedDocument.title : "Editor"}</h2>
        </header>
        {selectedDocument ? (
          <textarea
            className="editor-input"
            value={documentContent}
            spellCheck="false"
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
        </header>
        <article className="preview-content">
          {selectedDocument ? (
            <pre className="preview-plain-text">{documentContent}</pre>
          ) : (
            <p className="empty-state">Select a document to preview its content.</p>
          )}
        </article>
      </section>
    </main>
  );
}
