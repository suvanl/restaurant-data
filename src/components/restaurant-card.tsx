import { ExternalLinkIcon, Star, UtensilsCrossed } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import type { Restaurant } from "@/lib/response";
import { Skeleton } from "./ui/skeleton";

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

export const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const googleMapsLink = genGoogleMapsLink(restaurant.address.location);

    return (
        <Card className="max-w-xl lg:max-w-full">
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-x-2 text-balance">
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

export const RestaurantCardSkeleton = () => {
    return (
        <Skeleton className="h-[200px] max-w-xl rounded-xl sm:h-[174px] lg:max-w-full" />
    );
};
