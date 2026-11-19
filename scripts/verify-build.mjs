/**
 * Pemeriksaan hasil build sebelum dipublikasikan.
 *
 * Kasus yang dicegah: halaman tampil kosong karena HTML hanya berisi
 * <div id="root"></div> (JS gagal dimuat) atau karena aset memakai jalur yang
 * salah, misalnya /assets/... padahal situs dilayani dari /NAMA-REPO/.
 */
import {readFile, readdir} from 'node:fs/promises';
import {existsSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {OUT_DIR, resolveSiteBase} from './site-base.mjs';

const base = resolveSiteBase();
const errors = [];

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else files.push(path);
  }
  return files;
}

const pages = [];
if (!existsSync(OUT_DIR)) {
  errors.push(`${OUT_DIR}/ tidak ada. Jalankan npm run build.`);
} else {
  for (const file of await walk(OUT_DIR)) {
    if (file.endsWith('index.html')) pages.push(file);
  }
}

for (const file of pages) {
  const label = file.slice(OUT_DIR.length + 1);
  const html = await readFile(file, 'utf8');
  if (!/data-prerender="true"/.test(html)) errors.push(`${label}: tidak diprerender, #root kosong bila JS gagal dimuat.`);
  if (/<script[^>]+src="\/src\//.test(html)) errors.push(`${label}: masih memuat /src/...; itu jalur dev, bukan hasil build.`);
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  if (!scripts.some((url) => url.startsWith(base) && url.includes('/assets/'))) {
    errors.push(`${label}: tidak menemukan bundel JavaScript di bawah ${base}assets/.`);
  }
  for (const url of [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1])) {
    if (!url.startsWith(base)) {
      errors.push(`${label}: aset ${url} berada di luar base ${base}.`);
      continue;
    }
    const local = join(OUT_DIR, url.slice(base.length).split(/[?#]/)[0]);
    if (!existsSync(local)) errors.push(`${label}: aset ${url} tidak ada di ${OUT_DIR}/.`);
    else if (local.endsWith('.js') && statSync(local).size < 1024) errors.push(`${label}: bundel ${url} terlalu kecil, mungkin rusak.`);
  }
}

if (!existsSync(join(OUT_DIR, '.nojekyll'))) {
  errors.push(`${OUT_DIR}/.nojekyll tidak ada; GitHub Pages (sumber branch) akan memproses hasil build dengan Jekyll.`);
}

if (errors.length) {
  console.error(`Build tidak siap dipublikasikan:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`OK: ${pages.length} halaman siap dipublikasikan pada base ${base}.`);
