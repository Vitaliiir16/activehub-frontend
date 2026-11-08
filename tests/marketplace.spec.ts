import { test, expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

async function register(
  page: Page,
  role: "user" | "organizer",
  suffix: string,
) {
  await page.goto("/login");
  const csrf = await (await page.request.get("/api/auth/csrf")).json();
  const cities = await (await page.request.get("/api/cities")).json(),
    directions = await (await page.request.get("/api/directions")).json();
  const common = {
    email: `market-${role}-${suffix}@example.test`,
    password: "MarketplaceE2e123",
    passwordConfirmation: "MarketplaceE2e123",
    phone: "+380501234567",
    cityId: cities.items[0].id,
  };
  const response = await page.request.post(`/api/auth/register/${role}`, {
    headers: { Origin: new URL(page.url()).origin, "X-CSRF-Token": csrf.token },
    data:
      role === "user"
        ? {
            ...common,
            firstName: "Taylor",
            lastName: "Member",
            gender: "UNDISCLOSED",
          }
        : {
            ...common,
            name: "UI Sports Club",
            type: "CLUB",
            directionIds: [directions.items[0].id],
          },
  });
  expect(response.status()).toBe(201);
  return { city: cities.items[0], direction: directions.items[0] };
}
const localInput = (offset: number) => {
  const date = new Date(Date.now() + offset),
    p = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Kyiv",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .formatToParts(date)
        .map((p) => [p.type, p.value]),
    );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
};
test("organizer creates an activity and member books, pays and receives a refund", async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "One browser covers this integrated marketplace workflow",
  );
  const orgContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
    }),
    userContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
    }),
    org = await orgContext.newPage(),
    user = await userContext.newPage(),
    suffix = randomUUID(),
    title = `UI training ${suffix}`;
  try {
    const dictionaries = await register(org, "organizer", suffix);
    await register(user, "user", suffix);
    await org.goto("/organizer/events/new");
    await org.getByLabel("Title", { exact: true }).fill(title);
    await org
      .getByLabel("City", { exact: true })
      .selectOption(dictionaries.city.id);
    await org
      .getByLabel("Direction", { exact: true })
      .selectOption(dictionaries.direction.id);
    await org
      .getByLabel("Address", { exact: true })
      .fill("12 UI Sports Street");
    await org
      .getByLabel("Description", { exact: true })
      .fill("An activity created through the real organizer form");
    await org.getByLabel("Price (UAH)", { exact: true }).fill("100");
    await org.getByLabel("Confirmation", { exact: true }).selectOption("AUTO");
    await org
      .getByLabel("Starts at (Europe/Kyiv)")
      .fill(localInput(48 * 3600000));
    await org
      .getByLabel("Ends at (Europe/Kyiv)")
      .fill(localInput(49 * 3600000));
    await org.getByRole("button", { name: "Save event", exact: true }).click();
    await expect(
      org.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await user.goto(`/events?cityId=all&title=${encodeURIComponent(title)}`);
    await user.getByRole("link", { name: title, exact: true }).last().click();
    await user.getByRole("link", { name: "Book session" }).click();
    await expect(user.getByRole("region", { name: "Current price breakdown" })).toContainText("100.00");
    await user
      .getByRole("button", { name: "Reserve places", exact: true })
      .click();
    await expect(
      user.getByRole("heading", { name: "Simulated card payment" }),
    ).toBeVisible();
    await user
      .getByLabel("Card number", { exact: true })
      .fill("4242 4242 4242 4242");
    await user.getByLabel("Cardholder", { exact: true }).fill("Taylor Member");
    await user.getByLabel("Expiry month").fill("12");
    await user
      .getByLabel("Expiry year")
      .fill(String(new Date().getUTCFullYear() + 1));
    await user.getByLabel("CVV").fill("123");
    await user.getByRole("button", { name: "Pay now", exact: true }).click();
    await expect(
      user.getByRole("heading", { name: "Payment receipt", exact: true }),
    ).toBeVisible();
    await user.reload();
    await expect(
      user.getByRole("heading", { name: "Payment receipt", exact: true }),
    ).toBeVisible();
    user.on("dialog", (dialog) => dialog.accept());
    await user
      .getByRole("button", { name: "Cancel booking", exact: true })
      .click();
    await expect(
      user.getByRole("heading", { name: "Refunded receipt", exact: true }),
    ).toBeVisible();
    await expect(
      user.getByText("Full refund returned to the same simulated card", {
        exact: false,
      }),
    ).toBeVisible();
    expect(await user.locator("body").innerText()).not.toMatch(
      /[\u0400-\u04ff]/,
    );
  } finally {
    await orgContext.close();
    await userContext.close();
  }
});
