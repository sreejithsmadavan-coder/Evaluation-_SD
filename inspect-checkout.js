const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  // Login
  await page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}
  await page.fill('#email', 'sreejith.s+4@webandcrafts.com');
  await page.fill('#password', 'Password');
  await page.click('button.login_login_btn__8VNqS');
  await page.waitForTimeout(5000);

  // Add product to cart
  await page.goto('https://qa-sunnydiamonds.webc.in/jewellery', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.locator('a.product-item-content').first().click();
  await page.waitForTimeout(3000);
  await page.locator('button.add-cart').first().click({ force: true });
  await page.waitForTimeout(2000);

  // Go to checkout
  await page.goto('https://qa-sunnydiamonds.webc.in/checkout', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());

  // All form inputs
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      tag: el.tagName, type: el.type, name: el.name, id: el.id,
      class: el.className.substring(0,80), placeholder: el.placeholder,
      value: el.value, required: el.required, maxLength: el.maxLength,
      ariaLabel: el.getAttribute('aria-label'),
      parentClass: el.parentElement?.className?.substring(0,60),
      label: el.previousElementSibling?.textContent?.trim().substring(0,30) || el.closest('label')?.textContent?.trim().substring(0,30) || '',
    }));
  });
  console.log('\n=== INPUTS ===');
  inputs.forEach((inp, i) => console.log(`[${i}]`, JSON.stringify(inp)));

  // All buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, input[type="submit"], a[class*="btn"]')).filter(el => el.textContent.trim()).map(el => ({
      tag: el.tagName, type: el.type, text: el.textContent.trim().substring(0,40),
      class: el.className.substring(0,80), href: el.href || '',
    }));
  });
  console.log('\n=== BUTTONS ===');
  buttons.forEach((b, i) => console.log(`[${i}]`, JSON.stringify(b)));

  // Headings
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4')).slice(0,20).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0,80), class: el.className.substring(0,60)
    }));
  });
  console.log('\n=== HEADINGS ===');
  headings.forEach((h, i) => console.log(`[${i}]`, JSON.stringify(h)));

  // Order summary section
  const summary = await page.evaluate(() => {
    const el = document.querySelector('[class*="order_summary"], [class*="OrderSummary"], [class*="orderSummary"], [class*="summary"]');
    return el ? { class: el.className.substring(0,80), text: el.textContent.trim().substring(0,500) } : 'not found';
  });
  console.log('\n=== ORDER SUMMARY ===');
  console.log(JSON.stringify(summary));

  // Payment section
  const payment = await page.evaluate(() => {
    const els = document.querySelectorAll('input[type="radio"], [class*="payment"], [class*="Payment"]');
    return Array.from(els).slice(0,10).map(el => ({
      tag: el.tagName, type: el.type, name: el.name, value: el.value,
      class: el.className.substring(0,60), label: el.closest('label')?.textContent?.trim().substring(0,30) || '',
      text: el.textContent?.trim().substring(0,40),
    }));
  });
  console.log('\n=== PAYMENT ===');
  payment.forEach((p, i) => console.log(`[${i}]`, JSON.stringify(p)));

  // Coupon / Gift Card section
  const coupon = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="coupon"], [class*="Coupon"], [class*="gift"], [class*="Gift"], [class*="promo"]');
    return Array.from(els).slice(0,5).map(el => ({
      class: el.className.substring(0,60), tag: el.tagName,
      html: el.innerHTML.substring(0,300),
    }));
  });
  console.log('\n=== COUPON/GIFT ===');
  coupon.forEach((c, i) => console.log(`[${i}]`, JSON.stringify(c)));

  // Checkboxes
  const checkboxes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input[type="checkbox"]')).map(el => ({
      name: el.name, id: el.id, checked: el.checked, class: el.className.substring(0,60),
      label: el.closest('label')?.textContent?.trim().substring(0,50) || el.parentElement?.textContent?.trim().substring(0,50),
    }));
  });
  console.log('\n=== CHECKBOXES ===');
  checkboxes.forEach((c, i) => console.log(`[${i}]`, JSON.stringify(c)));

  // Validation errors (if any visible)
  const errors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="error"], [class*="Error"]')).filter(el => el.textContent.trim()).slice(0,10).map(el => ({
      class: el.className.substring(0,60), text: el.textContent.trim().substring(0,60),
    }));
  });
  console.log('\n=== ERRORS ===');
  errors.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  // reCAPTCHA
  const captcha = await page.evaluate(() => {
    const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
    const divs = document.querySelectorAll('[class*="captcha"], [class*="recaptcha"], .g-recaptcha');
    return { iframes: iframes.length, divs: divs.length };
  });
  console.log('\n=== RECAPTCHA ===', JSON.stringify(captcha));

  // State dropdown options count
  const stateOptions = await page.evaluate(() => {
    const select = document.querySelector('select[name*="state" i], select[name*="State" i], #state');
    if (!select) return [];
    return Array.from(select.options).map(o => o.textContent.trim());
  });
  console.log('\n=== STATE OPTIONS ===', stateOptions.length, 'options:', stateOptions.slice(0,5).join(', '), '...');

  await browser.close();
})();
