# Backend contract

Backend owns the canonical English requirements, OpenAPI and API conventions. The reviewed source revision is recorded in [backend.json](../contracts/backend.json), with the SHA-256 of [backend.openapi.yaml](../contracts/backend.openapi.yaml). Use the exact commit link from that manifest when reviewing upstream files; the local sibling source is backend/docs/openapi.yaml. New contract changes are reviewed and verified on the backend before this snapshot and generated client are updated.

Canonical references: [requirements](https://github.com/Vitaliiir16/activehub-backend/blob/79e376fc1733974a6e9670ed94fa3b73bff8c9fb/docs/REQUIREMENTS.md), [OpenAPI source](https://github.com/Vitaliiir16/activehub-backend/blob/79e376fc1733974a6e9670ed94fa3b73bff8c9fb/docs/openapi.yaml), [API conventions](https://github.com/Vitaliiir16/activehub-backend/blob/79e376fc1733974a6e9670ed94fa3b73bff8c9fb/docs/API_CONVENTIONS.md) and [manual review](https://github.com/Vitaliiir16/activehub-backend/blob/79e376fc1733974a6e9670ed94fa3b73bff8c9fb/docs/ACCOUNTS_REVIEW.md).

## Available API

OpenAPI 0.3.0 contains 112 operations: 62 implemented and 50 planned. The client adds authenticated catalog/organizers/photos, owned event/session management, recommendations, card/free booking lifecycle, list/calendar, organizer decisions and simulated payments/receipts/refunds to the existing accounts/access endpoints. Subscriptions, loyalty, chat, complete reminders/communications and optional recovery remain planned. Q-03 is approved inclusive; Q-01/Q-02/Q-04/Q-05 remain open.

src/api/schema.d.ts is generated with openapi-typescript. api:generate rebuilds it; api:check verifies snapshot hash, full backend SHA and generated output. CI checks out that exact public backend commit and compares the canonical file bytes. Snapshot types for a planned operation do not make it available.

## Security and UI

Cookie credentials accompany API requests. The client obtains a session/context-bound CSRF token before each unsafe request and serializes mutations. No session token is stored in browser storage. A protected 401 clears the displayed session. Backend DTOs choose allowed profile fields from the authenticated role; owner identity cannot be supplied by the caller. HTTP-only cookies, exact Origin checks, expiry/status checks and access constraints are enforced on the server.

The optional organizer registration logo uploads after automatic sign-in. A failed logo upload preserves the account and opens profile with a retry message. Profiles can retain their own inactive dictionary selections, using authenticated includeSelected queries. Images are decoded and normalized on the backend and served only to their owner.

Role landing pages are /events, /organizer and /admin. They contain honest release placeholders; no fabricated statistics or working catalog are shown. Shared profile/notifications pages use real data. ADMIN-only account creation/access forms do not introduce the optional dedicated administrator list.

## Evidence and scope

Local lint/types/build, snapshot/types checks, typed health and eight desktop/mobile browser checks passed against the real Compose stack. The suite exercises registration, validation feedback, profile/email/photo/preferences, reload, logout/login, password change, welcome in-app/Mailpit and seeded/new ADMIN. Screenshots were inspected for English text and responsive layouts. Backend acceptance tests separately cover CSRF, role/ownership denial, unique-email races, expiry/block/deletion revocation, inactive dictionaries, password handling and outbox deduplication.

Exact tested pairs, PRs and hosted CI results are recorded in backend/docs/PROGRESS.md and the paired PR descriptions. This delivery completes stage 04 only. Email delivery uses durable retries; SMTP acceptance followed by a crash before the database commit remains an external duplicate-delivery window. Future communication triggers and business modules remain planned.

## Stage 05?07 compatibility

Backend PR: [#4](https://github.com/Vitaliiir16/activehub-backend/pull/4), revision 79e376fc1733974a6e9670ed94fa3b73bff8c9fb. The manifest pins the exact canonical bytes and SHA; later frontend edits do not change server authority. Both repositories branched from updated main after PRs #1?#3 were merged.

The real desktop browser flow creates an event in the organizer form, finds it as a user, reserves, pays, reloads, cancels and reads the refunded receipt. Three existing desktop account cases also passed. Backend risk checks cover PostgreSQL concurrency, expiry/completion, denial and once-only financial effects. No backend mocks were introduced. Broad field/filter/calendar/DST/visual/browser-engine coverage was not run locally. Existing desktop/mobile account CI stays enabled; the new marketplace workflow is intentionally desktop-only.

Payment requests reuse their UUID key after a transport failure with unchanged input; a declined response starts a new attempt. PAN/CVV remain in memory/form/request only. The backend returns integer UAH minor units and UTC instants; the UI formats UAH and Europe/Kyiv. CARD creation becomes FREE when the server price is zero. subscriptionUsedId is null and pointsRedeemed zero until stages 08?09; the UI explicitly describes these benefits as unavailable. Full cross-stage pricing/compensation acceptance remains unfinished.
