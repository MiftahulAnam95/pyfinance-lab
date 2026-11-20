# PyFinance Lab

Website belajar Python dari nol melalui proyek **Pencatat Keuangan Mahasiswa**. Paket berisi sumber situs, build statis siap dipublikasikan, dan empat file Python baru yang dipakai pada seluruh materi. Lampiran awal tidak dimodifikasi ataupun dipakai sebagai sumber contoh.

## Mulai menggunakan

Buka peta belajar untuk melihat 12 bab, atau masuk ke **Simulator Terminal** untuk mencoba demo tanpa Python. Bab **Siap Presentasi** berisi naskah ±30 detik, ±2 menit dan ±5 menit, pembagian peran opsional, demo, checklist, rencana cadangan, dan 24 bahan tanya jawab. **Ringkasan Cetak** juga memuat tombol reset progres dengan konfirmasi.

### Jalankan website

Perlu Node.js **20.19+** (seri 20) atau **22.12+**, serta npm. Instalasi paket membutuhkan internet; situs yang telah di-build menggunakan aset lokal dan tidak meminta CDN atau API.

```sh
npm ci
npm run dev
```

Buka alamat yang ditampilkan di terminal (biasanya `http://localhost:5173`). Untuk melihat versi produksi dan menguji fallback tanpa JavaScript:

```sh
npm run build
npm run preview
```

Hasil build ada di `docs/`. Jalankan `npm run preview` (menyajikan `docs/` pada base situs) atau, bila base-nya `/`, `python3 -m http.server 8000 --directory docs` lalu buka `http://localhost:8000`. Jangan membuka `index.html` via `file://`, karena rute dan aset dilayani lewat HTTP.

`npm run build` selalu diakhiri pemeriksaan `npm run verify`: setiap halaman harus sudah diprerender dan semua aset yang dirujuk harus ada di bawah base situs. Kalau `verify` gagal, jangan publikasikan hasil build — biasanya berarti menyajikan HTML dev atau folder yang salah sehingga halaman tampil kosong.

### Kalau situs yang sudah di-hosting masih tampil kosong

Halaman kosong (putih, tanpa teks sama sekali) hampir selalu berarti yang disajikan adalah `index.html` **pengembangan** di akar repo, yang memuat `/src/main.tsx` — berkas itu hanya ada di server dev. Halaman yang benar selalu memuat `/NAMA-REPO/assets/...`.

Cek cepat:

1. Buka `https://USERNAME.github.io/NAMA-REPO/`, klik kanan → **View Page Source**, cari `<script`. Kalau tertulis `/src/main.tsx`, sumber publikasinya salah.
2. Di repo, buka **Settings → Pages → Build and deployment → Source** dan pastikan **Deploy from a branch**, **Branch: `main`**, **Folder: `/docs`** (bukan `/` atau `/root`). Setelan ini tidak disimpan di repo, jadi harus dipilih manual sekali di setiap repo.
3. Setelah diubah, tunggu build Pages selesai (tab **Actions**, workflow `pages-build-deployment`), lalu muat ulang dengan **Ctrl+Shift+R** karena browser kerap menyimpan HTML lama.
4. Kalau memilih mode **GitHub Actions** (workflow `.github/workflows/pages.yml`), set **Settings → Pages → Build and deployment → Source: GitHub Actions**, bukan Deploy from a branch. Jangan mencampur keduanya: selama sumbernya masih branch, build dari branch itu yang tayang dan deploy workflow kalah, meskipun job-nya terlihat "success". Setelah memilih GitHub Actions, buka tab **Actions → Deploy PyFinance Lab to Pages → Run workflow** (branch `main`). Workflow ini berakhir dengan pemeriksaan HTML yang benar-benar tayang: kalau halaman masih memuat `/src/main.tsx` atau belum berisi hasil build, job-nya **gagal dengan pesan yang menjelaskan** — jadi kegagalan tidak lagi berupa halaman kosong yang senyap.

Kalau `docs/` disajikan lewat sumber branch, `docs/.nojekyll` sudah disertakan agar Jekyll tidak memproses hasil build.

### Jalankan Python sungguhan

Pasang Python 3 (3.11+ disarankan). Tidak ada paket pip yang diperlukan. Simpan `main.py`, `pencatat.py`, `laporan.py`, dan `tampilan.py` dalam satu folder, atau gunakan file yang disertakan di `public/python`:

