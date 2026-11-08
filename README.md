# ActiveHub frontend

The React/TypeScript interface for ActiveHub. Accounts and access are available with English forms, role navigation and responsive layouts. Users and organizers can register, edit their profiles/photos/preferences, change passwords and sign out. Administrators can create other administrators and update their access. The authenticated catalog, organizer event/session/photo forms, user bookings/list/calendar, organizer decisions, simulated payment and refunded receipts use the real backend. Subscriptions, the member loyalty card, the administrator loyalty settings, notifications and user-organizer chat use the real backend. Administration screens use the real backend as well. Reporting screens remain planned.

## Start

Clone [activehub-backend](https://github.com/Vitaliiir16/activehub-backend) beside this repository. With Node 24 and Docker's Linux engine running, execute from the backend directory:

~~~powershell
node scripts/create-local-env.mjs
docker compose up --build --wait
~~~

Generate the environment only once. Open http://localhost:8080. The backend owns Compose, migrations/seeds, PostgreSQL, worker, Mailpit and shared image storage. nginx proxies /api to the real backend using the same origin. Seeded administrator credentials remain in the private backend .env; there are no hardcoded demo credentials.

For Vite development, run npm.cmd ci and npm.cmd run dev, then open http://localhost:5173. API_PROXY_TARGET defaults to http://127.0.0.1:3000. Configure the backend APP_ORIGINS with the exact Vite origin. Browser environment values are public; never put secrets in them.

## Checks

~~~powershell
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run api:check
npm.cmd run build
npm.cmd run test:health
npx.cmd playwright install chromium
npm.cmd run test:e2e
~~~

Health/E2E require the running Compose stack. The E2E runner privately loads only the required administrator credentials and local ports from ../activehub-backend/.env. For an isolated configuration, set ACTIVEHUB_E2E_ENV_FILE to its filename; FRONTEND_BASE_URL and MAILPIT_BASE_URL can override test URLs. No credentials are printed. Eight desktop/mobile Chromium tests exercise actual API/PostgreSQL and Mailpit, including both signup roles, profile/email/photo/preferences, reload, password change, logout/login and seeded/new ADMIN. No backend mocks are used. The backend manual review guide describes the separate test environment.

GitHub Actions runs static/generated-type checks, checks out the exact backend commit in contracts/backend.json, compares the OpenAPI snapshot byte-for-byte, starts Compose and runs the browser suite. Cross-repository checkout currently relies on public backend visibility.

## API and sessions

[BACKEND_CONTRACT.md](docs/BACKEND_CONTRACT.md) records the pinned contract and compatibility evidence. API calls include cookies. Unsafe calls fetch a bound CSRF token and run serially; session expiration returns the interface to sign-in. Credentials are never stored in localStorage. Server checks remain authoritative for roles, ownership, dictionaries, passwords and images.

## Design patterns

No GoF pattern is claimed in this frontend. Backend SeatPolicy Strategy and SMTP/card Adapters are indexed with symbols and search commands in its README. Future frontend patterns will be listed with actual symbols, purpose and search commands when justified.

The marketplace browser scenario runs once on desktop Chromium against real PostgreSQL/API; it creates an activity, reserves, pays, reloads and cancels to a refunded receipt. It supplements the existing account checks. It does not claim broad calendar/filter/visual coverage. See the backend [manual review](https://github.com/Vitaliiir16/activehub-backend/blob/feature/05-07-marketplace/docs/MARKETPLACE_REVIEW.md). Card credentials remain in the current form/request only, never browser storage. Money displays as UAH; dates use Europe/Kyiv.

Stage 08 adds organizer Plans, subscription purchase, My subscriptions and eligible subscription selection when booking. Purchased terms remain unchanged after plan edits/archive. Corporate loyalty is deferred to stage 09. New subscription browser forms were not E2E-tested in this reduced run.

Stage 09 adds the Loyalty page (card, benefits, balance, Premium progress, monthly free visits and points history) and administrator Loyalty settings (levels, rules, card assignment/lock and points adjustment). Prices, free visits, discounts and awards come from the server; the booking form shows only an estimate before card benefits. A desktop browser test covers earning points and the administrator card and points forms.

Stage 10 adds Messages (conversation list and thread) and header unread badges for notifications and messages. Both update by polling, without reloading the page, and pause while the tab is hidden. Notifications link to their subject, can be filtered to unread and show whether they were also emailed. Emails are sent by the backend worker: by default into Mailpit at http://localhost:8025, or through a real provider such as Gmail when the backend `.env` is configured (see the backend README, Email). A desktop browser test covers live chat and unread badges.

Stage 11 adds the Administration area for administrators: Users, Organizers, Events, Bookings, Subscriptions, Dictionaries, Loyalty settings and Administrator access. Lists filter through the address and paginate; block, unblock, cancel and delete ask for a reason, and the server applies the cascades and refunds. A desktop browser test covers the main flows; the statistics dashboard is planned for a later stage.
