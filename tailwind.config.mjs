/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                // Display serif for headings — editorial, authoritative
                display: ['"Playfair Display"', "Georgia", "serif"],
                // Clean sans for body text
                body: ['"DM Sans"', "sans-serif"],
                // Monospaced for data values — precise, technical
                mono: ['"JetBrains Mono"', "monospace"],
            },
            colors: {
                forest: {
                    50: "#f0f7f0",
                    100: "#dceedc",
                    200: "#b9dcba",
                    300: "#88c289",
                    400: "#57a259",
                    500: "#348536",
                    600: "#256827",
                    700: "#1e5220",
                    800: "#1a421c",
                    900: "#163618",
                    950: "#0b1f0c",
                },
                slate: {
                    750: "#2a3441",
                    850: "#18222e",
                    950: "#0d1520",
                },
                water: {
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                },
            },
            zIndex: {
                1000: "1000",
            },
        },
    },
    plugins: [],
};
