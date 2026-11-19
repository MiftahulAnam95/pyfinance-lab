import {mkdir, readFile, writeFile, rm} from 'node:fs/promises';
import {OUT_DIR} from './site-base.mjs';
import {render, routes, pageTitle} from '../.prerender/entry-server.js';

const log = (...args) => console.log(...args);
const template = await readFile(`${OUT_DIR}/index.html`, 'utf8');
for (const page of routes) {
  const dir = page === 'home' ? OUT_DIR : `${OUT_DIR}/${page}`;
  await mkdir(dir, {recursive: true});
  const html = template.replace('<div id="root"><!--app--></div>', () => `<div id="root" data-prerender="true">${render(page)}</div>`);
  if (!html.includes('data-prerender="true"')) throw new Error('Prerender marker missing');
  await writeFile(`${dir}/index.html`, html.replace(/<title>.*?<\/title>/, () => `<title>${pageTitle(page)}</title>`));
}
await rm('.prerender', {recursive: true, force: true});
log(`Prerendered ${routes.length} pages.`);
