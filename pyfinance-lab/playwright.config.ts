import {defineConfig} from '@playwright/test';
const localRoot='http://localhost:4173/';
const staticURL=process.env.TEST_STATIC_URL;
export default defineConfig({
 testDir:'./browser',use:{baseURL:staticURL??localRoot},reporter:'list',
 webServer:staticURL?undefined:{command:'npm run preview -- --port 4173 --strictPort',url:localRoot,reuseExistingServer:true},
});
