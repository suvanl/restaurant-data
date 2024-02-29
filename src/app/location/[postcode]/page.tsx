import { API_BASE_URL } from "@/app/constants";
import { type SortOption, SortSelect } from "@/components/sort-select";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type LimitedEnrichedRestaurantsResponse,
    isValidRestaurantsResponse,
} from "@/data/response";
import { ExternalLinkIcon, Star, UtensilsCrossed } from "lucide-react";
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

type SearchParams = Record<string, string | string[] | undefined>;
export default async function ResultsPage({
    params,
    searchParams,
}: {
    params: { postcode: string };
    searchParams: SearchParams;
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

type Restaurant = LimitedEnrichedRestaurantsResponse["restaurants"][number];
const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const googleMapsLink = genGoogleMapsLink(restaurant.address.location);

    return (
        <Card className="max-w-xl lg:max-w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-x-2 text-balance">
                    {restaurant.name}
                    {restaurant.isNew ? (
                        <Badge variant="secondary">✨ New</Badge>
                    ) : null}
                </CardTitle>
                <CardDescription className="text-pretty">
                    <a
                        href={googleMapsLink}
                        target="_blank"
                        className="flex max-w-fit flex-wrap items-center gap-x-1.5 hover:underline"
                    >
                        {formatAddress(restaurant.address)}
                        <ExternalLinkIcon className="size-3" />
                    </a>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center gap-1">
                    <div>
                        <Star className="size-4" />
                        <span className="sr-only">Rating</span>
                    </div>
                    <div>
                        <span className="font-semibold">
                            {restaurant.rating.starRating.toFixed(1)}
                        </span>{" "}
                        <span className="text-xs text-muted-foreground">
                            ({restaurant.rating.count} reviews)
                        </span>
                    </div>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-1">
                    <div>
                        <UtensilsCrossed className="size-4" />
                        <span className="sr-only">Cuisines</span>
                    </div>
                    {restaurant.cuisines.map((cuisine) => (
                        <Badge key={cuisine.uniqueName} variant="outline">
                            {cuisine.name}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const formatAddress = (address: Restaurant["address"]) => {
    return `${address.firstLine}, ${address.city}, ${address.postalCode}`;
};

/**
 * Generates a Google Maps link using the coordinates from the given location
 * @param location the restaurant's location data
 * @returns the generated Google Maps link
 */
const genGoogleMapsLink = (location: Restaurant["address"]["location"]) => {
    const [lon, lat] = location.coordinates;
    return `https://www.google.co.uk/maps/place/${lat},${lon}`;
};
