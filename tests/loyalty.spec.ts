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

test("member earns points and an administrator assigns a locked card and adjusts points", async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "One browser covers this integrated loyalty workflow",
  );
  const contexts = await Promise.all(
    [0, 1, 2].map(() =>
      browser.newContext({ baseURL: info.project.use.baseURL }),
    ),
  );
  const [org, user, admin] = await Promise.all(
    contexts.map((c) => c.newPage()),
  );
  const suffix = randomUUID(),
    title = `Loyalty UI ${suffix}`,
    password = "LoyaltyE2e12345";
  try {
    for (const page of [org, user, admin]) await page.goto("/login");
    const cities = await (await org.request.get("/api/cities")).json(),
      directions = await (await org.request.get("/api/directions")).json(),
      direction = directions.items.find(
        (d: { name: string }) => d.name !== "Swimming",
      );
    const common = {
      password,
      passwordConfirmation: password,
      phone: "+380501234567",
      cityId: cities.items[0].id,
    };
    expect(
      (
        await post(org, "/api/auth/register/organizer", {
          ...common,
          email: `loyalty-org-${suffix}@example.test`,
          name: "Loyalty UI Club",
          type: "CLUB",
          directionIds: [direction.id],
        })
      ).status(),
    ).toBe(201);
    expect(
      (
        await post(user, "/api/auth/register/user", {
          ...common,
          email: `loyalty-user-${suffix}@example.test`,
          firstName: "Robin",
          lastName: "Member",
          gender: "UNDISCLOSED",
        })
      ).status(),
    ).toBe(201);
    const start = Date.now() + 48 * 3600000;
    const created = await post(org, "/api/organizer/events", {
      title,
      description: "Loyalty browser activity",
      kind: "TRAINING",
      directionId: direction.id,
      cityId: cities.items[0].id,
      address: "5 Loyalty Avenue",
      skill: "ANY",
      age: "ANY",
      priceMinor: 10000,
      seatsPerSession: 5,
      confirmationMode: "AUTO",
      sessions: [
        {
          startsAt: new Date(start).toISOString(),
          endsAt: new Date(start + 3600000).toISOString(),
          seatsTotal: 5,
        },
      ],
    });
    expect(created.status()).toBe(201);
    const event = await created.json();

    await user.goto(`/events/${event.id}`);
    await user.getByRole("link", { name: "Book session" }).click();
    await expect(
      user.getByText("Estimated total before card benefits", { exact: false }),
    ).toBeVisible();
    await user
      .getByRole("button", { name: "Reserve places", exact: true })
      .click();
    await user
      .getByLabel("Card number", { exact: true })
      .fill("4242 4242 4242 4242");
    await user.getByLabel("Cardholder", { exact: true }).fill("Robin Member");
    await user.getByLabel("Expiry month").fill("12");
    await user
      .getByLabel("Expiry year")
      .fill(String(new Date().getUTCFullYear() + 1));
    await user.getByLabel("CVV").fill("123");
    await user.getByRole("button", { name: "Pay now", exact: true }).click();
    await expect(
      user.getByText("Loyalty points awarded: 20.", { exact: false }),
    ).toBeVisible();

    await user.getByRole("link", { name: "Loyalty", exact: true }).click();
    const card = user.getByRole("region", { name: "Card" });
    await expect(card.getByText("Standard", { exact: true })).toBeVisible();
    await expect(
      card.getByRole("heading", { name: "20 points" }),
    ).toBeVisible();
    await expect(
      card.getByText("480 more lifetime points to Premium."),
    ).toBeVisible();
    await expect(
      user.getByRole("list", { name: "Points history" }).getByText("Earned", {
        exact: false,
      }),
    ).toBeVisible();
    const memberId = (await (await user.request.get("/api/me")).json()).id;

    expect(
      (
        await post(admin, "/api/auth/login", {
          email: process.env.INITIAL_ADMIN_EMAIL,
          password: process.env.INITIAL_ADMIN_PASSWORD,
        })
      ).status(),
    ).toBe(200);
    await admin.goto("/admin/loyalty");
    await expect(
      admin.getByRole("heading", { name: "Loyalty settings" }),
    ).toBeVisible();
    await expect(admin.getByRole("form", { name: "PREMIUM level" })).toBeVisible();
    const assign = admin.getByRole("form", { name: "Assign card" });
    await assign.getByLabel("User account ID").fill(memberId);
    await assign.getByLabel("Card level").selectOption("PREMIUM");
    await assign.getByLabel("Reason").fill("Loyalty review");
    await assign.getByRole("button", { name: "Assign card" }).click();
    await expect(assign.getByText("Card updated")).toBeVisible();
    const adjust = admin.getByRole("form", { name: "Adjust points" });
    await adjust.getByLabel("User account ID").fill(memberId);
    await adjust.getByLabel("Points to add (negative to deduct)").fill("-30");
    await adjust.getByLabel("Reason").fill("Overdraw check");
    await adjust.getByRole("button", { name: "Record adjustment" }).click();
    await expect(
      adjust.getByText("The points balance cannot become negative"),
    ).toBeVisible();
    await adjust.getByLabel("Points to add (negative to deduct)").fill("5");
    await adjust.getByLabel("Reason").fill("Welcome bonus");
    await adjust.getByLabel("User account ID").fill(memberId);
    await adjust.getByRole("button", { name: "Record adjustment" }).click();
    await expect(
      admin.getByText("Adjustment recorded: +5 points."),
    ).toBeVisible();

    await user.reload();
    await expect(card.getByText("Premium", { exact: true })).toBeVisible();
    await expect(
      card.getByRole("heading", { name: "25 points" }),
    ).toBeVisible();
    await expect(
      card.getByText("An administrator set this card", { exact: false }),
    ).toBeVisible();
    expect(await user.locator("body").innerText()).not.toMatch(
      /[\u0400-\u04ff]/,
    );
  } finally {
    await Promise.all(contexts.map((c) => c.close()));
  }
});
