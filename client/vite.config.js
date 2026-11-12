import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // On GitHub Pages the site lives under /ecommerce-application/, not at the root.
  base: process.env.GITHUB_PAGES ? '/ecommerce-application/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
