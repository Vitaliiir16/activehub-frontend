# ActiveHub frontend

The React/TypeScript interface for the ActiveHub sports marketplace. Members discover activities, book, use subscriptions and loyalty, pay through a simulator and message organizers. Organizers manage activities, sessions, requests and plans. Administrators manage the platform and review statistics.

The application uses React 19, TypeScript, Vite and a typed REST client. The backend is a separate Next.js/TypeScript repository with PostgreSQL. English UI, UAH and Europe/Kyiv apply throughout.

## Start

Keep activehub-backend and activehub-frontend beside each other. From the backend directory:

~~~powershell
node scripts/create-local-env.mjs
docker compose up --build --wait
~~~

The environment generator preserves an existing .env. Open http://localhost:8080; Mailpit is http://localhost:8025. Backend Compose owns migrations, required seeds, optional demo data and shared uploads. nginx proxies /api to the real backend.

For demo sign-in, enable SEED_DEMO in the backend .env and use its private DEMO_PASSWORD. The default namespace creates member1 through member4, trainer, club, venue and organizer at @demo.activehub.example.test; the initial administrator uses its separately configured credentials. Full setup, SMTP options and non-destructive reseeding are in the [backend README](https://github.com/Vitaliiir16/activehub-backend#readme).

For local Vite development:

~~~powershell
npm.cmd ci
npm.cmd run dev
~~~

Open http://localhost:5173. API_PROXY_TARGET defaults to http://127.0.0.1:3000; the backend must allow the exact Vite origin. Browser configuration is public and must contain no secrets.

## Checks and compatibility

~~~powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run api:check
npm.cmd run build
~~~

test:health reaches actual PostgreSQL through the proxy. test:e2e runs Playwright against a running real stack. ACTIVEHUB_E2E_ENV_FILE selects a private isolated backend environment; credentials are redacted. Existing CI remains enabled. Use one relevant scenario when changing a screen rather than repeating the full suite on every edit.

[BACKEND_CONTRACT.md](docs/BACKEND_CONTRACT.md) records compatibility. contracts/backend.json pins the exact backend revision and schema hash; src/api/schema.d.ts is generated from those bytes. Cookies hold the session, unsafe calls fetch CSRF tokens and run serially, and the server checks role, state and owner. No credentials or card input are stored in localStorage.

The organizer dashboard shows real counters, pending decisions, upcoming availability and activity cards. Event management has Overview, Sessions, Bookings, Edit, Photos and Status views. Booking confirmation shows the current server-calculated breakdown before reserving, then displays the immutable result. Previewing never reserves capacity or benefits.

No GoF pattern is claimed in this frontend. The backend indexes its SeatPolicy Strategy, pricing chain and payment/SMTP Adapters with actual symbols and search commands. The [acceptance guide](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/FINAL_ACCEPTANCE.md) contains the teacher demonstration and verification limits. Optional stage 14 screens are not advertised as working features.
