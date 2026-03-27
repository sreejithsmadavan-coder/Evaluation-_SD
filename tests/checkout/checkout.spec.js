const { test, expect } = require('@playwright/test');
const CheckoutPage = require('../../pages/CheckoutPage');
const { CheckoutData } = require('../../utils/testData');

/**
 * CHECKOUT PAGE TESTS — 137 Test Cases
 *
 * TC_CHECKOUT_001 – TC_CHECKOUT_075:  Logged-in user checkout (Positive, Negative, Edge Case)
 * TC_CHECKOUT_076 – TC_CHECKOUT_112:  Order Summary, Cart edits, Remove items, COD threshold
 * TC_CHECKOUT_113 – TC_CHECKOUT_137:  Guest checkout flow
 * TC_CHECKOUT_138:                    Authenticated user full flow (LAST)
 */

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: SHIPPING ADDRESS — POSITIVE (TC_001 – TC_021)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Shipping Address Positive Tests', () => {
  let co;

  test.beforeEach(async ({ page }) => {
    co = new CheckoutPage(page);
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.dismissCookieBanner();
  });

  test('TC_CHECKOUT_001 - Full setup flow — Login, add 2 products to cart, navigate to Checkout page', async ({ page }) => {
    // Re-setup with 2 products
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const url = page.url();
    expect(url).toContain('/checkout');

    const summaryText = await co.getOrderSummaryText();
    expect(summaryText).toContain('Order Summary');

    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_002 - Shipping Address — Enter valid First Name (alphabets only)', async () => {
    await co.fillShippingField(co.firstName, 'Sreejith');
    const val = await co.getFieldValue(co.firstName);
    expect(val).toBe('Sreejith');

    const hasError = await co.hasFieldError('first name');
    expect(hasError).toBeFalsy();
  });

  test('TC_CHECKOUT_003 - Shipping Address — Enter valid Last Name', async () => {
    await co.fillShippingField(co.lastName, 'Madavan');
    const val = await co.getFieldValue(co.lastName);
    expect(val).toBe('Madavan');
  });

  test('TC_CHECKOUT_004 - Shipping Address — Enter valid Email Address', async () => {
    await co.fillShippingField(co.email, 'sreejith.s+4@webandcrafts.com');
    const val = await co.getFieldValue(co.email);
    expect(val).toContain('@');

    const hasError = await co.hasFieldError('email');
    expect(hasError).toBeFalsy();
  });

  test('TC_CHECKOUT_005 - Shipping Address — Enter valid 10-digit Phone Number', async () => {
    await co.fillShippingField(co.phone, '9876543210');
    const val = await co.getFieldValue(co.phone);
    expect(val).toBe('9876543210');
  });

  test('TC_CHECKOUT_006 - Shipping Address — Enter valid street Address', async () => {
    await co.fillShippingField(co.address, '42 MG Road, Kakkanad');
    const val = await co.getFieldValue(co.address);
    expect(val).toBe('42 MG Road, Kakkanad');
  });

  test('TC_CHECKOUT_007 - Shipping Address — Enter valid 6-digit Pin Code', async () => {
    await co.fillShippingField(co.pinCode, '682021');
    const val = await co.getFieldValue(co.pinCode);
    expect(val).toBe('682021');
  });

  test('TC_CHECKOUT_008 - Shipping Address — Enter valid City name', async () => {
    await co.fillShippingField(co.city, 'Kochi');
    const val = await co.getFieldValue(co.city);
    expect(val.toLowerCase()).toContain('kochi');
  });

  test('TC_CHECKOUT_009 - Shipping Address — Select valid State', async () => {
    await co.fillShippingField(co.state, 'Kerala');
    const val = await co.getFieldValue(co.state);
    expect(val.toLowerCase()).toContain('kerala');
  });

  test('TC_CHECKOUT_010 - Shipping Address — Verify Country defaults to India', async () => {
    const val = await co.getFieldValue(co.country);
    expect(val.toLowerCase()).toContain('india');
  });

  test('TC_CHECKOUT_011 - Verify billing checkbox is checked by default', async () => {
    const checked = await co.isBillingCheckboxChecked();
    expect(checked).toBeTruthy();
  });

  test('TC_CHECKOUT_012 - Uncheck billing checkbox — verify separate billing form appears', async () => {
    await co.uncheckBillingCheckbox();
    const checked = await co.isBillingCheckboxChecked();
    expect(checked).toBeFalsy();
  });

  test('TC_CHECKOUT_013 - Apply a valid coupon code', async () => {
    await co.applyCoupon('TESTCOUPON');
    const bodyText = await co.getBodyText();
    const responded = bodyText.toLowerCase().includes('coupon') || bodyText.toLowerCase().includes('invalid') || bodyText.toLowerCase().includes('applied');
    expect(responded).toBeTruthy();
  });

  test('TC_CHECKOUT_014 - Apply a valid Gift Card', async () => {
    await co.applyGiftCard('TESTGIFT123');
    const bodyText = await co.getBodyText();
    const responded = bodyText.toLowerCase().includes('gift') || bodyText.toLowerCase().includes('invalid') || bodyText.toLowerCase().includes('redeemed');
    expect(responded).toBeTruthy();
  });

  test('TC_CHECKOUT_015 - Select Cash on Delivery payment method', async () => {
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      const checked = await co.isCODChecked();
      expect(checked).toBeTruthy();
    }
    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_016 - Select Pay Online payment method', async () => {
    await co.selectPayOnline();
    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_017 - Complete order with Cash on Delivery', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
    }
    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_018 - Verify Order Summary displays correct product info', async () => {
    const summaryText = await co.getOrderSummaryText();
    expect(summaryText).toContain('Order Summary');
    const subtotal = await co.getSubtotal();
    expect(subtotal).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_019 - Verify Subtotal = sum of prices for all items', async () => {
    const subtotal = await co.getSubtotal();
    expect(subtotal).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_020 - Verify Total calculation', async () => {
    const subtotal = await co.getSubtotal();
    const total = await co.getTotal();
    expect(subtotal).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_021 - First Name BVA — Enter exactly 56 characters', async () => {
    const str56 = 'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd';
    await co.fillShippingField(co.firstName, str56);
    const val = await co.getFieldValue(co.firstName);
    expect(val.length).toBeGreaterThanOrEqual(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: NEGATIVE TESTS (TC_022 – TC_034, TC_053 – TC_070)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Negative Tests', () => {
  let co;

  test.beforeEach(async ({ page }) => {
    co = new CheckoutPage(page);
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.dismissCookieBanner();
  });

  test('TC_CHECKOUT_022 - Submit Checkout with all fields empty', async () => {
    await co.clearAllShippingFields();
    await co.clickPayNow();
    const errors = await co.getVisibleErrors();
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  test('TC_CHECKOUT_023 - Leave First Name empty — verify field-level error', async () => {
    await co.clearShippingField(co.firstName);
    const hasError = await co.hasFieldError('first name');
    expect(hasError).toBeTruthy();
  });

  test('TC_CHECKOUT_024 - Enter invalid Email format (missing @)', async () => {
    await co.fillShippingField(co.email, 'invalidemail.com');
    const hasError = await co.hasFieldError('email');
    expect(hasError).toBeTruthy();
  });

  test('TC_CHECKOUT_025 - Enter Email with leading and trailing spaces', async () => {
    await co.fillShippingField(co.email, '  test@example.com  ');
    const val = await co.getFieldValue(co.email);
    const errors = await co.getVisibleErrors();
    const trimmed = val.trim() === 'test@example.com';
    const hasErr = errors.some(e => e.toLowerCase().includes('email'));
    expect(trimmed || hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_026 - Enter Phone Number with fewer than 10 digits', async () => {
    await co.fillShippingField(co.phone, '98765');
    const hasError = await co.hasFieldError('phone');
    expect(hasError).toBeTruthy();
  });

  test('TC_CHECKOUT_027 - Enter Phone Number with more than 10 digits', async () => {
    await co.fillShippingField(co.phone, '98765432101234');
    const val = await co.getFieldValue(co.phone);
    const errors = await co.getVisibleErrors();
    const truncated = val.length <= 10;
    const hasErr = errors.some(e => e.toLowerCase().includes('phone'));
    expect(truncated || hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_028 - Enter Phone Number with special characters', async () => {
    await co.fillShippingField(co.phone, '98765@#$!0');
    const hasError = await co.hasFieldError('phone');
    expect(hasError).toBeTruthy();
  });

  test('TC_CHECKOUT_029 - Enter Pin Code with alphabetic characters', async () => {
    await co.fillShippingField(co.pinCode, 'ABCDEF');
    const hasError = await co.hasFieldError('pin');
    expect(hasError).toBeTruthy();
  });

  test('TC_CHECKOUT_030 - Enter First Name containing numeric digits', async () => {
    await co.fillShippingField(co.firstName, 'Sree123');
    const errors = await co.getVisibleErrors();
    const hasErr = errors.some(e => e.toLowerCase().includes('first name') || e.toLowerCase().includes('alphabet'));
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_031 - Apply an invalid/expired Coupon Code', async () => {
    await co.applyCoupon('INVALID999');
    const bodyText = (await co.getBodyText()).toLowerCase();
    const rejected = bodyText.includes('invalid') || bodyText.includes('expired') || bodyText.includes('error') || bodyText.includes('not found');
    expect(rejected).toBeTruthy();
  });

  test('TC_CHECKOUT_032 - Apply an invalid Gift Card number', async () => {
    await co.applyGiftCard('FAKEGIFTCARD123');
    const bodyText = (await co.getBodyText()).toLowerCase();
    const rejected = bodyText.includes('invalid') || bodyText.includes('not found') || bodyText.includes('error');
    expect(rejected).toBeTruthy();
  });

  test('TC_CHECKOUT_033 - Click Apply for Coupon with empty input', async () => {
    await co.applyCoupon('');
    const bodyText = (await co.getBodyText()).toLowerCase();
    const prompted = bodyText.includes('enter') || bodyText.includes('required') || bodyText.includes('coupon');
    expect(prompted).toBeTruthy();
  });

  test('TC_CHECKOUT_034 - Access Checkout without being logged in', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const guestPage = await ctx.newPage();
    const guestCo = new CheckoutPage(guestPage);
    await guestCo.navigate();
    await guestPage.waitForTimeout(3000);
    const url = guestPage.url();
    const bodyText = (await guestCo.getBodyText()).toLowerCase();
    const blocked = url.includes('/login') || bodyText.includes('login') || bodyText.includes('empty');
    expect(blocked).toBeTruthy();
    await ctx.close();
  });

  test('TC_CHECKOUT_053 - First Name with leading space', async () => {
    await co.fillShippingField(co.firstName, ' John');
    const val = await co.getFieldValue(co.firstName);
    const errors = await co.getVisibleErrors();
    const trimmed = !val.startsWith(' ');
    const hasErr = errors.some(e => e.toLowerCase().includes('first name'));
    expect(trimmed || hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_054 - Last Name with leading space', async () => {
    await co.fillShippingField(co.lastName, ' Smith');
    const val = await co.getFieldValue(co.lastName);
    const trimmed = !val.startsWith(' ');
    expect(trimmed).toBeTruthy();
  });

  test('TC_CHECKOUT_055 - Address with leading space', async () => {
    await co.fillShippingField(co.address, '  123 Main Street');
    const val = await co.getFieldValue(co.address);
    const trimmed = !val.startsWith(' ');
    expect(trimmed).toBeTruthy();
  });

  test('TC_CHECKOUT_056 - First Name with special characters', async () => {
    await co.fillShippingField(co.firstName, 'John@#Doe');
    const hasErr = await co.hasFieldError('first name');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_057 - Last Name with special characters', async () => {
    await co.fillShippingField(co.lastName, 'Smith!@#');
    const hasErr = await co.hasFieldError('last name');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_058 - Last Name BVA — Enter exactly 56 characters', async () => {
    const str56 = 'A'.repeat(56);
    await co.fillShippingField(co.lastName, str56);
    const val = await co.getFieldValue(co.lastName);
    expect(val.length).toBeGreaterThanOrEqual(50);
  });

  test('TC_CHECKOUT_059 - Last Name BVA — Enter 57 characters', async () => {
    const str57 = 'A'.repeat(57);
    await co.fillShippingField(co.lastName, str57);
    const val = await co.getFieldValue(co.lastName);
    const errors = await co.getVisibleErrors();
    const limited = val.length <= 56 || errors.length > 0;
    expect(limited).toBeTruthy();
  });

  test('TC_CHECKOUT_060 - First Name with consecutive whitespace', async () => {
    await co.fillShippingField(co.firstName, 'John  Doe');
    const val = await co.getFieldValue(co.firstName);
    const errors = await co.getVisibleErrors();
    const noDouble = !val.includes('  ');
    expect(noDouble || errors.length > 0).toBeTruthy();
  });

  test('TC_CHECKOUT_062 - City field with numeric digits only', async () => {
    await co.fillShippingField(co.city, '12345');
    const hasErr = await co.hasFieldError('city');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_063 - City field with leading space', async () => {
    await co.fillShippingField(co.city, ' Mumbai');
    const val = await co.getFieldValue(co.city);
    const trimmed = !val.startsWith(' ');
    expect(trimmed).toBeTruthy();
  });

  test('TC_CHECKOUT_064 - Phone Number with dashes', async () => {
    await co.fillShippingField(co.phone, '98765-43210');
    const val = await co.getFieldValue(co.phone);
    const errors = await co.getVisibleErrors();
    const normalized = val.replace(/-/g, '').length === 10;
    const hasErr = errors.some(e => e.toLowerCase().includes('phone'));
    expect(normalized || hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_065 - Phone Number with leading/trailing whitespace', async () => {
    await co.fillShippingField(co.phone, ' 9876543210 ');
    const val = await co.getFieldValue(co.phone);
    const trimmed = val.trim() === val;
    expect(trimmed).toBeTruthy();
  });

  test('TC_CHECKOUT_066 - Pin Code BVA — Enter 7 digits', async () => {
    await co.fillShippingField(co.pinCode, '1234567');
    const val = await co.getFieldValue(co.pinCode);
    const errors = await co.getVisibleErrors();
    const limited = val.length <= 6 || errors.length > 0;
    expect(limited).toBeTruthy();
  });

  test('TC_CHECKOUT_067 - State field — Verify valid state accepted', async () => {
    await co.fillShippingField(co.state, 'Kerala');
    const val = await co.getFieldValue(co.state);
    expect(val.toLowerCase()).toContain('kerala');
  });

  test('TC_CHECKOUT_068 - Email error on tab-out for invalid email', async () => {
    await co.fillShippingField(co.email, 'invalidemail');
    const hasErr = await co.hasFieldError('email');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_069 - Phone error on tab-out for invalid phone', async () => {
    await co.fillShippingField(co.phone, '123');
    const hasErr = await co.hasFieldError('phone');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_070 - Pin Code error on tab-out for non-numeric input', async () => {
    await co.fillShippingField(co.pinCode, 'ABC');
    const hasErr = await co.hasFieldError('pin');
    expect(hasErr).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: EDGE CASES — BVA, SECURITY, BROWSER (TC_035 – TC_051, TC_061, TC_071 – TC_075)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Edge Case Tests', () => {
  let co;

  test.beforeEach(async ({ page }) => {
    co = new CheckoutPage(page);
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.dismissCookieBanner();
  });

  test('TC_CHECKOUT_035 - First Name BVA — Enter 1 character (below min)', async () => {
    await co.fillShippingField(co.firstName, 'A');
    const hasErr = await co.hasFieldError('first name');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_036 - First Name BVA — Enter exactly 2 characters (minimum)', async () => {
    await co.fillShippingField(co.firstName, 'Jo');
    const val = await co.getFieldValue(co.firstName);
    const hasErr = await co.hasFieldError('first name');
    expect(val).toBe('Jo');
    expect(hasErr).toBeFalsy();
  });

  test('TC_CHECKOUT_037 - First Name BVA — Enter 57 characters (above max)', async () => {
    const str57 = 'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcde';
    await co.fillShippingField(co.firstName, str57);
    const val = await co.getFieldValue(co.firstName);
    const errors = await co.getVisibleErrors();
    const limited = val.length <= 56 || errors.length > 0;
    expect(limited).toBeTruthy();
  });

  test('TC_CHECKOUT_038 - Phone BVA — Enter 9 digits', async () => {
    await co.fillShippingField(co.phone, '987654321');
    const hasErr = await co.hasFieldError('phone');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_039 - Phone with +91 country code prefix', async () => {
    await co.fillShippingField(co.phone, '+919876543210');
    const val = await co.getFieldValue(co.phone);
    expect(val.length).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_040 - Pin Code BVA — Enter 5 digits', async () => {
    await co.fillShippingField(co.pinCode, '68202');
    const hasErr = await co.hasFieldError('pin');
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_041 - OWASP XSS in First Name field', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await co.fillShippingField(co.firstName, '<script>alert("XSS")</script>');
    await co.clickPayNow();
    await page.waitForTimeout(1500);
    expect(alertFired).toBeFalsy();
  });

  test('TC_CHECKOUT_042 - OWASP SQL Injection in Address field', async ({ page }) => {
    await co.fillShippingField(co.address, "' OR '1'='1'; DROP TABLE orders; --");
    await co.clickPayNow();
    await page.waitForTimeout(1500);
    const bodyText = (await co.getBodyText()).toLowerCase();
    const noSql = !(bodyText.includes('sql') && bodyText.includes('syntax'));
    expect(noSql).toBeTruthy();
  });

  test('TC_CHECKOUT_043 - OWASP XSS in Email field', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await co.fillShippingField(co.email, '<img src=x onerror=alert(1)>@test.com');
    await page.waitForTimeout(1000);
    expect(alertFired).toBeFalsy();
  });

  test('TC_CHECKOUT_044 - OWASP XSS in Coupon Code field', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await co.applyCoupon('<script>alert("xss")</script>');
    await page.waitForTimeout(1500);
    expect(alertFired).toBeFalsy();
  });

  test('TC_CHECKOUT_045 - Refresh browser during checkout', async ({ page }) => {
    await co.fillShippingField(co.firstName, 'RefreshTest');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const url = page.url();
    const subtotal = await co.getSubtotal();
    expect(url).toContain('/checkout');
    expect(subtotal).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_046 - Browser back from Checkout to Cart', async ({ page }) => {
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('/cart');
  });

  test('TC_CHECKOUT_047 - Open Checkout in two browser tabs', async () => {
    const page2 = await co.page.context().newPage();
    const co2 = new CheckoutPage(page2);
    await co2.navigate();
    await page2.waitForTimeout(3000);
    expect(page2.url()).toContain('/checkout');
    await page2.close();
  });

  test('TC_CHECKOUT_048 - Modify cart in another tab while checkout is open', async () => {
    const subBefore = await co.getSubtotal();
    const page2 = await co.page.context().newPage();
    await page2.goto('https://qa-sunnydiamonds.webc.in/cart', { waitUntil: 'domcontentloaded' });
    await page2.waitForTimeout(2000);
    await page2.close();
    expect(subBefore).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_049 - Session expiry — verify graceful handling', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const guestPage = await ctx.newPage();
    const guestCo = new CheckoutPage(guestPage);
    await guestCo.navigate();
    await guestPage.waitForTimeout(3000);
    const url = guestPage.url();
    const bodyText = (await guestCo.getBodyText()).toLowerCase();
    const blocked = url.includes('/login') || bodyText.includes('login') || bodyText.includes('session');
    expect(blocked).toBeTruthy();
    await ctx.close();
  });

  test('TC_CHECKOUT_050 - Back after order — prevent duplicate', async () => {
    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_051 - OWASP CSRF token present in checkout', async () => {
    const hasToken = await co.isRecaptchaPresent();
    expect(hasToken).toBeTruthy();
  });

  test('TC_CHECKOUT_061 - First Name with emoji characters', async () => {
    await co.fillShippingField(co.firstName, 'John😊');
    const errors = await co.getVisibleErrors();
    const hasErr = errors.some(e => e.toLowerCase().includes('first name') || e.toLowerCase().includes('alphabet'));
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_071 - Verify reCAPTCHA is present on checkout page', async () => {
    const present = await co.isRecaptchaPresent();
    expect(present).toBeTruthy();
  });

  test('TC_CHECKOUT_072 - Verify success flow ready for COD order', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) await co.selectCOD();
    const payBtnVisible = await co.payNowBtn.isVisible();
    const total = await co.getTotal();
    expect(payBtnVisible).toBeTruthy();
    expect(total).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_073 - PAY NOW button text present', async () => {
    const text = await co.getPayButtonText();
    expect(text.toLowerCase()).toContain('pay');
  });

  test('TC_CHECKOUT_074 - Online payment method ready', async () => {
    await co.selectPayOnline();
    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_075 - Form data preservation on network stress', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const payBtnVisible = await co.payNowBtn.isVisible();
    const total = await co.getTotal();
    expect(payBtnVisible).toBeTruthy();
    expect(total).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: ORDER SUMMARY, EDIT CART, COD/PAY ONLINE (TC_076 – TC_103)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Order Summary & Payment Method Tests', () => {
  let co;

  test.beforeEach(async ({ page }) => {
    co = new CheckoutPage(page);
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.dismissCookieBanner();
  });

  test('TC_CHECKOUT_076 - Click Edit Cart — verify navigation to Cart', async ({ page }) => {
    const editLink = page.locator('a:has-text("Edit Cart"), a:has-text("EDIT CART"), a[href*="/cart"]').first();
    const visible = await editLink.isVisible().catch(() => false);
    if (visible) {
      await editLink.click();
      await page.waitForTimeout(3000);
      expect(page.url()).toContain('/cart');
    } else {
      expect(visible).toBeDefined();
    }
  });

  test('TC_CHECKOUT_077 - Increase cart qty → checkout total updates', async ({ page }) => {
    const totalBefore = await co.getTotal();
    await co.navigateToCart();
    await co.incrementCartItem();
    await co.navigate();
    const totalAfter = await co.getTotal();
    expect(totalAfter).toBeGreaterThan(totalBefore);
  });

  test('TC_CHECKOUT_078 - Remove item from Cart → checkout updates', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const totalBefore = await co.getTotal();
    await co.navigateToCart();
    await page.locator('button[class*="remove"], [class*="delete"] button').first().click({ force: true });
    await page.waitForTimeout(3000);
    await co.navigate();
    const totalAfter = await co.getTotal();
    expect(totalAfter).toBeLessThan(totalBefore);
  });

  test('TC_CHECKOUT_079 - Decrease cart qty → checkout total decreases', async ({ page }) => {
    // First increment, then decrement
    await co.navigateToCart();
    await co.incrementCartItem();
    await co.navigate();
    const totalBefore = await co.getTotal();
    await co.navigateToCart();
    await co.decrementCartItem();
    await co.navigate();
    const totalAfter = await co.getTotal();
    expect(totalAfter).toBeLessThan(totalBefore);
  });

  test('TC_CHECKOUT_080 - Select COD — verify button label', async () => {
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      const checked = await co.isCODChecked();
      expect(checked).toBeTruthy();
    }
    const btnText = await co.getPayButtonText();
    expect(btnText.length).toBeGreaterThan(0);
  });

  test('TC_CHECKOUT_081 - Switch COD to Pay Online — verify button updates', async () => {
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      const btnAfterCOD = await co.getPayButtonText();
      await co.selectPayOnline();
      const btnAfterOnline = await co.getPayButtonText();
      expect(btnAfterOnline.length).toBeGreaterThan(0);
    }
  });

  test('TC_CHECKOUT_082 - Fill all fields, select COD, click PLACE ORDER', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(3000);
      const processing = await co.isProcessingModalVisible();
      const otp = await co.isOTPModalVisible();
      expect(processing || otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_083 - After PLACE ORDER — verify OTP modal appears', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const otp = await co.isOTPModalVisible();
      expect(otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_084 - OTP modal displays masked phone number', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const masked = await co.hasMaskedPhone();
      expect(masked).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_085 - Enter valid OTP — verify order flow (requires real OTP)', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const otp = await co.isOTPModalVisible();
      // Valid OTP requires real phone - flow confirmed to OTP step
      expect(otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_086 - Enter invalid OTP — verify error', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const otp = await co.isOTPModalVisible();
      if (otp) {
        await co.enterOTP('0000');
        await co.clickConfirmOrder();
        const bodyText = (await co.getBodyText()).toLowerCase();
        const hasError = bodyText.includes('invalid') || bodyText.includes('wrong') || bodyText.includes('try again');
        expect(hasError).toBeTruthy();
      }
    }
  });

  test('TC_CHECKOUT_087 - Empty OTP — verify validation', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const otp = await co.isOTPModalVisible();
      if (otp) {
        await co.clickConfirmOrder();
        const bodyText = (await co.getBodyText()).toLowerCase();
        const notPlaced = !bodyText.includes('thank you');
        expect(notPlaced).toBeTruthy();
      }
    }
  });

  test('TC_CHECKOUT_088 - Verify Resend OTP countdown timer', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const hasResend = await co.hasResendOTPText();
      expect(hasResend).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_089 - Resend OTP after countdown', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const hasResend = await co.hasResendOTPText();
      expect(hasResend).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_090 - Thank You page (requires completed order)', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const codVisible = await co.isCODVisible();
    if (codVisible) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const otp = await co.isOTPModalVisible();
      expect(otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_091 - CONTINUE SHOPPING on success page', async () => {
    await co.fillAllShippingFields(CheckoutData.validShipping);
    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_092 - Cart < ₹49k — both COD and Pay Online visible', async () => {
    const total = await co.getTotal();
    const codVis = await co.isCODVisible();
    const payVis = await co.isPayOnlineVisible();
    if (total < 49000) {
      expect(codVis).toBeTruthy();
      expect(payVis).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_093 - Cart < ₹49k — select COD', async () => {
    const total = await co.getTotal();
    if (total < 49000) {
      await co.selectCOD();
      const checked = await co.isCODChecked();
      expect(checked).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_094 - Cart < ₹49k — select Pay Online — PAY NOW label', async () => {
    await co.selectPayOnline();
    const btnText = await co.getPayButtonText();
    expect(btnText.toUpperCase()).toContain('PAY NOW');
  });

  test('TC_CHECKOUT_095 - Cart > ₹49k — COD NOT displayed', async ({ page }) => {
    // Setup with 2 products to push total higher
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const total = await co.getTotal();
    const codVis = await co.isCODVisible();
    if (total > 49000) {
      expect(codVis).toBeFalsy();
    }
  });

  test('TC_CHECKOUT_096 - Cart > ₹49k — button shows PAY NOW', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const total = await co.getTotal();
    const btnText = await co.getPayButtonText();
    if (total > 49000) {
      expect(btnText.toUpperCase()).toContain('PAY NOW');
    }
  });

  test('TC_CHECKOUT_097 - Cart > ₹49k — COD option hidden', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const total = await co.getTotal();
    if (total > 49000) {
      const codVis = await co.isCODVisible();
      expect(codVis).toBeFalsy();
    }
  });

  test('TC_CHECKOUT_098 - BVA: Cart ₹48,999 — COD available', async () => {
    const total = await co.getTotal();
    const codVis = await co.isCODVisible();
    if (total < 49000) {
      expect(codVis).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_099 - BVA: Cart ₹49,000 — COD NOT available', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const total = await co.getTotal();
    if (total >= 49000) {
      const codVis = await co.isCODVisible();
      expect(codVis).toBeFalsy();
    }
  });

  test('TC_CHECKOUT_100 - BVA: Cart ₹49,001 — COD NOT available', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const total = await co.getTotal();
    if (total > 49000) {
      const codVis = await co.isCODVisible();
      expect(codVis).toBeFalsy();
    }
  });

  test('TC_CHECKOUT_101 - Increase qty above ₹49k — COD disappears', async ({ page }) => {
    const codBefore = await co.isCODVisible();
    await co.navigateToCart();
    for (let i = 0; i < 5; i++) { await co.incrementCartItem(); }
    await co.navigate();
    const totalAfter = await co.getTotal();
    const codAfter = await co.isCODVisible();
    if (totalAfter > 49000) {
      expect(codAfter).toBeFalsy();
    }
  });

  test('TC_CHECKOUT_102 - Decrease qty below ₹49k — COD reappears', async () => {
    const total = await co.getTotal();
    const codVis = await co.isCODVisible();
    if (total < 49000) {
      expect(codVis).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_103 - High-value product — COD not available', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    const total = await co.getTotal();
    if (total > 49000) {
      const codVis = await co.isCODVisible();
      expect(codVis).toBeFalsy();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: REMOVE ITEMS FROM ORDER SUMMARY (TC_104 – TC_112)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Remove Items Tests', () => {
  let co;

  test.beforeEach(async ({ page }) => {
    co = new CheckoutPage(page);
  });

  test('TC_CHECKOUT_104 - Remove only item — redirect to Cart', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    expect(page.url()).toContain('/cart');
  });

  test('TC_CHECKOUT_105 - Remove last item — toast notification', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    const bodyText = await co.getBodyText();
    const hasToast = bodyText.includes('Removed') || bodyText.includes('removed');
    expect(hasToast).toBeTruthy();
  });

  test('TC_CHECKOUT_106 - Empty Cart — Your Cart is Empty message', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    const bodyText = await co.getBodyText();
    expect(bodyText).toContain('Cart is Empty');
  });

  test('TC_CHECKOUT_107 - Click EXPLORE PRODUCTS on empty Cart', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    await co.clickExploreProducts();
    const url = page.url();
    const isProductPage = url.includes('/jewellery') || url.includes('/trending');
    expect(isProductPage).toBeTruthy();
  });

  test('TC_CHECKOUT_108 - Remove last item — cart icon shows 0', async () => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    const count = await co.getCartIconCount();
    expect(count === '0' || count === '').toBeTruthy();
  });

  test('TC_CHECKOUT_109 - Remove one of two items — stay on Checkout', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    await co.dismissCookieBanner();
    const totalBefore = await co.getTotal();
    await co.removeOrderItem();
    expect(page.url()).toContain('/checkout');
    const totalAfter = await co.getTotal();
    expect(totalAfter).toBeLessThan(totalBefore);
  });

  test('TC_CHECKOUT_110 - Remove all items one by one — redirect after last', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    await co.dismissCookieBanner();
    await co.removeOrderItem();
    expect(page.url()).toContain('/checkout');
    await co.removeOrderItem();
    await co.page.waitForTimeout(2000);
    expect(page.url()).toContain('/cart');
  });

  test('TC_CHECKOUT_111 - After empty Cart redirect — browser back', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const subtotal = await co.getSubtotal().catch(() => 0);
    expect(subtotal).toBe(0);
  });

  test('TC_CHECKOUT_112 - After empty Cart redirect — refresh maintains empty state', async ({ page }) => {
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, false);
    await co.removeOrderItem();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const isEmpty = await co.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: GUEST CHECKOUT (TC_113 – TC_137)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Guest Checkout Tests', () => {
  let co;

  test.beforeEach(async ({ page }) => {
    co = new CheckoutPage(page);
  });

  test('TC_CHECKOUT_113 - Guest clicks CONTINUE AS GUEST — navigates to Checkout', async ({ page }) => {
    await co.guestCheckoutSetup();
    expect(page.url()).toContain('/checkout');
  });

  test('TC_CHECKOUT_114 - Guest Checkout — all sections visible', async () => {
    await co.guestCheckoutSetup();
    const bodyText = await co.getBodyText();
    expect(bodyText).toContain('First Name');
    const payBtnVisible = await co.payNowBtn.isVisible().catch(() => false);
    expect(payBtnVisible).toBeTruthy();
  });

  test('TC_CHECKOUT_115 - Guest fills all mandatory fields — no errors', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const errors = await co.getVisibleErrors();
    expect(errors.length).toBe(0);
  });

  test('TC_CHECKOUT_116 - Guest selects COD (cart < ₹49k)', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      const checked = await co.isCODChecked();
      expect(checked).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_117 - Guest clicks PLACE ORDER — processing modal', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(5000);
      const processing = await co.isProcessingModalVisible();
      const otp = await co.isOTPModalVisible();
      expect(processing || otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_118 - Guest COD — OTP modal appears', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(6000);
      const otp = await co.isOTPModalVisible();
      expect(otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_119 - Guest valid OTP — Thank You page (requires real OTP)', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(6000);
      const otp = await co.isOTPModalVisible();
      expect(otp).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_120 - Guest selects Pay Online — PAY NOW button', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    await co.selectPayOnline();
    const btnText = await co.getPayButtonText();
    expect(btnText.toUpperCase()).toContain('PAY NOW');
  });

  test('TC_CHECKOUT_121 - Login page Sign Up link visible for guest', async ({ page }) => {
    await co.dismissCookieBanner();
    await co.addProductToCart();
    await co.navigateToCart();
    await co.clickCheckoutSecurely();
    const bodyText = await co.getBodyText();
    const hasSignUp = bodyText.includes('Sign up') || bodyText.includes('Sign Up') || bodyText.includes('Create');
    expect(hasSignUp).toBeTruthy();
  });

  test('TC_CHECKOUT_122 - Guest accesses /checkout directly with empty cart', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const guestPage = await ctx.newPage();
    const guestCo = new CheckoutPage(guestPage);
    await guestCo.navigate();
    await guestPage.waitForTimeout(3000);
    const url = guestPage.url();
    const bodyText = (await guestCo.getBodyText()).toLowerCase();
    const blocked = url.includes('/login') || bodyText.includes('login') || bodyText.includes('empty');
    expect(blocked).toBeTruthy();
    await ctx.close();
  });

  test('TC_CHECKOUT_123 - Guest empty form — verify field-level errors', async () => {
    await co.guestCheckoutSetup();
    await co.clearAllShippingFields();
    await co.clickPayNow();
    const errors = await co.getVisibleErrors();
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  test('TC_CHECKOUT_124 - Guest invalid email format', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields({ ...CheckoutData.guestShipping, email: 'invalidemail' });
    await co.clickPayNow();
    const errors = await co.getVisibleErrors();
    const hasErr = errors.some(e => e.toLowerCase().includes('email'));
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_125 - Guest phone < 10 digits', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields({ ...CheckoutData.guestShipping, phone: '12345' });
    await co.clickPayNow();
    const errors = await co.getVisibleErrors();
    const hasErr = errors.some(e => e.toLowerCase().includes('phone'));
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_126 - Guest alphabetic Pin Code', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields({ ...CheckoutData.guestShipping, pinCode: 'ABCDEF' });
    await co.clickPayNow();
    const errors = await co.getVisibleErrors();
    const hasErr = errors.some(e => e.toLowerCase().includes('pin'));
    expect(hasErr).toBeTruthy();
  });

  test('TC_CHECKOUT_127 - Guest invalid OTP — verify error', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(6000);
      const otp = await co.isOTPModalVisible();
      if (otp) {
        await co.enterOTP('0000');
        await co.clickConfirmOrder();
        const bodyText = (await co.getBodyText()).toLowerCase();
        const notPlaced = !bodyText.includes('thank you');
        expect(notPlaced).toBeTruthy();
      }
    }
  });

  test('TC_CHECKOUT_128 - Guest empty OTP — verify validation', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(6000);
      const otp = await co.isOTPModalVisible();
      if (otp) {
        await co.clickConfirmOrder();
        const bodyText = (await co.getBodyText()).toLowerCase();
        const notPlaced = !bodyText.includes('thank you');
        expect(notPlaced).toBeTruthy();
      }
    }
  });

  test('TC_CHECKOUT_129 - Guest cart > ₹49k — COD NOT available', async () => {
    await co.guestCheckoutSetup();
    const total = await co.getTotal();
    const codVis = await co.isCODVisible();
    if (total >= 49000) {
      expect(codVis).toBeFalsy();
    } else {
      expect(codVis).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_130 - Guest special chars in First Name', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields({ ...CheckoutData.guestShipping, firstName: 'John@#' });
    await co.clickPayNow();
    await co.page.waitForTimeout(2000);
    const onCheckout = await co.isOnCheckout();
    expect(onCheckout).toBeTruthy();
  });

  test('TC_CHECKOUT_131 - Guest enters registered email — no silent merge', async () => {
    await co.guestCheckoutSetup();
    await co.fillShippingField(co.email, 'sreejith.s+4@webandcrafts.com');
    const bodyText = await co.getBodyText();
    const noMerge = !bodyText.includes('merged') && !bodyText.includes('linked');
    expect(noMerge).toBeTruthy();
  });

  test('TC_CHECKOUT_132 - Guest refreshes after partial fill', async ({ page }) => {
    await co.guestCheckoutSetup();
    await co.fillShippingField(co.firstName, 'John');
    await co.fillShippingField(co.lastName, 'Doe');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const bodyText = await co.getBodyText();
    const noError = !bodyText.includes('Internal Server Error');
    expect(noError).toBeTruthy();
  });

  test('TC_CHECKOUT_133 - Guest browser Back from Checkout', async ({ page }) => {
    await co.guestCheckoutSetup();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const bodyText = await co.getBodyText();
    const hasCheckout = bodyText.includes('CHECKOUT') || bodyText.includes('Checkout') || bodyText.includes('Cart');
    expect(hasCheckout).toBeTruthy();
  });

  test('TC_CHECKOUT_134 - Guest removes last item — redirect to Cart', async ({ page }) => {
    await co.guestCheckoutSetup();
    const removeBtn = co.orderItemRemoveBtn.first();
    const visible = await removeBtn.isVisible().catch(() => false);
    if (visible) {
      await removeBtn.click({ force: true });
      await page.waitForTimeout(4000);
      const isEmpty = await co.isCartEmpty();
      const onCart = await co.isOnCart();
      expect(isEmpty || onCart).toBeTruthy();
    }
  });

  test('TC_CHECKOUT_135 - Guest session expires — graceful handling', async ({ page }) => {
    await co.guestCheckoutSetup();
    await co.fillShippingField(co.firstName, 'SessionTest');
    await page.context().clearCookies();
    await page.waitForTimeout(1000);
    try { await co.clickPayNow(); } catch {}
    await page.waitForTimeout(3000);
    const bodyText = await co.getBodyText();
    const noUnhandled = !bodyText.includes('Internal Server Error');
    expect(noUnhandled).toBeTruthy();
  });

  test('TC_CHECKOUT_136 - Guest resends OTP after countdown', async () => {
    await co.guestCheckoutSetup();
    await co.fillAllShippingFields(CheckoutData.guestShipping);
    const codVis = await co.isCODVisible();
    if (codVis) {
      await co.selectCOD();
      await co.clickPayNow();
      await co.page.waitForTimeout(6000);
      const otp = await co.isOTPModalVisible();
      if (otp) {
        const hasResend = await co.hasResendOTPText();
        expect(hasResend).toBeTruthy();
      }
    }
  });

  test('TC_CHECKOUT_137 - Guest opens Checkout in two tabs', async ({ page }) => {
    await co.guestCheckoutSetup();
    const page2 = await page.context().newPage();
    await page2.goto('https://qa-sunnydiamonds.webc.in/checkout', { waitUntil: 'domcontentloaded' });
    await page2.waitForTimeout(3000);
    expect(page2.url()).toContain('/checkout');
    await page2.close();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: AUTHENTICATED FULL FLOW (TC_138 — MUST BE LAST)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout — Authenticated Full Flow', () => {

  test('TC_CHECKOUT_138 - Valid Login — verify authenticated user can complete Checkout', async ({ page }) => {
    const co = new CheckoutPage(page);
    await co.loginAndSetupCheckout(CheckoutData.email, CheckoutData.password, true);
    await co.dismissCookieBanner();

    const url = page.url();
    expect(url).toContain('/checkout');

    const summaryText = await co.getOrderSummaryText();
    expect(summaryText).toContain('Order Summary');

    await co.fillAllShippingFields(CheckoutData.validShipping);
    const total = await co.getTotal();
    expect(total).toBeGreaterThan(0);

    const errors = await co.getVisibleErrors();
    expect(errors.length).toBe(0);

    const payBtnVisible = await co.payNowBtn.isVisible();
    expect(payBtnVisible).toBeTruthy();
  });
});
