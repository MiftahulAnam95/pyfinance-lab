import {defineConfig} from 'vite';

const basePath = (process.env.SITE_BASE ?? '/').trim().replace(/^\/+|\/+$/g, '');
if (basePath && !/^[\w.-]+(?:\/[\w.-]+)*$/.test(basePath)) {
  throw new Error('SITE_BASE harus berupa jalur seperti /nama-repo/, bukan URL lengkap.');
}

export default defineConfig({
  base: basePath ? `/${basePath}/` : '/',
  server: {host: '0.0.0.0', allowedHosts: true},
  preview: {host: '0.0.0.0', allowedHosts: true},
});
