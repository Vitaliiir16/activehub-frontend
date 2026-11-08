# Backend contract

The canonical English requirements live in [backend/docs/REQUIREMENTS.md](https://github.com/Vitaliiir16/activehub-backend/blob/4cc6e2424fc41e848a42503deffb4746f1b5fb00/docs/REQUIREMENTS.md). The backend owns [OpenAPI](https://github.com/Vitaliiir16/activehub-backend/blob/4cc6e2424fc41e848a42503deffb4746f1b5fb00/docs/openapi.yaml) and [API conventions](https://github.com/Vitaliiir16/activehub-backend/blob/4cc6e2424fc41e848a42503deffb4746f1b5fb00/docs/API_CONVENTIONS.md).

## Pinned snapshot

Contract source: backend commit `4cc6e2424fc41e848a42503deffb4746f1b5fb00`, API version 0.1.0. [backend.json](../contracts/backend.json) records this full SHA and the SHA-256 of [backend.openapi.yaml](../contracts/backend.openapi.yaml). The snapshot is a consumer copy; edit the backend source first.

`src/api/schema.d.ts` is generated using openapi-typescript. Run `npm.cmd run api:generate` after copying a reviewed backend contract and updating the manifest. `npm.cmd run api:check` verifies its hash and rejects stale generated types. CI checks out that exact backend commit and compares the canonical file byte-for-byte before running the real stack.

## What works

The typed client in `src/api/client.ts` exposes only the implemented `GET /api/health`. It sends credentials on same-origin requests and maps documented errors to ApiError. The welcome screen performs a real request, displays loading/success/failure in English, and offers retry. nginx and Vite proxy API requests; there are no backend mocks.

OpenAPI describes 107 operations. The remaining 106 are planned, including login/session/CSRF, catalog and every business operation. Generated types for planned operations do not make those operations available. The client deliberately exposes no business methods yet. No authentication or CSRF enforcement is claimed in this delivery.

Money is integer UAH minor units, instants are UTC RFC 3339, and the UI will format dates in Europe/Kyiv. Page size defaults to 20; filters and sorting belong in URLs. Planned cookie and CSRF handling, access control and idempotency are defined by the linked backend conventions.

## Verified scope

`npm.cmd run test:health` calls the typed client through a running frontend proxy and checks the actual API/database response. `npm.cmd run test:e2e` runs Chromium desktop and mobile checks against that same running stack. Set `FRONTEND_BASE_URL` to change the default `http://127.0.0.1:8080`. Install Chromium once with `npx.cmd playwright install chromium`.

Both browser tests passed locally on the Docker stack, including English text, connected status, no horizontal overflow and no page errors. Screenshots were reviewed at both sizes. This covers the foundation only, not business integration. The final tested backend/frontend pair belongs in backend PROGRESS.md and the paired PR descriptions.

Q-01 through Q-05 remain open and are not approved by this contract. Stop after stage 03; authentication and other product modules require the next authorized stage.
