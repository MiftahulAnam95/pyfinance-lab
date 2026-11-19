import {defineConfig} from '@playwright/test';
import {resolveSiteBase} from './scripts/site-base.mjs';

// Situs selalu diuji dari base yang sama dengan hasil build (mis. /pyfinance-lab/),
// sehingga tes juga menangkap aset yang salah jalur sejak dini.
const localRoot = `http://localhost:4173${resolveSiteBase()}`;
const staticURL = process.env.TEST_STATIC_URL;

export default defineConfig({
  testDir: './browser',
  use: {baseURL: staticURL ?? localRoot},
  reporter: 'list',
  webServer: staticURL ? undefined : {command: 'npm run preview -- --port 4173 --strictPort', url: localRoot, reuseExistingServer: true},
});
