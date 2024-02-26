import type { HTMLAttributes } from "react";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { cn } from "@/lib/utils";

export const Header = (props: HTMLAttributes<HTMLElement>) => {
    const { className, ...attrs } = props;

    return (
        <header
            className={cn(
                "flex items-center justify-between gap-x-2 sm:items-start",
                className,
            )}
            {...attrs}
        >
            <div>
                <h1 className="font-semibold tracking-tight sm:text-lg">
                    Restaurant Data Search
                </h1>
                <p className="text-sm sm:text-base">
                    JET Software Engineering Coding Assignment
                </p>
            </div>
            <ThemeModeToggle />
        </header>
    );
};
