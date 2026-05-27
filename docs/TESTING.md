## Testing and Validation

Use the verification level that matches the behavior being changed. Passing
static checks, tests, and build is required before handoff, but it is not enough
to verify Electron-only behavior such as file dialogs, preload IPC, native menu
commands, fullscreen handling, or disk persistence.

## Verification Model

### 1. Static Checks

Run these for code changes and before marking implementation work complete:

```text
npm run typecheck
npm test
npm run build
```

These checks verify TypeScript, automated tests, and production bundling. They
do not prove that Electron shell behavior works.

### 2. Browser-Only Renderer Checks

Use `npm run dev:renderer` only for renderer behavior that does not depend on
Electron APIs.

Appropriate examples:

- layout checks
- editor UI rendering
- preview-only rendering
- theme styling checks
- non-persistent component behavior

Do not use `npm run dev:renderer` to verify file operations. The browser-only
renderer does not exercise the Electron preload API, native file dialogs, menu
events, or real disk persistence.

### 3. Electron Integration Checks

Use `npm run dev` for behavior that crosses the Electron boundary.

Required examples:

- opening a workspace folder
- opening an individual Markdown file
- native menu commands
- `Ctrl+S` save
- fullscreen exit with `Esc`
- preload IPC behavior
- create, rename, delete, read, and write operations

File operations must be verified with `npm run dev`, not
`npm run dev:renderer`.

### 4. Disk Persistence Checks

When a change affects local files, verify the result on disk after using the
Electron app.

Required examples:

- created files exist in the selected workspace
- renamed files move to the expected workspace-relative path
- deleted files are removed only after explicit confirmation
- saved edits are written as UTF-8 Markdown
- reopening or reselecting a document shows the persisted content

## Required Electron Manual Smoke Test

Run this checklist with `npm run dev` before marking Electron-facing file,
workspace, editor, menu, preview, theme, link, tag, or fullscreen behavior done:

1. Open a workspace folder.
2. Confirm `.md` files are listed.
3. Open an individual `.md` file.
4. Create a Markdown file.
5. Rename a Markdown file.
6. Edit and save a Markdown file.
7. Save with `Ctrl+S`.
8. Delete a Markdown file after explicit confirmation.
9. Confirm Markdown preview updates.
10. Toggle theme and confirm persistence after reload.
11. Navigate an internal link.
12. Confirm tag display updates for the current document.
13. Enter fullscreen and exit with `Esc`.

For UI-related changes, prefer manual Electron smoke testing during the MVP phase.

Playwright E2E tests are optional during the MVP phase. Use them only for small, stable smoke tests after the dev server and test environment are known to work reliably.

Do not repeatedly rerun failing Playwright tests without first isolating the issue with a minimal app-load test.
Do not claim UI behavior was verified unless it was confirmed through manual testing or successful Playwright execution.
