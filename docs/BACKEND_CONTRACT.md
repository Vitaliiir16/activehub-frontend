# Backend contract

Backend owns the canonical English requirements, OpenAPI and API conventions. The reviewed source revision is recorded in [backend.json](../contracts/backend.json), with the SHA-256 of [backend.openapi.yaml](../contracts/backend.openapi.yaml). Use the exact commit link from that manifest when reviewing upstream files; the local sibling source is backend/docs/openapi.yaml. New contract changes are reviewed and verified on the backend before this snapshot and generated client are updated.

Canonical references: [requirements](https://github.com/Vitaliiir16/activehub-backend/blob/8ac3e377d327e867c15bd32af86c5bd3e3b55d95/docs/REQUIREMENTS.md), [OpenAPI source](https://github.com/Vitaliiir16/activehub-backend/blob/e63887f3b9f3d06166a5957d4cc385e16a3e80d6/docs/openapi.yaml), [API conventions](https://github.com/Vitaliiir16/activehub-backend/blob/8ac3e377d327e867c15bd32af86c5bd3e3b55d95/docs/API_CONVENTIONS.md) and [manual review](https://github.com/Vitaliiir16/activehub-backend/blob/8ac3e377d327e867c15bd32af86c5bd3e3b55d95/docs/ACCOUNTS_REVIEW.md).

## Available API

OpenAPI 0.2.0 contains 110 operations: 21 implemented and 89 planned. The client exposes health, CSRF/login/registration/session/logout, own profiles/password/images/preferences, dictionaries, welcome notifications and administrator creation/status. All other routes remain planned, including catalog, bookings, payments, subscriptions, loyalty behavior, chat and optional recovery. Q-01 through Q-05 remain open.

src/api/schema.d.ts is generated with openapi-typescript. api:generate rebuilds it; api:check verifies snapshot hash, full backend SHA and generated output. CI checks out that exact public backend commit and compares the canonical file bytes. Snapshot types for a planned operation do not make it available.

## Security and UI

Cookie credentials accompany API requests. The client obtains a session/context-bound CSRF token before each unsafe request and serializes mutations. No session token is stored in browser storage. A protected 401 clears the displayed session. Backend DTOs choose allowed profile fields from the authenticated role; owner identity cannot be supplied by the caller. HTTP-only cookies, exact Origin checks, expiry/status checks and access constraints are enforced on the server.

The optional organizer registration logo uploads after automatic sign-in. A failed logo upload preserves the account and opens profile with a retry message. Profiles can retain their own inactive dictionary selections, using authenticated includeSelected queries. Images are decoded and normalized on the backend and served only to their owner.

Role landing pages are /events, /organizer and /admin. They contain honest release placeholders; no fabricated statistics or working catalog are shown. Shared profile/notifications pages use real data. ADMIN-only account creation/access forms do not introduce the optional dedicated administrator list.

## Evidence and scope

Local lint/types/build, snapshot/types checks, typed health and eight desktop/mobile browser checks passed against the real Compose stack. The suite exercises registration, validation feedback, profile/email/photo/preferences, reload, logout/login, password change, welcome in-app/Mailpit and seeded/new ADMIN. Screenshots were inspected for English text and responsive layouts. Backend acceptance tests separately cover CSRF, role/ownership denial, unique-email races, expiry/block/deletion revocation, inactive dictionaries, password handling and outbox deduplication.

Exact tested pairs, PRs and hosted CI results are recorded in backend/docs/PROGRESS.md and the paired PR descriptions. This delivery completes stage 04 only. Email delivery uses durable retries; SMTP acceptance followed by a crash before the database commit remains an external duplicate-delivery window. Future communication triggers and business modules remain planned.
