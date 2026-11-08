# ActiveHub frontend

The web interface for ActiveHub, a marketplace for sports sessions, venue bookings and activities. It will provide separate areas for users, organizers and administrators.

The React and TypeScript scaffold runs with Vite and shows an English coming-soon screen. Product features and the typed backend client are the next steps.

## Stack and setup plan

The frontend will be a separate React and TypeScript application using the Next.js REST backend. Vite is the proposed build tool. The interface will be in English, with prices in UAH and dates displayed in Europe/Kyiv.

Clone this repository beside [activehub-backend](https://github.com/Vitaliiir16/activehub-backend), keeping both directory names. After infrastructure is implemented, the target full-stack command from the backend directory will be:

```powershell
docker compose up --build
```

For the scaffold, use Node 24 and run `npm.cmd ci`, `npm.cmd run lint`, `npm.cmd run typecheck` and `npm.cmd run build`. `npm.cmd run dev` serves the frontend on port 5173 and proxies `/api` to port 3000. Compose and environment examples follow with infrastructure. Never place secrets in frontend environment variables: values shipped to the browser are public.

## Development

The [backend contract guide](docs/BACKEND_CONTRACT.md) links the product requirements, delivery plan and future OpenAPI location. Backend contract changes come first, followed by backend behavior, then the typed client and interface. Each integration will record the backend commit it uses and the frontend revision tested with it.

The planned interface includes authentication, event and organizer catalogs, booking history with a calendar, payments, subscriptions, loyalty, chat, notifications, organizer tools and administration. Loading, empty and error states and phone/desktop layouts are part of the required scope.

## Design patterns

No design patterns have been implemented yet. Proposed backend patterns are documented in the [architecture proposal](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/ARCHITECTURE.md). If a pattern is justified in this application, this section will name it, explain its purpose and link its actual source symbols with a search command. Code comments will be concise and in English.

## Checks and review

Lint, type checking and the production build are available and verified. Full-stack checks follow with the typed API client. Feature branches and small meaningful commits are required. Pull requests state the behavior changed, requirements covered, checks actually run and compatible backend revision. Merging remains with the repository owner.
