# Active Development Task

Last updated: 2026-05-28

This document tracks only the currently active development phase. Completed MVP
and QA phase plans are archived under `docs/roadmap/`.

## Current Active Phase

Maintenance and targeted hardening.

The MVP and post-MVP QA stabilization phases are complete. No new feature
implementation task is currently active.

## Current Task

No active implementation task is assigned.

Google Drive sync planning is documented under `docs/sync/` and
`docs/roadmap/PHASE_3_GOOGLE_DRIVE_SYNC.md`. Implementation is not active.

When a concrete issue is reproduced or a new feature is explicitly requested,
record only the active work here using this format:

```text
Goal:
Scope:
Out of scope:
Verify:
Assigned area:
Status:
```

## Next Recommended Work

- Run the Electron manual smoke checklist in `docs/TESTING.md` before changing
  workspace, file, editor, preview, theme, link, tag, menu, or fullscreen
  behavior.
- Record reproduced QA issues in `docs/qa/QA_LOG.md`.
- Add durable regression coverage to `docs/qa/REGRESSION_CASES.md` when a fixed
  issue should be checked again.
- Keep Google Drive sync as a future, explicitly requested post-MVP feature.
  The current planning documents live under `docs/sync/`.

## Archived Phase Plans

Completed or future phase context lives outside this active task document:

```text
docs/roadmap/PHASE_1_MVP.md
docs/roadmap/PHASE_2_QA.md
docs/roadmap/PHASE_3_GOOGLE_DRIVE_SYNC.md
```

## Active Document Map

- `docs/CURRENT_STATUS.md` contains the concise handoff state.
- `docs/TASK.md` contains only the current active task or phase.
- `docs/qa/QA_LOG.md` contains reproduced QA findings and outcomes.
- `docs/qa/REGRESSION_CASES.md` contains durable regression checks.
