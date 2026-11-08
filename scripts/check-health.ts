import assert from "node:assert/strict";
import { createApi } from "../src/api/client";

const result = await createApi(process.env.FRONTEND_BASE_URL ?? "http://127.0.0.1:8080").health(AbortSignal.timeout(5000));
assert.deepEqual(result, { status: "ok", service: "activehub-api", version: "0.1.0", database: "ready" });
console.log("PASS: typed frontend client reached real API and PostgreSQL through the frontend proxy");
