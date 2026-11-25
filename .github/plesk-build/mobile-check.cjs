const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const origin = process.argv[2];
const story = '/aktivitas/gbqn-xi-2026-tilawah-karya-ilmiah-1269-peserta-di-malang';
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function expectCount(locator, expected) {
  for (let i = 0; i < 120; i++) {
    if (await locator.count() === expected) return;
    await pause(100);
  }
  assert.equal(await locator.count(), expected);
}
async function open(page, path) {
  const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
}
async function fresh(browser, name, test) {
  const context = await browser.newContext({viewport: {width:Number(process.env.MOBILE_WIDTH||390),height:844},
    screen:{width:Number(process.env.MOBILE_WIDTH||390),height:844}, deviceScaleFactor:2, isMobile:true,hasTouch:true,
    serviceWorkers:'block',locale:'id-ID',userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36'});
  try {
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.setCacheDisabled', {cacheDisabled:true});
    page.setDefaultTimeout(22000);
    const actions = [], errors = [];
    const archiveReads = [];
    page.on("response", response => { if (response.url().includes("/api/arsip/")) archiveReads.push([response.status(), response.url().slice(origin.length)]); });
    page.on('request', req => {
      if(req.method() === 'POST' && req.url().startsWith(origin)) actions.push(new URL(req.url()).pathname);
    });
    page.on('pageerror', err => errors.push(err.message));
    let result;
    try {
      result = await test(page);
    } catch (error) {
      console.error("Diagnostic", name, page.url(), archiveReads, {
        status: await page.locator("[aria-live=polite]").allTextContents(),
        search: await page.locator("input").evaluateAll(els => els.map(el => ({value:el.value,placeholder:el.placeholder}))),
        cards: await page.locator("[data-news-card]").count(),
      });
      throw error;
    }
    assert.deepEqual(actions, [], 'Unexpected page POST');
    assert.deepEqual(errors, [], 'Browser errors');
    console.log('PASS',name,JSON.stringify(result));
  } catch(e) {
    process.exitCode = 1;
    console.error('FAIL',name,e.stack);
  } finally { await context.close(); }
}
async function achievements(page) {
  let failPageTwo = false;
  const responses = [];
  page.on('response', res => { const u=new URL(res.url()); if (u.pathname === '/api/arsip/prestasi') responses.push([res.request().method(),u.searchParams.get('search'),u.searchParams.get('page'),res.status()]); });
  await page.route('**/api/arsip/prestasi?**', route => {
    const url = new URL(route.request().url());
    return failPageTwo && url.searchParams.get('page') === '2' ?
      route.fulfill({status:403,contentType:'text/plain',body:'Simulated interruption'}) : route.continue();
  });
  await open(page, '/prestasi');
  await page.getByText('9 prestasi ditemukan', {exact:true}).waitFor();
  const rows=page.locator('[data-result]');
  const show=page.getByRole('button',{name:'Lihat lebih banyak'});
  await show.waitFor(); await expectCount(rows,5);
  failPageTwo=true;
  await show.tap();
  const retry=page.getByRole('button',{name:'Coba muat lagi'});
  await retry.waitFor(); await expectCount(rows,5);
  failPageTwo=false; await retry.tap(); await expectCount(rows,9);
  const titles=(await rows.allTextContents()).map(x=>x.trim());
  assert.equal(new Set(titles).size,9);
  assert(titles.some(x=>x.includes('GBQN UB')) && titles.some(x=>x.includes('UIN Ponorogo')));
  await rows.first().tap(); const dialog=page.getByRole('dialog'); await dialog.waitFor();
  await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
  const search=page.getByPlaceholder('Cari prestasi atau peserta…');
  await search.fill('MYCC'); await page.locator('[aria-live=polite]').filter({hasText:'2 prestasi ditemukan'}).waitFor(); await expectCount(rows,2);
  assert((await rows.allTextContents()).every(x=>x.includes('MYCC')));
  assert(responses.some(([m,s,p,r])=>m==='GET'&&p==='2'&&r===200));
  return {first:5,expanded:titles.length,searchMYCC:2,responses};
}
async function news(page) {
  let fail=false;
  const responses=[];
  page.on('response',res=>{const u=new URL(res.url());if(u.pathname==='/api/arsip/aktivitas')responses.push([res.request().method(),u.searchParams.get('search'),res.status()]);});
  await page.route('**/api/arsip/aktivitas?**',route=> fail && new URL(route.request().url()).searchParams.get('search')?.toLowerCase()==='diklat' ? route.fulfill({status:403,contentType:'text/html',body:'<p>Forbidden</p>'}):route.continue());
  await open(page,'/aktivitas');
  await page.getByText('3 kabar ditemukan',{exact:true}).waitFor();
  const cards=page.locator('[data-news-card]');
  await expectCount(cards,3);
  const search=page.getByPlaceholder('Cari berita atau acara…');
  await search.pressSequentially('GBQN', { delay: 70 });
  await page.locator('[aria-live=polite]').filter({hasText:'1 kabar ditemukan'}).waitFor();
  assert.match(await cards.innerText(),/GBQN|Gebyar Brawijaya/i);
  await cards.getByRole('button').tap();
  const dialog=page.getByRole('dialog');
  await dialog.waitFor();
  assert.equal(await dialog.getByRole('link',{name:/Lihat selengkapnya/}).getAttribute('href'),story);
  await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
  await search.fill('ujitidakadamatch826');
  await page.locator('[aria-live=polite]').filter({hasText:'0 kabar ditemukan'}).waitFor(); await expectCount(cards,0);
  await page.getByText('Belum ada yang cocok.').waitFor();
  fail=true; await search.fill('Diklat');
  await page.getByText('Kabar belum dapat dimuat.',{exact:true}).waitFor();
  assert.equal(await page.locator('[aria-live=polite]').filter({hasText:'0 kabar ditemukan'}).count(),0);
  fail=false; await page.getByRole('button',{name:'Coba lagi',exact:true}).tap();
  await page.locator('[aria-live=polite]').filter({hasText:'1 kabar ditemukan'}).waitFor(); assert.match(await cards.innerText(),/Diklat/i);
  await search.fill(''); await page.getByText('3 kabar ditemukan',{exact:true}).waitFor();
  assert(responses.some(([m,s,r])=>m==='GET'&&s.toLowerCase()==='gbqn'&&r===200));
  return {initial:3,GBQN:1,empty:0,DiklatAfterRetry:1,responses};
}
async function delayedSearchHydration(page) {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route('**/_next/static/chunks/**', async route => {
    if (/\.js$/.test(new URL(route.request().url()).pathname)) await held;
    await route.continue();
  });
  try {
    const navigation = await page.goto(origin + '/aktivitas', {waitUntil:'commit'});
    assert.equal(navigation.status(), 200);
    await page.getByText('3 kabar ditemukan', {exact:true}).waitFor();
    const input = page.getByPlaceholder('Cari berita atau acara…');
    await input.waitFor();
    const locked = !(await input.isEditable());
    // While JS is still in transit, the field must be locked or retain accepted keystrokes.
    if (!locked) {
      await input.pressSequentially('GBQN', {delay:50});
      assert.equal(await input.inputValue(), 'GBQN');
    }
    const response = page.waitForResponse(res => {
      const url = new URL(res.url());
      return res.request().method() === 'GET' && url.pathname === '/api/arsip/aktivitas'
        && url.searchParams.get('search')?.toUpperCase() === 'GBQN' && res.status() === 200;
    }, {timeout:22000});
    release();
    if (locked) {
      await page.waitForFunction(el => !el.disabled && !el.readOnly, await input.elementHandle());
      await input.pressSequentially('GBQN', {delay:50});
    }
    await response;
    await page.locator('[aria-live=polite]').filter({hasText:'1 kabar ditemukan'}).waitFor();
    const cards = page.locator('[data-news-card]');
    await expectCount(cards, 1);
    assert.match(await cards.innerText(), /GBQN|Gebyar Brawijaya/i);
    return {lockedBeforeHydration:locked, search:await input.inputValue(), news:await cards.count()};
  } finally { release(); }
}

async function photos(page,path,simulate) {
  let allowFailure;
  const gate=new Promise(resolve=>{allowFailure=resolve;});
  if(simulate) await page.route('https://cdn.sanity.io/images/**',route=>
    new URL(route.request().url()).searchParams.get('q')==='85'?
      gate.then(()=>route.abort('failed')):route.continue());
  await open(page,path);
  const thumbs=page.getByRole('button',{name:/^Perbesar foto:/});
  const tile=thumbs.first(); await tile.scrollIntoViewIfNeeded();
  const thumb=tile.locator('img');
  await page.waitForFunction(el=>el.complete && el.naturalWidth>0,await thumb.elementHandle());
  await tile.tap();
  const dialog=page.getByRole('dialog',{name:/Dokumentasi/}); await dialog.waitFor();
  try {
    if(simulate) {
      await dialog.getByText('Memuat foto…').waitFor();
      assert(await dialog.locator('img').first().evaluate(el=>el.complete&&el.naturalWidth>0));
      allowFailure();
      await dialog.getByText(/Foto belum dapat dimuat dalam ukuran besar/).waitFor();
      await dialog.getByRole('button',{name:'Coba lagi'}).tap();
    }
    const wanted=simulate?'72':'85';
    await page.waitForFunction(q=>Array.from(document.querySelectorAll('dialog[open] img')).some(el=>el.complete&&el.naturalWidth>0&&new URL(el.currentSrc).searchParams.get('q')===q&&getComputedStyle(el).opacity!=='0'),wanted);
    await dialog.getByRole('status').waitFor({state:'hidden'});
    const img=await dialog.locator('img').last().evaluate(el=>({host:new URL(el.currentSrc).host,width:el.naturalWidth,height:el.naturalHeight}));
    assert.equal(img.host,'cdn.sanity.io');
    await dialog.getByRole('button',{name:'Tutup foto'}).tap(); await dialog.waitFor({state:'hidden'});
    await thumbs.nth(1).tap(); await dialog.waitFor();
    await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
    return {photoButtons:await thumbs.count(),...img,retry:simulate};
  } finally {allowFailure();}
}
async function navigateThroughSite(page) {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route('**/_next/static/chunks/**', async route => {
    if (/\.js$/.test(new URL(route.request().url()).pathname)) await held;
    await route.continue();
  });
  const menu=page.getByRole('button',{name:'Buka menu'});
  try {
    const response = await page.goto(origin + '/', {waitUntil:'commit'});
    assert.equal(response.status(), 200);
    await menu.waitFor();
    assert.equal(await menu.isEnabled(), false, 'The SSR menu should not accept a tap before hydration');
  } finally { release(); }
  // Playwright waits for the visible button to become enabled and taps exactly once.
  await menu.tap();
  await page.getByRole('navigation',{name:'Navigasi utama'}).getByRole('link',{name:/Berita & acara/i}).tap();
  await page.getByText('3 kabar ditemukan',{exact:true}).waitFor();
  await page.getByPlaceholder('Cari berita atau acara…').fill('GbQn');
  await page.locator('[aria-live=polite]').filter({hasText:'1 kabar ditemukan'}).waitFor();
  await page.locator('[data-news-card] button').tap();
  await page.getByRole('dialog').getByRole('link',{name:/Lihat selengkapnya/}).tap();
  await page.waitForURL(origin+story);
  await page.getByRole('button',{name:/^Perbesar foto:/}).first().tap();
  const photo=page.getByRole('dialog',{name:/Dokumentasi/});
  await photo.waitFor();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('dialog[open] img')).some(img=>img.complete&&img.naturalWidth>0&&img.currentSrc.includes('q=85')));
  await photo.getByRole('button',{name:'Tutup foto'}).tap();
  await photo.waitFor({state:'hidden'});
  await menu.tap();
  await page.getByRole('navigation',{name:'Navigasi utama'}).getByRole('link',{name:/Prestasi/i}).tap();
  await page.getByText('9 prestasi ditemukan',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Lihat lebih banyak'}).tap();
  await expectCount(page.locator('[data-result]'),9);
  return {homeToNews:true, searchToStory:true,photoVisible:true,menuToAchievements:9};
}
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true});
  try {
    await fresh(browser,'berita',news);
    await fresh(browser,'pencarian saat JS terlambat',delayedSearchHydration);
    await fresh(browser,'prestasi',achievements);
    await fresh(browser,'foto bidang',p=>photos(p,'/tentang/bidang/syarhil-quran',false));
    await fresh(browser,'foto berita',p=>photos(p,story,true));
    await fresh(browser,'navigasi',navigateThroughSite);
  } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
