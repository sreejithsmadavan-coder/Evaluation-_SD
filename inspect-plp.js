const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://qa-sunnydiamonds.webc.in/jewellery/earrings', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  try { const b = page.locator('button.cookie-consent_accept_btn__39jUd'); if (await b.isVisible({ timeout: 2000 })) await b.click(); } catch {}
  await page.waitForTimeout(1000);

  // 1. Page heading/title
  console.log('=== PAGE TITLE ===');
  console.log(await page.title());
  console.log('URL:', page.url());

  // 2. Breadcrumbs
  console.log('\n=== BREADCRUMBS ===');
  const breadcrumbs = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="breadcrumb"] a, [class*="breadcrumb"] span, [class*="Breadcrumb"] a, [class*="Breadcrumb"] span');
    return Array.from(els).map(el => ({ tag: el.tagName, text: el.textContent.trim(), href: el.href || '', class: el.className.substring(0,60) }));
  });
  breadcrumbs.forEach((b,i) => console.log(`[${i}]`, JSON.stringify(b)));

  // 3. Page heading
  console.log('\n=== HEADINGS ===');
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3')).slice(0,10).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0,80), class: el.className.substring(0,80)
    }));
  });
  headings.forEach((h,i) => console.log(`[${i}]`, JSON.stringify(h)));

  // 4. Product count
  console.log('\n=== PRODUCT COUNT TEXT ===');
  const countText = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="count"], [class*="total"], [class*="product_count"], [class*="result"]');
    return Array.from(els).filter(el => el.textContent.trim().match(/\d+/)).map(el => ({
      text: el.textContent.trim().substring(0,60), class: el.className.substring(0,60)
    }));
  });
  countText.forEach((c,i) => console.log(`[${i}]`, JSON.stringify(c)));

  // 5. Filters / Sort
  console.log('\n=== FILTERS/SORT ===');
  const filters = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="filter"], [class*="Filter"], [class*="sort"], [class*="Sort"], select');
    return Array.from(els).slice(0,15).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0,80), class: el.className.substring(0,80),
      id: el.id
    }));
  });
  filters.forEach((f,i) => console.log(`[${i}]`, JSON.stringify(f)));

  // 6. Product cards
  console.log('\n=== PRODUCT CARDS (first 2) ===');
  const cards = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="product_card"], [class*="productCard"], [class*="Item_item"], [class*="product-card"]');
    return Array.from(els).slice(0,2).map(el => ({
      class: el.className.substring(0,80),
      html: el.innerHTML.substring(0,500)
    }));
  });
  cards.forEach((c,i) => console.log(`[${i}]`, JSON.stringify(c)));

  // 7. Product names, prices, wishlist, add to cart
  console.log('\n=== PRODUCT ELEMENTS ===');
  const prodElements = await page.evaluate(() => {
    const names = Array.from(document.querySelectorAll('[class*="Item_title"], [class*="product_name"], h2[class*="title"]')).slice(0,3).map(el => el.textContent.trim());
    const prices = Array.from(document.querySelectorAll('[class*="Item_price"], [class*="product_price"], [class*="price"]')).slice(0,3).map(el => el.textContent.trim());
    const addToCart = document.querySelectorAll('[class*="add_to_cart"], [class*="addToCart"]').length;
    const wishlist = document.querySelectorAll('[class*="wishlist"], [class*="Wishlist"]').length;
    return { names, prices, addToCart, wishlist };
  });
  console.log(JSON.stringify(prodElements, null, 2));

  // 8. Pagination / Load More
  console.log('\n=== PAGINATION ===');
  const pagination = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="pagination"], [class*="Pagination"], [class*="load_more"], [class*="loadMore"], button:has-text("Load More")');
    return Array.from(els).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0,60), class: el.className.substring(0,80)
    }));
  });
  pagination.forEach((p,i) => console.log(`[${i}]`, JSON.stringify(p)));

  // 9. Sort dropdown options
  console.log('\n=== SORT OPTIONS ===');
  const sortOpts = await page.evaluate(() => {
    const selects = document.querySelectorAll('select, [class*="sort"] select, [class*="Sort"]');
    const opts = [];
    selects.forEach(s => {
      Array.from(s.options || []).forEach(o => opts.push({ value: o.value, text: o.textContent.trim() }));
    });
    // Also check for custom sort dropdowns
    const customSort = document.querySelectorAll('[class*="sort"] [class*="option"], [class*="sort"] li, [class*="sort"] button');
    customSort.forEach(el => opts.push({ text: el.textContent.trim().substring(0,50), class: el.className.substring(0,50) }));
    return opts;
  });
  sortOpts.forEach((s,i) => console.log(`[${i}]`, JSON.stringify(s)));

  // 10. Filter sidebar/section details
  console.log('\n=== FILTER DETAILS ===');
  const filterDetails = await page.evaluate(() => {
    const sections = document.querySelectorAll('[class*="filter"] [class*="group"], [class*="filter"] [class*="section"], [class*="Filter"] [class*="heading"], [class*="filter"] h3, [class*="filter"] h4, [class*="filter_title"]');
    return Array.from(sections).slice(0,15).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0,60), class: el.className.substring(0,60)
    }));
  });
  filterDetails.forEach((f,i) => console.log(`[${i}]`, JSON.stringify(f)));

  await browser.close();
})();
