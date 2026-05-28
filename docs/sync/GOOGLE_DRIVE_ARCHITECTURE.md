# Google Drive Architecture

Status: Placeholder only

Google Drive sync is a possible post-MVP feature. It is not implemented and must
not be started unless explicitly requested.

## Boundary

- Preserve the local-first editor baseline.
- Keep UI components independent from Google Drive APIs.
- Keep cloud behavior behind an application/storage boundary.
- Do not change local Markdown file ownership or plain-text compatibility.

## Future Questions

- How should a Google Drive-backed storage provider relate to
  `StorageProvider`?
- What metadata is required without introducing a database-first model?
- How are local edits, remote edits, and offline changes reconciled?
- Which behavior must remain available when authentication fails?

## Out Of Scope

- API client implementation
- sync engine implementation
- conflict resolution implementation
- background sync
- cloud metadata schema
