# Current Project Status

Last checked: 2026-05-26

This document summarizes the current implementation state so another session can
quickly continue from the same point. It reflects the repository state checked
against `docs/TASK.md`.

## Verification Commands

The following commands were run successfully:

```text
npm run typecheck
npm test
npm run build
```

Observed result:

- TypeScript type checking passes.
- Vitest runs and passes.
- Production build completes successfully.

Current test coverage covers the scaffold, local storage implementation, and
workspace and document services.

## Implemented So Far

### 1. Project Scaffold

Status: mostly complete.

Current implementation:

- React, TypeScript, Vite, and Electron are configured.
- Scripts exist in `package.json`:
  - `dev`
  - `desktop`
  - `typecheck`
  - `build`
  - `test`
- Electron entry points exist under `electron/`.
- The app renders a three-pane layout with a workspace file list and selected
  document editor.
- Electron exposes preload APIs for opening a workspace folder and reading a
  selected Markdown document.

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

- `README.md` still says the project is in `MVP Planning`, but the scaffold has
  already been created.
- The current UI can request a workspace folder, display Markdown document
  paths, and load selected document content into the editor.
- The preview pane currently mirrors selected document content as plain text;
  full Markdown rendering remains a later MVP step.

### 2. Core Domain Types

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

Status: partially complete.

Current implementation:

- The file pane can open a workspace through Electron and list Markdown files.
- Selecting a listed file reads it through the preload IPC boundary.
- The editor pane displays the selected document content in a textarea.
- The preview pane mirrors the selected document content as plain text for now.

Relevant files:

```text
electron/main.cjs
electron/preload.cjs
src/types/electron.d.ts
src/components/layout/WorkspaceView.tsx
src/styles/global.css
```

Remaining work:

- Replace the plain-text preview with a Markdown rendering library in step 9.
- Add explicit save behavior in step 8.

## Not Implemented Yet

The following `docs/TASK.md` steps are not implemented yet:

- `7. File Explorer UI`
- `8. Document Editing And Saving`
- `9. Markdown Preview`
- `10. Theme Support`
- `11. Internal Link Parsing And Navigation`
- `12. Tag Extraction`
- `13. MVP Hardening`

`6. Three-Pane Layout` is partially implemented. The file pane can display
workspace document paths after opening a folder, and the editor can load selected
document content. The preview is still plain text rather than rendered Markdown.

## Current Code Shape

The following service files still contain empty classes:

```text
src/services/LinkService.ts
src/services/TagService.ts
src/services/ThemeService.ts
```

`DocumentService` now delegates document reads and saves to the storage layer.

The current layout can open a workspace folder through the Electron preload API,
display Markdown document paths, and load selected document content:

```text
src/components/layout/WorkspaceView.tsx
```

The preview pane is intentionally plain text until the Markdown rendering step.
UI components do not currently read or write files directly, which is consistent
with the architecture boundary described in `docs/ARCHITECTURE.md`.

## Recommended Next Step

Continue with `docs/TASK.md` step 8:

1. Add explicit save behavior for edited Markdown content.
2. Handle document switching with unsaved changes predictably.
3. Keep UI components behind preload/application service APIs rather than direct
   file-system access.

Keep the implementation local-first and MVP-only. Do not add a database, search
index, plugin system, cloud sync, graph features, or advanced Markdown renderer.
