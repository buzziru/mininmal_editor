# QA Log

Last updated: 2026-05-28

This document records reproduced QA findings and their outcomes. Keep
`docs/CURRENT_STATUS.md` limited to active or unresolved QA concerns.

## Current Open Findings

No open QA findings are currently documented.

## Resolved Findings

| Finding | Outcome | Regression reference |
| ------- | ------- | -------------------- |
| `Open Folder...` was needed from the File menu. | Resolved; menu command opens a workspace folder. | `docs/qa/REGRESSION_CASES.md` |
| `Open File...` was needed from the File menu. | Resolved; menu command opens an individual `.md` file. | `docs/qa/REGRESSION_CASES.md` |
| Workspace folder selection needed to list contained Markdown files. | Resolved; recursive `.md` listing is supported. | `docs/qa/REGRESSION_CASES.md` |
| Opening an individual `.md` file needed a consistent workspace context. | Resolved; containing folder becomes the active workspace. | `docs/qa/REGRESSION_CASES.md` |
| `New` needed to create files through Electron preload IPC. | Resolved; in-pane file path form creates Markdown files. | `docs/qa/REGRESSION_CASES.md` |
| `Rename` needed to avoid overwriting existing files. | Resolved; in-pane file path form uses storage/preload boundaries. | `docs/qa/REGRESSION_CASES.md` |
| `Delete` needed explicit confirmation. | Resolved; selected Markdown file is removed only after confirmation. | `docs/qa/REGRESSION_CASES.md` |
| Opening a different workspace with the same relative selection needed reload. | Resolved; selected document reloads for the new workspace. | `docs/qa/REGRESSION_CASES.md` |
| `Ctrl+S` save needed native menu support. | Resolved; File menu includes `Save` with `CmdOrCtrl+S`. | `docs/qa/REGRESSION_CASES.md` |
| Standard edit commands needed menu roles. | Resolved; undo, redo, cut, copy, paste, and select all are restored. | `docs/qa/REGRESSION_CASES.md` |
| Fullscreen needed an exit path. | Resolved; pressing `Esc` exits fullscreen. | `docs/qa/REGRESSION_CASES.md` |

## New Finding Template

```text
Date:
Status: open | resolved
Area:
Environment:
Steps to reproduce:
Expected:
Actual:
Fix summary:
Verification:
Regression reference:
```
