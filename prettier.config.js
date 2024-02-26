/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ["prettier-plugin-tailwindcss"],
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    endOfLine: "auto",
    quoteProps: "consistent",
};

export default config;
