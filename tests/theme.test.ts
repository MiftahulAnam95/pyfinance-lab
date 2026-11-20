import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

const block = (start) => {
  const from = css.indexOf(start);
  assert.notEqual(from, -1, `blok CSS ${start} tidak ditemukan`);
  const to = css.indexOf('}', from);
  const tokens = {};
  for (const m of css.slice(from, to).matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) tokens[m[1]] = m[2];
  return tokens;
};

const dark = block(':root{');
const light = block(":root[data-theme='light']");

const rgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const luminance = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('mode terang mendefinisikan seluruh token warna yang ada di mode gelap', () => {
  const missing = Object.keys(dark).filter((token) => !light[token]);
  assert.deepEqual(missing, [], `token belum di-override: ${missing.join(', ')}`);
});

test('setiap token yang dipakai CSS benar-benar terdefinisi', () => {
  const body = css.slice(css.indexOf('}', css.indexOf(":root[data-theme='light']")) + 1);
  const used = new Set([...body.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]));
  const typography = ['--heading', '--mono', '--side']; // font dan lebar bilah sisi, bukan warna
  const unknown = [...used].filter((token) => !dark[token] && !typography.includes(token));
  assert.deepEqual(unknown, [], `token tanpa definisi: ${unknown.join(', ')}`);
});

test('tidak ada warna hex lepas di luar blok token (kecuali cetak)', () => {
  // Blok @media print sengaja memakai hitam/putih mutlak agar hasil cetak konsisten.
  const start = css.indexOf('}', css.indexOf(":root[data-theme='light']")) + 1;
  const body = css.slice(start).replace(/@media print\{[\s\S]*$/, '');
  const literal = [...body.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
  assert.deepEqual(literal, [], `warna hex harus jadi token: ${literal.join(', ')}`);
});

for (const [name, tokens] of Object.entries({gelap: dark, terang: light})) {
  test(`kontras teks mode ${name} memenuhi WCAG AA (>= 4.5)`, () => {
    const pairs = [
      ['text', 'bg'], ['body', 'bg'], ['muted', 'bg'], ['dim', 'bg'], ['mint', 'bg'],
      ['text', 'surface'], ['body', 'surface'], ['muted', 'surface'], ['nav-text', 'sidebar'],
      ['mint', 'active-bg'], ['chip-text', 'chip-box'], ['td-text', 'bg'], ['th-text', 'th-bg'],
      ['quiz-text', 'quiz'], ['code-text', 'code-bg'], ['pre-text', 'pre-bg'], ['on-accent', 'mint'],
      ['card-label', 'card'], ['term-text', 'term-bg'], ['log-text', 'term-bg'], ['balance-text', 'balance-bg'],
      ['meta', 'bg'], ['gloss-text', 'gloss-card'], ['check-text', 'bg'], ['surface-text', 'surface'],
      ['btn-text', 'btn-bg'], ['kbd-text', 'kbd'], ['term-top-text', 'term-top'], ['term-command', 'term-bg'],
      ['line-num', 'code-bg'], ['mint', 'mint-bg'], ['mint', 'badge'], ['mint', 'callout'],
    ];
    const failing = pairs
      .map(([fg, bg]) => ({ pair: `${fg}/${bg}`, ratio: contrast(tokens[`--${fg}`], tokens[`--${bg}`]) }))
      .filter(({ ratio }) => ratio < 4.5);
    assert.deepEqual(failing, [], `kontras kurang: ${failing.map((f) => `${f.pair}=${f.ratio.toFixed(2)}`).join(', ')}`);
  });
}
