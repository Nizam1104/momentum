// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    // ... other config
    plugins: [
      require("tailwindcss-animate"),
      require('@tailwindcss/typography'), // Add this line
    ],
    animation: {
      shimmer: "shimmer 2s linear infinite",
    },
    keyframes: {
      shimmer: {
        from: { backgroundPosition: "0 0" },
        to: { backgroundPosition: "-200% 0" },
      },
    },
    
  }
  