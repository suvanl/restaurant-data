import { API_BASE_URL, RESTAURANTS_LIMIT } from "@/app/constants";
import { Restaurants, RestaurantsFallback } from "@/components/restaurants";
import {
    type LimitedEnrichedRestaurantsResponse,
    isValidRestaurantsResponse,
    type Restaurant,
} from "@/data/response";
import { type SortOption, sortOptions, isValidSortOption } from "@/lib/sort";
import type { Metadata } from "next";
import { Suspense } from "react";

/**
 * Sorts the list of restaurants based on the given sort option.
 * @param restaurants Original array of Restaurant objects
 * @param sortBy The sort method to use
 * @returns Sorted array of Restaurant objects
 */
const sortRestaurantData = (
    restaurants: Restaurant[],
    sortBy: SortOption,
): Restaurant[] => {
    const selectedOption: SortOption = isValidSortOption(sortBy)
        ? sortBy
        : "default";
    return sortOptions[selectedOption].sortFn(restaurants);
};

/**
 * Retrieves the data from the "get enriched restaurants by postcode" endpoint and sorts
 * the `restaurants` array in the response by the given {@link sortBy} method.
 * @param postcode The postcode to retrieve restaurants for.
 * @param sortBy The sort method to use on the returned `restaurants` array.
 * @returns Enriched restaurants data, or `null` if the response doesn't have a status of 200
 * or doesn't match the expected type definition.
 */
const getRestaurantsByPostcode = async (
    postcode: string,
    sortBy: SortOption = "default",
): Promise<LimitedEnrichedRestaurantsResponse | null> => {
    // Use the "limit" query param to limit the number of Restaurant objects returned to 10
    const apiUrl = `${API_BASE_URL}/discovery/uk/restaurants/enriched/bypostcode/${postcode}?limit=${RESTAURANTS_LIMIT}`;

    const res = await fetch(apiUrl, {
        next: {
            // Revalidate the cached data after 3 minutes (180 s)
            revalidate: 180,
        },
    });
    const data = await res.json();

    if (
        res.status === 200 &&
        data &&
        typeof data === "object" &&
        isValidRestaurantsResponse(data)
    ) {
        const { metaData, restaurants } = data;

        // We're only interested in "metaData" and "restaurants", so we'll
        // explicitly ensure that only those are returned. Despite other keys
        // not being present in LimitedEnrichedRestaurantsResponse, they do exist
        // in the actual response (e.g., filters, enrichedLists, etc).
        //
        // See the API reference for the full response schema:
        // https://uk.api.just-eat.io/docs#operation/discoveryTenantRestaurantsEnrichedBypostcodePostcodeGet
        return {
            metaData,
            restaurants: sortRestaurantData(restaurants, sortBy),
        } as const;
    }

    return null;
};

export default async function ResultsPage({
    params,
    searchParams,
}: {
    params: { postcode: string };
    searchParams: Record<string, string | string[] | undefined>;
}) {
    return (
        <section>
            <h1 className="text-3xl font-semibold">Results</h1>

            <Suspense fallback={<RestaurantsFallback />}>
                <Restaurants
                    postcode={params.postcode}
                    sortBy={(searchParams.sort ?? "default") as SortOption} // Use default sort order if "sort" param is null/undefined
                    fetcher={getRestaurantsByPostcode}
                />
            </Suspense>
        </section>
    );
}

export async function generateMetadata({
    params,
}: {
    params: { postcode: string };
}): Promise<Metadata> {
    // Dynamically generate the document <title>
    return {
        title: `Restaurants in ${params.postcode.toUpperCase()} - Restaurant Data`,
    };
}
