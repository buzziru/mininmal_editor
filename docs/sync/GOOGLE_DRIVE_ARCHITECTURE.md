# Google Drive Sync Architecture

Status: Planned, not implemented

Google Drive sync is a post-MVP feature. This document defines the intended
implementation boundary only. Do not begin implementation unless Google Drive
sync is explicitly assigned as active work.

## Goals

- Preserve the local-first editor baseline.
- Keep Markdown files as plain `.md` files.
- Sync only Markdown documents in the selected workspace.
- Keep Google Drive API details out of UI components.
- Prevent silent overwrites when local and remote content diverge.
- Allow the current local editor workflow to continue when Drive auth or network
  access fails.

## Non-Goals

- Google Docs conversion.
- Real-time collaboration.
- Multi-user shared editing.
- Mobile sync.
- Plugin-based sync providers.
- Automatic merge of conflicting Markdown content.
- Full Drive file manager behavior.

## First Implementation Scope

The first implementation should support:

- connect a Google account
- disconnect a Google account
- select or create one Drive folder for the active local workspace
- manually run "sync now"
- upload local `.md` files to the mapped Drive folder
- download remote `.md` files into the local workspace
- detect local/remote conflicts without overwriting either side
- show sync status and sync results in the renderer

Automatic background sync may be added later only after manual sync is stable.

## Architecture Boundary

The sync feature should be layered separately from the existing local editing
flow.

```text
Renderer UI
    ↓
Preload IPC API
    ↓
Electron Main Sync Handlers
    ↓
SyncService
    ↓
LocalFileStorage + GoogleDriveClient
    ↓
Local File System + Google Drive API
```

UI components may call preload methods such as `connectDrive`, `disconnectDrive`,
`syncWorkspace`, and `getSyncStatus`. They must not import Google API clients or
own token state.

## Storage Strategy

Do not replace `LocalFileStorage` with a remote-first storage provider in the
first implementation.

Preferred first approach:

- Keep `LocalFileStorage` as the editor's source for read/write operations.
- Add `SyncService` as an orchestration layer that compares local files with
  Drive files.
- Add `GoogleDriveClient` as a small wrapper around the Drive API.
- Keep Drive IDs and sync metadata in app-managed sync state, not in Markdown
  documents.

This avoids making normal editing depend on network availability.

## Proposed Modules

```text
src/services/SyncService.ts
src/services/SyncService.test.ts
src/sync/SyncTypes.ts
src/sync/SyncPlanner.ts
src/sync/SyncPlanner.test.ts
electron/driveAuth.cjs
electron/driveClient.cjs
electron/syncState.cjs
```

Names may change during implementation, but responsibilities should stay
separate:

- auth: OAuth and token lifecycle
- client: Drive API calls
- state: workspace-to-Drive-folder mapping and file sync metadata
- planner: pure diff and conflict decisions
- service: ordered execution and result reporting

## Sync State

Sync state should live in the application's user data directory, not in the
Markdown workspace.

Minimum state:

```ts
interface SyncWorkspaceConfig {
  localWorkspaceRoot: string;
  driveFolderId: string;
  accountEmail?: string;
}

interface SyncFileState {
  localPath: string;
  driveFileId: string;
  lastSyncedLocalMtimeMs?: number;
  lastSyncedDriveModifiedTime?: string;
  lastSyncedChecksum?: string;
}
```

The exact persisted shape can change, but it must not require hidden metadata in
Markdown files.

## File Identity

Use workspace-relative paths as the user-facing identity. Use Drive file IDs as
the remote identity after a file has been created or matched.

Rules:

- Local paths must remain relative to the workspace.
- Only `.md` files are included.
- Backslashes should normalize to `/` in app-level sync state.
- Case-only path changes need explicit handling because Windows and Drive do not
  have identical path semantics.

## Sync Algorithm

First manual sync:

1. Scan local `.md` files through the local storage boundary.
2. List Drive `.md` files in the mapped Drive folder.
3. Load prior sync state for the workspace.
4. Build a sync plan:
   - upload local-only files
   - download remote-only files
   - update remote when only local changed
   - update local when only remote changed
   - create conflict copies when both changed
5. Execute the plan with per-file error collection.
6. Persist updated sync state only for successful file operations.
7. Return a summary to the renderer.

## Conflict Policy

The first implementation must not auto-merge conflicting Markdown content.

When both sides changed since the last successful sync:

- keep the current local file unchanged
- download the remote version as a conflict copy
- use a deterministic filename such as
  `notes.conflict-20260528-153000.md`
- report the conflict in the sync result

## Deletion Policy

Deletion is risky and should not be part of the first implementation unless it
is explicitly scoped.

Recommended first behavior:

- local-only file: upload
- remote-only file: download
- missing file that previously existed on both sides: report as a delete
  candidate, but do not delete automatically

Automatic remote trashing or local deletion should require a later explicit
policy decision.

## Google Drive API Notes

Relevant Drive API capabilities:

- `files.list` for folder listings and query-based filtering
- `files.create` for uploads
- `files.update` for remote updates
- file media download for remote content
- `changes` API for later incremental remote change tracking

The first implementation can use full folder scans during manual sync. The
`changes` API can be introduced later after sync state and conflict handling are
stable.

## Verification

Automated checks:

- `npm run typecheck`
- `npm test`
- `npm run build`

Focused tests:

- sync planning for local-only, remote-only, changed, unchanged, and conflicting
  files
- path normalization
- sync state persistence
- Drive client error mapping with a fake client
- IPC handlers do not expose tokens to the renderer

Manual Electron checks:

- connect a Google account
- disconnect the account
- map a local workspace to a Drive folder
- upload a local Markdown file
- download a remote Markdown file
- edit the same file locally and remotely, then confirm a conflict copy is made
- run sync with network unavailable and confirm local editing still works
- revoke token access and confirm the app shows a recoverable auth error

## Official References

- Google OAuth 2.0 for installed apps:
  https://developers.google.com/identity/protocols/oauth2/native-app
- Google Drive API file search:
  https://developers.google.com/workspace/drive/api/guides/search-files
- Google Drive API uploads:
  https://developers.google.com/workspace/drive/api/guides/manage-uploads
- Google Drive API changes:
  https://developers.google.com/workspace/drive/api/guides/manage-changes
- Google Drive API push notifications:
  https://developers.google.com/workspace/drive/api/guides/push
