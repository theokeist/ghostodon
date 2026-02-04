import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Workspaces: ensure Vite follows the symlinks nicely
    preserveSymlinks: true
  },
  optimizeDeps: {
    include: ['@ghostodon/core'],
    exclude: ['@ghostodon/ui']
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [
        // allow importing workspace packages
        path.resolve(__dirname, '../..')
      ]
    }
  }
});
