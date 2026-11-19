"""Komponen teks terminal, tanpa mengubah transaksi."""

OPS = ('Catat pemasukan', 'Catat pengeluaran', 'Lihat saldo',
       'Lihat riwayat', 'Laporan kategori', 'Keluar')


def rupiah(nilai):
    return f"{'-' if nilai < 0 else ''}Rp{abs(nilai):,}".replace(',', '.')


def menu():
    print('\n=== PENCATAT KEUANGAN ===')
    for nomor, label in enumerate(OPS, start=1):
        print(f'{nomor}. {label}')
