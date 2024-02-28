import type { HTMLAttributes } from "react";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
                <Link
                    href="/"
                    className="font-semibold tracking-tight sm:text-lg"
                >
                    Restaurant Data Search
                </Link>
                <p className="text-sm sm:text-base">
                    JET Software Engineering Coding Assignment
                </p>
            </div>
            <ThemeModeToggle />
        </header>
    );
};
