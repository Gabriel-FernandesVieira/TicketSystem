import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/HTicket': {
        target: 'http://localhost:7142',
          changeOrigin: true,
        secure: false
      }
    }
  }
});