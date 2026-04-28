import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        court: {
          DEFAULT: "#0d3b2c",
          light: "#145a45",
          accent: "#c9a227",
        },
      },
    },
  },
  plugins: [],
};

export default config;
