import {expect,test} from '@playwright/test';

test('desktop: peta, navigasi, kuis, progres dan konfirmasi reset',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('heading',{name:'Belajar Python dari Nol.'})).toBeVisible();
 await expect(page.locator('.chapter-card')).toHaveCount(12);
 await page.getByRole('link',{name:'Mulai Belajar'}).click();
 await expect(page).toHaveURL(/\/mengenal-proyek\//);
 await page.getByRole('button',{name:'A. Isi rekening secara otomatis'}).click();
 await expect(page.getByRole('status')).toHaveText(/Belum tepat.*Program tidak membaca rekening/);
 await page.getByRole('button',{name:'B. Selisih transaksi yang dimasukkan'}).click();
 await expect(page.getByRole('status')).toHaveText(/Tepat\./);
 await page.getByRole('button',{name:'Tandai bab selesai'}).click();
 await page.reload();
 await expect(page.getByRole('button',{name:/Bab selesai/})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('progressbar')).toHaveAttribute('value','1');
 await page.getByRole('link',{name:'Ringkasan Cetak',exact:true}).click();
 await page.getByRole('button',{name:'Reset progres'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('button',{name:'Batal'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('progressbar')).toHaveAttribute('value','1');
 await page.getByRole('button',{name:'Reset progres'}).click();
 await page.getByRole('button',{name:'Ya, reset progres'}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('value','0');
 await page.emulateMedia({media:'print'});
 await expect(page.locator('.sidebar')).toBeHidden();
 await expect(page.getByRole('heading',{name:'Demo dalam satu baris'})).toBeVisible();
});

test('pencarian keyboard, tautan konsep, dan kamus',async({page})=>{
 await page.goto('./');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Lewati ke konten'})).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.locator('main')).toBeFocused();
 await page.keyboard.press('Control+k');
 await expect(page.getByRole('searchbox',{name:'Kata kunci materi'})).toBeFocused();
 await page.getByRole('searchbox').fill('variabel dan tipe data');
 await page.getByRole('link',{name:/Variabel dan tipe data/}).click();
 await expect(page).toHaveURL(/dasar-python\/#konsep-2/);
 await expect(page.locator('#konsep-2')).toHaveAttribute('open','');
 await page.goto('./kamus/');
 await page.getByRole('searchbox',{name:'Cari istilah'}).fill('dictionary');
 await expect(page.locator('dt')).toHaveText(['Dictionary']);
 await page.getByRole('searchbox',{name:'Cari istilah'}).fill('istilahtidakada');
 await expect(page.getByText('Tidak ada istilah yang cocok.',{exact:false})).toBeVisible();
});

test('simulator browser mengirim input dan berakhir tanpa menyimpan data',async({page})=>{
 await page.goto('./simulator/');
 const input=page.locator('#terminal-input');
 for(const text of ['1','150000','2','25.000','2','25000','Makan','3','4','5']){
  await input.fill(text);await input.press('Enter');
 }
 const log=page.getByRole('log');
 await expect(log).toContainText('Input ditolak:');
 await expect(log).toContainText('Saldo: Rp125.000');
 await expect(log).toContainText('Makan: Rp25.000');
 await input.fill('6');await input.press('Enter');
 await expect(input).toBeDisabled();
 await expect(log).toContainText('Sesi selesai. Data tidak disimpan.');
 await page.getByRole('button',{name:'Mulai sesi kosong'}).click();
 await expect(input).toBeFocused();
 await expect(page.getByText('0 transaksi dalam memori.')).toBeVisible();
 await page.getByRole('button',{name:'Muat contoh demo'}).click();
 await expect(log).toContainText('Saldo: Rp125.000');
});

test('jejak data, petunjuk bertahap, dan mode latihan presentasi',async({page})=>{
 await page.goto('./alur/');
 await page.getByRole('button',{name:'4. Catat pengeluaran'}).click();
 await expect(page.locator('.trace-grid pre').first()).not.toContainText('Makan');
 await expect(page.locator('.trace-grid pre').last()).toContainText('Makan');
 await page.getByRole('button',{name:'Berikutnya'}).click();
 await expect(page.locator('.trace-ui .example')).toContainText('Rp125.000');
 await page.goto('./latihan/');
 const drill=page.locator('article.lesson-panel').first();
 await drill.getByText('Petunjuk 1',{exact:true}).click();
 await drill.getByText('Petunjuk 2',{exact:true}).click();
 await drill.getByText('Buka jawaban dan pembahasan',{exact:true}).click();
 await expect(drill.getByText('Saldo: Rp125.000',{exact:true})).toBeVisible();
 await page.goto('./presentasi/');
 await expect(page.locator('.question')).toHaveCount(24);
 await page.getByRole('button',{name:'Mulai mode latihan'}).click();
 await page.locator('.question').first().locator('textarea').fill('Untuk mencatat transaksi.');
 await page.locator('.question').first().getByText('Buka pembahasan').click();
 await expect(page.locator('.question').first().getByText('Alasannya:')).toBeVisible();
});

test('kode bisa diunduh dan disalin',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('./pencatat/');
 const box=page.locator('.code-box').first();
 const py=await page.request.get('./python/pencatat.py');
 expect(py.ok()).toBeTruthy();
 const event=page.waitForEvent('download');
 await box.getByRole('link',{name:'Unduh'}).click();
 expect((await event).suggestedFilename()).toBe('pencatat.py');
 await box.getByRole('button',{name:'Salin'}).click();
 await expect(box.getByRole('status')).toHaveText('Kode tersalin.');
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await py.text());
});

test('mobile: navigasi dialog, tidak ada overflow, dan motion berkurang',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./');
 await expect(page.locator('html')).not.toHaveClass(/lenis/);
 await expect(page.locator('.hero-terminal')).toHaveCSS('transform','none');
 const drawer=page.getByRole('button',{name:'Buka navigasi bab'});
 await drawer.click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('dialog').getByRole('link',{name:'Bedah main.py'}).click();
 await expect(page).toHaveURL(/\/main\//);
 await expect(page.getByRole('heading',{name:'Bedah main.py',exact:true})).toBeVisible();
 for(const route of ['./', './main/', './simulator/', './presentasi/']){
  await page.goto(route);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
});

test('motion: Lenis aktif hanya tanpa preferensi reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('./');
 await expect(page.locator('html')).toHaveClass(/\blenis\b/);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

test('tanpa JavaScript: landing, bab, jejak data, dan fallback simulator',async({browser,baseURL})=>{
 const ctx=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await ctx.newPage();
 await page.goto('./');
 await expect(page.getByRole('heading',{name:'Belajar Python dari Nol.'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Buka navigasi bab'})).toBeHidden();
 await page.getByRole('link',{name:'Mulai Belajar'}).click();
 await expect(page.getByRole('heading',{name:'Mengenal Proyek',exact:true})).toBeVisible();
 await page.goto('./alur/');
 await page.getByText('4. Catat pengeluaran',{exact:true}).click();
 await expect(page.locator('noscript p').filter({hasText:'Kategori Makan valid.'})).toBeVisible();
 await page.goto('./simulator/');
 await expect(page.locator('noscript p').filter({hasText:'Simulator memerlukan JavaScript.'})).toBeVisible();
 await expect(page.getByText('Saldo: Rp125.000',{exact:true})).toBeVisible();
 await ctx.close();
});

test('aksesibilitas otomatis: beranda, kode, simulator dan presentasi',async({page})=>{
 const {AxeBuilder}=await import('@axe-core/playwright');
 for(const route of ['./','./pencatat/','./simulator/','./presentasi/']){
  await page.goto(route);
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(scan.violations.map(({id,nodes})=>({id,targets:nodes.map(n=>n.target)})),route).toEqual([]);
 }
});
