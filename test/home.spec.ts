import { test, expect } from "@playwright/test";

test("should fail client-side validation (postcode < 2 chars)", async ({
    page,
}) => {
    await page.goto("/");
    await page.getByRole("searchbox").click();
    await page.getByRole("searchbox").fill("a");
    await page.getByRole("button", { name: "Search" }).click();

    // Verify that the URL remains the same. We shouldn't navigate to the
    // "/location/[postcode]" route if validation fails.
    await expect(page).toHaveURL("/");

    await expect(
        page.getByText("Postcode must be at least 2 characters"),
    ).toBeVisible();
});

test("should navigate to '/location/[postcode]' if validation passes", async ({
    page,
}) => {
    const testPostcode = "ec4m";

    await page.goto("/");
    await page.getByRole("searchbox").click();
    await page.getByRole("searchbox").fill(testPostcode);
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(`/location/${testPostcode}`);

    // Verify that the postcode is displayed in a h1 tag on ResultsPage
    await expect(
        page.getByRole("heading", { level: 1 }).getByText(testPostcode),
    ).toBeVisible();
});
