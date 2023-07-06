/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        468: "468px",
      },
      screens: {
        sm: "600px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      fontFamily: {
        sans: ["var(--font-roboto)"],
        oleo: ["var(--font-oleo-script)"],
      },
      boxShadow: {
        custom: "0px 8px 15px 1px #121212;",
      },
      colors: {
        bgrey: "rgba(222, 222, 222, 0.503)",
        formblue: "rgb(94, 191, 255)",
        formgrey: "rgba(243, 243, 243, 0.572)",
        fontblue: "rgb(28, 136, 209)",
        black: "#14171a",
        white: "#fafaf9",
        grey: "rgb(149, 149, 149)",
        modalbg: "#c9c9c983",
        glass: "hsl(0,0%,45%,0.2)",
        blue: "rgb(0, 149, 246)",
      },
      gridAutoRows: {
        130: "130px",
      },
    },
  },
  plugins: [],
};
