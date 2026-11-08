import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import { spawnSync } from "node:child_process";

const file = resolve(
  process.env.ACTIVEHUB_E2E_ENV_FILE ?? "../activehub-backend/.env",
);
const config = existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {};
const env = {
  ...process.env,
  INITIAL_ADMIN_EMAIL:
    process.env.INITIAL_ADMIN_EMAIL ?? config.INITIAL_ADMIN_EMAIL,
  INITIAL_ADMIN_PASSWORD:
    process.env.INITIAL_ADMIN_PASSWORD ?? config.INITIAL_ADMIN_PASSWORD,
  FRONTEND_BASE_URL:
    process.env.FRONTEND_BASE_URL ??
    `http://127.0.0.1:${config.FRONTEND_PORT ?? 8080}`,
  MAILPIT_BASE_URL:
    process.env.MAILPIT_BASE_URL ??
    `http://127.0.0.1:${config.MAILPIT_PORT ?? 8025}`,
};
if (!env.INITIAL_ADMIN_EMAIL || !env.INITIAL_ADMIN_PASSWORD)
  throw Error(
    "Configure the seeded administrator in the backend .env or set ACTIVEHUB_E2E_ENV_FILE before running E2E",
  );
const result = spawnSync(
  process.execPath,
  ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
  { env, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
);
const redact = (value) =>
  [env.INITIAL_ADMIN_PASSWORD, "ActiveHubE2e123", "UpdatedActiveHubE2e123"]
    .filter(Boolean)
    .reduce(
      (text, secret) => text.replaceAll(secret, "[redacted]"),
      value ?? "",
    );
process.stdout.write(redact(result.stdout));
process.stderr.write(redact(result.stderr));
if (result.error) throw result.error;
process.exit(result.status ?? 1);
