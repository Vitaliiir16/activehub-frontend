import { test, expect } from "@playwright/test";

test("English welcome screen connects to the real API", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = page.waitForResponse((result) => result.url().endsWith("/api/health") && result.status() === 200);
  await page.goto("/");
  const health = await response;
  expect(await health.json()).toMatchObject({ status: "ok", service: "activehub-api", database: "ready" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your next activity");
  await expect(page.getByRole("status")).toHaveText("Connected. We are getting things ready for you.");
  expect(await page.locator("html").getAttribute("lang")).toBe("en");
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0400-\u04ff]/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("welcome.png"), fullPage: true });
});
