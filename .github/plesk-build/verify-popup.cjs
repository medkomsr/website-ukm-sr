const {chromium} = require("playwright-core");
const assert = require("node:assert/strict");

async function verify(browser, mobile) {
  const viewport = mobile ? {width:390,height:844} : {width:1280,height:800};
  const context = await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,reducedMotion:"reduce"});
  try {
    const page = await context.newPage();
    const origin = process.argv[2];
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.setDefaultTimeout(30000);
    await page.goto(origin + "/prestasi", {waitUntil:"domcontentloaded"});
    await page.getByText("12 prestasi ditemukan",{exact:true}).waitFor();
    const rows = page.locator("[data-result]");
    const count = expected => page.waitForFunction(n => document.querySelectorAll("[data-result]").length === n, expected);
    await count(mobile ? 5 : 9);
    let dimensions;
    for (const [title,fit,asset] of [
      ["GBQN UB – MSQ","cover","f9f2545dc0d9b87dcdc65271abc1d5aa7d39d288"],
      ["Gebyar Tafsir ISQI – MSQ","contain","bc360a5330db597b70eb8b933852f7f96b87852c"]
    ]) {
      const row = page.getByRole("button",{name:"Lihat prestasi: " + title,exact:true});
      await row.click();
      const detail = page.getByRole("dialog",{name:title,exact:true});
      const zoom = detail.getByRole("button",{name:"Lihat foto utuh"});
      const img = zoom.locator("img");
      await img.evaluate(image => image.decode());
      const value = await img.evaluate(image => {
        const size = el => [el.clientWidth,el.clientHeight];
        return {modal:size(image.closest("dialog").firstElementChild), frame:size(image.parentElement),fit:getComputedStyle(image).objectFit,src:decodeURIComponent(image.currentSrc)};
      });
      assert(value.src.includes(asset), title + " asset");
      assert.equal(value.fit,fit);
      assert(Math.abs(value.frame[0]/value.frame[1] - 1.5) < .01);
      const geometry=[value.modal,value.frame];
      if (dimensions) assert.deepEqual(geometry,dimensions);
      dimensions=geometry;
      await zoom.click();
      const back = page.getByRole("button",{name:"Kembali ke detail"});
      await back.waitFor();
      const full = page.locator("dialog[open]").filter({has:back}).locator("img");
      await full.evaluate(image=>image.decode());
      assert.equal(await full.evaluate(image=>getComputedStyle(image).objectFit),"contain");
      await back.click();
      await detail.getByRole("button",{name:"Tutup detail prestasi"}).click();
      await detail.waitFor({state:"hidden"});
    }
    const missing = "GSRA UNAIR – Banjari";
    const fallbackPath = "/prestasi-placeholder.png";
    await page.getByRole("button", {name:"Lihat prestasi: " + missing, exact:true}).click();
    const details = page.getByRole("dialog",{name:missing,exact:true});
    const fallback = details.getByRole("img",{name:"Foto prestasi belum tersedia"});
    await fallback.evaluate(img => img.decode());
    assert.equal(await fallback.evaluate(img => new URL(img.currentSrc).pathname),fallbackPath);
    assert.equal(await details.getByRole("button",{name:"Lihat foto utuh"}).count(),0);
    await details.getByRole("button",{name:"Tutup detail prestasi"}).click();
    await details.waitFor({state:"hidden"});
    let number=mobile? 5 : 9;
    while (number < 12) {
      await page.getByRole("button",{name:mobile ? "Lihat lebih banyak" : "Berikutnya"}).click();
      number=mobile ? Math.min(number+5,12) : 12;
      await count(mobile ? number : 3);
    }
    assert((await rows.allInnerTexts()).some(text=>text.includes("Gebyar Tafsir IV ISQI")));
    await page.goto(origin + "/#publications", {waitUntil:"domcontentloaded"});
    const cards = page.locator("[data-award]");
    await cards.first().waitFor({state:"attached"});
    const card = cards.filter({hasText:missing});
    await card.waitFor({state:"attached"});
    for (let i=0; i<await cards.count() && await card.getAttribute("aria-hidden") === "true"; i++) {
      await page.getByRole("button",{name:"Prestasi berikutnya",exact:true}).click();
    }
    assert.equal(await card.getAttribute("aria-hidden"),"false");
    const cover = card.locator("img");
    await cover.scrollIntoViewIfNeeded();
    await cover.evaluate(img => img.decode());
    assert.equal(await cover.evaluate(img => new URL(img.currentSrc).pathname),fallbackPath);
    assert.deepEqual(errors,[]);
    console.log("PASS",viewport, "popup and homepage fallback, original photos preserved, photo and modal bounds",dimensions, "all 12 results accessible.");
  } finally {await context.close();}
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN});
  try {for (const mobile of [true,false]) await verify(browser,mobile);}
  finally {await browser.close();}
})().catch(error=>{console.error(error); process.exitCode=1;});
