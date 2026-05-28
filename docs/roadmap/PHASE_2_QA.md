# Phase 2 - Post-MVP QA Stabilization Archive

Status: Complete

Archived from `docs/TASK.md` and `docs/CURRENT_STATUS.md` during documentation
restructuring on 2026-05-28.

## Purpose

Stabilize the completed MVP against manual Electron QA findings while preserving
the local-first architecture and MVP scope.

## Scope

The stabilization phase addressed:

- workspace folder opening so contained `.md` files appear in the file pane
- `New` creating Markdown files through existing storage and Electron preload
  boundaries
- `Rename` renaming the selected Markdown file without overwriting an existing
  file
- fullscreen exit after toggling fullscreen on, with `Esc` returning to normal
  layout
- opening an individual `.md` file while keeping workspace folder selection as
  the primary MVP workflow
- File menu entries for:
  - `Open Folder...`
  - `Open File...`
  - `Exit`

## Resolved QA Findings

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

## Verification Used

Recorded baseline commands:

```text
npm run typecheck
npm test
npm run build
```

Manual Electron QA confirmed:

- `Open Folder...` lists contained Markdown files.
- `Open File...` opens a selected `.md` file.
- `New` creates a Markdown file and refreshes the file list.
- `Rename` updates the selected file and refreshes the file list.
- Fullscreen can be exited with `Esc`.
- Existing edit, save, preview, theme, link, and tag behavior still works.

## Review Focus Used

- Keep fixes tied directly to reproduced QA issues.
- Preserve the UI, service, and storage boundaries.
- Avoid non-MVP features such as multi-workspace management, search, file
  watching, or advanced menu systems.
- Add focused regression tests where the issue can be covered outside manual
  Electron behavior.

Detailed ongoing QA tracking now lives in:

```text
docs/qa/QA_LOG.md
docs/qa/REGRESSION_CASES.md
```
