import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: { clearMocks: false },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
