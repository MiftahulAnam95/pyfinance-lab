import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resolveSiteBase} from '../scripts/site-base.mjs';

test('GitHub Pages repo proyek memakai subfolder nama repo', () => {
  assert.equal(resolveSiteBase({GITHUB_REPOSITORY: 'MiftahulAnam95/pyfinance-lab'}), '/pyfinance-lab/');
});

test('repo USER.github.io dilayani dari akar domain', () => {
  assert.equal(resolveSiteBase({GITHUB_REPOSITORY: 'MiftahulAnam95/MiftahulAnam95.github.io'}), '/');
});

test('SITE_BASE menimpa deteksi otomatis dan dinormalkan', () => {
  assert.equal(resolveSiteBase({SITE_BASE: '/kelas-uas2026/'}), '/kelas-uas2026/');
  assert.equal(resolveSiteBase({SITE_BASE: 'kelas-uas2026'}), '/kelas-uas2026/');
  assert.equal(resolveSiteBase({SITE_BASE: '/', GITHUB_REPOSITORY: 'a/pyfinance-lab'}), '/');
});

test('SITE_BASE berupa URL lengkap ditolak', () => {
  assert.throws(() => resolveSiteBase({SITE_BASE: 'https://example.com/a'}), /SITE_BASE/);
});

test('tanpa variabel lingkungan memakai nama repo bawaan', () => {
  assert.equal(resolveSiteBase({}), '/pyfinance-lab/');
});
