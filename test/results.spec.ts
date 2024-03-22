import { test, expect } from "@playwright/test";

test("should contain uppercased postcode in title", async ({ page }) => {
    const testPostcode = "w1a";

    await page.goto(`/location/${testPostcode}`);
    await expect(page).toHaveTitle(
        `Restaurants in ${testPostcode.toUpperCase()} - Restaurant Data`,
    );
});

test.describe("errored state (no restaurant data)", () => {
    test("should display error alert", async ({ page }) => {
        await page.goto("/location/m");
        await expect(
            page
                .getByRole("alert")
                .getByText("No restaurants were found at this postcode"),
        ).toBeVisible();
    });

    test("'Go back' button navigates to index route on click", async ({
        page,
    }) => {
        await page.goto("/location/m");
        await page.getByText("Go back").click();
        await expect(page).toHaveURL("/");
    });
});
