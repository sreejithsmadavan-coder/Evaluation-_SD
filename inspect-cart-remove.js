const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  await page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}
  await page.fill('#email', 'sreejith.s+4@webandcrafts.com');
  await page.fill('#password', 'Password');
  await page.click('button.login_login_btn__8VNqS');
  await page.waitForTimeout(5000);

  // Add a product
  await page.goto('https://qa-sunnydiamonds.webc.in/jewellery', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.locator('a.product-item-content').first().click();
  await page.waitForTimeout(3000);
  await page.locator('button.add-cart').first().click();
  await page.waitForTimeout(2000);

  await page.goto('https://qa-sunnydiamonds.webc.in/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Items:', await page.locator('.cartItem_cart_item__3pdCT').count());

  // Full first item HTML
  const html = await page.evaluate(() => {
    const item = document.querySelector('.cartItem_cart_item__3pdCT');
    return item ? item.outerHTML.substring(0, 3000) : 'NO ITEM FOUND';
  });
  console.log('\nFIRST ITEM HTML:\n', html);

  // All clickable elements within item
  const clickables = await page.evaluate(() => {
    const item = document.querySelector('.cartItem_cart_item__3pdCT');
    if (!item) return [];
    return Array.from(item.querySelectorAll('button, a, [role="button"]')).map(el => ({
      tag: el.tagName, class: el.className.substring(0,80),
      text: el.textContent.trim().substring(0,30),
      ariaLabel: el.getAttribute('aria-label'),
    }));
  });
  console.log('\nCLICKABLES:', JSON.stringify(clickables, null, 2));

  await browser.close();
})();
