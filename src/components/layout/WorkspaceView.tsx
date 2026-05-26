import { useState } from "react";

import type { DocumentMetadata } from "../../models/Document";
import type { Workspace } from "../../models/Workspace";

const sampleDocuments = ["notes.md", "projects.md", "ideas/startup.md"];

export function WorkspaceView() {
  const [workspace, setWorkspace] = useState<Workspace>();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const visibleDocuments = documents.length > 0 ? documents.map((document) => document.path) : sampleDocuments;

  const openWorkspace = async (): Promise<void> => {
    setErrorMessage(undefined);

    try {
      const result = await window.markdownEditor?.openWorkspace();

      if (!result) {
        return;
      }

      setWorkspace(result.workspace);
      setDocuments(
        result.documents.map((document) => ({
          ...document,
          updatedAt: document.updatedAt ? new Date(document.updatedAt) : undefined,
        })),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open workspace.");
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
            <button key={documentPath} type="button" className="file-list-item">
              {documentPath}
            </button>
          ))}
        </nav>
      </aside>

      <section className="pane editor-pane" aria-label="Markdown editor">
        <header className="pane-header">
          <h2>Editor</h2>
        </header>
        <textarea
          className="editor-input"
          defaultValue={"# Welcome\n\nStart writing Markdown here.\n\n#tag\n\n[[notes]]"}
          spellCheck="false"
          aria-label="Markdown content"
        />
      </section>

      <section className="pane preview-pane" aria-label="Markdown preview">
        <header className="pane-header">
          <h2>Preview</h2>
        </header>
        <article className="preview-content">
          <h1>Welcome</h1>
          <p>Start writing Markdown here.</p>
          <p className="tag-chip">#tag</p>
          <p>
            <a href="#notes">[[notes]]</a>
          </p>
        </article>
      </section>
    </main>
  );
}
