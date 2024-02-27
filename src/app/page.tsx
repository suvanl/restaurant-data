import { SearchForm } from "@/components/search-form";

export default function HomePage() {
    return (
        <section className="space-y-4">
            <h2 className="text-balance text-3xl font-medium leading-none tracking-tight">
                Find restaurants in a postcode area
            </h2>

            <SearchForm />
        </section>
    );
}
