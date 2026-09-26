import { defineConfig } from 'vitest/config';

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the site from /<repo>/; dev stays at the root. `vite preview` runs as 'serve',
  // so it needs the flag too, or it serves the build from / while index.html points at /recoil/.
  base: command === 'build' || isPreview ? '/recoil/' : '/',
  build: {
    // Phaser alone is ~1.4 MB minified (~360 kB gzipped), so the default 500 kB warning is noise.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
}));
