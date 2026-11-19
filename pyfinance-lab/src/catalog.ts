export const chapters = [
 ['mengenal-proyek','Mengenal Proyek','Pahami masalah, tujuan, dan gambaran besar program.','compass'],
 ['persiapan','Persiapan','Siapkan Python, editor, dan folder proyekmu.','box'],
 ['dasar-python','Dasar Python','Mulai dari variabel, kondisi, loop, hingga fungsi.','code'],
 ['pencatat','Bedah pencatat.py','Lihat bagaimana transaksi dicatat dan saldo dihitung.','wallet'],
 ['laporan','Bedah laporan.py','Ubah daftar transaksi menjadi laporan yang mudah dibaca.','chart'],
 ['main','Bedah main.py','Ikuti keputusan program dari menu sampai keluar.','terminal'],
 ['tampilan','Bedah tampilan.py','Rapikan menu dan angka Rupiah tanpa mengubah data.','monitor'],
 ['alur','Alur & Jejak Data','Ikuti perubahan data setiap kali pengguna memilih menu.','route'],
 ['debugging','Error & Debugging','Baca pesan error dan temukan penyebabnya.','bug'],
 ['latihan','Latihan Mandiri','Prediksi output, perbaiki kode, dan coba tantangan.','clipboard'],
 ['kamus','Kamus Istilah','Cari padanan istilah Python dalam bahasa sehari-hari.','book'],
 ['presentasi','Siap Presentasi','Latih demo dan jawaban untuk kemungkinan tanya jawab.','mic'],
] as const;
export type Slug = typeof chapters[number][0];
export type Page = Slug | 'home' | 'simulator' | 'ringkasan';
export const routes:Page[] = ['home',...chapters.map(x=>x[0]),'simulator','ringkasan'];
export const base = import.meta.env.BASE_URL;
export const publicFile = (path:string) => `${base}${path}`;
export const href = (page:Page) => publicFile(page==='home'?'':`${page}/`);
export const mapHref = `${href('home')}#peta-belajar`;
export function pageFromPath(pathname:string):Page {
 const relative = pathname.startsWith(base)?pathname.slice(base.length):'';
 const path = relative.split('/').find(Boolean) as Page|undefined;
 return path&&routes.includes(path)?path:'home';
}
export const files = import.meta.glob('../public/python/*.py',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
export const source = (name:string) => files[`../public/python/${name}.py`];

export const pageTitle = (page:Page) => page==='home'?'PyFinance Lab — Belajar Python dari Nol':`${chapters.find(c=>c[0]===page)?.[1]??(page==='simulator'?'Simulator Terminal':'Ringkasan Cetak')} — PyFinance Lab`;
