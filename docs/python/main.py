"""Jalankan dengan python main.py dari folder ini."""

from pencatat import baca_nominal, tambah, saldo
from laporan import riwayat, per_kategori
from tampilan import menu, rupiah


def main():
    data = []
    while True:
        menu()
        pilihan = input('Pilih menu [1–6]: ').strip(' \t\r\n')
        if pilihan in ('1', '2'):
            jenis = 'masuk' if pilihan == '1' else 'keluar'
            try:
                nominal = baca_nominal(input('Nominal (Rp): '))
                kategori = 'Uang saku' if jenis == 'masuk' else input('Kategori: ')
                tambah(data, jenis, nominal, kategori)
                print('Transaksi tersimpan.')
            except ValueError as error:
                print(f'Input ditolak: {error}')
        elif pilihan == '3':
            print(f'Saldo: {rupiah(saldo(data))}')
        elif pilihan == '4':
            print(riwayat(data))
        elif pilihan == '5':
            print(per_kategori(data))
        elif pilihan == '6':
            print('Sesi selesai. Data tidak disimpan.')
            break
        else:
            print('Pilihan tidak dikenal. Pilih 1–6.')


if __name__ == '__main__':
    try:
        main()
    except (EOFError, KeyboardInterrupt):
        print('\nSesi dihentikan. Data tidak disimpan.')
