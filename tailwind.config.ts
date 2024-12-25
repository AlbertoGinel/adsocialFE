// tailwind.config.ts

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-bg)',  // Use CSS variable for primary color
        secondary: 'var(--secondary-bg)', // Use CSS variable for secondary color
        background: 'var(--background)', // Custom background color
        foreground: 'var(--foreground)', // Custom foreground color
        alert: 'var(--alert-bg)', // Custom alert background
        alertBorder: 'var(--alert-border)', // Custom alert border
        alertText: 'var(--alert-text)', // Custom alert text color
        error: 'var(--error-bg)', // Custom error background
        errorText: 'var(--error-text)', // Custom error text color
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],  // Custom font family
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
