# ActiveHub frontend

The React and TypeScript interface for ActiveHub. The current Vite scaffold displays an English welcome screen. Authentication, catalogs, booking and role-specific tools are planned.

## Run locally

Clone [activehub-backend](https://github.com/Vitaliiir16/activehub-backend) beside this directory, keeping both repository names. With Node 24 and Docker's Linux engine available, run from `activehub-backend`:

```powershell
node scripts/create-local-env.mjs
docker compose up --build --wait
```

Environment generation is needed once and never overwrites existing configuration. Open <http://localhost:8080>. The backend owns Compose and starts PostgreSQL, required seeds, API, worker, frontend and Mailpit. nginx proxies `/api` to the real backend using the same browser origin. `/uploads` is reserved for future authenticated file handling; no serving endpoint exists yet.

For Vite development, keep the API running and use:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open <http://localhost:5173>. The proxy defaults to `http://127.0.0.1:3000`; set `API_PROXY_TARGET` in a local `.env` for another port. Never put secrets in browser environment variables.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

PowerShell uses `npm.cmd` and `npx.cmd`; other shells use `npm` and `npx`. Lockfiles pin dependencies, including targeted lint dependency overrides for the minimatch advisory. Product behavior remains unimplemented.

## Contract and development

[BACKEND_CONTRACT.md](docs/BACKEND_CONTRACT.md) links canonical requirements and records synchronization. Contract changes come first, followed by backend behavior, the typed client and paired checks. New UI, code, messages and documentation use English. Future prices use UAH and dates display in Europe/Kyiv.

## Design patterns

No GoF pattern is implemented in this frontend. When a pattern is justified, this index will name its purpose, real source symbols and a search command. Comments stay concise and in English.
