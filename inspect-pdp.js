const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // Use a known product URL
  await page.goto('https://qa-sunnydiamonds.webc.in/isabelette-diamond-earring?variant_id=2260723548026', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({timeout:2000}); } catch{}
  await page.waitForTimeout(1000);

  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());

  // Product name/title
  const prodName = await page.evaluate(() => {
    const el = document.querySelector('h1, [class*="product_title"], [class*="ProductTitle"], [class*="pdp_title"]');
    return el ? { text: el.textContent.trim(), class: el.className.substring(0,80) } : 'none';
  });
  console.log('\nPRODUCT NAME:', JSON.stringify(prodName));

  // SKU
  const sku = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*')).filter(el => el.textContent.includes('SKU') && el.children.length < 3);
    return els.slice(0,2).map(el => ({ text: el.textContent.trim().substring(0,60), class: el.className.substring(0,60) }));
  });
  console.log('SKU:', JSON.stringify(sku));

  // Price
  const price = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="price"], [class*="Price"]');
    return Array.from(els).slice(0,5).map(el => ({ text: el.textContent.trim().substring(0,60), class: el.className.substring(0,60) }));
  });
  console.log('PRICE:', JSON.stringify(price));

  // Rating
  const rating = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="rating"], [class*="Rating"], [class*="star"], [class*="Star"]');
    return Array.from(els).slice(0,3).map(el => ({ text: el.textContent.trim().substring(0,40), class: el.className.substring(0,60) }));
  });
  console.log('RATING:', JSON.stringify(rating));

  // Breadcrumbs
  const breadcrumbs = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="breadcrumb"] a, [class*="breadcrumb"] span');
    return Array.from(els).map(el => ({ text: el.textContent.trim(), href: el.href || '' }));
  });
  console.log('BREADCRUMBS:', JSON.stringify(breadcrumbs));

  // Image gallery
  const gallery = await page.evaluate(() => {
    const imgs = document.querySelectorAll('[class*="gallery"] img, [class*="Gallery"] img, [class*="product_image"] img, [class*="slick"] img, [class*="slider"] img, [class*="pdp"] img');
    return { count: imgs.length, first: imgs[0] ? { src: imgs[0].src.substring(0,80), alt: imgs[0].alt } : null };
  });
  console.log('GALLERY:', JSON.stringify(gallery));

  // Thumbnails
  const thumbs = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="thumb"] img, [class*="Thumb"] img');
    return els.length;
  });
  console.log('THUMBNAILS:', thumbs);

  // Buttons: Add to Cart, Buy Now
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).filter(el => {
      const t = el.textContent.trim().toLowerCase();
      return t.includes('add to cart') || t.includes('buy now') || t.includes('check availability');
    }).map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0,40), class: el.className.substring(0,80) }));
  });
  console.log('BUTTONS:', JSON.stringify(buttons));

  // Quantity
  const qty = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="quantity"], [class*="Quantity"], [class*="qty"], input[type="number"]');
    return Array.from(els).slice(0,5).map(el => ({ tag: el.tagName, class: el.className.substring(0,60), html: el.outerHTML.substring(0,200) }));
  });
  console.log('QUANTITY:', JSON.stringify(qty));

  // Accordions/Tabs (Price Breakup, Metal Details, Diamond Details, etc.)
  const accordions = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="accordion"], [class*="Accordion"], [class*="collapse"], [class*="tab"], [class*="toggle"]');
    return Array.from(els).slice(0,15).map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0,80), class: el.className.substring(0,80) }));
  });
  console.log('ACCORDIONS:', JSON.stringify(accordions.slice(0,10)));

  // Pincode/Check Availability
  const pincode = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[placeholder*="pin" i], input[placeholder*="code" i], input[name*="pin" i], input[type="tel"]');
    return Array.from(inputs).map(el => ({ placeholder: el.placeholder, name: el.name, id: el.id, class: el.className.substring(0,60), type: el.type }));
  });
  console.log('PINCODE INPUT:', JSON.stringify(pincode));

  // Social share
  const social = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="share"], [class*="Share"], [class*="social"], [class*="Social"]');
    return Array.from(els).slice(0,3).map(el => ({ class: el.className.substring(0,60), text: el.textContent.trim().substring(0,40) }));
  });
  console.log('SOCIAL:', JSON.stringify(social));

  // You May Also Like
  const related = await page.evaluate(() => {
    const sec = document.querySelector('[class*="also_like"], [class*="AlsoLike"], [class*="related"], [class*="Related"], [class*="recommend"]');
    if (!sec) return 'not found';
    return { class: sec.className.substring(0,80), cards: sec.querySelectorAll('[class*="card"], [class*="item"], [class*="product"]').length };
  });
  console.log('RELATED:', JSON.stringify(related));

  // Trust badges / Our Promise
  const trust = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="promise"], [class*="Promise"], [class*="trust"], [class*="Trust"]');
    return Array.from(els).slice(0,3).map(el => ({ class: el.className.substring(0,60), text: el.textContent.trim().substring(0,80) }));
  });
  console.log('TRUST:', JSON.stringify(trust));

  // Full page sections via headings
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4')).slice(0,20).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0,60), class: el.className.substring(0,60)
    }));
  });
  console.log('HEADINGS:', JSON.stringify(headings));

  // Newsletter
  const newsletter = await page.evaluate(() => {
    const el = document.querySelector('#newsletter');
    return el ? { id: el.id, placeholder: el.placeholder, class: el.className.substring(0,60) } : 'none';
  });
  console.log('NEWSLETTER:', JSON.stringify(newsletter));

  await browser.close();
})();
