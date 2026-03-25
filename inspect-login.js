const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Get the form HTML
  const formHtml = await page.evaluate(() => {
    const form = document.querySelector('form') || document.querySelector('[class*="login"]');
    return form ? form.outerHTML : document.body.innerHTML.substring(0, 10000);
  });
  console.log('=== FORM HTML ===');
  console.log(formHtml);

  // Get all inputs
  const inputs = await page.evaluate(() => {
    const allInputs = document.querySelectorAll('input, button, select, textarea');
    return Array.from(allInputs).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 || el.type === 'checkbox' || el.type === 'hidden';
    }).map(el => ({
      tag: el.tagName, type: el.type, name: el.name, id: el.id,
      class: el.className, placeholder: el.placeholder,
      text: el.textContent?.trim().substring(0, 80),
      ariaLabel: el.getAttribute('aria-label'),
      parentClass: el.parentElement?.className,
    }));
  });
  console.log('\n=== INPUTS ===');
  inputs.forEach((inp, i) => console.log(`[${i}]`, JSON.stringify(inp)));

  // Get all labels
  const labels = await page.evaluate(() => {
    const allLabels = document.querySelectorAll('label');
    return Array.from(allLabels).map(el => ({
      text: el.textContent?.trim(), for: el.htmlFor, class: el.className,
    }));
  });
  console.log('\n=== LABELS ===');
  labels.forEach((l, i) => console.log(`[${i}]`, JSON.stringify(l)));

  // Get all links
  const links = await page.evaluate(() => {
    const formArea = document.querySelector('form') || document.querySelector('[class*="login"]') || document.body;
    const allLinks = formArea.querySelectorAll('a');
    return Array.from(allLinks).map(el => ({
      text: el.textContent?.trim().substring(0, 80), href: el.href, class: el.className,
    }));
  });
  console.log('\n=== LINKS IN FORM AREA ===');
  links.forEach((l, i) => console.log(`[${i}]`, JSON.stringify(l)));

  // Get all headings
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => ({
      tag: el.tagName, text: el.textContent?.trim(), class: el.className,
    }));
  });
  console.log('\n=== HEADINGS ===');
  headings.forEach((h, i) => console.log(`[${i}]`, JSON.stringify(h)));

  // Get eye toggles
  const eyeToggles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="eye"], [class*="toggle"], [aria-label*="password"], [aria-label*="Password"]')).map(el => ({
      tag: el.tagName, class: el.className, ariaLabel: el.getAttribute('aria-label'),
      parentClass: el.parentElement?.className,
    }));
  });
  console.log('\n=== EYE TOGGLES ===');
  eyeToggles.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  // Get checkboxes
  const checkboxes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input[type="checkbox"]')).map(el => ({
      name: el.name, id: el.id, class: el.className,
      labelText: el.parentElement?.textContent?.trim(),
      parentClass: el.parentElement?.className,
    }));
  });
  console.log('\n=== CHECKBOXES ===');
  checkboxes.forEach((c, i) => console.log(`[${i}]`, JSON.stringify(c)));

  // Test: submit empty form and check for error messages
  console.log('\n=== TEST: Empty form submit ===');
  const submitBtn = await page.$('button[type="submit"], button:has-text("Sign In"), button:has-text("SIGN IN")');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(2000);
    const errors = await page.evaluate(() => {
      const all = document.querySelectorAll('[class*="error"], [class*="Error"], [class*="invalid"], [class*="validation"]');
      return Array.from(all).filter(el => el.textContent?.trim() && (el.offsetParent !== null || el.offsetWidth > 0))
        .map(el => ({ class: el.className, text: el.textContent?.trim().substring(0, 200) }));
    });
    console.log('Errors:', JSON.stringify(errors));

    const html5 = await page.evaluate(() => {
      const fields = document.querySelectorAll('input[required], input[type="email"], input[type="password"]');
      return Array.from(fields).map(el => ({
        name: el.name || el.id, validationMsg: el.validationMessage
      }));
    });
    console.log('HTML5 validation:', JSON.stringify(html5));
  } else {
    console.log('No submit button found!');
  }

  await browser.close();
})();
