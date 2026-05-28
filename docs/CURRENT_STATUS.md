# Current Project Status

Last checked: 2026-05-28

This document is the concise handoff/status entry point for the current project
state. Detailed completed phase plans live in `docs/roadmap/`, and detailed QA
tracking lives in `docs/qa/`.

## Current Active Phase

Maintenance and targeted hardening.

The MVP and post-MVP QA stabilization phases are complete. Google Drive sync is
planned as a post-MVP feature, but it is not implemented and must not begin
unless explicitly assigned as active implementation work.

## Current Implementation Baseline

The application is a local-first Windows Markdown editor with:

- left activity bar with resizable file, editor, and preview panes
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

The following commands were last recorded as passing on 2026-05-27:

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

## Known Active Issues

No known MVP-blocking issues are currently documented.

If a regression is found, record reproduction steps in `docs/qa/QA_LOG.md`
before implementing the fix.

## Next Recommended Work

- Continue with targeted hardening only when a concrete issue is reproduced.
- Add or update focused tests when behavior is covered by service, storage, or
  pure renderer logic.
- Verify Electron-only behavior manually with `npm run dev`.
- Update `docs/qa/QA_LOG.md`, `docs/qa/REGRESSION_CASES.md`, and
  `docs/TESTING.md` if QA coverage or verification guidance changes.
- Use `docs/sync/` as the planning source of truth before any Google Drive sync
  implementation begins.

## Documentation Map

Active operational documents:

```text
AGENTS.md
docs/TASK.md
docs/CURRENT_STATUS.md
```

Stable reference documents:

```text
README.md
docs/PRD.md
docs/MVP_SPEC.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/STYLE_GUIDE.md
docs/TESTING.md
```

Archived and planning documents:

```text
docs/roadmap/PHASE_1_MVP.md
docs/roadmap/PHASE_2_QA.md
docs/roadmap/PHASE_3_GOOGLE_DRIVE_SYNC.md
docs/qa/QA_LOG.md
docs/qa/REGRESSION_CASES.md
docs/sync/GOOGLE_DRIVE_ARCHITECTURE.md
docs/sync/AUTH_FLOW.md
docs/sync/SYNC_EDGE_CASES.md
```
