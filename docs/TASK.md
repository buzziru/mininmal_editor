# MVP Execution Plan

This document turns the current Markdown editor plan into small, reviewable MVP
implementation steps. It is based on `AGENTS.md`, `README.md`, and the documents
under `docs/`.

## Plan Review

The current plan is directionally sound for an MVP:

- The product scope is narrow: local Markdown files, three panes, editing,
  preview, basic file management, themes, internal links, and tags.
- The architecture boundary is clear: UI, application services, and storage
  layer should stay separate.
- The local file system remains the source of truth.
- Future extensibility is considered through a storage abstraction, without
  requiring cloud or plugin systems in the MVP.

Key risks to control during execution:

- Do not let UI components directly read or write files.
- Do not add a database or indexing layer for tags, links, or search.
- Keep markdown rendering library-based; do not build a custom Markdown engine.
- Treat file create, rename, save, and delete paths as data-loss-sensitive.
- Keep each step small enough to review independently.

## Assumptions

- The app will use TypeScript and React.
- The desktop shell will be selected during the project scaffold step.
- Only local `.md` files are required for MVP.
- The MVP targets a Windows desktop workflow.

## Success Criteria

The MVP is complete when a user can:

- Select and reopen a local workspace folder.
- Browse `.md` files in a left sidebar.
- Create, rename, edit, save, and delete Markdown files safely.
- Edit Markdown in the center pane.
- See a rendered Markdown preview in the right pane.
- Switch between light and dark themes.
- Detect and navigate basic `[[Document Name]]` internal links.
- Extract and display basic `#tag` tags for the current document.

## Reviewable Implementation Steps

### 1. Project Scaffold

Assigned Agent: scaffold

Goal: Create the minimal app shell and development setup.

Scope:

- Choose and initialize the desktop stack.
- Add TypeScript and React structure.
- Add minimal build, lint, and test commands.
- Add the initial folder layout aligned with `docs/ARCHITECTURE.md`.

Verify:

- App starts locally.
- Type checking passes.
- The initial window renders a placeholder three-pane layout.

Review focus:

- Stack choice is explicit.
- Folder structure is simple.
- No product features are mixed into the scaffold.

### 2. Core Domain Types

Assigned Agent: domain

Goal: Define the shared data model used by services and UI.

Scope:

- Add `Workspace`, `Document`, `DocumentMetadata`, `DocumentLink`, `Tag`, and
  `Theme` types.
- Keep fields aligned with `docs/DATA_MODEL.md`.
- Avoid optional future metadata unless needed by MVP behavior.

Verify:

- Type checking passes.
- Public interfaces use explicit types.

Review focus:

- Model names match project language.
- No database, graph, sync, or search-specific model is introduced.

### 3. Storage Provider Contract

Assigned Agent: storage

Goal: Establish the storage boundary before adding UI behavior.

Scope:

- Define `StorageProvider`.
- Include only MVP operations: list, read, write, create, rename, and delete
  Markdown documents.
- Keep path handling isolated from UI components.

Verify:

- Contract can express all required MVP file operations.
- Unit tests cover path and extension constraints where practical.

Review focus:

- UI has no direct file-system dependency.
- The abstraction is minimal and not a plugin system.

### 4. Local File Storage

Assigned Agent: storage

Goal: Implement local `.md` file operations safely.

Scope:

- Implement `LocalFileStorage`.
- List Markdown files under the selected workspace.
- Read and write plain Markdown content.
- Create, rename, and delete files with explicit error paths.
- Ignore non-Markdown files for MVP.

Verify:

- Tests cover listing, reading, writing, creating, renaming, deleting, and
  rejecting unsupported paths.
- Manual check confirms files remain normal `.md` files on disk.

Review focus:

- File operations are conservative.
- Delete behavior is not silent.
- No hidden metadata files are required.

### 5. Workspace Service

Assigned Agent: services

Goal: Manage the current workspace without leaking storage details to UI.

Scope:

- Open a local folder as a workspace.
- Store or restore the last workspace if the chosen shell supports it simply.
- Provide workspace document metadata to the UI.

Verify:

- App can open a workspace folder.
- App can reload the current document list.
- Missing or inaccessible workspace shows a clear error state.

Review focus:

- Workspace state remains simple.
- No multi-workspace management is added.

### 6. Three-Pane Layout

Assigned Agent: ui-layout

Goal: Build the fixed MVP interface shape.

Scope:

- Add left file list, center editor, and right preview panes.
- Add empty, loading, selected, and error states.
- Follow the minimalist visual direction in `docs/STYLE_GUIDE.md`.

Verify:

- Layout renders at common desktop sizes.
- Panes remain readable.
- Keyboard focus is predictable.

Review focus:

- Layout is stable and not over-designed.
- No floating panels, docking, or mobile layout work is introduced.

