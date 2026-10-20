import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Use relative base for production builds (GitHub Pages compatibility), and root '/' for dev server
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
}));
