"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const POSTCODE_MIN_LENGTH = 2;
const POSTCODE_MAX_LENGTH = 8;

// The schema that form data is expected to adhere to
const formSchema = z.object({
    postcode: z
        .string()
        .min(POSTCODE_MIN_LENGTH, {
            message: `Postcode must be at least ${POSTCODE_MIN_LENGTH} characters`,
        })
        .max(POSTCODE_MAX_LENGTH, {
            message: `Postcode must contain at most ${POSTCODE_MAX_LENGTH} characters`,
        })
        .trim(),
});

export const SearchForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { postcode: "" },
    });

    const router = useRouter();

    /**
     * Called when the form is submitted and passes client-side validation.
     * @param formValues The submitted values, in the shape of the formSchema
     */
    const onSubmit = (formValues: z.infer<typeof formSchema>) => {
        // todo: refactor to use a server action instead of client-side navigation?

        const { postcode } = formValues;

        // Remove all spaces from the postcode
        const parsedPostcode = postcode.replaceAll(" ", "");

        // Navigate to the dynamic route for the given postcode
        void router.push(`/${parsedPostcode}`);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full max-w-2xl gap-x-2"
            >
                <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    type="search"
                                    placeholder="Enter a postcode e.g., EC4M 7RF"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="flex items-center gap-x-2">
                    <SearchIcon className="size-5" />
                    Search
                </Button>
            </form>
        </Form>
    );
};
