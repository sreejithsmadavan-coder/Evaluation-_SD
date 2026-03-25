const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://qa-sunnydiamonds.webc.in/create', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Test 1: Click submit with empty form
  console.log('=== TEST: Empty form submit ===');
  await page.click('button.register_register_btn__3ejME');
  await page.waitForTimeout(2000);

  let errors = await page.evaluate(() => {
    const allElements = document.querySelectorAll('[class*="error"], [class*="Error"], [class*="invalid"], [class*="Invalid"], .error, .field-error, .validation-error');
    return Array.from(allElements).map(el => ({
      tag: el.tagName,
      class: el.className,
      text: el.textContent?.trim().substring(0, 200),
      id: el.id,
      visible: el.offsetParent !== null || el.offsetWidth > 0,
    }));
  });
  console.log('Error elements after empty submit:');
  errors.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  // Also check for any new elements that appeared
  const formHTML = await page.evaluate(() => {
    const form = document.querySelector('form');
    return form ? form.innerHTML : 'NO FORM FOUND';
  });

  // Check specifically for error spans/divs near inputs
  const fieldErrors = await page.evaluate(() => {
    const fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'c_password'];
    const results = {};
    fields.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        const parent = input.closest('[class*="form_control"], [class*="form_group"]');
        if (parent) {
          const errorEl = parent.querySelector('[class*="error"], [class*="Error"], span, p');
          results[id] = {
            parentClass: parent.className,
            parentHTML: parent.innerHTML.substring(0, 300),
            errorText: errorEl ? errorEl.textContent?.trim() : null,
          };
        }
      }
    });
    return results;
  });
  console.log('\n=== FIELD-LEVEL ERRORS ===');
  Object.entries(fieldErrors).forEach(([k, v]) => console.log(`${k}:`, JSON.stringify(v)));

  // Test 2: Fill in short first name and check
  console.log('\n=== TEST: Short first name (2 chars) ===');
  await page.fill('#first_name', 'Jo');
  await page.fill('#last_name', 'Doe');
  await page.fill('#email', 'test@test.com');
  await page.fill('#phone', '9876543210');
  await page.fill('#password', 'Test@1234');
  await page.fill('#c_password', 'Test@1234');
  // Check terms
  await page.check('#terms_and_condition');
  await page.click('button.register_register_btn__3ejME');
  await page.waitForTimeout(2000);

  const errors2 = await page.evaluate(() => {
    const allElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
    return Array.from(allElements).filter(el => el.offsetParent !== null || el.offsetWidth > 0).map(el => ({
      tag: el.tagName,
      class: el.className,
      text: el.textContent?.trim().substring(0, 200),
    }));
  });
  console.log('Visible errors after short first name:');
  errors2.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  // Check full page text for error messages
  const bodyText = await page.evaluate(() => document.body.innerText);
  const errorLines = bodyText.split('\n').filter(line =>
    line.toLowerCase().includes('error') ||
    line.toLowerCase().includes('required') ||
    line.toLowerCase().includes('invalid') ||
    line.toLowerCase().includes('must') ||
    line.toLowerCase().includes('cannot') ||
    line.toLowerCase().includes('at least') ||
    line.toLowerCase().includes('minimum')
  );
  console.log('\n=== ERROR-RELATED TEXT ON PAGE ===');
  errorLines.forEach(line => console.log(line.trim()));

  // Test 3: Password mismatch
  console.log('\n=== TEST: Password mismatch ===');
  await page.goto('https://qa-sunnydiamonds.webc.in/create', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.fill('#first_name', 'John');
  await page.fill('#last_name', 'Doe');
  await page.fill('#email', 'test@test.com');
  await page.fill('#phone', '9876543210');
  await page.fill('#password', 'Test@1234');
  await page.fill('#c_password', 'Test@9999');
  await page.check('#terms_and_condition');
  await page.click('button.register_register_btn__3ejME');
  await page.waitForTimeout(2000);

  const errors3 = await page.evaluate(() => {
    const allElements = document.querySelectorAll('[class*="error"], [class*="Error"], [class*="invalid"]');
    return Array.from(allElements).filter(el => {
      const text = el.textContent?.trim();
      return text && text.length > 0 && (el.offsetParent !== null || el.offsetWidth > 0);
    }).map(el => ({
      class: el.className,
      text: el.textContent?.trim().substring(0, 200),
    }));
  });
  console.log('Errors after password mismatch:');
  errors3.forEach((e, i) => console.log(`[${i}]`, JSON.stringify(e)));

  // Get the complete form HTML after submit
  const formAfter = await page.evaluate(() => {
    const form = document.querySelector('form');
    return form ? form.innerHTML.substring(0, 5000) : 'NO FORM';
  });
  console.log('\n=== FORM HTML AFTER PASSWORD MISMATCH SUBMIT ===');
  console.log(formAfter);

  await browser.close();
})();
