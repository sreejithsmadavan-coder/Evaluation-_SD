const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  // Login first to get authenticated cart
  await page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}
  await page.fill('#email', 'sreejith.s+4@webandcrafts.com');
  await page.fill('#password', 'Password');
  await page.click('button.login_login_btn__8VNqS');
  await page.waitForTimeout(5000);

  // Add a product to cart first
  await page.goto('https://qa-sunnydiamonds.webc.in/18-k-rose-gold-mia-diamond-pendant?variant_id=45', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.locator('button.add-cart').first().click();
  await page.waitForTimeout(3000);

  // Navigate to cart
  await page.goto('https://qa-sunnydiamonds.webc.in/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());

  // Headings
  const headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1,h2,h3,h4')).slice(0,15).map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0,80), class: el.className.substring(0,80) })));
  console.log('\nHEADINGS:', JSON.stringify(headings, null, 2));

  // Cart items
  const cartItems = await page.evaluate(() => {
    const items = document.querySelectorAll('[class*="cart_item"], [class*="cartItem"], [class*="cart_product"], tr[class*="cart"], [class*="CartItem"]');
    return Array.from(items).slice(0,3).map(el => ({ class: el.className.substring(0,80), html: el.innerHTML.substring(0,500) }));
  });
  console.log('\nCART ITEMS:', JSON.stringify(cartItems.slice(0,2), null, 2));

  // Product details in cart
  const products = await page.evaluate(() => {
    const names = Array.from(document.querySelectorAll('[class*="cart"] [class*="name"], [class*="cart"] [class*="title"], [class*="cart"] h2, [class*="cart"] h3')).map(el => el.textContent.trim().substring(0,60));
    const prices = Array.from(document.querySelectorAll('[class*="cart"] [class*="price"]')).slice(0,5).map(el => el.textContent.trim().substring(0,30));
    return { names, prices };
  });
  console.log('\nPRODUCTS:', JSON.stringify(products));

  // Quantity controls
  const qty = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="quantity"], [class*="Quantity"], input[type="number"]');
    return Array.from(els).slice(0,5).map(el => ({ tag: el.tagName, class: el.className.substring(0,80), html: el.outerHTML.substring(0,300) }));
  });
  console.log('\nQUANTITY:', JSON.stringify(qty, null, 2));

  // Buttons (remove, checkout, continue shopping, etc.)
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).filter(el => {
      const t = el.textContent.trim().toLowerCase();
      return t.includes('remove') || t.includes('checkout') || t.includes('continue') || t.includes('proceed') || t.includes('update') || t.includes('clear') || t.includes('apply') || t.includes('coupon');
    }).map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0,40), class: el.className.substring(0,80), visible: el.offsetParent !== null }));
  });
  console.log('\nBUTTONS:', JSON.stringify(buttons, null, 2));

  // Order summary
  const summary = await page.evaluate(() => {
    const sec = document.querySelector('[class*="summary"], [class*="Summary"], [class*="order_total"], [class*="checkout"]');
    return sec ? { class: sec.className.substring(0,80), text: sec.textContent.trim().substring(0,300) } : 'not found';
  });
  console.log('\nSUMMARY:', JSON.stringify(summary));

  // Coupon/promo section
  const coupon = await page.evaluate(() => {
    const els = document.querySelectorAll('input[placeholder*="coupon" i], input[placeholder*="promo" i], input[placeholder*="code" i], [class*="coupon"], [class*="promo"]');
    return Array.from(els).map(el => ({ tag: el.tagName, class: el.className.substring(0,60), placeholder: el.placeholder, id: el.id }));
  });
  console.log('\nCOUPON:', JSON.stringify(coupon));

  // Empty cart state (for reference)
  console.log('\n=== FULL PAGE TEXT (first 1000 chars) ===');
  const text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  console.log(text);

  await browser.close();
})();
