# JET Software Engineering Coding Assignment

This is the source code for the solution developed for the Just Eat Takeaway.com Software Engineering individual assessment.

This solution is a web app built with [Next.js](https://nextjs.org/).

## Demo

The following demo video highlights the web app's functionality. Specifically: fetching 10 restaurants based on the given postcode, displaying the required data points, and sorting the data using the available sort methods.

https://github.com/suvanl/restaurant-data/assets/32813609/e6d0edc1-1e0c-4736-8bc4-4d9f1d6de93f

## Documentation

### Building and running the app

[Node.js](https://nodejs.org/) is a prerequisite.

> [!IMPORTANT]
> All commands should be run from the project root.

1.  Clone or download this repository
2.  Install dependencies

    ```sh
    npm install
    # or, if using pnpm
    pnpm install
    ```

3.  Build the app

    ```sh
    npm run build
    # or
    pnpm build
    ```

4.  Run the app
    ```sh
    npm start
    # or
    pnpm start
    ```
5.  Open the web app. The terminal output of `npm start` will display the local URL it is running at. By default, this is [http://localhost:3000](http://localhost:3000).

<details>
<summary><b>Development mode</b></summary>
To run this app in development mode (with hot reloading, error reporting, etc) replace steps 3 and 4 with the following command:

```sh
npm run dev
# or
pnpm dev
```

</details>

### Usage

Once the app has been built and is running, it can be used like so:

1. Enter a valid UK postcode into the search input field on the homepage.
2. Press the "Search" button or use the enter key.
3. The required data points (name, cuisines, rating (as a number), address) are displayed for each restaurant.
4. (optional) Click on an address to view its location on Google Maps.
5. (optional) Sort the data in a different order by selecting an option from the "Sort by" menu.

### Architecture and patterns

This app uses modern Next.js and React features such as the [app router](https://nextjs.org/docs/app), [server components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) (RSCs), and streaming server-side rendering with [Suspense](https://react.dev/reference/react/Suspense).

### Project structure

The [`src`](https://github.com/suvanl/restaurant-data/tree/main/src) folder contains the following subdirectories:

-   **app** - Represents the file-based routing structure and contains pages and layouts. Dynamic Segments are enclosed in square brackets, e.g. "[postcode]".
-   **components** - Contains the components that are used in the UI. These components are composed of flexible, reusable components which are in the **components/ui** directory. These reusable components are adapted from the [shadcn/ui](https://ui.shadcn.com) collection.
-   **lib** - Contains application logic and constants that are used throughout the app.
-   **styles** - Contains the global stylesheet containing Tailwind CSS directives and CSS variables for the light and dark colour themes.

## Assumptions

-   Assumed that the `limit` query parameter is stable for the "get enriched restaurants by postcode" endpoint.
    -   This query param is undocumented for this endpoint, but successfully limits the size of the `restaurants` array as expected (in this case, to 10 (`?limit=10`)), and seems to be stable based on some manual testing.

## Future improvements

The following improvements could be made to this solution:

-   Display the restaurant's logo in the `<RestaurantCard />` component (using the `logoUrl` property in the Restaurant object as the image source).
-   Add more sort options, such as "number of ratings", and "rating (low-high)".
-   Validate postcode from ResultsPage (server component) to improve UX when navigating directly to the URL (bypassing the SearchForm).

---

<small>Suvan Leelasena &lt;suvan@outlook.com&gt; </small>
