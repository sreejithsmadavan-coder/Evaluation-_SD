const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  // Accept cookies
  try {
    await page.goto('https://qa-sunnydiamonds.webc.in', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 });
  } catch {}

  // Add product to cart as guest
  await page.goto('https://qa-sunnydiamonds.webc.in/jewellery', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.locator('a.product-item-content').first().click();
  await page.waitForTimeout(3000);
  await page.locator('button.add-cart').first().click({ force: true });
  await page.waitForTimeout(2000);

  // Go to cart
  await page.goto('https://qa-sunnydiamonds.webc.in/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click checkout securely
  await page.locator('a[href="/checkout"], button:has-text("CHECKOUT SECURELY"), a:has-text("CHECKOUT")').first().click();
  await page.waitForTimeout(3000);

  console.log('URL after checkout click:', page.url());

  // Look for CONTINUE AS GUEST
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Has CONTINUE AS GUEST:', bodyText.includes('CONTINUE AS GUEST'));

  // Click CONTINUE AS GUEST
  try {
    await page.locator('button:has-text("CONTINUE AS GUEST"), a:has-text("CONTINUE AS GUEST")').first().click({ timeout: 5000 });
    await page.waitForTimeout(5000);
  } catch (e) {
    console.log('Error clicking CONTINUE AS GUEST:', e.message.substring(0, 100));
  }

  console.log('URL after guest click:', page.url());

  // Inspect form inputs
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      tag: el.tagName, type: el.type, name: el.name, id: el.id,
      class: el.className.substring(0, 80), placeholder: el.placeholder,
      value: el.value, required: el.required,
      parentClass: el.parentElement?.className?.substring(0, 60),
    }));
  });
  console.log('\n=== INPUTS ===');
  inputs.forEach((inp, i) => console.log(`[${i}]`, JSON.stringify(inp)));

  // Buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).filter(el => el.textContent.trim()).map(el => ({
      text: el.textContent.trim().substring(0, 50),
      class: el.className.substring(0, 80),
    }));
  });
  console.log('\n=== BUTTONS ===');
  buttons.forEach((b, i) => console.log(`[${i}]`, JSON.stringify(b)));

  // Headings
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4,h5')).slice(0, 20).map(el => ({
      tag: el.tagName, text: el.textContent.trim().substring(0, 80),
    }));
  });
  console.log('\n=== HEADINGS ===');
  headings.forEach((h, i) => console.log(`[${i}]`, JSON.stringify(h)));

  // Payment section
  const payment = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="payment"], [class*="Payment"], [class*="paymentCard"]');
    return Array.from(els).slice(0, 10).map(el => ({
      class: el.className.substring(0, 60), text: el.textContent.trim().substring(0, 60),
    }));
  });
  console.log('\n=== PAYMENT ===');
  payment.forEach((p, i) => console.log(`[${i}]`, JSON.stringify(p)));

  // Order summary
  const summary = await page.evaluate(() => {
    const el = document.querySelector('[class*="summary"], [class*="Summary"], [class*="order"]');
    return el ? { class: el.className.substring(0, 80), text: el.textContent.trim().substring(0, 300) } : 'not found';
  });
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(summary));

  // Error selectors
  const errors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="error"], [class*="Error"]')).filter(el => el.textContent.trim()).slice(0, 10).map(el => ({
      class: el.className.substring(0, 80), text: el.textContent.trim().substring(0, 80),
    }));
  });
  console.log('\n=== ERRORS ===');
  errors.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  await browser.close();
})();
