// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind will be run via PostCSS (see postcss.config.js). The `@tailwindcss/vite`
// plugin can conflict with PostCSS processing and cause @apply to fail to find
// utilities. Keep Vite config minimal and let PostCSS handle Tailwind.
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Change this to your backend URL in development
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

