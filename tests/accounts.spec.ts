import { test, expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

const password = "ActiveHubE2e123";
const image = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAD0lEQVQImWNgaGAAIQgFAA4OAgHj5clFAAAAAElFTkSuQmCC",
  "base64",
);
async function login(page: Page, email: string, secret: string) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}
async function englishLayout(page: Page) {
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0400-\u04ff]/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
for (const role of ["USER", "ORGANIZER"] as const) {
  test(`${role} registers, edits profile, restores session and signs in again`, async ({
    page,
    request,
  }, info) => {
    const email = `e2e-${role.toLowerCase()}-${randomUUID()}@example.test`;
    const updatedEmail = `updated-${email}`;
    let currentPassword = password;
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/register");
    await page
      .getByRole("button", {
        name: role === "USER" ? "Find an activity" : "Offer activities",
      })
      .click();
    await expect(page.getByText("STEP 2 OF 2", { exact: false })).toBeVisible();
    if (role === "USER") {
      await page.getByLabel("First name", { exact: true }).fill("Taylor");
      await page.getByLabel("Last name", { exact: true }).fill("Active");
    } else {
      await page
        .getByLabel("Organization or trainer name")
        .fill("Movement Club");
      await page.getByLabel("Provider type").selectOption("CLUB");
      await page.getByLabel("Yoga", { exact: true }).check();
      await page
        .getByLabel("Description (optional)")
        .fill("A welcoming local club");
    }
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Phone (international format)").fill("+380501234567");
    await page
      .getByLabel("City", { exact: true })
      .selectOption({ label: "Kyiv" });
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page
      .getByLabel("Confirm password", { exact: true })
      .fill("Mismatch123");
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await expect(
      page.getByText("Passwords do not match", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Confirm password", { exact: true }).fill(password);
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await expect(page).toHaveURL(
      role === "USER" ? /\/events$/ : /\/organizer$/,
    );
    await expect(page.getByRole("status")).toHaveText("Connected to ActiveHub");
    await page.screenshot({
      path: info.outputPath(`${role.toLowerCase()}-home.png`),
      fullPage: true,
    });
    await englishLayout(page);
    await page.getByRole("link", { name: "Profile", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Profile & preferences" }),
    ).toBeVisible();
    if (role === "USER")
      await page.getByLabel("First name", { exact: true }).fill("Jordan");
    else
      await page
        .getByLabel("Organization or trainer name")
        .fill("Movement Studio");
    await page.getByLabel("Email", { exact: true }).fill(updatedEmail);
    if (role === "USER") await page.getByLabel("Yoga", { exact: true }).check();
    await page
      .getByRole("button", { name: "Save profile", exact: true })
      .click();
    await expect(
      page.getByText("Profile saved", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Choose image", { exact: true }).setInputFiles({
      name: "profile.png",
      mimeType: "image/png",
      buffer: image,
    });
    await page
      .getByRole("button", { name: "Upload image", exact: true })
      .click();
    await expect(
      page.getByText("Image updated", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Messages", { exact: true }).check();
    await page
      .getByRole("button", { name: "Save email preferences", exact: true })
      .click();
    await expect(
      page.getByText("Email preferences saved", { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByLabel(
        role === "USER" ? "First name" : "Organization or trainer name",
        { exact: true },
      ),
    ).toHaveValue(role === "USER" ? "Jordan" : "Movement Studio");
    await expect(page.getByLabel("Messages", { exact: true })).toBeChecked();
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
      updatedEmail,
    );
    if (role === "USER")
      await expect(page.getByLabel("Yoga", { exact: true })).toBeChecked();
    await expect(
      page.getByAltText(
        role === "USER" ? "Your profile photo" : "Your organization logo",
      ),
    ).toBeVisible();
    await page.screenshot({
      path: info.outputPath(`${role.toLowerCase()}-profile.png`),
      fullPage: true,
    });
    await englishLayout(page);
    if (role === "USER") {
      await page.getByLabel("Current password", { exact: true }).fill(password);
      await page
        .getByLabel("New password", { exact: true })
        .fill("UpdatedActiveHubE2e123");
      await page
        .getByRole("button", { name: "Change password", exact: true })
        .click();
      await expect(
        page.getByText(
          "Password updated. Other sessions have been signed out.",
          { exact: true },
        ),
      ).toBeVisible();
      currentPassword = "UpdatedActiveHubE2e123";
    }
    await page
      .getByRole("link", { name: "Notifications", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Welcome to ActiveHub", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Mark as read", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Mark as read", exact: true }),
    ).toHaveCount(0);
    const mailpit = process.env.MAILPIT_BASE_URL ?? "http://127.0.0.1:8025";
    await expect
      .poll(
        async () => {
          const response = await request.get(
            `${mailpit}/api/v1/search?query=${encodeURIComponent("to:" + email)}`,
          );
          expect(response.ok()).toBe(true);
          const data = await response.json();
          return (
            data.messages?.filter(
              (message: { Subject: string }) =>
                message.Subject === "Welcome to ActiveHub",
            ).length ?? 0
          );
        },
        { timeout: 15000 },
      )
      .toBe(1);
    await page.goto("/admin/accounts");
    await expect(page).toHaveURL(
      role === "USER" ? /\/events$/ : /\/organizer$/,
    );
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Sign in", exact: true }),
    ).toBeVisible();
    await login(page, updatedEmail, "Incorrect123");
    await expect(page.getByRole("alert")).toHaveText(
      "Email or password is incorrect",
    );
    await page.getByLabel("Password", { exact: true }).fill(currentPassword);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(
      role === "USER" ? /\/events$/ : /\/organizer$/,
    );
    expect(errors).toEqual([]);
  });
}
test("seeded administrator signs in and creates another administrator", async ({
  page,
}, info) => {
  const email = process.env.INITIAL_ADMIN_EMAIL,
    secret = process.env.INITIAL_ADMIN_PASSWORD;
  expect(
    email,
    "Load the backend environment file before running administrator E2E",
  ).toBeTruthy();
  expect(secret).toBeTruthy();
  await login(page, email!, secret!);
  await expect(page).toHaveURL(/\/admin$/);
  await page
    .getByRole("link", { name: "Administrator access", exact: true })
    .click();
  const newEmail = `admin-e2e-${randomUUID()}@example.test`;
  await page
    .getByLabel("Display name", { exact: true })
    .fill("Test Administrator");
  await page.getByLabel("Email", { exact: true }).fill(newEmail);
  await page.getByLabel("Temporary password", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Create administrator", exact: true })
    .click();
  await expect(
    page.getByText(
      "Administrator created. Share their credentials through a private channel.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.locator(".created-account")).toContainText(newEmail);
  await englishLayout(page);
  await page.screenshot({
    path: info.outputPath("administrator-access.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await login(page, newEmail, password);
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Welcome, Test Administrator." }),
  ).toBeVisible();
});
