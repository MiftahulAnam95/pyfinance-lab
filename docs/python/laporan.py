"""Buat laporan teks dari daftar transaksi."""

from tampilan import rupiah


def riwayat(data):
    hasil = []
    for nomor, item in enumerate(data, start=1):
        tanda = '+' if item['jenis'] == 'masuk' else '-'
        hasil.append(f"{nomor}. {item['kategori']} | {tanda}{rupiah(item['nominal'])}")
    return '\n'.join(hasil) or 'Belum ada transaksi.'


def per_kategori(data):
    total = {}
    for item in data:
        if item['jenis'] == 'keluar':
            nama = item['kategori']
            total[nama] = total.get(nama, 0) + item['nominal']
    return '\n'.join(f'{nama}: {rupiah(n)}' for nama, n in total.items()) or 'Belum ada pengeluaran.'