```sh
cd public/python
python3 main.py
```

Di Windows coba `py -3 main.py` atau `python main.py`. Input contoh, satu per baris: `1`, `150000`, `2`, `25000`, `Makan`, `3`. Saldo: **Rp125.000**. Menu `4` menampilkan dua transaksi, `5` menampilkan `Makan: Rp25.000`, dan `6` menutup sesi.

### Deploy ke GitHub Pages

1. Buat repositori **publik** di GitHub, misalnya `pyfinance-lab`. Untuk langkah Git di bawah, buat repo kosong tanpa README bawaan. Repositori publik juga membuat kode dan materi proyek bisa dilihat orang lain.
2. Push **isi** folder `pyfinance-lab` ke branch `main` repositori itu — termasuk folder `docs/` berisi hasil build. Pastikan `.github/workflows/pages.yml` dan `package-lock.json` terlihat di root repo (folder `.github` bisa tersembunyi di pengelola file). Jangan hanya mengunggah file ZIP.
3. Di GitHub, buka **Settings → Pages → Build and deployment → Source**, lalu pilih **Deploy from a branch** dengan branch **main** dan folder **/docs**. Jika sebelumnya sudah memakai sumber lain, ubah dulu pilihan ini — tanpa itu GitHub akan menyajikan `index.html` pengembangan di root, yang memuat `/src/main.tsx` dan berakhir sebagai halaman kosong.
4. Tunggu build Pages selesai, lalu buka **Settings → Pages → Visit site**. Untuk repo proyek biasa, URL-nya berbentuk `https://USERNAME.github.io/NAMA-REPO/`. Setiap push ke `main` memicu build ulang dari folder `docs/`. Workflow `.github/workflows/pages.yml` disediakan bila nanti ingin pindah ke mode **GitHub Actions**; workflow itu membangun ulang `docs/` dari sumber dan menjalankan pemeriksaan yang sama.

Contoh push pertama dari terminal, dari folder hasil ekstrak. Ganti `USERNAME` dan `NAMA-REPO` dengan nama GitHub milikmu:

