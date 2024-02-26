import type { HTMLAttributes } from "react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export const Footer = (props: HTMLAttributes<HTMLElement>) => {
    const { className, ...attrs } = props;

    return (
        <footer
            className={cn("text-muted-foreground mb-6 text-sm", className)}
            {...attrs}
        >
            <Separator className="mb-4" />

            <div className="leading-loose">
                <p>
                    Suvan Leelasena &lt;
                    <a
                        href="mailto:suvan@outlook.com"
                        className="hover:text-foreground underline"
                    >
                        suvan@outlook.com
                    </a>
                    &gt;
                </p>
                <a
                    href="https://github.com/suvanl/restaurant-data"
                    className="hover:text-foreground underline"
                >
                    View source on GitHub
                </a>
            </div>
        </footer>
    );
};
