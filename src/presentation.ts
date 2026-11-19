export const scripts = [
 ['±30 detik',[
 'Pengeluaran kecil sering terlupa. Karena itu kami membuat pencatat keuangan di terminal agar mahasiswa bisa mencatat uang masuk dan keluar serta melihat sisanya. Sebagai contoh, dari uang saku Rp150.000 setelah makan Rp25.000, saldo tercatat Rp125.000. Empat file membagi pekerjaan antara menu, pencatatan, laporan, dan tampilan. Versi ini hanya menyimpan data selama sesi.'
 ]],
 ['±2 menit',[
 'Pembukaan: “Pernah merasa uang saku cepat habis padahal tidak ingat belanja apa saja? Kami mulai dari masalah itu. Tujuan proyek ini bukan membaca rekening, tetapi membantu mencatat transaksi yang kita masukkan sendiri.”',
 'Cara kerja: “Pengguna memilih menu dan mengetik nominal bulat. Program menolak titik ribuan saat input, tetapi menambahkan titik ketika menampilkan angka. Untuk pengeluaran, kita menuliskan kategori seperti Makan. Setiap catatan masuk ke sebuah daftar yang tetap tersedia selama menu diulang.”',
 'Demo: “Saya pilih 1 lalu ketik 150000. Berikutnya saya pilih 2, ketik 25000 dan Makan. Pada pilihan 3, saldo adalah Rp125.000. Menu 4 menunjukkan dua catatan; menu 5 hanya menampilkan pengeluaran Makan sebesar Rp25.000.”',
 'Penutup: “main mengatur pilihan, pencatat memvalidasi dan menghitung, laporan merangkum, dan tampilan menyeragamkan format. Saat keluar, data tidak disimpan. Penyimpanan ke file bisa menjadi tahap selanjutnya. Silakan bertanya tentang bagian yang ingin ditelusuri.”'
 ]],
 ['±5 menit',[
 '0:00–0:45 · Pembukaan. “Bayangkan pada awal minggu kita menerima Rp150.000 untuk kebutuhan kuliah. Setelah membeli makan, kita tahu uang berkurang, tetapi beberapa hari kemudian mungkin lupa berapa. Kalau mencatat saat transaksi terjadi, kita bisa mengecek kembali apa yang kita catat.” Terangkan bahwa demo memakai data contoh, bukan data rekening sungguhan.',
 '0:45–1:30 · Solusi. “Terminal adalah jendela teks. Program menampilkan enam pilihan: mencatat masuk, mencatat keluar, melihat saldo, melihat riwayat, melihat kategori, dan keluar. Nominal harus bilangan Rupiah positif tanpa pemisah; kategori pengeluaran tidak boleh kosong.” Tunjukkan titik beda antara input 25000 dan format Rp25.000.',
 '1:30–2:20 · Cara kerja. “Kita mulai dengan list kosong. Setiap transaksi adalah dictionary: tiga kolom bernama jenis, nominal, dan kategori. main memanggil modul pencatat untuk menambah satu item. Saldo tidak dicatat terpisah; dihitung dari daftar. Laporan membaca daftar yang sama tanpa menghapusnya. tampilan mengerjakan format, bukan matematika.” Tunjuk file sesuai perannya sambil memperlihatkan list sebelum dan sesudah append.',
 '2:20–3:50 · Demo. Jalankan python3 main.py. Catat uang saku 150000 lewat menu 1. Di menu 2, masukkan 25.000 dan jelaskan penolakan sebelum kategori ditanya. Pilih 2 lagi, masukkan 25000 lalu Makan. Tampilkan menu 3 dan hitung keras-keras 150.000 dikurangi 25.000. Tampilkan 4 dan 5; tunjukkan dua baris riwayat tetapi hanya satu kategori biaya. Pilih 6 dan baca pesan penutupan.',
 '3:50–4:35 · Refleksi. “Memisahkan file membuat tiap tugas lebih mudah diuji. Misalnya, saldo data kosong harus nol. Kelemahannya: catatan hilang setelah keluar, kategori membedakan huruf besar/kecil, dan tidak ada koreksi atau penghapusan transaksi. Ini prototipe belajar, bukan pengganti aplikasi bank. Perbaikan pertama kami adalah memuat dan menyimpan daftar dalam JSON, dengan validasi format dan penanganan file rusak.”',
 '4:35–5:00 · Kesimpulan. “Data yang benar masuk, fungsi mengolah, lalu hasil ditampilkan. Kita bisa menjelaskan setiap angka pada demo dari daftar yang kecil.” Undang tanya jawab; sesuaikan pembagian waktu dengan ketentuan dosen dan kecepatan berbicara.'
 ]],
] as const;
export const questions=[
 ['Masalah apa yang diselesaikan?','Membantu mahasiswa mengingat transaksi dan menghitung saldo dari catatan.','Riwayat bisa diperiksa kembali, tetapi program tidak punya akses ke rekening.'],
 ['Mengapa menggunakan terminal?','Supaya fokus belajar pada data, kondisi, dan fungsi sebelum membuat antarmuka grafis.','input dan print sudah cukup untuk interaksi pada implementasi ini.'],
 ['Apa beda input, proses, output?','Input misalnya 25000, proses validasi dan hitung, output misalnya Saldo: Rp125.000.','Ketiganya adalah peran berbeda pada satu alur data.'],
 ['Apa tugas main.py?','Menerima pilihan, memanggil fungsi, dan mengulang menu sampai keluar.','main mengatur urutan kerja, bukan menyimpan aturan format.'],
 ['Apa tugas pencatat.py?','Memeriksa nominal/transaksi, menambah item, dan menghitung saldo.','Fungsi baca_nominal, tambah, dan saldo masing-masing mengerjakan hal itu.'],
 ['Apa tugas laporan.py?','Menghasilkan teks riwayat dan pengelompokan biaya.','Riwayat membaca semua item; kategori melihat pengeluaran saja.'],
 ['Apa tugas tampilan.py?','Mencetak menu dan mengubah bilangan ke teks Rupiah.','Fungsi ini tidak mengubah list transaksi.'],
 ['Mengapa list dan dictionary?','List menjaga urutan catatan; dictionary memberi nama bidang per catatan.','Dengan demikian data[0] bermakna transaksi pertama, dan kunci nominal bermakna nilainya.'],
 ['Mengapa tidak memakai float?','Rupiah dimodelkan sebagai bilangan bulat.','Tidak dibutuhkan pecahan dan int menghindari pembulatan float.'],
 ['Dari mana Rp125.000 berasal?','150000 dikurangi 25000.','Fungsi saldo mulai dari nol, menambah pemasukan, dan mengurangi pengeluaran.'],
 ['Bolehkah saldo negatif?','Boleh.','Tidak ada aturan menolak transaksi yang lebih besar dari saldo.'],
 ['Apa yang terjadi pada nominal 25.000?','Ditolak sebelum kategori diminta.','Validasi menerima digit ASCII, bukan titik, dan ValueError ditangkap oleh main.'],
 ['Berapa batas nominal satu transaksi?','1 sampai 999999999 Rupiah.','Setelah membuang nol depan, maksimum sembilan digit; tambah memeriksa rentang ulang.'],
 ['Apa yang terjadi pada kategori kosong?','Ditolak, lalu kembali ke menu.','Kategori dibersihkan pada tepi sebelum dicek; append belum berlangsung.'],
 ['Apakah Makan sama dengan makan?','Tidak pada versi ini.','Dictionary memakai nama asli sebagai kunci dan membedakan kapitalisasi.'],
 ['Bagaimana dua biaya Makan digabung?','Tambah nominal baru ke total yang sudah ada.','get(nama, 0) menyediakan dasar 0 untuk kategori baru.'],
 ['Mengapa while True tidak berjalan selamanya?','Pilihan 6 mencapai break.','break memutus loop terdekat, lalu fungsi selesai.'],
 ['Apa gunanya penjaga __name__?','Memulai terminal hanya jika file dijalankan langsung.','Saat impor nama modul bukan __main__, jadi menu tidak berjalan.'],
 ['Apakah laporan mengubah daftar?','Tidak.','riwayat membangun list teks; per_kategori memakai dictionary lokal.'],
 ['Bagaimana menguji kasus tepi?','Cek list kosong, batas nominal, saldo negatif, dan kategori kosong.','Masing-masing menguji kondisi yang tidak terlihat di demo normal.'],
 ['Berapa biaya waktu menghitung ulang saldo?','Linear terhadap jumlah transaksi (O(n)).','Satu kali kunjungan untuk tiap item; cocok untuk data sesi kecil.'],
 ['Apakah data bertahan saat program ditutup?','Tidak.','List dibuat saat main mulai dan tidak ditulis ke penyimpanan.'],
 ['Apa pengembangan pertama yang masuk akal?','Simpan ke JSON lalu muat kembali saat mulai.','JSON dapat merepresentasikan list/dictionary; perlu validasi, penanganan file hilang/rusak, dan aturan kapan menyimpan.'],
 ['Apakah simulator menjalankan Python?','Tidak; ia meniru menu dan aturan menggunakan JavaScript.','Eksekusi Python sebenarnya terjadi saat interpreter lokal menjalankan main.py.'],
] as const;
