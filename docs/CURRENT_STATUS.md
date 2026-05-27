# Current Project Status

Last checked: 2026-05-27

This document summarizes the current implementation state so another session can
quickly continue from the same point. It reflects the repository state checked
against `docs/TASK.md`, including each step's **Assigned Agent** from that plan.

## Task Step And Agent Mapping

Use this table to delegate work. Full step details live in `docs/TASK.md`.

| Step | Task area | Assigned Agent | Status (summary) |
| ---- | --------- | -------------- | ---------------- |
| 1 | Project Scaffold | scaffold | mostly complete |
| 2 | Core Domain Types | domain | mostly complete |
| 3 | Storage Provider Contract | storage | mostly complete |
| 4 | Local File Storage | storage | mostly complete |
| 5 | Workspace Service | services | partially complete |
| 6 | Three-Pane Layout | ui-layout | partially complete |
| 7 | File Explorer UI | ui-explorer | mostly complete |
| 8 | Document Editing And Saving | ui-editor | mostly complete |
| 9 | Markdown Preview | markdown | mostly complete |
| 10 | Theme Support | ui-theme | mostly complete |
| 11 | Internal Link Parsing And Navigation | links | mostly complete |
| 12 | Tag Extraction | tags | mostly complete |
| 13 | MVP Hardening | polish | mostly complete |

## Verification Commands

The following commands were run successfully:

```text
npm run dev
npm run dev:renderer
npm run typecheck
npm test
npm run build
```

Observed result:

- `npm run dev` opens the Electron app with preload-backed file operations.
- `npm run dev:renderer` opens the browser-only renderer for UI checks.
- TypeScript type checking passes.
- Vitest runs and passes for the app source tests under `src/`.
- Production build completes successfully.

Current test coverage covers the scaffold, local storage implementation, and
workspace and document services.

## Implemented So Far

### 1. Project Scaffold

Assigned Agent: scaffold

Status: mostly complete.

Current implementation:

- React, TypeScript, Vite, and Electron are configured.
- Scripts exist in `package.json`:
  - `dev`
  - `dev:renderer`
  - `desktop`
  - `typecheck`
  - `build`
  - `test`
- Electron entry points exist under `electron/`.
- The app renders a three-pane layout with a workspace file list and selected
  document editor.
- Electron exposes preload APIs for opening a workspace folder and reading a
  selected Markdown document.
- `npm run dev` starts the Vite renderer server and opens the Electron window.
  Browser-only renderer checks can use `npm run dev:renderer`, but file
  operations require Electron.

Relevant files:

