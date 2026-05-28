# Google Drive Auth Flow

Status: Planned, not implemented

Authentication is required before Google Drive sync can be implemented. This
document defines the intended auth boundary for the post-MVP sync feature.

## Goals

- Use an OAuth flow appropriate for an Electron desktop app.
- Keep access and refresh tokens out of the renderer.
- Store credentials outside Markdown workspaces.
- Allow users to disconnect their Google account.
- Keep local editing available when auth fails.

## Non-Goals

- In-app browser credential entry.
- Custom account system.
- Multi-account sync in the first implementation.
- Sharing or collaboration permissions management.

## OAuth Flow

Use the installed app OAuth flow with the user's system browser.

Expected sequence:

1. Renderer requests `connectDrive` through preload IPC.
2. Electron main starts the OAuth authorization request.
3. The user's system browser opens the Google consent screen.
4. Electron main receives the redirect through a loopback redirect URI.
5. Electron main exchanges the authorization code for tokens.
6. Electron main stores refresh-token-capable credentials securely.
7. Renderer receives only connection status, account identity, and errors.

Do not collect Google credentials inside the app UI.

## Token Storage

Tokens must not be stored:

- in Markdown files
- inside the selected workspace
- in renderer local storage
- in source-controlled project files

Preferred first storage approach:

- store auth state under Electron `app.getPath("userData")`
- encrypt token payloads with Electron `safeStorage` where available
- keep token read/write code in Electron main only

If distribution-level credential hardening becomes a requirement, evaluate a
Windows Credential Manager/keytar-style store before release.

## Scopes

Prefer the narrowest scope that supports the chosen Drive folder workflow.

Initial candidate:

```text
https://www.googleapis.com/auth/drive.file
```

If the app must discover or manage files that it did not create or that were not
explicitly selected by the user, a broader Drive scope may be required. That
decision must be documented before implementation.

## Exposed Renderer State

Renderer-visible auth state should be limited to:

```ts
interface DriveConnectionStatus {
  connected: boolean;
  accountEmail?: string;
  error?: string;
}
```

The renderer must never receive access tokens, refresh tokens, client secrets,
or raw OAuth responses.

## Disconnect Behavior

Disconnect should:

- remove local token state
- clear workspace-to-Drive-account association if appropriate
- leave local Markdown files untouched
- surface whether remote Drive files are left as-is

Token revocation against Google may be added if the implementation can do it
reliably. Local credential removal is required.

## Auth Failure Handling

Required recoverable states:

- user cancels consent
- token refresh fails
- token is revoked
- network unavailable
- selected scope is insufficient

In all cases:

- local editing must remain available
- sync should stop before modifying files
- the UI should show a concise recoverable error

## Verification

- Auth handlers run only in Electron main.
- Preload exposes status methods, not tokens.
- Disconnect removes stored credentials.
- Revoked/expired tokens produce a recoverable error.
- Local workspace editing still works after auth failure.

## Official References

- Google OAuth 2.0 for installed apps:
  https://developers.google.com/identity/protocols/oauth2/native-app
- Google OAuth 2.0 overview:
  https://developers.google.com/identity/protocols/oauth2
