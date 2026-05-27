## Testing and Validation

Run the following checks when relevant:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`

For UI-related changes, prefer manual Electron smoke testing during the MVP phase.

Playwright E2E tests are optional during the MVP phase. Use them only for small, stable smoke tests after the dev server and test environment are known to work reliably.

Do not repeatedly rerun failing Playwright tests without first isolating the issue with a minimal app-load test.
Do not claim UI behavior was verified unless it was confirmed through manual testing or successful Playwright execution.