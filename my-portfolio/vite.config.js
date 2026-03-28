import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 直接作为 Vite 插件用
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/MotionPathPlugin'],
          ui: ['lucide-react', '@radix-ui/react-navigation-menu'],
        },
      },
    },
  },
});
