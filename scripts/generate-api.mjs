import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import openapiTS, { astToString } from "openapi-typescript";

const source = new URL("../contracts/backend.openapi.yaml", import.meta.url);
const metadata = JSON.parse(await readFile(new URL("../contracts/backend.json", import.meta.url), "utf8"));
const bytes = await readFile(source);
assert.equal(createHash("sha256").update(bytes).digest("hex"), metadata.sha256, "Contract snapshot hash differs from the recorded backend contract");
assert.match(metadata.commit, /^[0-9a-f]{40}$/);
const ast = await openapiTS(source);
const generated = "// ActiveHub API types generated from the pinned backend contract.\n" + astToString(ast).replace(/\s*\/\*\*[\s\S]*?\*\//g, "").trimStart();
const target = new URL("../src/api/schema.d.ts", import.meta.url);
if (process.argv.includes("--check")) {
  assert.equal(await readFile(target, "utf8"), generated, "Generated API types are stale; run npm run api:generate");
  console.log("PASS: generated types match the pinned contract snapshot");
} else {
  await writeFile(target, generated);
  console.log("Generated API types from the pinned contract snapshot");
}
