// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// Assuming your backend is running on http://localhost:5000
// const BACKEND_URL = 'http://localhost:5000';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: BACKEND_URL,
//         changeOrigin: true,
//         secure: false, // Set to true if your backend uses HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '') // Only if your backend routes don't have /api prefix
//       },
//     },
//     port: 3000, 
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind CSS Vite plugin

// Assuming your backend is running on http://localhost:5000
const BACKEND_URL = 'http://localhost:5000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the Tailwind CSS Vite plugin here
  ],
  server: {
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false, // Set to true if your backend uses HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '') // Only if your backend routes don't have /api prefix
      },
    },
    port: 3000, // Frontend will run on port 3000
  },
});
