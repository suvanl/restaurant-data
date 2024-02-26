import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Restaurant Data",
    description: "Just Eat Takeaway.com software engineering coding assignment",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${GeistSans.variable} ${GeistMono.variable}`}
            // Suppress warning about className prop mismatch between server and client.
            // ThemeProvider will modify the className by appending the theme name to it.
            //This is expected behaviour. This suppression only applies one level deep.
            suppressHydrationWarning
        >
            <body className="flex h-dvh flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Footer className="container mx-auto px-4 md:px-16" />
                </ThemeProvider>
            </body>
        </html>
    );
}
