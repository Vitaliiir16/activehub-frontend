import { test, expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

async function post(page: Page, path: string, data: unknown) {
  const csrf = await (await page.request.get("/api/auth/csrf")).json();
  return page.request.post(path, {
    headers: {
      Origin: new URL(page.url()).origin,
      "X-CSRF-Token": csrf.token,
      "Idempotency-Key": randomUUID(),
    },
    data,
  });
}
const tile = (page: Page, name: string) =>
  page.locator(".stat-tile").filter({ has: page.locator(".stat-name", { hasText: new RegExp(`^${name}$`) }) }).locator(".stat-value");

test("organizer dashboard counts own activities; administrator filters statistics and reads an organizer's figures", async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "One browser covers this integrated statistics workflow",
  );
  const email = process.env.INITIAL_ADMIN_EMAIL,
    secret = process.env.INITIAL_ADMIN_PASSWORD;
  expect(email, "Load the backend environment file before running administrator E2E").toBeTruthy();
  const contexts = await Promise.all([0, 1, 2].map(() => browser.newContext({ baseURL: info.project.use.baseURL })));
  const [org, member, admin] = await Promise.all(contexts.map((c) => c.newPage()));
  const suffix = randomUUID(),
    password = "StatsE2ePassword123";
  try {
    for (const page of [org, member, admin]) await page.goto("/login");
    const cities = await (await org.request.get("/api/cities")).json(),
      directions = await (await org.request.get("/api/directions")).json();
    const common = { password, passwordConfirmation: password, phone: "+380501234567", cityId: cities.items[0].id };
    expect(
      (
        await post(org, "/api/auth/register/organizer", {
          ...common,
          email: `stats-org-${suffix}@example.test`,
          name: `Stats UI Club ${suffix.slice(0, 8)}`,
          type: "CLUB",
          directionIds: [directions.items[0].id],
        })
      ).status(),
    ).toBe(201);
    expect(
      (
        await post(member, "/api/auth/register/user", {
          ...common,
          email: `stats-member-${suffix}@example.test`,
          firstName: "Morgan",
          lastName: "Counted",
          gender: "UNDISCLOSED",
        })
      ).status(),
    ).toBe(201);
    const organizerId = (await (await org.request.get("/api/me")).json()).id;

    // The organizer starts with no activities, then the count follows a new activity.
    await org.goto("/organizer");
    await expect(org.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
    await expect(tile(org, "Activities")).toHaveText("0");
    const start = Date.now() + 48 * 3600000;
    expect(
      (
        await post(org, "/api/organizer/events", {
          title: `Stats UI ${suffix}`,
          description: "Statistics browser activity",
          kind: "TRAINING",
          directionId: directions.items[0].id,
          cityId: cities.items[0].id,
          address: "7 Statistics Way",
          skill: "ANY",
          age: "ANY",
          priceMinor: 0,
          seatsPerSession: 5,
          confirmationMode: "AUTO",
          sessions: [{ startsAt: new Date(start).toISOString(), endsAt: new Date(start + 3600000).toISOString(), seatsTotal: 5 }],
        })
      ).status(),
    ).toBe(201);
    await org.reload();
    await expect(tile(org, "Activities")).toHaveText("1");
    await expect(tile(org, "Upcoming sessions")).toHaveText("1");
    await expect(org.getByRole("figure", { name: /Bookings in the last 30 days/ })).toBeVisible();
    await expect(org.getByRole("img", { name: /Bookings in the last 30 days: 30 days/ })).toBeVisible();

    // Members have no access to the dashboard or the statistics.
    await member.goto("/organizer");
    await expect(member).toHaveURL(/\/events$/);
    await member.goto("/admin/statistics");
    await expect(member).toHaveURL(/\/events$/);

    // The administrator opens the platform statistics, switches to a 7-day window and reads the tables.
    await admin.goto("/login");
    await admin.getByLabel("Email", { exact: true }).fill(email!);
    await admin.getByLabel("Password", { exact: true }).fill(secret!);
    await admin.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(admin).toHaveURL(/\/admin$/);
    await admin.getByRole("link", { name: "Statistics", exact: true }).first().click();
    await expect(admin.getByRole("heading", { name: "Statistics", exact: true })).toBeVisible();
    await expect(tile(admin, "Bookings")).toBeVisible();
    await expect(admin.getByRole("figure", { name: "Bookings per day" })).toBeVisible();
    await admin.getByRole("radio", { name: "Last 7 days" }).check();
    await admin.getByRole("button", { name: "Show statistics", exact: true }).click();
    await expect(admin).toHaveURL(/period=7d/);
    await expect(admin.getByText(/Period: \d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}/)).toBeVisible();
    const summary = admin.getByText("Show data table: Bookings per day");
    await summary.click();
    await expect(admin.getByRole("table", { name: "Bookings per day" })).toBeVisible();
    await expect(admin.getByRole("table", { name: "Bookings per day" }).getByRole("row")).toHaveCount(8);
    await expect(admin.getByText(/^Booking conversion/).first()).toBeVisible();
    expect(await admin.locator("body").innerText()).not.toMatch(/[Ѐ-ӿ]/);

    // The administrator reads one organizer's figures on its detail page.
    await admin.goto(`/admin/organizers/${organizerId}`);
    await expect(admin.getByRole("heading", { name: "Figures", exact: true })).toBeVisible();
    await expect(admin.getByRole("region", { name: "Organizer figures" }).locator(".stat-tile").first()).toContainText("Activities");
    await expect(tile(admin, "Activities").first()).toHaveText("1");
  } finally {
    await Promise.all(contexts.map((c) => c.close()));
  }
});
