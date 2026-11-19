"""Validasi, pencatatan, dan perhitungan saldo."""

BATAS_NOMINAL = 999_999_999


def baca_nominal(teks):
    angka = teks.strip(' \t\r\n').lstrip('0')
    if not angka or len(angka) > 9 or not angka.isascii() or not angka.isdecimal():
        raise ValueError('Nominal harus berupa angka 1–999999999 tanpa pemisah.')
    return int(angka)


def tambah(data, jenis, nominal, kategori):
    kategori = kategori.strip(' \t\r\n')
    if (jenis not in ('masuk', 'keluar') or type(nominal) is not int
            or not 1 <= nominal <= BATAS_NOMINAL or not kategori):
        raise ValueError('Jenis, nominal, atau kategori tidak valid.')
    data.append({'jenis': jenis, 'nominal': nominal, 'kategori': kategori})


def saldo(data):
    total = 0
    for item in data:
        if item['jenis'] == 'masuk':
            total += item['nominal']
        else:
            total -= item['nominal']
    return total
