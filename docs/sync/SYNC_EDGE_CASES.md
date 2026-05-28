# Google Drive Sync Edge Cases

Status: Planned, not implemented

This document records edge cases that must be considered before Google Drive
sync implementation starts. The first implementation should favor safe,
observable behavior over automatic cleanup.

## Guiding Rule

Never silently overwrite or delete user Markdown content.

When the app cannot prove a sync operation is safe, it should skip the operation,
report the issue, and keep local files intact.

## Local And Remote Edits

Case: the same file changed locally and on Drive since the last successful sync.

Required behavior:

- keep the local file unchanged
- download the remote version as a conflict copy
- report the conflict in the sync summary
- update sync state only for non-conflicting successful operations

Do not auto-merge Markdown in the first implementation.

## Remote-Only File

Case: a Markdown file exists in the mapped Drive folder but not locally.

Required first behavior:

- download it into the matching workspace-relative path when that path is free
- create parent folders as needed
- if a path collision exists, create a conflict copy instead of overwriting

## Local-Only File

Case: a Markdown file exists locally but not in Drive.

Required first behavior:

- upload it to the mapped Drive folder
- persist the returned Drive file ID in sync state

## Deleted Local File

Case: sync state says the file existed on both sides, but the local file is now
missing.

Required first behavior:

- do not automatically delete the Drive file
- report it as a delete candidate
- leave remote content intact

Remote trash/delete behavior requires a separate explicit policy decision.

## Deleted Remote File

Case: sync state says the file existed on both sides, but the Drive file is now
missing or trashed.

Required first behavior:

- do not automatically delete the local file
- report it as a remote delete candidate
- leave local content intact

## Renamed File

Case: a file path changes locally or remotely.

Required first behavior:

- if sync state can confidently match the same Drive file ID, treat it as a move
  or rename
- if identity is ambiguous, treat it as local-only plus remote-only and avoid
  deleting either side

## Case-Only Rename

Case: `Notes.md` becomes `notes.md`.

Required first behavior:

- normalize app-level paths consistently
- test on Windows specifically
- avoid creating duplicate sync state entries for paths that differ only by case

## Duplicate Remote Names

Case: multiple Drive files in the mapped folder have the same visible name.

Required first behavior:

- skip automatic download/update for ambiguous duplicates
- report the duplicate names in the sync result
- require manual cleanup or a later disambiguation design

## Folder Moves

Case: the mapped Drive folder is moved in Drive.

Required first behavior:

- continue using the folder ID if it remains accessible
- report an error if the folder is deleted or access is revoked

## Unsupported Files

Case: non-Markdown files exist locally or remotely.

Required first behavior:

- ignore non-`.md` files
- do not upload attachments, images, or app metadata

## Partial Failure

Case: some files sync successfully and others fail.

Required behavior:

- preserve per-file results
- persist sync state only for successful file operations
- show a summary that distinguishes success, skipped, conflict, and failed items

## Network Loss

Case: network access disappears during sync.

Required behavior:

- stop processing additional remote operations after the failure is detected
- keep local files available
- report a recoverable network error
- do not mark failed operations as synced

## Token Expiration Or Revocation

Case: access token refresh fails or permission is revoked.

Required behavior:

- stop sync before modifying files
- clear or mark invalid auth state as needed
- show reconnect guidance
- keep local editing available

## App Shutdown During Sync

Case: the app closes during pending sync operations.

Required first behavior:

- avoid long hidden background operations
- perform manual sync with visible progress
- persist state only after each successful file operation
- on next launch, require a new manual sync

## Large Files

Case: unusually large Markdown files.

Required first behavior:

- avoid loading unnecessary remote file content during planning
- use Drive upload behavior that can tolerate interruption
- surface per-file failures instead of failing the entire sync silently

## Future Decisions

These areas require explicit decisions before implementation expands:

- automatic background sync interval
- automatic deletion propagation
- conflict review UI
- sync history UI
- Drive changes API adoption
- push notification/webhook support
