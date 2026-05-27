import { expect, test } from "@playwright/test";

test("loads the app", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("main", { name: "Markdown editor workspace" })).toBeVisible();
});
