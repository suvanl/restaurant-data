import { test, expect } from "@playwright/test";

test("should fail client-side validation (postcode < 2 chars)", async ({
    page,
}) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("a");
    await page.getByRole("button", { name: "Search" }).click();

    // Verify that the URL remains the same. We shouldn't navigate to the
    // "/location/[postcode]" route if validation fails.
    await expect(page).toHaveURL("/");

    await expect(
        page.getByText("Postcode must be at least 2 characters"),
    ).toBeVisible();
});
