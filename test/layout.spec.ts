import { test, expect } from "@playwright/test";

test("header link navigates to index", async ({ page }) => {
    await page.goto("/a");
    await page.getByRole("link").getByText("Restaurant Data Search").click();

    await expect(page).toHaveURL("/");
});
