import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gear: resolve(__dirname, 'gear.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        about: resolve(__dirname, 'about.html')
      }
    }
  }
});
