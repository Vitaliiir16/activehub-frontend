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

test("member and organizer chat with live updates, unread badges and notifications", async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "One browser covers this integrated chat workflow",
  );
  const contexts = await Promise.all(
    [0, 1].map(() => browser.newContext({ baseURL: info.project.use.baseURL })),
  );
  const [org, user] = await Promise.all(contexts.map((c) => c.newPage()));
  const suffix = randomUUID(),
    title = `Chat UI ${suffix}`,
    password = "ChatE2ePassword123";
  try {
    for (const page of [org, user]) await page.goto("/login");
    const cities = await (await org.request.get("/api/cities")).json(),
      directions = await (await org.request.get("/api/directions")).json();
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
          email: `chat-org-${suffix}@example.test`,
          name: "Chat UI Club",
          type: "CLUB",
          directionIds: [directions.items[0].id],
        })
      ).status(),
    ).toBe(201);
    expect(
      (
        await post(user, "/api/auth/register/user", {
          ...common,
          email: `chat-user-${suffix}@example.test`,
          firstName: "Casey",
          lastName: "Member",
          gender: "UNDISCLOSED",
        })
      ).status(),
    ).toBe(201);
    const start = Date.now() + 48 * 3600000;
    const created = await post(org, "/api/organizer/events", {
      title,
      description: "Chat browser activity",
      kind: "TRAINING",
      directionId: directions.items[0].id,
      cityId: cities.items[0].id,
      address: "3 Chat Street",
      skill: "ANY",
      age: "ANY",
      priceMinor: 0,
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

    // The organizer keeps another page open while the member writes.
    await org.goto("/organizer/events");
    await user.goto(`/events/${event.id}`);
    await user.getByRole("button", { name: "Message organizer" }).click();
    await expect(user.getByRole("heading", { name: "Chat UI Club" })).toBeVisible();
    await expect(user.getByLabel("Include activity", { exact: false })).toBeChecked();
    await user.getByLabel("Message", { exact: true }).fill("Hello, is parking available?");
    await user.getByRole("button", { name: "Send message" }).click();
    const thread = user.getByRole("list", { name: "Messages" });
    await expect(thread.getByText("Hello, is parking available?")).toBeVisible();
    await expect(thread.getByText(`Activity: ${title}`)).toBeVisible();
    await expect(thread.getByText("Sent", { exact: false })).toBeVisible();

    // The organizer's header shows the unread message without a reload, then the thread opens.
    await expect(
      org.getByRole("status").filter({ hasText: "1 unread messages" }),
    ).toBeAttached({ timeout: 25000 });
    await expect(
      org.getByRole("status").filter({ hasText: "unread notifications" }),
    ).toBeAttached();
    await org.getByRole("link", { name: "Messages", exact: true }).click();
    const row = org.getByRole("list", { name: "Conversations" }).getByRole("link", { name: /Casey Member/ });
    await expect(row).toContainText("Hello, is parking available?");
    await expect(row.getByLabel("1 unread")).toBeVisible();
    await row.click();
    await expect(
      org.getByRole("list", { name: "Messages" }).getByText("Hello, is parking available?"),
    ).toBeVisible();
    await org.getByLabel("Message", { exact: true }).fill("Yes, free parking at the entrance.");
    await org.getByRole("button", { name: "Send message" }).click();

    // The member sees the reply and the read marker without reloading.
    await expect(thread.getByText("Yes, free parking at the entrance.")).toBeVisible({
      timeout: 15000,
    });
    await expect(thread.getByText("Read", { exact: false })).toBeVisible({ timeout: 15000 });

    // The reply also created an in-app notification that links to the conversation.
    await user.getByRole("link", { name: "Notifications", exact: true }).click();
    await expect(
      user.getByRole("heading", { name: "New message from Chat UI Club" }).first(),
    ).toBeVisible();
    expect(await user.locator("body").innerText()).not.toMatch(/[Ѐ-ӿ]/);
  } finally {
    await Promise.all(contexts.map((c) => c.close()));
  }
});
