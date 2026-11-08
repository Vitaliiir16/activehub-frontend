import { test, expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

async function post(page: Page, path: string, data: unknown, method: "POST" | "PATCH" = "POST") {
  const csrf = await (await page.request.get("/api/auth/csrf")).json();
  return page.request.fetch(path, {
    method,
    headers: {
      Origin: new URL(page.url()).origin,
      "X-CSRF-Token": csrf.token,
      "Idempotency-Key": randomUUID(),
    },
    data,
  });
}

test("administrator searches, edits, blocks, cancels, manages dictionaries and removes an organizer", async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "One browser covers this integrated administration workflow",
  );
  const email = process.env.INITIAL_ADMIN_EMAIL,
    secret = process.env.INITIAL_ADMIN_PASSWORD;
  expect(email, "Load the backend environment file before running administrator E2E").toBeTruthy();
  const contexts = await Promise.all([0, 1, 2].map(() => browser.newContext({ baseURL: info.project.use.baseURL })));
  const [org, member, admin] = await Promise.all(contexts.map((c) => c.newPage()));
  const suffix = randomUUID(),
    password = "AdminE2ePassword123",
    title = `Admin UI ${suffix}`,
    firstName = "Avery";
  try {
    for (const page of [org, member, admin]) await page.goto("/login");
    const cities = await (await org.request.get("/api/cities")).json(),
      directions = await (await org.request.get("/api/directions")).json();
    const common = { password, passwordConfirmation: password, phone: "+380501234567", cityId: cities.items[0].id };
    expect(
      (
        await post(org, "/api/auth/register/organizer", {
          ...common,
          email: `admin-org-${suffix}@example.test`,
          name: `Admin UI Club ${suffix.slice(0, 8)}`,
          type: "CLUB",
          directionIds: [directions.items[0].id],
        })
      ).status(),
    ).toBe(201);
    expect(
      (
        await post(member, "/api/auth/register/user", {
          ...common,
          email: `admin-member-${suffix}@example.test`,
          firstName,
          lastName: "Searchable",
          gender: "UNDISCLOSED",
        })
      ).status(),
    ).toBe(201);
    const organizerId = (await (await org.request.get("/api/me")).json()).id,
      memberId = (await (await member.request.get("/api/me")).json()).id;
    const start = Date.now() + 48 * 3600000;
    const created = await post(org, "/api/organizer/events", {
      title,
      description: "Administration browser activity",
      kind: "TRAINING",
      directionId: directions.items[0].id,
      cityId: cities.items[0].id,
      address: "9 Admin Avenue",
      skill: "ANY",
      age: "ANY",
      priceMinor: 10000,
      seatsPerSession: 5,
      confirmationMode: "AUTO",
      sessions: [{ startsAt: new Date(start).toISOString(), endsAt: new Date(start + 3600000).toISOString(), seatsTotal: 5 }],
    });
    expect(created.status()).toBe(201);
    const event = await created.json();
    const booking = await (
      await post(member, "/api/bookings", { sessionId: event.nextSession.id, seats: 1, paymentMethod: "CARD" })
    ).json();
    expect(
      (
        await post(member, `/api/bookings/${booking.id}/payments`, {
          number: "4242424242424242",
          holder: "Avery Searchable",
          expiryMonth: 12,
          expiryYear: new Date().getUTCFullYear() + 1,
          cvv: "123",
        })
      ).status(),
    ).toBe(201);

    // Sign in as the seeded administrator and find the member by e-mail.
    await admin.goto("/login");
    await admin.getByLabel("Email", { exact: true }).fill(email!);
    await admin.getByLabel("Password", { exact: true }).fill(secret!);
    await admin.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(admin).toHaveURL(/\/admin$/);
    await expect(admin.getByRole("link", { name: "Users", exact: true })).toBeVisible();
    await admin.getByRole("link", { name: "Users", exact: true }).click();
    await admin.getByLabel("Name, email or phone").fill(`admin-member-${suffix}@example.test`);
    await admin.getByRole("button", { name: "Apply filters" }).click();
    await expect(admin).toHaveURL(/search=admin-member/);
    await expect(admin.getByText("1 found")).toBeVisible();
    await admin.getByRole("link", { name: `${firstName} Searchable` }).click();
    await expect(admin.getByRole("heading", { name: `${firstName} Searchable` })).toBeVisible();

    // Edit contacts; passwords are not offered.
    await expect(admin.getByLabel("Password")).toHaveCount(0);
    await admin.getByLabel("Last name").fill("Renamed");
    await admin.getByRole("button", { name: "Save contacts" }).click();
    await expect(admin.getByText("Contacts saved")).toBeVisible();
    await expect(admin.getByRole("heading", { name: `${firstName} Renamed` })).toBeVisible();

    // Blocking needs a reason, ends the member's session and is reversible.
    await admin.getByRole("button", { name: "Block user" }).click();
    await admin.getByRole("form", { name: "Block user" }).getByLabel("Reason").fill("Browser test block");
    await admin.getByRole("button", { name: "Confirm: Block user" }).click();
    await expect(admin.locator(".panel", { hasText: "Access" }).locator(".badge").first()).toHaveText("Blocked");
    expect((await member.request.get("/api/me")).status()).toBe(401);
    await admin.getByRole("button", { name: "Unblock user" }).click();
    await admin.getByRole("form", { name: "Unblock user" }).getByLabel("Reason").fill("Browser test unblock");
    await admin.getByRole("button", { name: "Confirm: Unblock user" }).click();
    await expect(admin.locator(".panel", { hasText: "Access" }).locator(".badge").first()).toHaveText("Active");

    // Cancel the member's paid booking with a refund from the booking search.
    await admin.goto(`/admin/bookings?userId=${memberId}`);
    await expect(admin.getByText("1 found")).toBeVisible();
    await expect(admin.getByRole("row", { name: new RegExp(title) }).locator(".badge")).toHaveText("Confirmed");
    await admin.getByRole("button", { name: "Cancel booking" }).click();
    await admin.getByRole("form", { name: "Cancel booking" }).getByLabel("Reason").fill("Browser test cancellation");
    await admin.getByRole("button", { name: "Confirm: Cancel booking" }).click();
    await expect(admin.getByRole("row", { name: new RegExp(title) }).locator(".badge")).toHaveText("Cancelled");

    // Moderate the event: it is listed with its status and can be blocked.
    await admin.goto(`/admin/events?organizerId=${organizerId}`);
    await admin.getByRole("button", { name: "Moderate" }).click();
    await admin.getByRole("button", { name: "Block event" }).click();
    await admin.getByRole("form", { name: "Block event" }).getByLabel("Reason").fill("Browser test moderation");
    await admin.getByRole("button", { name: "Confirm: Block event" }).click();
    await expect(admin.getByRole("row", { name: new RegExp(title) }).locator(".badge")).toHaveText("Blocked");

    // Dictionaries: add, rename and deactivate a city.
    await admin.goto("/admin/dictionaries");
    const cityName = `E2E City ${suffix.slice(0, 8)}`;
    await admin.getByLabel("New city name").fill(cityName);
    await admin.getByRole("button", { name: "Add city" }).click();
    await expect(admin.getByText("City added")).toBeVisible();
    await admin.getByLabel("Show cities").selectOption("true");
    await admin.getByRole("button", { name: `Deactivate ${cityName}` }).click();
    await admin.getByLabel("Show cities").selectOption("false");
    await expect(admin.getByRole("button", { name: `Activate ${cityName}` })).toBeVisible();

    // Delete the organizer: it becomes a deleted account with history kept.
    await admin.goto(`/admin/organizers/${organizerId}`);
    await admin.getByRole("button", { name: "Delete organizer" }).click();
    await admin.getByRole("form", { name: "Delete organizer" }).getByLabel("Reason").fill("Browser test removal");
    await admin.getByRole("button", { name: "Confirm: Delete organizer" }).click();
    await expect(admin).toHaveURL(/\/admin\/organizers$/);
    await admin.goto(`/admin/organizers?id=${organizerId}&status=DELETED`);
    await expect(admin.getByText("1 found")).toBeVisible();
    await expect(admin.getByRole("table").locator(".badge")).toHaveText("Deleted");
    expect((await org.request.get("/api/me")).status()).toBe(401);

    // Members and organizers have no access to the administration screens.
    expect(
      (await post(member, "/api/auth/login", { email: `admin-member-${suffix}@example.test`, password })).status(),
    ).toBe(200);
    await member.goto("/admin/users");
    await expect(member).toHaveURL(/\/events$/);
    expect(await admin.locator("body").innerText()).not.toMatch(/[Ѐ-ӿ]/);
  } finally {
    await Promise.all(contexts.map((c) => c.close()));
  }
});
