import { defineConfig } from 'vitest/config'
import path from 'path'

// No @vitejs/plugin-react here on purpose: nothing in the current test suite
// renders JSX (lib/utils.test.ts is plain functions, useDebounce.test.ts uses
// renderHook without JSX). Add the plugin back only once an actual .tsx
// component test needs it — it pulls in `vite` as a peer dependency, which
// this yarn-classic monorepo has some trouble hoisting cleanly.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
