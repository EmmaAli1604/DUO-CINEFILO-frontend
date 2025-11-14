/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
    extend: {
        colors: {
        background: 'hsl(345 26% 13%)',
        foreground: 'hsl(42 36% 82%)',
        border: 'hsl(349 31% 30%)',
        card: 'hsl(349 31% 20%)',
        primary: 'hsl(345 36% 45%)',
        secondary: 'hsl(349 31% 25%)',
        muted: 'hsl(349 31% 22%)',
        accent: 'hsl(345 36% 45%)',
        destructive: 'hsl(0 72% 51%)',
        },
    },
    },
    plugins: [],
    }