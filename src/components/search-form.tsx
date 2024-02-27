"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";

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
        }),
});

export const SearchForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { postcode: "" },
    });

    const onSubmit = (formValues: z.infer<typeof formSchema>) => {
        console.log(formValues);
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
