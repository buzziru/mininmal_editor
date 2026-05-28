# Phase 1 - MVP Implementation Archive

Status: Complete

Archived from `docs/TASK.md` during documentation restructuring on 2026-05-28.
This document preserves the completed MVP implementation plan so `docs/TASK.md`
can stay focused on current active work.

## Purpose

Build a small, stable local-first Markdown editor for Windows.

The MVP validated:

- local Markdown file workflow
- three-pane layout
- local file management
- Markdown editing and preview
- basic internal links
- basic tag extraction
- light and dark themes
- simple UI, application service, and storage boundaries

## Assumptions

- The app uses TypeScript and React.
- The desktop shell targets a Windows desktop workflow.
- Only local `.md` files are required for MVP.
- Local files remain the source of truth.

## Success Criteria

The MVP was considered complete when a user could:

- select and reopen a local workspace folder
- browse `.md` files in a left sidebar
- create, rename, edit, save, and delete Markdown files safely
- edit Markdown in the center pane
- see rendered Markdown preview in the right pane
- switch between light and dark themes
- detect and navigate basic `[[Document Name]]` internal links
- extract and display basic `#tag` tags for the current document

## Completed Steps

| Step | Task area                            | Assigned area | Status   |
| ---- | ------------------------------------ | ------------- | -------- |
| 1    | Project Scaffold                     | scaffold      | complete |
| 2    | Core Domain Types                    | domain        | complete |
| 3    | Storage Provider Contract            | storage       | complete |
| 4    | Local File Storage                   | storage       | complete |
| 5    | Workspace Service                    | services      | complete |
| 6    | Three-Pane Layout                    | ui-layout     | complete |
| 7    | File Explorer UI                     | ui-explorer   | complete |
| 8    | Document Editing And Saving          | ui-editor     | complete |
| 9    | Markdown Preview                     | markdown      | complete |
| 10   | Theme Support                        | ui-theme      | complete |
| 11   | Internal Link Parsing And Navigation | links         | complete |
| 12   | Tag Extraction                       | tags          | complete |
| 13   | MVP Hardening                        | polish        | complete |

## Step Details

### 1. Project Scaffold

Goal: create the minimal app shell and development setup.

Scope:

- choose and initialize the desktop stack
- add TypeScript and React structure
- add minimal build, lint, and test commands
- add the initial folder layout aligned with `docs/ARCHITECTURE.md`

Verify:

- app starts locally
- type checking passes
- initial window renders a placeholder three-pane layout

### 2. Core Domain Types

Goal: define the shared data model used by services and UI.

Scope:

- add `Workspace`, `Document`, `DocumentMetadata`, `DocumentLink`, `Tag`, and
  `Theme` types
- keep fields aligned with `docs/DATA_MODEL.md`
- avoid optional future metadata unless needed by MVP behavior

Verify:

- type checking passes
- public interfaces use explicit types

### 3. Storage Provider Contract

Goal: establish the storage boundary before adding UI behavior.

Scope:

- define `StorageProvider`
- include only MVP operations: list, read, write, create, rename, and delete
  Markdown documents
- keep path handling isolated from UI components

Verify:

- contract can express all required MVP file operations
- focused tests cover path and extension constraints where practical

### 4. Local File Storage

Goal: implement local `.md` file operations safely.

Scope:

- implement `LocalFileStorage`
- list Markdown files under the selected workspace
- read and write plain Markdown content
- create, rename, and delete files with explicit error paths
- ignore non-Markdown files for MVP

Verify:

- tests cover listing, reading, writing, creating, renaming, deleting, and
  rejecting unsupported paths
- manual check confirms files remain normal `.md` files on disk

### 5. Workspace Service

Goal: manage the current workspace without leaking storage details to UI.

Scope:

- open a local folder as a workspace
- store or restore the last workspace if the chosen shell supports it simply
- provide workspace document metadata to the UI

Verify:

- app can open a workspace folder
- app can reload the current document list
- missing or inaccessible workspace shows a clear error state

### 6. Three-Pane Layout

Goal: build the fixed MVP interface shape.

Scope:

- add left file list, center editor, and right preview panes
- add empty, loading, selected, and error states
- follow the minimalist visual direction in `docs/STYLE_GUIDE.md`

Verify:

- layout renders at common desktop sizes
- panes remain readable
- keyboard focus is predictable

### 7. File Explorer UI

Goal: let users browse and select Markdown files.

Scope:

- render workspace folder structure or a simple nested file list
- select a document
- add create, rename, and delete actions
- require confirmation before delete

Verify:

- selecting a file loads it into the editor
- create, rename, and delete update the file list
- delete cannot happen accidentally

### 8. Document Editing And Saving

Goal: provide a reliable Markdown editing loop.

Scope:

- load the selected document into an editor textarea or simple editor component
- track unsaved changes
- save edited Markdown to disk
- choose either explicit save or simple autosave and document the behavior

Verify:

- edits persist to the local `.md` file
- switching documents handles unsaved changes predictably
- save failures are visible to the user

### 9. Markdown Preview

Goal: render supported Markdown syntax in the preview pane.

Scope:

- use a proven Markdown rendering library
- support headings, paragraphs, lists, inline code, code blocks, bold, italic,
  and links
- update preview from editor content

Verify:

- supported syntax renders correctly
- unsafe or unsupported embedded content is not enabled by default

### 10. Theme Support

Goal: add light and dark themes.

Scope:

- add theme tokens or CSS variables
- add a theme toggle
- persist the selected theme if simple to do in the chosen shell

Verify:

- light and dark themes apply across all panes
- text contrast remains readable
- theme switching does not affect document content

### 11. Internal Link Parsing And Navigation

Goal: support basic `[[Document Name]]` links.

Scope:

- parse internal links from document content
- highlight or render internal links in the preview
- navigate to an existing document when a link target can be resolved
- show a clear unresolved state for missing targets

Verify:

- `[[Existing Document]]` opens the matching document
- missing links do not create files automatically
- link parsing is covered by focused tests

### 12. Tag Extraction

Goal: extract basic `#tag` values from the current document.

Scope:

- parse tags from Markdown content
- display tags for the current document
- keep tag behavior local to the open document

Verify:

- tags are extracted from simple Markdown examples
- tag parsing tests cover basic valid and invalid cases

### 13. MVP Hardening

Goal: close reliability gaps before considering the MVP complete.

Scope:

- review file operation errors
- review unsaved-change behavior
- review empty workspace behavior
- add focused regression tests for fixed issues
- update relevant docs if behavior changed

Verify:

- type checking passes
- tests pass
- manual smoke test covers open workspace, create, edit, preview, save, rename,
  delete, theme toggle, link navigation, and tag display

## Explicitly Out Of Scope For MVP

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

## Review Cadence Used

- Review after each numbered step.
- Keep each pull request focused on one step.
- Include tests in the same step when behavior is introduced.
- Update documentation in the same step when behavior or scope changes.
- Do not combine scaffold, storage, UI, and feature behavior in one review.
