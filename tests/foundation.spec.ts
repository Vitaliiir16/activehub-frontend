import { test, expect } from "@playwright/test";

test("English sign-in screen and real API are available", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const health = await page.request.get("/api/health");
  expect(await health.json()).toMatchObject({
    status: "ok",
    service: "activehub-api",
    database: "ready",
  });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Make room for movement.",
  );
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
  expect(await page.locator("html").getAttribute("lang")).toBe("en");
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0400-\u04ff]/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("sign-in.png"),
    fullPage: true,
  });
});
