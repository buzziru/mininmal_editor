# Sync Edge Cases

Status: Placeholder only

Sync edge cases are not implemented. This document reserves a place for future
planning if Google Drive sync is explicitly requested.

## Future Case Areas

- local and remote edits to the same file
- deleted local file with existing remote copy
- renamed file while offline
- remote file moved outside the expected folder
- duplicate filenames or case-only filename changes
- partial upload or download failure
- token expiration during sync
- app shutdown during pending sync work

## Constraints

- Do not change current local file behavior from this placeholder.
- Do not add sync metadata to Markdown content without a future design decision.
- Do not introduce cloud conflict behavior until the feature is scoped.
