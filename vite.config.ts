import {defineConfig} from 'vite';
import {OUT_DIR, resolveSiteBase} from './scripts/site-base.mjs';

// Halaman dipublikasikan dari docs/ (GitHub Pages: branch main, folder /docs).
const base = resolveSiteBase();

export default defineConfig({
  base,
  build: {outDir: OUT_DIR, emptyOutDir: true},
  server: {host: '0.0.0.0', allowedHosts: true},
  preview: {host: '0.0.0.0', allowedHosts: true},
});
