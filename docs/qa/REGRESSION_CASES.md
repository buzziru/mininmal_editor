# Regression Cases

Last updated: 2026-05-28

This document lists durable regression checks derived from resolved QA findings.
Use `docs/TESTING.md` for the full verification model and Electron manual smoke
checklist.

## Electron-Required Cases

These cases require `npm run dev` because they cross Electron file dialogs,
native menu, preload IPC, fullscreen, or disk persistence boundaries.

| Case | Steps | Expected result |
| ---- | ----- | --------------- |
| Open workspace folder | Use `Open Folder...` and select a folder containing `.md` files. | Contained Markdown files are listed in the file pane. |
| Open individual Markdown file | Use `Open File...` and select a `.md` file. | The file opens, and its containing folder becomes the active workspace. |
| Create Markdown file | Use the in-pane `New` flow with a workspace-relative `.md` path. | File is created on disk and appears in the file list. |
| Rename Markdown file | Select a file and rename it to a non-existing `.md` path. | File is renamed on disk and selection/list refreshes. |
| Prevent unsafe rename | Attempt to rename a file to an existing path. | Existing file is not overwritten, and an error is shown. |
| Delete with confirmation | Select a file and trigger delete. | File is deleted only after explicit confirmation. |
| Save with menu shortcut | Edit content and use `Ctrl+S`. | Changes are written to disk. |
| Standard edit roles | Use undo, redo, cut, copy, paste, and select all from the Edit menu. | Native edit actions work in editable text fields. |
| Workspace reselection reload | Open a different workspace where the same relative path exists. | The selected document reloads from the new workspace. |
| Fullscreen exit | Enter fullscreen and press `Esc`. | Window returns to normal layout. |

## MVP Behavior Cases

These cases may require Electron when disk persistence is involved.

| Case | Steps | Expected result |
| ---- | ----- | --------------- |
| Markdown preview updates | Edit Markdown headings, lists, code, and links. | Preview reflects supported syntax. |
| Pane layout fills width | Toggle Explorer off, resize editor/preview, then toggle Explorer on. | Visible panes always fill the workspace width without right-side unused space. |
| Theme persistence | Toggle theme, reload the app, and reopen the workspace. | Selected theme remains applied. |
| Internal link navigation | Open a document containing `[[Existing Document]]` and click the link. | Matching document opens. |
| Missing internal link | Open a document containing a missing `[[Document]]` link. | Missing state is clear and no file is created automatically. |
| Tag display | Add and remove simple `#tag` values. | Current-document tag display updates. |

## Notes

- Add a new regression case when a fixed issue is likely to recur.
- Keep this document focused on checks, not implementation history.
- Keep detailed reproduced findings in `docs/qa/QA_LOG.md`.
