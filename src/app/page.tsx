import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function HomePage() {
    return (
        <main className="container relative mx-auto min-h-dvh items-center space-y-60 overflow-auto p-4 md:p-16">
            <section>
                <h1 className="text-lg font-semibold tracking-tight">
                    Restaurant Data Search
                </h1>
                <p>JET Software Engineering Coding Assignment</p>
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
