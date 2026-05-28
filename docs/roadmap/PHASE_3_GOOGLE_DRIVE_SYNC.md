# Phase 3 - Google Drive Sync Planning Boundary

Status: Not started

Google Drive sync is a possible post-MVP feature. It is not implemented, not
active, and must not be started unless explicitly requested.

## Purpose

Preserve a clear planning boundary for future sync work without mixing cloud
complexity into the local-first MVP baseline.

## Current Boundary

- The app remains local-first.
- Local Markdown files remain the source of truth.
- Sync must be architecturally separate from local file editing.
- Sync planning must not change current MVP behavior.
- Sync implementation must not begin from this placeholder alone.

## Prerequisites Before Implementation

- Confirm the local-first baseline remains stable.
- Define authentication, consent, and token storage requirements.
- Define conflict handling and offline behavior.
- Define how sync interacts with `StorageProvider` without leaking cloud details
  into UI components.
- Add tests and manual QA criteria before implementing behavior.

## Planning Documents

Future sync planning should be split across:

```text
docs/sync/GOOGLE_DRIVE_ARCHITECTURE.md
docs/sync/AUTH_FLOW.md
docs/sync/SYNC_EDGE_CASES.md
```

These documents are placeholders until Google Drive sync is explicitly scoped.

## Out Of Scope Until Requested

- Google Drive API integration
- OAuth implementation
- token persistence
- remote file listing
- sync engine
- conflict resolution
- cloud metadata model
- background sync