### 7. File Explorer UI

Assigned Agent: ui-explorer

Goal: Let users browse and select Markdown files.

Scope:

- Render workspace folder structure or a simple nested file list.
- Select a document.
- Add create, rename, and delete actions.
- Require confirmation before delete.

Verify:

- Selecting a file loads it into the editor.
- Create, rename, and delete update the file list.
- Delete cannot happen accidentally.

Review focus:

- UI delegates file operations to services.
- File explorer remains Markdown-focused.

### 8. Document Editing And Saving

Assigned Agent: ui-editor

Goal: Provide a reliable Markdown editing loop.

Scope:

- Load the selected document into an editor textarea or simple editor component.
- Track unsaved changes.
- Save edited Markdown to disk.
- Choose either explicit save or simple autosave and document the behavior.

Verify:

- Edits persist to the local `.md` file.
- Switching documents handles unsaved changes predictably.
- Save failures are visible to the user.

Review focus:

- No rich-text or WYSIWYG editor is added.
- Data-loss cases are handled explicitly.

### 9. Markdown Preview

Assigned Agent: markdown

Goal: Render supported Markdown syntax in the preview pane.

Scope:

- Use a proven Markdown rendering library.
- Support headings, paragraphs, lists, inline code, code blocks, bold, italic,
  and links.
- Update preview from editor content.

Verify:

- Supported syntax renders correctly.
- Unsafe or unsupported embedded content is not enabled by default.

Review focus:

- No custom Markdown engine.
- No Mermaid, LaTeX, or plugin rendering.

### 10. Theme Support

Assigned Agent: ui-theme

Goal: Add light and dark themes.

Scope:

- Add theme tokens or CSS variables.
- Add a theme toggle.
- Persist the selected theme if simple to do in the chosen shell.

Verify:

- Light and dark themes apply across all panes.
- Text contrast remains readable.
- Theme switching does not affect document content.

Review focus:

- Only two built-in themes.
- No custom theme editor or marketplace concepts.

### 11. Internal Link Parsing And Navigation

Assigned Agent: links

Goal: Support basic `[[Document Name]]` links.

Scope:

- Parse internal links from document content.
- Highlight or render internal links in the preview.
- Navigate to an existing document when a link target can be resolved.
- Show a clear unresolved state for missing targets.

Verify:

- `[[Existing Document]]` opens the matching document.
- Missing links do not create files automatically.
- Link parsing is covered by focused tests.

Review focus:

- No backlink index.
- No fuzzy matching, aliases, graph view, or link suggestions.

### 12. Tag Extraction

Assigned Agent: tags

Goal: Extract basic `#tag` values from the current document.

Scope:

- Parse tags from Markdown content.
- Display tags for the current document.
- Keep tag behavior local to the open document.

Verify:

- Tags are extracted from simple Markdown examples.
- Tag parsing tests cover basic valid and invalid cases.

Review focus:

- No tag pages, tag search, tag hierarchy, or graph.

### 13. MVP Hardening

Assigned Agent: polish

Goal: Close reliability gaps before considering the MVP complete.

Scope:

- Review file operation errors.
- Review unsaved-change behavior.
- Review empty workspace behavior.
- Add focused regression tests for fixed issues.
- Update relevant docs if behavior changed.

Verify:

- Type checking passes.
- Tests pass.
- Manual smoke test covers open workspace, create, edit, preview, save, rename,
  delete, theme toggle, link navigation, and tag display.

Review focus:

- Fix only MVP reliability issues.
- Avoid broad refactors at this stage.

## Explicitly Out Of Scope For MVP

The following features must not be implemented during the MVP unless explicitly
re-scoped:

- Cloud sync: Google Drive, Dropbox, OneDrive, remote file systems, sync engine,
  conflict resolution.
- Accounts and collaboration: authentication, multi-user support, shared
  workspaces, real-time collaboration.
- Advanced knowledge management: backlink panel, graph visualization, semantic
  search, AI recommendations.
- Editor extensions: plugin system, custom commands, macros, extension
  marketplace, Vim mode, multi-cursor editing.
- Advanced Markdown rendering: Mermaid, LaTeX, diagrams, embedded web content,
  custom Markdown plugins.
- Advanced UI: floating panels, complex docking, layout customization,
  multi-window editing, mobile support.
- Data systems: relational database, embedded database, graph database,
  embedding store, semantic index, proprietary metadata store.
- Advanced tags: tag pages, tag graph, tag hierarchy, tag autocomplete, tag
  search system.
- Advanced search: full-text search, fuzzy search, ranking, saved searches.

## Suggested Review Cadence

- Review after each numbered step.
- Keep each pull request focused on one step.
- Include tests in the same step when behavior is introduced.
- Update documentation in the same step when behavior or scope changes.
- Do not combine scaffold, storage, UI, and feature behavior in one review.
