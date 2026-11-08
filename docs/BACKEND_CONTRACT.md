# Backend integration contract

Status on 2026-11-08: integration is planned. No API specification, endpoints, schemas or typed client exist. Documentation revision links below are not proof of application compatibility.

## Sources

Backend repository: [Vitaliiir16/activehub-backend](https://github.com/Vitaliiir16/activehub-backend).

- [Published requirements baseline](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/REQUIREMENTS.md)
- [Requirement and verification matrix](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/REQUIREMENTS_MATRIX.md)
- [Delivery plan](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/DELIVERY_PLAN.md)
- [Open decisions](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/ASSUMPTIONS.md)
- [API change history](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/API_CHANGELOG.md)
- [Progress and paired revision record](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/PROGRESS.md)

The original specification is archived unchanged locally at sibling `../activehub-backend/docs/project.md`. It is not published. The English baseline records the owner's language override and retains the original section references.

The future canonical OpenAPI file is `activehub-backend/docs/openapi.yaml` (planned; currently absent). Once published its URL will be `https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/openapi.yaml`. The development contract must be pinned to a commit, not just that moving URL. Do not invent routes or types from the feature list.

## Synchronization order

1. Review backend contract changes, acceptance examples and changelog before consuming them.
2. Backend implements and verifies the agreed contract with PostgreSQL integration checks.
3. Pin the backend commit and contract hash, then generate or update the typed frontend client and related screens. Backend retains authority over pricing, eligibility, lifecycle, ownership and validation.
4. Run both check suites and integrated E2E at exact revisions. Cross-link both PRs and record the tested pair here and in backend progress.
5. Expand backend compatibility before changing consumers; retire older behavior only in a later coordinated review. Merging is reserved to the owner.

## Contract topics to define

Authentication/session cookies, CSRF and same-origin proxy behavior; role/ownership errors; English field messages and error format; money/timestamp representation; filters/pagination/sorting; file uploads; booking/payment idempotency; status/deadline semantics; chat and notification updates. These are pending design decisions rather than agreed transport formats.

Interface text is English by explicit owner direction, overriding the source's Ukrainian-language UI requirement. UAH and Europe/Kyiv remain fixed. Never ship secrets in browser environment values or persist full card numbers/CVV. Avoid mock-only acceptance: integration uses the real backend and PostgreSQL.

## Compatibility record

| Item | Current value |
|---|---|
| Backend implementation revision | None; no implementation exists |
| OpenAPI revision and SHA-256 | None; file not yet defined |
| Frontend client revision | None; no client exists |
| Paired application checks | Not run; no applications or scripts exist |

When populated, each entry must include both commit SHAs, scope/date, actual commands and outcomes. A documentation baseline cannot be relabeled as a tested application pair.
