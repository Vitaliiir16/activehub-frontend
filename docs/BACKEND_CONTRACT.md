# Backend contract

Backend owns the canonical English requirements, OpenAPI and API conventions. The reviewed source revision is recorded in [backend.json](../contracts/backend.json), with the SHA-256 of [backend.openapi.yaml](../contracts/backend.openapi.yaml). Use the exact commit link from that manifest when reviewing upstream files; the local sibling source is backend/docs/openapi.yaml. New contract changes are reviewed and verified on the backend before this snapshot and generated client are updated.

Canonical references: [requirements](https://github.com/Vitaliiir16/activehub-backend/blob/3f38561554d6b4c45048375d845f8f02f64bcc1f/docs/REQUIREMENTS.md), [OpenAPI source](https://github.com/Vitaliiir16/activehub-backend/blob/3f38561554d6b4c45048375d845f8f02f64bcc1f/docs/openapi.yaml), [API conventions](https://github.com/Vitaliiir16/activehub-backend/blob/3f38561554d6b4c45048375d845f8f02f64bcc1f/docs/API_CONVENTIONS.md) and [manual review](https://github.com/Vitaliiir16/activehub-backend/blob/3f38561554d6b4c45048375d845f8f02f64bcc1f/docs/ACCOUNTS_REVIEW.md).

## Available API

OpenAPI 0.5.0 contains 112 operations: 79 implemented and 33 planned. The client covers accounts/access, the authenticated catalog/organizers/photos, owned event/session management, recommendations, the booking lifecycle, list/calendar, organizer decisions, simulated payments/receipts/refunds, subscription plans/purchases and loyalty (member card and ledger, administrator levels/rules, card assignment and points adjustment). Chat, complete reminders/communications, general administration, reporting and optional recovery remain planned. Q-01/Q-02/Q-03/Q-04 are approved; Q-05 remains open.

src/api/schema.d.ts is generated with openapi-typescript. api:generate rebuilds it; api:check verifies snapshot hash, full backend SHA and generated output. CI checks out that exact public backend commit and compares the canonical file bytes. Snapshot types for a planned operation do not make it available.

## Security and UI

Cookie credentials accompany API requests. The client obtains a session/context-bound CSRF token before each unsafe request and serializes mutations. No session token is stored in browser storage. A protected 401 clears the displayed session. Backend DTOs choose allowed profile fields from the authenticated role; owner identity cannot be supplied by the caller. HTTP-only cookies, exact Origin checks, expiry/status checks and access constraints are enforced on the server.

The optional organizer registration logo uploads after automatic sign-in. A failed logo upload preserves the account and opens profile with a retry message. Profiles can retain their own inactive dictionary selections, using authenticated includeSelected queries. Images are decoded and normalized on the backend and served only to their owner.

Role landing pages are /events, /organizer and /admin. They contain honest release placeholders; no fabricated statistics or working catalog are shown. Shared profile/notifications pages use real data. ADMIN-only account creation/access forms do not introduce the optional dedicated administrator list.

## Evidence and scope

Local lint/types/build, snapshot/types checks, typed health and eight desktop/mobile browser checks passed against the real Compose stack. The suite exercises registration, validation feedback, profile/email/photo/preferences, reload, logout/login, password change, welcome in-app/Mailpit and seeded/new ADMIN. Screenshots were inspected for English text and responsive layouts. Backend acceptance tests separately cover CSRF, role/ownership denial, unique-email races, expiry/block/deletion revocation, inactive dictionaries, password handling and outbox deduplication.

Exact tested pairs, PRs and hosted CI results are recorded in backend/docs/PROGRESS.md and the paired PR descriptions. The preceding account evidence is historical; the current delivery adds stages 05-07. Email delivery uses durable retries; SMTP acceptance followed by a crash before the database commit remains an external duplicate-delivery window. Later subscription/loyalty/chat/reminder behavior remains planned.

## Stage 05-07 compatibility

Backend PR: [#4](https://github.com/Vitaliiir16/activehub-backend/pull/4), revision b4daf72c703b080a064777683e1f24c28e6b730c. The manifest pins the exact canonical bytes and SHA; later frontend edits do not change server authority. Both repositories branched from updated main after PRs #1-#3 were merged.

The real desktop browser flow creates an event in the organizer form, finds it as a user, reserves, pays, reloads, cancels and reads the refunded receipt. Three existing desktop account cases also passed. Backend risk checks cover PostgreSQL concurrency, expiry/completion, denial and once-only financial effects. No backend mocks were introduced. Broad field/filter/calendar/DST/visual/browser-engine coverage was not run locally. Existing desktop/mobile account CI stays enabled; the new marketplace workflow is intentionally desktop-only.

Payment requests reuse their UUID key after a transport failure with unchanged input; a declined response starts a new attempt. PAN/CVV remain in memory/form/request only. The backend returns integer UAH minor units and UTC instants; the UI formats UAH and Europe/Kyiv. CARD creation becomes FREE when the server price is zero. subscriptionUsedId is null and pointsRedeemed zero until stages 08-09; the UI explicitly describes these benefits as unavailable. Full cross-stage pricing/compensation acceptance remains unfinished.

The first hosted marketplace run passed the new workflow but the old account health assertion matched both catalog loading and connection status. The assertion now targets connection status explicitly; no check was disabled. Final-head CI evidence is in the PR and local handoff.

## Stage 08

Contract 0.4.0 adds plan management/purchase and own subscriptions. Booking offers only currently eligible subscriptions; the server independently checks owner, organizer, scope, session validity and visits. Purchases snapshot terms and cannot be refunded. Corporate loyalty remains stage 09. Typecheck/build passed; the real API/DB visit smoke and last-visit/repeated-return race passed. New browser forms and full regressions were not run locally. The manifest pins the backend implementation; later documentation-only changes do not change its contract/runtime.

## Stage 09

Contract 0.5.0 at backend 3f38561554d6b4c45048375d845f8f02f64bcc1f adds the loyalty operations and the additive fields Booking.pointsAwarded and PointsTransaction.note. The loyalty page shows the server summary (card benefits, balance, lifetime points, Premium progress, current-month free visits, booking and attendance counts) and the paginated ledger. Administrator Loyalty settings edit the three levels and the rules, assign or lock a card and adjust points by user account ID; the server validates every value, prevents a negative balance and keeps existing price and award snapshots. The booking form shows only an estimate before card benefits; booking details show the server breakdown and awarded points. Optional points redemption is not offered.

Paired checks against the isolated stack: lint, typecheck, build, api:check and Playwright (10 passed, 2 mobile duplicates skipped). The new desktop loyalty workflow books and pays through the real forms, reads the awarded points and loyalty page, then assigns a locked Premium card, sees an overdraw rejected and records an adjustment. Backend risk suites cover the financial rules. Mobile loyalty, screenshot review and DST browser combinations were not run locally.
