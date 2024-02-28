import { API_BASE_URL } from "@/app/constants";
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
import { Suspense } from "react";

const getRestaurantsByPostcode = async (
    postcode: string,
): Promise<LimitedEnrichedRestaurantsResponse | null> => {
    const apiUrl = `${API_BASE_URL}/discovery/uk/restaurants/enriched/bypostcode/${postcode}`;

    // As this is dynamic data which is subject to change on every request, bypass
    // the default Next.js caching behaviour by setting `cache` to "no-store".
    //
    // Since the responsees are typically large, it would actually be useful to cache this
    // data and revalidate after a short amount of time (i.e., a few mins), but we can't
    // use the cache for responses over 2MB (hardcoded Next.js limit).
    // See https://github.com/vercel/next.js/discussions/48324
    const res = await fetch(apiUrl, { cache: "no-store" });

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
            restaurants: restaurants.slice(0, 10), // only use the first 10 restaurants
        } as const;
    }

    return null;
};

export default async function Page({
    params,
}: {
    params: { postcode: string };
}) {
    return (
        <section>
            <h1 className="text-2xl font-bold underline">Results</h1>

            <Suspense fallback={<>Loading...</>}>
                <Restaurants postcode={params.postcode} />
            </Suspense>
        </section>
    );
}

const Restaurants = async ({ postcode }: { postcode: string }) => {
    const data = await getRestaurantsByPostcode(postcode);
    if (data === null) {
        return <>⚠️ No data</>;
    }

    return (
        <>
            <h1>
                Restaurants in{" "}
                {`${data.metaData.area} ${data.metaData.postalCode}`}
            </h1>

            <div className="space-y-4">
                {data.restaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                    />
                ))}
            </div>
        </>
    );
};

type Restaurant = LimitedEnrichedRestaurantsResponse["restaurants"][number];
const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const googleMapsLink = genGoogleMapsLink(restaurant.address.location);

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                    {restaurant.name}
                    {restaurant.isNew ? (
                        <Badge variant="secondary">✨ New</Badge>
                    ) : null}
                </CardTitle>
                <CardDescription className="text-pretty">
                    <a
                        href={googleMapsLink}
                        target="_blank"
                        className="flex max-w-fit items-center gap-x-1.5 hover:underline"
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
                            {restaurant.rating.starRating}
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
