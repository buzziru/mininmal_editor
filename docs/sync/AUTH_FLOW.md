# Google Drive Auth Flow

Status: Placeholder only

Authentication is not implemented. This document exists only to keep future
Google Drive planning separate from the current local-first MVP baseline.

## Future Questions

- Which OAuth flow is appropriate for the Electron app?
- Where are access and refresh tokens stored?
- How does the user disconnect an account?
- What happens when tokens expire or are revoked?
- Which auth errors must be visible to the user?

## Constraints

- Do not introduce accounts during MVP maintenance.
- Do not store credentials in Markdown workspaces.
- Do not couple authentication state directly to editor UI components.
