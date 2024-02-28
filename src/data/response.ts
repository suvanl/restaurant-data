/**
 * Represents the "200 OK" response body from the "get enriched restaurants
 * by postcode" endpoint, but limited to only the data that's relevant
 * to our use case.
 *
 * @see https://uk.api.just-eat.io/docs#operation/discoveryTenantRestaurantsEnrichedBypostcodePostcodeGet
 */
export type LimitedEnrichedRestaurantsResponse = {
    metaData: {
        canonicalName: string;
        district: string;
        postalCode: string;
        area: string;
        location: Location;
        resultCount: number;
    };
    restaurants: {
        id: string;
        name: string;
        address: {
            city: string;
            firstLine: string;
            postalCode: string;
            location: Location;
        };
        rating: {
            count: number;
            starRating: number;
            userRating: number;
        };
        isNew: string;
        cuisines: {
            name: string;
            uniqueName: string;
        }[];
    }[];
};

type Location = {
    type: "Point";
    coordinates: [number, number];
};

export function isValidRestaurantsResponse(
    data: object,
): data is LimitedEnrichedRestaurantsResponse {
    return "metaData" in data && "restaurants" in data;
}
