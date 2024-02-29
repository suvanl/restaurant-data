import { API_BASE_URL } from "@/app/constants";
import { RestaurantCard } from "@/components/restaurant-card";
import { type SortOption, SortSelect } from "@/components/sort-select";
import {
    type LimitedEnrichedRestaurantsResponse,
    isValidRestaurantsResponse,
    type Restaurant,
} from "@/data/response";
import type { Metadata } from "next";
import { Suspense } from "react";

const sortRestaurantData = (
    restaurants: Restaurant[],
    sortBy: SortOption,
): Restaurant[] => {
    let sorted = restaurants;

    switch (sortBy) {
        case "default":
            sorted = restaurants;
            break;
        case "rating":
            sorted = restaurants.sort(
                (a, b) => b.rating.starRating - a.rating.starRating,
            );
            break;
        case "name-asc":
            sorted = sorted = restaurants.sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
            );
            break;
        case "name-desc":
            sorted = sorted = restaurants.sort((a, b) =>
                a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1,
            );
            break;
    }

    return sorted;
};

const getRestaurantsByPostcode = async (
    postcode: string,
    sortBy: SortOption = "default",
): Promise<LimitedEnrichedRestaurantsResponse | null> => {
    // Use the "limit" query param to limit the number of Restaurant objects returned to 10
    const apiUrl = `${API_BASE_URL}/discovery/uk/restaurants/enriched/bypostcode/${postcode}?limit=10`;

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

            <Suspense fallback={<>Loading...</>}>
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
    return {
        title: `Restaurants in ${params.postcode.toUpperCase()} - Restaurant Data`,
    };
}

const Restaurants = async ({
    postcode,
    sortBy,
    fetcher,
}: {
    postcode: string;
    sortBy: SortOption;
    fetcher: (
        postcode: string,
        sortBy?: SortOption,
    ) => Promise<LimitedEnrichedRestaurantsResponse | null>;
}) => {
    const data = await fetcher(postcode, sortBy);
    if (data === null) {
        return <>⚠️ No data</>;
    }

    return (
        <div className="space-y-4">
            <h1>
                Restaurants in{" "}
                {`${data.metaData.area} ${data.metaData.postalCode}`}
            </h1>
            <SortSelect defaultValue={sortBy} />

            <div className="my-4 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
                {data.restaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                    />
                ))}
            </div>
        </div>
    );
};
