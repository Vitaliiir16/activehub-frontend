# Backend compatibility

Backend owns REQUIREMENTS.md, docs/openapi.yaml and API_CHANGELOG.md. contracts/backend.json pins its exact repository revision and SHA-256; contracts/backend.openapi.yaml is copied byte-for-byte and src/api/schema.d.ts is generated from it. The current pin is b009f71a347b14a0bbff66637760e4baf09e8412, contract 0.9.0. Later documentation-only backend commits do not change runtime or schema.

The application consumes real account/profile/security, catalog, booking/payment/refund, subscription/loyalty, chat/notification, administration and statistics endpoints. Cookie sessions are restored on reload; unsafe requests obtain CSRF tokens and serialize. Server role/owner/state checks remain authoritative. Money is integer UAH minor units over the API and formatted in UAH; instants are UTC and displayed in Europe/Kyiv.

The new booking quote shows current ordered benefits before confirmation. It creates no reservation; final creation may change if another user consumes remaining capacity/quota first. Organizer dashboard lists reuse owned APIs. Event Bookings is scoped by eventId, while the server also checks the organizer owner. Organizer revenue includes subscription sales by the explicit stage 13 decision.

Current runtime boundary: frontend 9ef5071647bdecafb9075549b7debcffc6b72e6d, backend b009f71a347b14a0bbff66637760e4baf09e8412. Both lint/typecheck/build and generated-contract checks passed. Real PostgreSQL/API checks cover financial/visit/quota races and restoration, three roles, server preview, chat/Mailpit and isolation. One desktop marketplace workflow and sampled desktop/mobile pages passed; manager Overview/scoped Bookings/reset and invalid-promotion feedback were checked. Whole filter/field/calendar/browser/provider/crash matrices were not run. Final published heads and hosted CI belong in the PR descriptions and local handoff.

Optional stage 14 screens are not represented as functional. No card credentials or login secrets are stored in browser persistent storage. See backend docs/FINAL_ACCEPTANCE.md for the teacher sequence, exact checks and limitations.
