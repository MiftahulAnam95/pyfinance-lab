import os
import subprocess
import sys
import unittest
from pathlib import Path

sys.dont_write_bytecode = True
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'

BASE = Path(__file__).resolve().parents[1] / 'public' / 'python'
sys.path.insert(0, str(BASE))
from pencatat import baca_nominal, saldo, tambah
from laporan import per_kategori, riwayat
from tampilan import rupiah

class KeuanganTest(unittest.TestCase):
    def cli(self, *args):
        return subprocess.run([sys.executable, 'main.py'], cwd=BASE,
                              input='\n'.join(args) + '\n' if args else '',
                              capture_output=True, text=True, check=True).stdout

    def test_demo(self):
        out = self.cli('1','150000','2','25.000','2','25000','Makan','3','4','5','6')
        for expected in ('Input ditolak: Nominal harus', 'Saldo: Rp125.000',
                         '1. Uang saku | +Rp150.000\n2. Makan | -Rp25.000',
                         'Makan: Rp25.000', 'Sesi selesai. Data tidak disimpan.'):
            self.assertIn(expected, out)
        self.assertEqual(out.count('Transaksi tersimpan.'), 2)

    def test_zero_and_no_data(self):
        out = self.cli('3','4','5','6')
        for expected in ('Saldo: Rp0', 'Belum ada transaksi.', 'Belum ada pengeluaran.'):
            self.assertIn(expected, out)

    def test_input_nominal(self):
        for bad in ('', '0', '000', '-1', '+1', '1_000', '1.000', '１', '٩', '1000000000', '  ', '2 500'):
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                baca_nominal(bad)
        self.assertEqual(baca_nominal(' 0025000\t'), 25000)
        self.assertEqual(baca_nominal('999999999'), 999999999)
        self.assertEqual(baca_nominal('1'), 1)

    def test_mutation_invalid(self):
        data = []
        for bad in [('lain', 1, 'A'), ('keluar', 1999999999, 'A'), ('masuk', True, 'A'), ('keluar', 1, '  '), ('keluar', 1.5, 'A')]:
            with self.assertRaises(ValueError):
                tambah(data, *bad)
        self.assertEqual(data, [])
        out = self.cli('03','2','1','   ','3','6')
        self.assertIn('Pilihan tidak dikenal.', out)
        self.assertIn('Input ditolak: Jenis, nominal, atau kategori tidak valid.', out)
        self.assertIn('Saldo: Rp0', out)

    def test_report_read_only_and_negative(self):
        d = []
        tambah(d, 'keluar', 25000, ' Makan ')
        tambah(d, 'keluar', 10000, 'Makan')
        tambah(d, 'keluar', 5000, 'makan')
        old = [x.copy() for x in d]
        self.assertEqual(rupiah(saldo(d)), '-Rp40.000')
        self.assertEqual(per_kategori(d), 'Makan: Rp35.000\nmakan: Rp5.000')
        self.assertTrue(riwayat(d).endswith('3. makan | -Rp5.000'))
        self.assertEqual(d, old)
        self.assertIn('Sesi dihentikan. Data tidak disimpan.', self.cli())

if __name__ == '__main__':
    unittest.main()