```text
package.json
vite.config.ts
tsconfig.json
electron/main.cjs
electron/preload.cjs
src/main.tsx
src/app/App.tsx
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Notes:

- `README.md` development stage now matches this document (`MVP Implementation`).
- The current UI can request a workspace folder, display Markdown document
  paths, and load selected document content into the editor.
- The current UI can create, rename, and delete Markdown documents from the
  file pane.
- The current UI can explicitly save edits to the selected Markdown document.
- The preview pane renders selected document content as Markdown.
- The current UI can switch between light and dark themes.

### 2. Core Domain Types

Assigned Agent: domain

Status: mostly complete.

Current implementation:

- `Workspace`
- `Document`
- `DocumentMetadata`
- `DocumentLink`
- `Tag`
- `Theme`

Relevant files:

```text
src/models/Workspace.ts
src/models/Document.ts
src/models/DocumentLink.ts
src/models/Tag.ts
src/models/Theme.ts
```

Notes:

- The type names align with `docs/DATA_MODEL.md`.
- No database, graph, sync, or search-specific model has been introduced.

### 3. Storage Provider Contract

Assigned Agent: storage

Status: mostly complete.

Current implementation:

- `StorageProvider` exists with MVP file operations:
  - `listDocuments`
  - `readDocument`
  - `writeDocument`
  - `createDocument`
  - `renameDocument`
  - `deleteDocument`

Relevant file:

```text
src/storage/StorageProvider.ts
```

Current path constraints:

- `Document.path` is treated as workspace-relative.
- Only `.md` document paths are accepted.
- Absolute paths and paths escaping the workspace are rejected.

Remaining work:

- Revisit the contract if application services need additional workspace-level
  operations.

### 4. Local File Storage

Assigned Agent: storage

Status: mostly complete.

Current implementation:

- `LocalFileStorage` lists Markdown files recursively under the workspace.
- Reads and writes UTF-8 Markdown content.
- Creates nested Markdown files without overwriting existing files.
- Renames Markdown files without overwriting existing files.
- Deletes Markdown files through explicit storage calls.
- Rejects non-Markdown paths, absolute paths, and workspace escape paths.

Relevant files:

```text
src/storage/LocalFileStorage.ts
src/storage/LocalFileStorage.test.ts
```

Remaining work:

- Keep the Electron workspace listing behavior aligned with `LocalFileStorage`
  as the desktop integration matures.

### 5. Workspace Service

Assigned Agent: services

Status: partially complete.

Current implementation:

- `WorkspaceService` opens a local workspace using the storage boundary.
- The service keeps the active workspace in application state.
- Document metadata can be reloaded through the active storage provider.
- Failed workspace opens leave the previous active workspace unchanged.

Relevant files:

```text
src/services/WorkspaceService.ts
src/services/WorkspaceService.test.ts
```

Remaining work:

- Store or restore the last workspace if it remains simple in the desktop shell.

### 6. Three-Pane Layout

Assigned Agent: ui-layout

Status: partially complete.

Current implementation:

- The file pane can open a workspace through Electron and list Markdown files.
- Selecting a listed file reads it through the preload IPC boundary.
- The editor pane displays the selected document content in a textarea.
- The editor pane tracks unsaved changes and exposes an explicit save action.
- The preview pane renders selected document content with a Markdown rendering
  library.

Relevant files:

```text
electron/main.cjs
electron/preload.cjs
src/types/electron.d.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

### 7. File Explorer UI

Assigned Agent: ui-explorer

Status: mostly complete.

Current implementation:

- The file pane lists Markdown documents from the selected workspace.
- Users can select Markdown files to load them into the editor.
- Users can create Markdown files by entering a workspace-relative file path.
- Users can rename the selected Markdown file without overwriting an existing
  file.
- Users can delete the selected Markdown file only after explicit confirmation.
- File create, rename, and delete actions go through the Electron preload IPC
  boundary.
- The Electron main process validates workspace-relative `.md` paths and keeps
  file operations inside the active workspace.

Relevant files:

```text
electron/main.cjs
electron/preload.cjs
src/types/electron.d.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Manual desktop smoke test should confirm create, rename, and delete update
  normal `.md` files on disk.

### 8. Document Editing And Saving

Assigned Agent: ui-editor

Status: mostly complete.

Current implementation:

- The editor textarea tracks unsaved changes against the last loaded or saved
  document content.
- The editor header shows `Saved`, `Unsaved`, or `Saving...` status.
- A `Save` button writes the selected Markdown document through the Electron
  preload IPC boundary.
- The Electron main process validates workspace-relative `.md` paths before
  writing UTF-8 content.
- Switching documents or opening a different workspace asks before discarding
  unsaved changes.

Relevant files:

```text
electron/main.cjs
electron/preload.cjs
src/types/electron.d.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Manual desktop smoke test should confirm edits persist to disk through the
  Electron window.

### 9. Markdown Preview

Assigned Agent: markdown

Status: mostly complete.

Current implementation:

- The preview pane uses `react-markdown`.
- Preview updates from the current editor content.
- Basic Markdown syntax renders through the library, including headings,
  paragraphs, lists, inline code, code blocks, bold, italic, and links.
- Raw embedded HTML is not enabled.

Relevant files:

