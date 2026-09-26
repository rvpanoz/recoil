import { defineConfig } from 'vitest/config';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /<repo>/; dev stays at the root.
  base: command === 'build' ? '/recoil/' : '/',
  build: {
    // Phaser alone is ~1.4 MB minified (~360 kB gzipped), so the default 500 kB warning is noise.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
}));
