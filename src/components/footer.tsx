import type { HTMLAttributes } from "react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export const Footer = (props: HTMLAttributes<HTMLElement>) => {
    const { className, ...attrs } = props;

    return (
        <footer
            className={cn("pb-6 text-sm text-muted-foreground", className)}
            {...attrs}
        >
            <Separator className="mb-4" />

            <div className="leading-loose">
                <p>
                    Suvan Leelasena &lt;
                    <a
                        href="mailto:suvan@outlook.com"
                        className="underline hover:text-foreground"
                    >
                        suvan@outlook.com
                    </a>
                    &gt;
                </p>
                <a
                    href="https://github.com/suvanl/restaurant-data"
                    className="underline hover:text-foreground"
                >
                    View source on GitHub
                </a>
            </div>
        </footer>
    );
};
