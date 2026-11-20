/**
 * Tema tampilan: "dark" (bawaan) atau "light".
 *
 * Pilihan disimpan di localStorage dan diterapkan ke <html data-theme="...">.
 * Atribut itu dipasang sedini mungkin (lihat themeInit di main.tsx) agar
 * halaman tidak berkedip gelap sebelum React selesai hidrasi.
 */
export type Theme = 'dark' | 'light';

export const themeKey = 'pyfinance-lab:theme:v1';
export const themeColor = (theme: Theme) => (theme === 'dark' ? '#10131a' : '#f5f7f6');

export function readTheme(): Theme {
  try {
    return localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', themeColor(theme));
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    /* Penyimpanan diblokir: tema tetap berlaku untuk halaman ini. */
  }
}
