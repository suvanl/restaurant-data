import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function HomePage() {
    return (
        <main className="container mx-auto grow items-center space-y-60 overflow-auto p-4 md:p-16">
            <section className="flex items-center justify-between gap-x-2 sm:items-start">
                <div>
                    <h1 className="font-semibold tracking-tight sm:text-lg">
                        Restaurant Data Search
                    </h1>
                    <p className="text-sm sm:text-base">
                        JET Software Engineering Coding Assignment
                    </p>
                </div>
                <ThemeModeToggle />
            </section>

            <section className="space-y-4">
                <h2 className="text-balance text-3xl font-medium leading-none tracking-tight">
                    Find restaurants in a postcode area
                </h2>

                <form
                    action=""
                    className="flex w-full max-w-2xl items-center gap-x-2"
                >
                    <Input
                        type="search"
                        name="postcode"
                        placeholder="Enter a postcode e.g., EC4M 7RF"
                    />
                    <Button type="submit" className="flex items-center gap-x-2">
                        <SearchIcon className="size-5" />
                        Search
                    </Button>
                </form>
            </section>
        </main>
    );
}
