const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://qa-sunnydiamonds.webc.in/create', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Get the full page HTML of the form area
  const formHtml = await page.evaluate(() => {
    // Get the main form or body content
    const form = document.querySelector('form') || document.querySelector('[class*="register"], [class*="signup"], [class*="create"]') || document.body;
    return form.innerHTML;
  });

  console.log('=== FORM HTML ===');
  console.log(formHtml);

  // Get all input elements with their attributes
  const inputs = await page.evaluate(() => {
    const allInputs = document.querySelectorAll('input, select, textarea, button[type="submit"], button');
    return Array.from(allInputs).map(el => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      class: el.className,
      placeholder: el.placeholder,
      value: el.value,
      maxlength: el.maxLength,
      minlength: el.minLength,
      required: el.required,
      text: el.textContent?.trim().substring(0, 80),
      ariaLabel: el.getAttribute('aria-label'),
      dataTestId: el.getAttribute('data-testid'),
      parentClass: el.parentElement?.className,
    }));
  });

  console.log('\n=== ALL INPUT ELEMENTS ===');
  inputs.forEach((inp, i) => {
    console.log(`\n[${i}]`, JSON.stringify(inp, null, 2));
  });

  // Get all labels
  const labels = await page.evaluate(() => {
    const allLabels = document.querySelectorAll('label');
    return Array.from(allLabels).map(el => ({
      text: el.textContent?.trim(),
      for: el.htmlFor,
      class: el.className,
    }));
  });

  console.log('\n=== LABELS ===');
  labels.forEach((l, i) => console.log(`[${i}]`, JSON.stringify(l)));

  // Get all links
  const links = await page.evaluate(() => {
    const allLinks = document.querySelectorAll('a');
    return Array.from(allLinks).map(el => ({
      text: el.textContent?.trim().substring(0, 80),
      href: el.href,
      class: el.className,
    }));
  });

  console.log('\n=== LINKS ===');
  links.forEach((l, i) => console.log(`[${i}]`, JSON.stringify(l)));

  // Check for reCAPTCHA
  const captcha = await page.evaluate(() => {
    const iframes = document.querySelectorAll('iframe');
    return Array.from(iframes).map(el => ({
      src: el.src,
      title: el.title,
      class: el.className,
    }));
  });

  console.log('\n=== IFRAMES (CAPTCHA) ===');
  captcha.forEach((c, i) => console.log(`[${i}]`, JSON.stringify(c)));

  // Get all buttons
  const buttons = await page.evaluate(() => {
    const allButtons = document.querySelectorAll('button, input[type="submit"], [role="button"]');
    return Array.from(allButtons).map(el => ({
      tag: el.tagName,
      type: el.type,
      text: el.textContent?.trim().substring(0, 80),
      class: el.className,
      id: el.id,
      disabled: el.disabled,
    }));
  });

  console.log('\n=== BUTTONS ===');
  buttons.forEach((b, i) => console.log(`[${i}]`, JSON.stringify(b)));

  // Check for eye icons/password toggles
  const eyeIcons = await page.evaluate(() => {
    const passwordContainers = document.querySelectorAll('[class*="password"], [class*="Password"]');
    return Array.from(passwordContainers).map(el => ({
      class: el.className,
      innerHTML: el.innerHTML.substring(0, 500),
    }));
  });

  console.log('\n=== PASSWORD CONTAINERS ===');
  eyeIcons.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  await browser.close();
})();
