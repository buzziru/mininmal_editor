# Current Project Status

Last checked: 2026-05-27

This document summarizes the current implementation state so another session can
continue without rediscovering the MVP baseline. The current baseline has been
pushed to GitHub before starting any Google Drive integration.

## Current State

The MVP and post-MVP QA stabilization are complete.

The application is a local-first Windows Markdown editor with:

- three-pane layout: file list, editor, and preview
- local workspace folder selection
- individual `.md` file opening
- recursive `.md` file listing
- Markdown file create, rename, delete, read, and save flows
- explicit save button and `Ctrl+S` menu save
- Markdown preview rendering
- light and dark theme toggle with persistence
- basic internal link navigation
- current-document tag display
- fullscreen exit with `Esc`

The implementation remains local-first and MVP-scoped. Google Drive sync,
plugins, graph visualization, collaboration, mobile support, rich-text editing,
and advanced backlink analytics are not implemented.

## Verification Baseline

The following commands were run successfully for the current baseline:

```text
npm run typecheck
npm test
npm run build
```

Manual Electron verification must use:

```text
npm run dev
```

Browser-only renderer checks may use:

```text
npm run dev:renderer
```

Do not use `npm run dev:renderer` to verify file operations. File dialogs,
preload IPC, native menu commands, fullscreen handling, and disk persistence must
be verified in the Electron app with `npm run dev`.

See `docs/TESTING.md` for the required verification model and Electron manual
smoke checklist.

## Resolved QA Findings

The following post-MVP QA findings have been resolved:

- `Open Folder...` is available from the File menu and opens a workspace folder.
- `Open File...` is available from the File menu and opens an individual `.md`
  file.
- Workspace folder selection lists contained Markdown files.
- Opening an individual `.md` file treats its containing folder as the active
  workspace.
- `New` uses an in-pane file path form and creates a Markdown file through
  Electron preload IPC.
- `Rename` uses an in-pane file path form and renames the selected Markdown file
  through Electron preload IPC.
- `Delete` removes the selected Markdown file only after explicit confirmation.
- Opening a different workspace reloads the selected document even when the
  relative path matches the previous selection.
- The File menu includes `Save` with `CmdOrCtrl+S`.
- Standard Edit menu roles are restored: undo, redo, cut, copy, paste, and
  select all.
- Pressing `Esc` exits fullscreen when the Electron window is fullscreen.

## Known Issues

No known MVP-blocking issues are currently documented.

Before adding new features, run the Electron manual smoke checklist in
`docs/TESTING.md` against the current baseline. If a regression is found, record
it here with reproduction steps before implementing the fix.

## Next Recommended Work

Continue with targeted hardening only when a concrete issue is reproduced.

Recommended process:

1. Reproduce the issue in the smallest possible workflow.
2. Add or update focused tests when the behavior is covered by service, storage,
   or pure renderer logic.
3. Verify Electron-only behavior manually with `npm run dev`.
4. Update this status document and `docs/TESTING.md` if the verification process
   changes.

The next feature area may be Google Drive integration only after the local-first
baseline remains stable. Do not begin Google Drive implementation until it is
explicitly requested.

## Task Step And Agent Mapping

Full step details live in `docs/TASK.md`.

| Step | Task area                            | Assigned Agent | Status            |
| ---- | ------------------------------------ | -------------- | ----------------- |
| 1    | Project Scaffold                     | scaffold       | complete          |
| 2    | Core Domain Types                    | domain         | complete          |
| 3    | Storage Provider Contract            | storage        | complete          |
| 4    | Local File Storage                   | storage        | complete          |
| 5    | Workspace Service                    | services       | complete          |
| 6    | Three-Pane Layout                    | ui-layout      | complete          |
| 7    | File Explorer UI                     | ui-explorer    | complete          |
| 8    | Document Editing And Saving          | ui-editor      | complete          |
| 9    | Markdown Preview                     | markdown       | complete          |
| 10   | Theme Support                        | ui-theme       | complete          |
| 11   | Internal Link Parsing And Navigation | links          | complete          |
| 12   | Tag Extraction                       | tags           | complete          |
| 13   | MVP Hardening                        | polish         | complete          |

## Relevant Files

```text
electron/main.cjs
electron/preload.cjs
scripts/dev.cjs
src/components/layout/WorkspaceView.tsx
src/services/WorkspaceService.ts
src/services/DocumentService.ts
src/services/LinkService.ts
src/services/TagService.ts
src/services/ThemeService.ts
src/storage/LocalFileStorage.ts
src/storage/StorageProvider.ts
src/styles/global.css
```