```text
package.json
package-lock.json
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Manual UI smoke test should confirm preview rendering in the Electron window.

### 10. Theme Support

Assigned Agent: ui-theme

Status: mostly complete.

Current implementation:

- The app supports light and dark CSS variable themes.
- The preview pane header includes a theme toggle.
- The selected theme is persisted in local storage.
- `ThemeService` handles initial theme selection, toggling, and persistence.

Relevant files:

```text
src/models/Theme.ts
src/services/ThemeService.ts
src/services/ThemeService.test.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Manual UI smoke test should confirm theme switching and persistence in the
  Electron window.

## Not Implemented Yet

No numbered MVP implementation step from `docs/TASK.md` is currently marked as
not started.

`6. Three-Pane Layout` is partially implemented. The file pane can display
workspace document paths after opening a folder, the editor can load selected
document content, and the preview renders Markdown.

## Current Code Shape

`DocumentService` now delegates document reads and saves to the storage layer.

The current layout can open a workspace folder through the Electron preload API,
display Markdown document paths, and load selected document content:

```text
src/components/layout/WorkspaceView.tsx
```

The preview pane now uses `react-markdown` for Markdown rendering.
UI components do not currently read or write files directly, which is consistent
with the architecture boundary described in `docs/ARCHITECTURE.md`.

### 11. Internal Link Parsing And Navigation

Assigned Agent: links

Status: mostly complete.

Current implementation:

- `LinkService` parses basic `[[Document Name]]` internal links.
- Link targets resolve against current workspace document titles, paths, or paths
  without the `.md` extension.
- The preview pane renders internal links as clickable Markdown links.
- Clicking a resolved internal link loads the matching document.
- Missing links are styled as unresolved and show a clear error when clicked.
- Missing links do not create files automatically.

Relevant files:

```text
src/services/LinkService.ts
src/services/LinkService.test.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Manual UI smoke test should confirm internal link navigation in the Electron
  window with real workspace files.

### 12. Tag Extraction

Assigned Agent: tags

Status: mostly complete.

Current implementation:

- `TagService` extracts basic `#tag`, `#daily-note`, and `#project_2026` values
  from the current document content.
- Duplicate tags are displayed once, preserving first-seen order.
- The parser avoids Markdown headings such as `# Heading`, inline fragments such
  as `example.com/#section`, and language names such as `C#`.
- The preview pane displays tags for the currently selected document only.
- No tag pages, tag search, tag hierarchy, or tag index has been added.

Relevant files:

```text
src/services/TagService.ts
src/services/TagService.test.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Manual UI smoke test should confirm tag chips update while editing real
  workspace files in the Electron window.

### 13. MVP Hardening

Assigned Agent: polish

Status: mostly complete.

Current implementation:

- `npm run dev` now starts the Vite renderer server and opens the Electron app,
  so file operations can be tested with the preload API available.
- The Electron write path checks that the selected Markdown file still exists
  before saving, aligning it with `LocalFileStorage.writeDocument` and avoiding
  accidental file recreation after external deletion.
- Manual smoke testing confirmed opening a folder, selecting a `.md` file,
  editing content, live preview rendering, saving, and theme switching.
- `npm run dev:renderer` remains available for browser-only UI checks where file
  operations are not expected to work.

Relevant files:

```text
scripts/dev.cjs
electron/main.cjs
package.json
README.md
docs/CURRENT_STATUS.md
```

Remaining work:

- Continue adding focused regression tests only when new hardening issues are
  found.
- Optional: persist and restore the last workspace if it remains simple and does
  not add hidden file-system behavior.

## Recommended Next Step

Continue with targeted hardening only as issues are discovered.

1. Prefer small fixes tied to a reproduced issue.
2. Add a focused regression test when the issue is covered by service or storage
   code.
3. Keep manual Electron smoke testing for preload, file dialog, and desktop-only
   behavior.

Keep the implementation local-first and MVP-only. Do not add a database, search
index, plugin system, cloud sync, graph features, or advanced Markdown renderer.
