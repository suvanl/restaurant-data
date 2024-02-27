import { API_BASE_URL } from "@/app/constants";
import {
    type LimitedEnrichedRestaurantsResponse,
    isValidRestaurantsResponse,
} from "@/data/response";

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
    const data = await getRestaurantsByPostcode(params.postcode);
    if (data === null) {
        return <>⚠️ No data</>;
    }

    return (
        <div>
            <p>Postcode: {params.postcode}</p>
            <p>{data.metaData.canonicalName}</p>

            {data.restaurants.map((restaurant) => (
                <div key={restaurant.id}>
                    <p className="text-xl font-bold">{restaurant.name}</p>
                    <p>Rating: {JSON.stringify(restaurant.rating)}</p>
                    <p>
                        Cuisines:{" "}
                        {restaurant.cuisines.map((c) => `${c.name}, `)}
                    </p>
                </div>
            ))}
        </div>
    );
}
