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

export const sortOptions = [
    { id: "default", name: "Default order" },
    { id: "rating", name: "Rating (high-low)" },
    { id: "name-asc", name: "Name (A-Z)" },
    { id: "name-desc", name: "Name (Z-A)" },
] as const;

export type SortOption = (typeof sortOptions)[number]["id"];

export const SortSelect = ({ defaultValue }: { defaultValue: SortOption }) => {
    const router = useRouter();

    return (
        <div>
            <Label htmlFor="sort-select-trigger">Sort by</Label>

            <Select
                defaultValue={defaultValue}
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
                    {sortOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
