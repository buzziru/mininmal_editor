# Phase 3 - Google Drive Sync

Status: Planned, not implemented

Google Drive sync is a post-MVP feature. The implementation plan is documented,
but no sync code has been started.

## Purpose

Add optional Google Drive synchronization without weakening the local-first
Markdown editor baseline.

The app must remain useful as a local editor even when Google authentication,
network access, or Drive API calls fail.

## Current Boundary

- Local Markdown files remain the source of truth for editing.
- Sync is optional and must be explicitly connected by the user.
- Sync behavior must stay behind Electron main/preload and service boundaries.
- UI components must not import Google Drive API clients or own token state.
- Markdown files must remain plain `.md` files with no hidden sync metadata.
- Conflicts must not silently overwrite either local or remote content.

## Planning Documents

Detailed implementation planning lives in:

```text
docs/sync/GOOGLE_DRIVE_ARCHITECTURE.md
docs/sync/AUTH_FLOW.md
docs/sync/SYNC_EDGE_CASES.md
```

## Planned Milestones

### 1. Scope And Consent

- Confirm the exact Drive folder mapping workflow.
- Confirm OAuth scope requirements.
- Confirm where encrypted token state and sync mapping state are stored.
- Confirm that deletion propagation is excluded from the first implementation.

Verify:

- docs in `docs/sync/` reflect the final implementation scope before coding.

### 2. Authentication Foundation

- Add Electron main auth handlers.
- Use system-browser OAuth for an installed desktop app.
- Store tokens outside the Markdown workspace.
- Expose only connection status through preload.

Verify:

- renderer cannot access tokens
- disconnect removes local auth state
- auth failure does not break local editing

### 3. Drive Folder Mapping

- Select or create one Drive folder for the active local workspace.
- Store workspace-to-folder mapping in app-managed sync state.
- Keep mapping state out of Markdown files.

Verify:

- remapping a workspace is explicit
- local files are not modified by mapping alone

### 4. Manual Sync Engine

- Scan local `.md` files.
- List remote `.md` files in the mapped Drive folder.
- Build a sync plan.
- Upload local-only files.
- Download remote-only files.
- Update only one-sided changes.
- Create conflict copies when both sides changed.

Verify:

- local-only, remote-only, unchanged, one-sided changed, and conflicting files
  are covered by focused tests

### 5. User-Facing Sync Status

- Show connection state.
- Provide a manual "sync now" action.
- Show uploaded, downloaded, skipped, conflict, and failed counts.
- Surface recoverable auth/network errors.

Verify:

- users can understand what changed and what needs attention

### 6. Stabilization

- Run automated checks.
- Run Electron manual sync smoke tests.
- Add regression cases for conflicts, auth failure, and network failure.
- Update status and testing docs.

Verify:

- `npm run typecheck`
- `npm test`
- `npm run build`
- manual Electron sync checklist passes

## Explicitly Out Of Scope For First Implementation

- automatic background sync
- automatic conflict merging
- automatic deletion propagation
- Google Docs conversion
- attachments and non-Markdown files
- multi-account sync
- shared workspace collaboration
- Drive push notifications or webhooks

## Done Criteria

Phase 3 is complete only when:

- a user can connect Google Drive
- a user can map one local workspace to one Drive folder
- a user can manually sync Markdown files
- conflicts create safe local conflict copies
- local editing still works without network or auth
- tokens are not exposed to the renderer
- relevant automated tests pass
- Electron manual sync verification is complete
- `docs/sync/`, `docs/TESTING.md`, `docs/CURRENT_STATUS.md`, and
  `docs/TASK.md` are synchronized with the implemented behavior
