import type { Restaurant } from "@/lib/response";

export type SortOption = (typeof sortIds)[number];

export const sortIds = ["default", "rating", "name-asc", "name-desc"] as const;
export const sortOptions: Record<
    SortOption,
    {
        /**
         * The option's name that is displayed in the UI.
         */
        name: string;
        /**
         * Sorts the data.
         * @param restaurants Original data (array of Restaurant objects).
         * @returns Sorted array of Restaurant objects.
         */
        sortFn: (restaurants: Restaurant[]) => Restaurant[];
    }
> = {
    "default": {
        name: "Default order",
        sortFn: (restaurants) => restaurants,
    },
    "rating": {
        name: "Rating (high-low)",
        sortFn: (restaurants) => {
            return restaurants.sort(
                (a, b) => b.rating.starRating - a.rating.starRating,
            );
        },
    },
    "name-asc": {
        name: "Name (A-Z)",
        sortFn: (restaurants) => {
            return restaurants.sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
            );
        },
    },
    "name-desc": {
        name: "Name (Z-A)",
        sortFn: (restaurants) => {
            return restaurants.sort((a, b) =>
                a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1,
            );
        },
    },
};

export function isValidSortOption(option: string): option is SortOption {
    return sortIds.includes(option);
}
