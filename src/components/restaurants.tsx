import type { LimitedEnrichedRestaurantsResponse } from "@/lib/response";
import type { SortOption } from "@/lib/sort";
import { SortSelect } from "./sort-select";
import { RestaurantCard, RestaurantCardSkeleton } from "./restaurant-card";
import { Skeleton } from "./ui/skeleton";
import { RESTAURANTS_LIMIT } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowLeft, CircleSlash } from "lucide-react";
import Link from "next/link";

/**
 * Retrieves the data by calling the {@link fetcher} and renders a
 * {@link RestaurantCard} for each returned restaurant.
 */
export const Restaurants = async ({
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
    // Get the data from the data source (i.e., the Just Eat API in production)
    const data = await fetcher(postcode, sortBy);
    if (data === null) {
        return <ErrorAlert reason="null-data" />;
    }

    if (!data.restaurants.length) {
        return <ErrorAlert reason="empty-restaurants-array" />;
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

export const RestaurantsFallback = () => {
    return (
        <div className="space-y-5">
            {/* h1 */}
            <Skeleton className="h-[16px] w-[196px] rounded-full" />

            {/* SortSelect */}
            <div className="space-y-2">
                <Skeleton className="h-[14px] w-[48px] rounded-full" />
                <Skeleton className="h-[40px] w-[180px] rounded-md" />
            </div>

            {/* Restaurant cards */}
            <div className="my-4 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
                {[...Array<number>(RESTAURANTS_LIMIT)].map((_, i) => (
                    <RestaurantCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

const ErrorAlert = ({
    reason,
}: {
    reason: "null-data" | "empty-restaurants-array";
}) => {
    const text: Record<typeof reason, { title: string; description: string }> =
        {
            "null-data": {
                title: "Something went wrong",
                description:
                    "An error occurred and we couldn't get any data for the requested postcode.",
            },
            "empty-restaurants-array": {
                title: "No restaurants were found at this postcode",
                description: "Try again with a different postcode.",
            },
        };

    return (
        <>
            <Alert variant="destructive" className="mt-4">
                <CircleSlash className="size-4" />

                <AlertTitle>{text[reason].title}</AlertTitle>
                <AlertDescription>{text[reason].description}</AlertDescription>
            </Alert>

            <Link
                href="/"
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground underline transition-colors hover:text-foreground"
                replace
            >
                <ArrowLeft className="size-4" />
                Go back
            </Link>
        </>
    );
};
