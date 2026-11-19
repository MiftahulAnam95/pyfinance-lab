export type Item={jenis:'masuk'|'keluar';nominal:bigint;kategori:string};
export type Sim={phase:'menu'|'nominal'|'kategori'|'selesai';data:Item[];kind:Item['jenis'];amount:bigint;log:string[]};
export const options=['Catat pemasukan','Catat pengeluaran','Lihat saldo','Lihat riwayat','Laporan kategori','Keluar'];
export const menuText='=== PENCATAT KEUANGAN ===\n'+options.map((v,i)=>`${i+1}. ${v}`).join('\n');
export const prompt={menu:'Pilih menu [1–6]:',nominal:'Nominal (Rp):',kategori:'Kategori:',selesai:'Sesi selesai'};
export const rupiah=(v:bigint)=>`${v<0n?'-':''}Rp${(v<0n?-v:v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}`;
export const saldo=(data:Item[])=>data.reduce((s,x)=>s+(x.jenis==='masuk'?x.nominal:-x.nominal),0n);
export const init=():Sim=>({phase:'menu',data:[],kind:'masuk',amount:0n,log:[menuText]});
export function step(s:Sim,raw:string):Sim {
 if(s.phase==='selesai')return s;
 const text=raw.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g,'');
 const next:Sim={...s,log:[...s.log,`${prompt[s.phase]} ${raw}`]};
 const menu=(msg:string):Sim=>({...next,phase:'menu',log:[...next.log,msg,'\n'+menuText]});
 const add=(kategori:string)=>{next.data=[...s.data,{jenis:next.kind,nominal:next.amount,kategori}]; return menu('Transaksi tersimpan.');};
 if(s.phase==='nominal'){
  const angka=text.replace(/^0+/,'');
  if(!/^[0-9]{1,9}$/.test(angka))return menu('Input ditolak: Nominal harus berupa angka 1–999999999 tanpa pemisah.');
  next.amount=BigInt(angka);
  return s.kind==='masuk'?add('Uang saku'):{...next,phase:'kategori'};
 }
 if(s.phase==='kategori')return text?add(text):menu('Input ditolak: Jenis, nominal, atau kategori tidak valid.');
 if(text==='1'||text==='2')return {...next,phase:'nominal',kind:text==='1'?'masuk':'keluar'};
 if(text==='3')return menu(`Saldo: ${rupiah(saldo(s.data))}`);
 if(text==='4')return menu(s.data.map((x,i)=>`${i+1}. ${x.kategori} | ${x.jenis==='masuk'?'+':'-'}${rupiah(x.nominal)}`).join('\n')||'Belum ada transaksi.');
 if(text==='5'){
  const groups=new Map<string,bigint>();
  for(const x of s.data)if(x.jenis==='keluar')groups.set(x.kategori,(groups.get(x.kategori)??0n)+x.nominal);
  return menu(Array.from(groups,([name,n])=>`${name}: ${rupiah(n)}`).join('\n')||'Belum ada pengeluaran.');
 }
 if(text==='6')return {...next,phase:'selesai',data:[],log:[...next.log,'Sesi selesai. Data tidak disimpan.']};
 return menu('Pilihan tidak dikenal. Pilih 1–6.');
}
export const demoSteps=[
 {input:[],title:'Mulai sesi',path:'main.py → tampilan.menu()',why:'main membuat list baru lalu menampilkan menu.'},
 {input:['1','150000'],title:'Catat uang saku',path:'main.py → pencatat.baca_nominal() → pencatat.tambah()',why:'Teks 150000 menjadi int. Item masuk ditambahkan dengan kategori Uang saku.'},
 {input:['2','25.000'],title:'Coba nominal salah',path:'main.py → pencatat.baca_nominal() → except ValueError',why:'Titik adalah pemisah, jadi ditolak. Program belum meminta kategori dan data tidak berubah.'},
 {input:['2','25000','Makan'],title:'Catat pengeluaran',path:'main.py → pencatat.baca_nominal() → pencatat.tambah()',why:'Kategori Makan valid. Item keluar ditambahkan setelah pemasukan.'},
 {input:['3'],title:'Lihat saldo',path:'main.py → pencatat.saldo() → tampilan.rupiah()',why:'Penjumlahan berjalan dari 0 ke 150000 lalu 125000. Fungsi hanya membaca data.'},
 {input:['4'],title:'Lihat riwayat',path:'main.py → laporan.riwayat() → tampilan.rupiah()',why:'Dua transaksi ditampilkan sesuai urutan masuk.'},
 {input:['5'],title:'Lihat kategori',path:'main.py → laporan.per_kategori() → tampilan.rupiah()',why:'Hanya pengeluaran masuk ke rekap, sehingga Uang saku dilewati.'},
 {input:['6'],title:'Akhiri sesi',path:'main.py → break',why:'Loop berhenti. Daftar sesi tidak dibawa ke sesi berikutnya.'},
];
const states=demoSteps.reduce<Sim[]>((all,s)=>[...all,s.input.reduce(step,all.at(-1)??init())],[]);
export const trace=demoSteps.map((d,i)=>({...d,before:states[i-1]?.data??[],after:states[i].data,output:states[i].log.slice(i===0?0:(states[i-1].log.length)).filter(v=>!v.includes(menuText)).at(-1)??'Menu 1–6 siap menerima input.'}));
