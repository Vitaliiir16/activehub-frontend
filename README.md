# ActiveHub frontend

The web interface for ActiveHub, a marketplace for sports sessions, venue bookings and activities. It will provide separate areas for users, organizers and administrators.

This repository currently contains preparation documents only. There is no runnable application or API client yet.

## Stack and setup plan

The frontend will be a separate React and TypeScript application using the Next.js REST backend. Vite is the proposed build tool. The interface will be in English, with prices in UAH and dates displayed in Europe/Kyiv.

Clone this repository beside [activehub-backend](https://github.com/Vitaliiir16/activehub-backend), keeping both directory names. After infrastructure is implemented, the target full-stack command from the backend directory will be:

```powershell
docker compose up --build
```

Compose, package scripts, ports and environment examples do not exist yet. They will be documented alongside the scaffold and infrastructure. Use `npm.cmd` and `npx.cmd` in PowerShell. Never place secrets in frontend environment variables: values shipped to the browser are public.

## Development

The [backend contract guide](docs/BACKEND_CONTRACT.md) links the product requirements, delivery plan and future OpenAPI location. Backend contract changes come first, followed by backend behavior, then the typed client and interface. Each integration will record the backend commit it uses and the frontend revision tested with it.

The planned interface includes authentication, event and organizer catalogs, booking history with a calendar, payments, subscriptions, loyalty, chat, notifications, organizer tools and administration. Loading, empty and error states and phone/desktop layouts are part of the required scope.

## Design patterns

No design patterns have been implemented yet. Proposed backend patterns are documented in the [architecture proposal](https://github.com/Vitaliiir16/activehub-backend/blob/main/docs/ARCHITECTURE.md). If a pattern is justified in this application, this section will name it, explain its purpose and link its actual source symbols with a search command. Code comments will be concise and in English.

## Checks and review

Current validation covers documentation and repository hygiene. Type checking, lint, builds, focused component tests and full-stack end-to-end tests will be added with the application. Feature branches and small meaningful commits are required after the initial documentation baseline. Pull requests should state the behavior changed, requirements covered, checks actually run and the compatible backend revision. Merging remains with the repository owner.
