/**
 * Menentukan base URL situs.
 *
 * GitHub Pages untuk repo proyek dilayani dari /NAMA-REPO/, bukan dari akar
 * domain. Kalau aset ditulis sebagai /assets/... (akar domain), semuanya 404
 * dan halaman tampil kosong. Karena itu base dihitung otomatis dari nama repo
 * saat build berjalan di GitHub Actions (variabel GITHUB_REPOSITORY), dan bisa
 * ditimpa lewat SITE_BASE untuk host atau subfolder lain.
 */
export const REPO_NAME = 'pyfinance-lab';
export const OUT_DIR = 'docs';

const cleanPath = (value) =>
  String(value ?? '')
    .trim()
    .replace(/^\/+|\/+$/g, '');

export function resolveSiteBase(env = process.env) {
  const siteBase = cleanPath(env.SITE_BASE);
  if (String(env.SITE_BASE ?? '').trim() && !siteBase) return '/';
  if (siteBase) {
    if (!/^[\w.-]+(?:\/[\w.-]+)*$/.test(siteBase)) {
      throw new Error('SITE_BASE harus berupa jalur seperti /nama-repo/, bukan URL lengkap.');
    }
    return `/${siteBase}/`;
  }

  const [owner = '', repo = ''] = String(env.GITHUB_REPOSITORY ?? '').split('/');
  // Repo "USER.github.io" dilayani dari akar domain, tanpa nama repo.
  if (repo && /\.github\.io$/i.test(repo)) return '/';
  if (repo && repo.toLowerCase() !== owner.toLowerCase()) return `/${repo}/`;
  return `/${REPO_NAME}/`;
}
