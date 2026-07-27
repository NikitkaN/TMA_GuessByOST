import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
      '/api': 'http://localhost:3001',
    },
  },
//   resolve: {
//     alias: {
//       // Вместо '../../components/Button' можно писать '@/components/Button'
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
});