```sh
git init -b main
git add .
git commit -m "Deploy PyFinance Lab"
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Untuk repositori yang sudah berisi commit, clone dahulu lalu salin file proyek ke clone itu agar riwayatnya tidak tertimpa. GitHub Desktop juga bisa dipakai untuk commit/push. GitHub mungkin meminta login atau izin untuk mengubah file workflow; jangan menaruh token/kata sandi di dalam proyek.

Workflow mengambil jalur situs dari `actions/configure-pages`, sehingga nama repo **tidak perlu di-hardcode**. Halaman, aset, serta unduhan Python mengikuti jalur repo yang sama. GitHub Pages hanya meng-host website statis; `main.py` tetap dijalankan lokal untuk eksekusi Python asli.

### Deploy ke static host lain

`npm run build` menulis hasil ke `docs/` dengan base yang dihitung otomatis (lihat `scripts/site-base.mjs`): saat build di GitHub Actions, base diambil dari nama repo sehingga aset dilayani dari `/NAMA-REPO/assets/…`; repo `USER.github.io` memakai akar domain. Untuk host atau subfolder lain, set `SITE_BASE` saat build (`SITE_BASE=/nama-folder/ npm run build` di macOS/Linux, atau `$env:SITE_BASE='/nama-folder/'; npm run build` di PowerShell). Root domain lokal bisa dipaksa dengan `SITE_BASE=/`. Host harus menyajikan `index.html` pada path direktori seperti `/nama-repo/presentasi/`. Tidak perlu server Node atau aturan redirect SPA. Versi dev tidak melakukan prerender.

## Asumsi dan batasan

- Jumlah anggota kelompok, nama, rubrik, dan durasi presentasi belum diketahui. Contoh tiga orang bersifat opsional. Naskah dan pertanyaan latihan ada di `src/presentation.ts`.
- Nominal transaksi berupa Rupiah bulat positif (1–999.999.999), tanpa pemisah saat input. Kategori wajib untuk pengeluaran dan peka huruf besar/kecil. Saldo negatif diizinkan. Tidak ada impor rekening, anggaran, tanggal, koreksi transaksi, atau penilaian kesehatan keuangan.
- Data transaksi hanya hidup selama sesi. Progres belajar menggunakan `localStorage` browser (tanpa akun/sinkronisasi) dan bukan catatan transaksi. Jika penyimpanan diblokir, progres hanya berlaku pada halaman aktif.
- **Simulator JavaScript** mengikuti aturan dan teks menu Python. Tidak menjalankan file atau interpreter, tidak menghasilkan sinyal terminal sungguhan seperti EOF/Ctrl+C, dan punya tombol muat demo/mulai sesi yang bukan bagian CLI. Hero, jejak data, dan contoh hasil adalah materi yang disiapkan. **Python sungguhan** dijalankan lokal via `main.py`.
- Untuk cadangan presentasi tanpa internet, siapkan server lokal/build, salinan ringkasan yang dicetak, dan empat file Python. Situs yang di-host bukan PWA dan tidak menjamin akses ulang offline.

## Struktur

| Jalur | Isi |
| --- | --- |
| `public/python/` | Sumber Python tunggal untuk unduhan dan panel kode |
| `src/curriculum.ts`, `src/deep-dive.ts` | Kurikulum, bedah baris, latihan, kamus |
| `src/presentation.ts` | Naskah dan pertanyaan latihan UAS |
| `src/sim.ts` | Logika simulator dan sumber jejak demo |
| `src/motion.ts` | GSAP, ScrollTrigger, dan satu engine Lenis |
| `scripts/prerender.mjs` | Penulisan HTML statis per halaman |
| `scripts/site-base.mjs` | Penentuan base URL situs (otomatis dari nama repo) |
| `scripts/verify-build.mjs` | Pemeriksaan `docs/`: sudah diprerender dan semua aset ada |
| `docs/` | Hasil build yang dipublikasikan (GitHub Pages: branch `main`, folder `/docs`) |
| `tests/`, `browser/` | Tes Python, paritas simulator, dan interaksi browser |

## Aset dan desain

Lihat [DESAIN.md](DESAIN.md). Ikon [Solar](https://icon-sets.iconify.design/solar/) oleh [480 Design](https://www.figma.com/community/file/1166831539721848736), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), lewat `@iconify-json/solar`. Manrope, Space Grotesk, dan JetBrains Mono dilayani sendiri dari [Fontsource](https://fontsource.org/) dengan SIL Open Font License 1.1. Berkas kredit/lisensi ada di `public/licenses` (tersedia juga pada build). Tidak ada foto, gambar stok, avatar, atau klaim prestasi. Three.js tidak dipasang.

## Pengujian

```sh
npm run typecheck
npm test                         # memerlukan python3 untuk unittest dan tes paritas
npm run build && npm run verify
npx playwright install chromium  # Linux bisa memakai --with-deps bila diperlukan
npm run test:browser
```

- **Lulus:** pemeriksaan tipe dan build produksi (15 halaman HTML); 5 tes Python dan 5 tes simulator/jejak. Empat tes membandingkan transkrip Python dan simulator, termasuk demo, kategori kosong, menu salah, saldo negatif, nol awal, Unicode, dan batas nominal. Tes Python juga memeriksa daftar kosong, fungsi baca-saja, serta EOF.
- **Lulus di Chromium:** 9 tes browser untuk navigasi desktop/mobile, pencarian keyboard, jejak, latihan, presentasi, salin/unduh, penyimpanan dan reset, reduced motion, fallback tanpa JavaScript, CSS cetak, serta pemindaian axe pada empat halaman. Tampilan diperiksa pada desktop 1440×900 dan simulasi ponsel 390×844. Hanya Lenis terpasang dan aktif saat reduced motion tidak diminta.
- **Lulus simulasi GitHub Pages:** versi produksi dibuka pada subfolder `/kelas-uas2026/` dari server berkas statis tanpa fallback SPA. Sembilan tes browser lulus; tautan internal dan aset yang direferensikan dari seluruh 15 halaman merespons HTTP 200.
- **Belum diuji:** Safari/Firefox, ponsel fisik, pembaca layar manual, hasil dari printer fisik, dan publikasi di akun GitHub pengguna. Pemindaian axe bukan sertifikasi aksesibilitas.
