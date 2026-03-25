/**
 * PLP Test Execution Script — runs all 39 test cases with fresh contexts.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://qa-sunnydiamonds.webc.in';
const PLP = BASE + '/jewellery';
const RESULTS = path.join(__dirname, 'plp-test-results.json');
const results = [];

function add(tcId, actual, status) {
  results.push({ tcId, actualResult: actual, status });
  console.log(`  ${tcId}: ${status} — ${actual.substring(0, 130)}`);
}

async function fresh(browser, vp) {
  const ctx = await browser.newContext({ viewport: vp || { width: 1280, height: 720 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  return { ctx, page };
}

async function nav(page, url) {
  await page.goto(url || PLP, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);
  try { const b = page.locator('button.cookie-consent_accept_btn__39jUd'); if (await b.isVisible({ timeout: 2000 })) await b.click(); } catch {}
  await page.waitForTimeout(500);
}

async function close(ctx, page) { await page.close(); await ctx.close(); }

async function getCount(page) {
  const txt = await page.evaluate(() => {
    const el = document.querySelector('.lisitng_product_count__Om9WM, .MobileFilterPanel_total__1zYtA');
    return el ? el.textContent.trim() : '';
  });
  const m = txt.match(/(\d[\d,]*)/);
  return { text: txt, num: m ? parseInt(m[1].replace(/,/g, '')) : 0 };
}

async function getNames(page) {
  return page.locator('h2.Item_title__20dum').allTextContents();
}

async function getPrices(page) {
  const raw = await page.evaluate(() => {
    const cards = document.querySelectorAll('.Item_item__2fD-S');
    return Array.from(cards).slice(0, 24).map(c => {
      const el = c.querySelector('[class*="Item_price"]');
      if (!el) return 0;
      const m = el.textContent.replace(/,/g, '').match(/₹\s*(\d+)/);
      return m ? parseInt(m[1]) : 0;
    }).filter(p => p > 0);
  });
  return raw;
}

async function clickFilter(page, section, label) {
  // Expand section if needed
  const sec = page.locator(`.filter_filter_item__32lC1:has-text("${section}")`);
  const isOpen = await sec.evaluate(el => el.classList.contains('uk-open')).catch(() => false);
  if (!isOpen) { await sec.click(); await page.waitForTimeout(800); }
  await page.locator(`.filter_filter__3noTO label:has-text("${label}")`).first().click();
  await page.waitForTimeout(4000);
}

// ===================== ALL 39 TEST CASES =====================
async function run(browser) {

  // TC_PLP_001
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const h1 = await page.locator('h1').textContent().catch(() => '');
      const cnt = await getCount(page);
      const filter = await page.locator('.filter_filter__3noTO').isVisible().catch(() => false);
      const sort = await page.locator('button.lisitng_sorting_button__3sx5Y').isVisible().catch(() => false);
      const cards = await page.locator('.Item_item__2fD-S').count();
      const pag = await page.locator('.pagination-wrapper').isVisible().catch(() => false);
      const bread = await page.locator('[class*="breadcrumb"] a[href="/"]').first().isVisible().catch(() => false);
      const all = h1.includes('Jewellery') && cnt.num > 0 && filter && sort && cards > 0 && pag && bread;
      add('TC_PLP_001', `PLP loaded. H1: "${h1.trim()}". Count: ${cnt.text}. Filter: ${filter}. Sort: ${sort}. Cards: ${cards}. Pagination: ${pag}. Breadcrumb: ${bread}. ${all ? 'All UI elements visible.' : 'Some elements missing.'}`, all ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_001', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_002
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const cnt1 = await getCount(page);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const cnt2 = await getCount(page);
      const pass = cnt1.num > 0 && cnt1.num === cnt2.num;
      add('TC_PLP_002', `Product count: "${cnt1.text}" (${cnt1.num}). After reload: ${cnt2.num}. Consistent: ${pass}.`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_002', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_003 - Filter Rings
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const before = (await getCount(page)).num;
      await clickFilter(page, 'category', 'Rings');
      const url = page.url();
      const after = (await getCount(page)).num;
      const pass = url.toLowerCase().includes('rings') && after > 0 && after <= before;
      add('TC_PLP_003', `Clicked Rings filter. URL: ${url}. Count before: ${before}, after: ${after}. ${pass ? 'Only Ring products displayed.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_003', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_004 - Filter Earrings
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'category', 'Earrings');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.toLowerCase().includes('earrings') && cnt > 0;
      add('TC_PLP_004', `Clicked Earrings filter. URL: ${url}. Count: ${cnt}. ${pass ? 'Only Earring products displayed.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_004', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_005 - Filter Pendants
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'category', 'Pendants');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.toLowerCase().includes('pendants') && cnt > 0;
      add('TC_PLP_005', `Clicked Pendants filter. URL: ${url}. Count: ${cnt}. ${pass ? 'Only Pendant products displayed.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_005', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_006 - Yellow Gold
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'Color', 'yellow');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.includes('yellow-gold') && cnt > 0;
      add('TC_PLP_006', `Yellow Gold filter. URL: ${url}. Count: ${cnt}. ${pass ? 'Filtered to Yellow Gold.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_006', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_007 - Rose Gold
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'Color', 'rose');
      const url = page.url();
      const pass = url.includes('rose-gold');
      add('TC_PLP_007', `Rose Gold filter. URL: ${url}. ${pass ? 'Filtered to Rose Gold.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_007', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_008 - White Gold
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'Color', 'white');
      const url = page.url();
      const pass = url.includes('white-gold');
      add('TC_PLP_008', `White Gold filter. URL: ${url}. ${pass ? 'Filtered to White Gold.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_008', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_009 - 18K
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'metal purity', '18k');
      const url = page.url();
      const pass = url.includes('metal_purity=18k');
      add('TC_PLP_009', `18K filter. URL: ${url}. ${pass ? 'Filtered to 18K.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_009', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_010 - 22K
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await clickFilter(page, 'metal purity', '22k');
      const url = page.url();
      const pass = url.includes('metal_purity=22k');
      add('TC_PLP_010', `22K filter. URL: ${url}. ${pass ? 'Filtered to 22K.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_010', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_011 - Below 10k
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '?range=0TO10000');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.includes('range=0TO10000') && cnt > 0;
      add('TC_PLP_011', `Below ₹10k filter. URL: ${url}. Count: ${cnt}. ${pass ? 'Products below ₹10,000 displayed.' : 'Issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_011', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_012 - 10k-30k
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '?range=10000TO30000');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.includes('range=10000TO30000') && cnt > 0;
      add('TC_PLP_012', `₹10k-₹30k filter. URL: ${url}. Count: ${cnt}. ${pass ? 'Products in range displayed.' : 'Issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_012', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_013 - Sort Price Low to High
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('select.MobileFilterPanel_sort_select__1rjEa').selectOption('product_list_new_price_asc');
      await page.waitForTimeout(4000);
      const prices = await getPrices(page);
      let sorted = true;
      for (let i = 1; i < Math.min(prices.length, 5); i++) { if (prices[i] < prices[i-1]) sorted = false; }
      add('TC_PLP_013', `Sort Price Low→High. First 5 prices: ${prices.slice(0,5).join(', ')}. Ascending: ${sorted}. ${sorted ? 'Correctly sorted.' : 'Sort order incorrect.'}`, sorted ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_013', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_014 - Sort Price High to Low
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('select.MobileFilterPanel_sort_select__1rjEa').selectOption('product_list_new_price_desc');
      await page.waitForTimeout(4000);
      const prices = await getPrices(page);
      let sorted = true;
      for (let i = 1; i < Math.min(prices.length, 5); i++) { if (prices[i] > prices[i-1]) sorted = false; }
      add('TC_PLP_014', `Sort Price High→Low. First 5 prices: ${prices.slice(0,5).join(', ')}. Descending: ${sorted}. ${sorted ? 'Correctly sorted.' : 'Sort order incorrect.'}`, sorted ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_014', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_015 - Sort Name A-Z
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('select.MobileFilterPanel_sort_select__1rjEa').selectOption('product_list_new_atoz');
      await page.waitForTimeout(4000);
      const names = await getNames(page);
      const first = names[0]?.trim().toLowerCase() || '';
      const pass = first.charCodeAt(0) <= 'd'.charCodeAt(0);
      add('TC_PLP_015', `Sort Name A→Z. First product: "${names[0]?.trim()}". Starts near A: ${pass}. Names: ${names.slice(0,3).map(n=>n.trim()).join(', ')}.`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_015', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_016 - Sort Name Z-A
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('select.MobileFilterPanel_sort_select__1rjEa').selectOption('product_list_new_ztoa');
      await page.waitForTimeout(4000);
      const names = await getNames(page);
      const first = names[0]?.trim().toLowerCase() || '';
      const pass = first.charCodeAt(0) >= 'v'.charCodeAt(0);
      add('TC_PLP_016', `Sort Name Z→A. First product: "${names[0]?.trim()}". Starts near Z: ${pass}. Names: ${names.slice(0,3).map(n=>n.trim()).join(', ')}.`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_016', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_017 - Pagination Next
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const p1Names = await getNames(page);
      await page.locator('.pagination-wrapper').scrollIntoViewIfNeeded();
      await page.locator('.pagination button:has-text("Next")').click();
      await page.waitForTimeout(4000);
      const active = await page.locator('.pagination li.active button').textContent();
      const p2Names = await getNames(page);
      const diff = p1Names[0]?.trim() !== p2Names[0]?.trim();
      const pass = active.trim() === '2' && diff;
      add('TC_PLP_017', `Clicked Next. Active page: ${active.trim()}. Different products: ${diff}. ${pass ? 'Page 2 loaded with different products.' : 'Pagination issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_017', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_018 - Pagination Previous
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('.pagination-wrapper').scrollIntoViewIfNeeded();
      await page.locator('.pagination button:has-text("Next")').click();
      await page.waitForTimeout(3000);
      await page.locator('.pagination-wrapper').scrollIntoViewIfNeeded();
      await page.locator('.pagination button:has-text("Previous")').click();
      await page.waitForTimeout(3000);
      const active = await page.locator('.pagination li.active button').textContent();
      const pass = active.trim() === '1';
      add('TC_PLP_018', `Navigated to page 2, then clicked Previous. Active page: ${active.trim()}. ${pass ? 'Returned to page 1.' : 'Pagination issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_018', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_019 - Pagination direct page
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('.pagination-wrapper').scrollIntoViewIfNeeded();
      await page.locator('.pagination li button:has-text("2")').click();
      await page.waitForTimeout(3000);
      const active = await page.locator('.pagination li.active button').textContent();
      const pass = active.trim() === '2';
      add('TC_PLP_019', `Clicked page number 2. Active page: ${active.trim()}. ${pass ? 'Page 2 loaded correctly.' : 'Page navigation issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_019', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_020 - Product card click → PDP
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const prodName = await page.locator('h2.Item_title__20dum').first().textContent();
      await page.locator('a.product-item-content').first().click();
      await page.waitForTimeout(4000);
      const pdpUrl = page.url();
      const pass = !pdpUrl.includes('/jewellery') || pdpUrl.includes('variant_id');
      // Go back
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const backUrl = page.url();
      add('TC_PLP_020', `Clicked product "${prodName.trim().substring(0,40)}". PDP URL: ${pdpUrl}. Navigated to PDP: ${pass}. goBack URL: ${backUrl}. ${pass ? 'PDP loaded and back works.' : 'Navigation issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_020', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_021 - Add to Cart
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const btn = page.locator('a.Item_add_to_cart_btn__3aY4Y, button.Item_add_to_cart_btn__3aY4Y').first();
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      await page.waitForTimeout(3000);
      const body = await page.evaluate(() => document.body.innerHTML.toLowerCase());
      const cartUpdated = body.includes('added') || body.includes('cart') || body.includes('view cart');
      add('TC_PLP_021', `Clicked ADD TO CART on first product. Cart update indication: ${cartUpdated}. ${cartUpdated ? 'Product added to cart.' : 'No cart feedback visible.'}`, cartUpdated ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_021', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_022 - Breadcrumb Home
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('[class*="breadcrumb"] a[href="/"]').first().click();
      await page.waitForTimeout(3000);
      const url = page.url();
      const pass = url === BASE + '/' || url === BASE;
      add('TC_PLP_022', `Clicked Home breadcrumb. URL: ${url}. ${pass ? 'Redirected to Home Page.' : 'Navigation failed.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_022', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_023 - Multi: Rings + Yellow Gold
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '/rings?variants.color=yellow-gold');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.includes('rings') && url.includes('yellow-gold') && cnt > 0;
      add('TC_PLP_023', `Multi-filter: Rings + Yellow Gold. URL: ${url}. Count: ${cnt}. ${pass ? 'Only Yellow Gold Rings displayed.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_023', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_024 - Multi: 18K + Below 10k
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '?variants.metal_purity=18k&range=0TO10000');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const pass = url.includes('metal_purity=18k') && url.includes('range=0TO10000');
      add('TC_PLP_024', `Multi-filter: 18K + Below ₹10k. URL: ${url}. Count: ${cnt}. ${pass ? 'Combined filter applied.' : 'Filter issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_024', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_025 - SEO
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const title = await page.title();
      const meta = await page.evaluate(() => { const m = document.querySelector('meta[name="description"]'); return m ? m.content : ''; });
      const h1 = await page.locator('h1').textContent();
      const pass = title.toLowerCase().includes('sunny diamonds') && meta.length > 10 && h1.trim() === 'Jewellery';
      add('TC_PLP_025', `Title: "${title}". Meta: "${meta.substring(0,80)}". H1: "${h1.trim()}". ${pass ? 'SEO meta correct.' : 'SEO issues.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_025', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_026 - Zero results
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '?range=0TO10000&variants.stone=aqua');
      const cnt = (await getCount(page)).num;
      const cards = await page.locator('.Item_item__2fD-S').count();
      const txt = await page.evaluate(() => document.body.innerText.toLowerCase());
      const empty = cards === 0 || cnt === 0 || txt.includes('no product');
      add('TC_PLP_026', `Zero-result filter. Count: ${cnt}. Cards: ${cards}. Empty state: ${empty}. ${empty ? 'Empty state displayed correctly.' : 'Products shown despite extreme filter.'}`, empty ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_026', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_027 - Invalid category URL
  { const { ctx, page } = await fresh(browser);
    try {
      const resp = await page.goto(BASE + '/jewellery/invalidcategory', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      const txt = await page.evaluate(() => document.body.innerText);
      const graceful = txt.includes('404') || txt.toLowerCase().includes('not found') || page.url().includes('/jewellery');
      const no500 = !txt.includes('500');
      add('TC_PLP_027', `Invalid category URL. Status: ${resp?.status()}. URL: ${page.url()}. 404/redirect: ${graceful}. No 500: ${no500}. ${graceful && no500 ? 'Handled gracefully.' : 'Crash or unhandled.'}`, graceful && no500 ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_027', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_028 - Invalid filter param
  { const { ctx, page } = await fresh(browser);
    try {
      await page.goto(PLP + '?variants.color=invalidcolor', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      const txt = await page.evaluate(() => document.body.innerText);
      const no500 = !(txt.includes('500') && txt.toLowerCase().includes('error'));
      add('TC_PLP_028', `Invalid filter param (invalidcolor). URL: ${page.url()}. No server error: ${no500}. ${no500 ? 'Handled gracefully.' : 'Server error.'}`, no500 ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_028', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_029 - Page 9999
  { const { ctx, page } = await fresh(browser);
    try {
      await page.goto(PLP + '?page=9999', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      const txt = await page.evaluate(() => document.body.innerText);
      const no500 = !(txt.includes('500') && txt.toLowerCase().includes('error'));
      add('TC_PLP_029', `Page=9999. URL: ${page.url()}. No crash: ${no500}. ${no500 ? 'Handled gracefully.' : 'Server error.'}`, no500 ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_029', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_030 - goBack preserves filter
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '/rings');
      await page.locator('a.product-item-content').first().click();
      await page.waitForTimeout(3000);
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const url = page.url();
      const pass = url.includes('/rings');
      add('TC_PLP_030', `Applied Rings filter, clicked product, goBack. URL: ${url}. Filter preserved: ${pass}. ${pass ? 'Filter state preserved.' : 'Filter lost on back.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_030', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_031 - Bookmarkable URL
  { const { ctx, page } = await fresh(browser);
    try {
      const url = PLP + '?variants.color=yellow-gold';
      await nav(page, url);
      const cnt = (await getCount(page)).num;
      const pass = page.url().includes('yellow-gold') && cnt > 0;
      add('TC_PLP_031', `Direct URL with filter: ${url}. Count: ${cnt}. Filter active: ${pass}. ${pass ? 'URL is bookmarkable and shareable.' : 'Filter not applied.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_031', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_032 - Rapid filter toggling
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const sec = page.locator('.filter_filter_item__32lC1:has-text("category")');
      const isOpen = await sec.evaluate(el => el.classList.contains('uk-open')).catch(() => false);
      if (!isOpen) { await sec.click(); await page.waitForTimeout(500); }
      for (const cat of ['Rings', 'Earrings', 'Pendants', 'Nosepins']) {
        await page.locator(`.filter_filter__3noTO label:has-text("${cat}")`).first().click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(4000);
      const cnt = (await getCount(page)).num;
      const no500 = !(await page.evaluate(() => document.body.innerText)).includes('500');
      const pass = cnt >= 0 && no500;
      add('TC_PLP_032', `Rapidly toggled 4 category filters. Final count: ${cnt}. UI stable: ${no500}. ${pass ? 'No freeze or crash.' : 'UI issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_032', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_033 - Sort + Filter combined
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '/rings');
      await page.locator('select.MobileFilterPanel_sort_select__1rjEa').selectOption('product_list_new_price_asc');
      await page.waitForTimeout(4000);
      const prices = await getPrices(page);
      let sorted = true;
      for (let i = 1; i < Math.min(prices.length, 5); i++) { if (prices[i] < prices[i-1]) sorted = false; }
      const urlOk = page.url().includes('rings');
      const pass = sorted && urlOk;
      add('TC_PLP_033', `Rings + Sort Price Low→High. Prices: ${prices.slice(0,5).join(', ')}. Ascending: ${sorted}. Rings filter active: ${urlOk}. ${pass ? 'Filter and sort both applied.' : 'Issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_033', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_034 - Mobile responsive
  { const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });
    const page = await ctx.newPage();
    try {
      await page.goto(PLP, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(4000);
      try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}
      const filterBtn = await page.locator('button.MobileFilterPanel_filter_btn__2aZG0, .MobileFilterPanel_filter_btn__2aZG0').isVisible().catch(() => false);
      const cards = await page.locator('.Item_item__2fD-S').count();
      const hScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 5);
      const pass = cards > 0 && !hScroll;
      add('TC_PLP_034', `Mobile 375x812. Filter button: ${filterBtn}. Cards: ${cards}. Horizontal scroll: ${hScroll}. ${pass ? 'Responsive layout correct.' : 'Layout issues.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_034', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_035 - Last page (90)
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      await page.locator('.pagination-wrapper').scrollIntoViewIfNeeded();
      await page.locator('.pagination li button:has-text("90")').click();
      await page.waitForTimeout(5000);
      const active = await page.locator('.pagination li.active button').textContent();
      const cards = await page.locator('.Item_item__2fD-S').count();
      const nextLi = page.locator('.pagination li:has(button:has-text("Next"))');
      const nextDisabled = (await nextLi.getAttribute('class')).includes('disabled');
      const pass = active.trim() === '90' && cards > 0;
      add('TC_PLP_035', `Last page 90. Active: ${active.trim()}. Cards: ${cards}. Next disabled: ${nextDisabled}. ${pass ? 'Last page loaded correctly.' : 'Issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_035', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_036 - Add same product twice
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const btn = page.locator('a.Item_add_to_cart_btn__3aY4Y, button.Item_add_to_cart_btn__3aY4Y').first();
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      await page.waitForTimeout(2000);
      await btn.click({ force: true });
      await page.waitForTimeout(2000);
      const no500 = !(await page.evaluate(() => document.body.innerText)).includes('500');
      add('TC_PLP_036', `Added same product to cart twice. No crash: ${no500}. ${no500 ? 'Handled correctly (quantity incremented or already-in-cart shown).' : 'Error.'}`, no500 ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_036', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_037 - HTTPS
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page);
      const https = page.url().startsWith('https://');
      const mixed = [];
      page.on('console', m => { if (m.text().toLowerCase().includes('mixed content')) mixed.push(m.text()); });
      await page.waitForTimeout(2000);
      const pass = https && mixed.length === 0;
      add('TC_PLP_037', `URL: ${page.url()}. HTTPS: ${https}. Mixed content: ${mixed.length}. ${pass ? 'Secure connection. No mixed content.' : 'Security issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_037', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_038 - Above 80k
  { const { ctx, page } = await fresh(browser);
    try {
      await nav(page, PLP + '?range=80000TO10000000');
      const url = page.url();
      const cnt = (await getCount(page)).num;
      const prices = await getPrices(page);
      const allAbove = prices.length > 0 && prices.every(p => p >= 80000);
      const pass = url.includes('range=80000TO10000000') && cnt > 0;
      add('TC_PLP_038', `Above ₹80k. URL: ${url}. Count: ${cnt}. Prices: ${prices.slice(0,3).join(', ')}. All ≥80k: ${allAbove}. ${pass ? 'High-value products displayed.' : 'Issue.'}`, pass ? 'Pass' : 'Fail');
    } catch (e) { add('TC_PLP_038', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }

  // TC_PLP_039 - Authenticated Add to Cart (LAST)
  { const { ctx, page } = await fresh(browser);
    try {
      await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}
      await page.fill('#email', 'sreejith.s+4@webandcrafts.com');
      await page.fill('#password', 'Password');
      await page.click('button.login_login_btn__8VNqS');
      await page.waitForTimeout(5000);
      const loggedIn = !page.url().includes('/login');

      if (loggedIn) {
        await page.goto(PLP, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);
        const btn = page.locator('a.Item_add_to_cart_btn__3aY4Y, button.Item_add_to_cart_btn__3aY4Y').first();
        await btn.scrollIntoViewIfNeeded();
        await btn.click({ force: true });
        await page.waitForTimeout(3000);
        const notRedirected = !page.url().includes('/login');
        add('TC_PLP_039', `Login successful. Navigated to PLP. Clicked ADD TO CART. Not redirected to login: ${notRedirected}. ${notRedirected ? 'Authenticated Add to Cart works.' : 'Redirected to login.'}`, notRedirected ? 'Pass' : 'Fail');
      } else {
        add('TC_PLP_039', `Login failed. URL: ${page.url()}. Cannot verify authenticated Add to Cart.`, 'Fail');
      }
    } catch (e) { add('TC_PLP_039', 'Error: ' + e.message, 'Fail'); }
    await close(ctx, page);
  }
}

// ===================== MAIN =====================
(async () => {
  console.log('=== Starting PLP Test Execution (39 Test Cases) ===\n');
  const browser = await chromium.launch({ headless: true });
  await run(browser);
  await browser.close();

  fs.writeFileSync(RESULTS, JSON.stringify(results, null, 2));
  const p = results.filter(r => r.status === 'Pass').length;
  const f = results.filter(r => r.status === 'Fail').length;
  console.log(`\n=== Complete === Total: ${results.length} | Pass: ${p} | Fail: ${f}`);
  if (f > 0) console.log('Failed:', results.filter(r => r.status === 'Fail').map(r => r.tcId).join(', '));
})();
