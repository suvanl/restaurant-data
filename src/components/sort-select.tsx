"use client";

import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    sortIds,
    type SortOption,
    sortOptions,
    isValidSortOption,
} from "@/lib/sort";

export const SortSelect = ({ defaultValue }: { defaultValue: SortOption }) => {
    const router = useRouter();

    /**
     * Returns a "safe" default value for the <Select>.
     * It is safe in the sense that it will always be the value of one of the `<SelectItem>`s,
     * ensuring that the current sort method will be displayed in the <Select>.
     *
     * If the value is valid, it will be set as the default value. Otherwise, it will fall back
     * to "default".
     */
    const safeDefaultValue = (value: SortOption) => {
        return isValidSortOption(value) ? value : "default";
    };

    return (
        <div>
            <Label htmlFor="sort-select-trigger">Sort by</Label>

            <Select
                defaultValue={safeDefaultValue(defaultValue)}
                onValueChange={(value) =>
                    router.push(
                        `?${new URLSearchParams({ sort: value }).toString()}`,
                    )
                }
            >
                <SelectTrigger id="sort-select-trigger" className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {sortIds.map((option) => (
                        <SelectItem key={option} value={option}>
                            {sortOptions[option].name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
