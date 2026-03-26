/**
 * CheckoutPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for: https://qa-sunnydiamonds.webc.in/checkout
 *
 * Crawled selectors (verified live):
 *   INPUT  .checkout-form_formInput__14zQF     → all address text fields
 *   INPUT  placeholder="First Name*"           → first name
 *   INPUT  placeholder="Last Name*"            → last name
 *   INPUT  placeholder="Email Address*"        → email (type=email)
 *   INPUT  placeholder="Phone Number*"         → phone (type=tel)
 *   INPUT  placeholder="Address*"              → address (maxlength=150)
 *   INPUT  placeholder="Pin Code*"             → pin code
 *   INPUT  placeholder="City*"                 → city
 *   INPUT  placeholder="State*"                → state (text, not select)
 *   INPUT  placeholder="Country*"              → country
 *   INPUT  #same_shipping_address              → "Use as billing" checkbox
 *   INPUT  name="promocodes" (1st)             → coupon code field
 *   INPUT  name="promocodes" (2nd)             → gift card field
 *   BUTTON .checkout-form_promoButton__2Rlw0   → Apply buttons (coupon/gift)
 *   BUTTON .checkout-form_promoLink__2c0KY     → "View coupons" link
 *   INPUT  [type="radio"] name="virtual_order_payment_mode" → COD / Pay Online
 *   DIV    .checkout-form_paymentCard__2gBYQ   → payment option cards
 *   BUTTON .checkout-form_orderPayBtn__urOTK   → "Pay Now" button
 *   BUTTON .checkout-form_orderItemRemove__2Y3ts → remove item from order
 *   DIV    .checkout-form_summary_wrap__2BlTT   → order summary wrapper
 *   SPAN   .checkout-form_errorText__F8qUE      → validation error messages
 *   TEXTAREA #g-recaptcha-response              → reCAPTCHA response
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { expect } = require('@playwright/test');
const BasePage   = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/checkout';

    // ── Shipping Address Fields ───────────────────────────────────────────────
    this.firstNameInput  = page.locator('input[placeholder="First Name*"]');
    this.lastNameInput   = page.locator('input[placeholder="Last Name*"]');
    this.emailInput      = page.locator('input[placeholder="Email Address*"]');
    this.phoneInput      = page.locator('input[placeholder="Phone Number*"]');
    this.addressInput    = page.locator('input[placeholder="Address*"]');
    this.pinCodeInput    = page.locator('input[placeholder="Pin Code*"]');
    this.cityInput       = page.locator('input[placeholder="City*"]');
    this.stateInput      = page.locator('input[placeholder="State*"]');
    this.countryInput    = page.locator('input[placeholder="Country*"]');

    // ── Billing Address Checkbox ──────────────────────────────────────────────
    this.sameAsBillingCheckbox = page.locator('#same_shipping_address');

    // ── Coupon & Gift Card ────────────────────────────────────────────────────
    this.couponInput    = page.locator('input[name="promocodes"][placeholder="Enter coupon code"]');
    this.giftCardInput  = page.locator('input[name="promocodes"][placeholder="Enter card number"]');
    this.couponApplyBtn = page.locator('button.checkout-form_promoButton__2Rlw0').first();
    this.giftApplyBtn   = page.locator('button.checkout-form_promoButton__2Rlw0').nth(1);
    this.viewCouponsBtn = page.locator('button.checkout-form_promoLink__2c0KY');

    // ── Payment ──────────────────────────────────────────────────────────────
    this.codRadio        = page.locator('.checkout-form_paymentCard__2gBYQ').filter({ hasText: 'Cash on Delivery' }).locator('input[type="radio"]');
    this.payOnlineRadio  = page.locator('.checkout-form_paymentCard__2gBYQ').filter({ hasText: 'Pay Online' }).locator('input[type="radio"]');
    this.codCard         = page.locator('.checkout-form_paymentCard__2gBYQ').filter({ hasText: 'Cash on Delivery' });
    this.payOnlineCard   = page.locator('.checkout-form_paymentCard__2gBYQ').filter({ hasText: 'Pay Online' });
    this.payNowBtn       = page.locator('button.checkout-form_orderPayBtn__urOTK');

    // ── Order Summary ────────────────────────────────────────────────────────
    this.orderSummary     = page.locator('.checkout-form_summary_wrap__2BlTT');
    this.orderItems       = page.locator('.checkout-form_orderItem__1yqMR, .checkout-form_orderItemRow__3kTAm');
    this.removeItemBtn    = page.locator('button.checkout-form_orderItemRemove__2Y3ts');

    // ── Validation Errors ────────────────────────────────────────────────────
    this.errorTexts       = page.locator('span.checkout-form_errorText__F8qUE:not(.checkout-form_errorHidden__2i)');
    this.allErrors        = page.locator('span.checkout-form_errorText__F8qUE');

    // ── reCAPTCHA ────────────────────────────────────────────────────────────
    this.recaptchaFrame   = page.locator('iframe[src*="recaptcha"]');
    this.recaptchaResponse = page.locator('#g-recaptcha-response');

    // ── Footer Newsletter ────────────────────────────────────────────────────
    this.newsletterInput  = page.locator('#newsletter');
    this.newsletterSubmit = page.locator('button.footer_newsletter_submit__Qqn5f');
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Navigate directly to the Checkout page. */
  async navigate() {
    await this.goto(this.url);
    await this.page.waitForLoadState('networkidle');
    await this.acceptCookies();
  }

  /** Navigate back to Checkout (goBack with fallback). */
  async navigateBack() {
    try {
      await this.page.goBack({ waitUntil: 'networkidle', timeout: 6000 });
      if (!this.page.url().includes('/checkout')) await this.navigate();
    } catch {
      await this.navigate();
    }
  }

  // ── Shipping Address Actions ───────────────────────────────────────────────

  /**
   * Fill a specific address field and tab out.
   * @param {'firstName'|'lastName'|'email'|'phone'|'address'|'pinCode'|'city'|'state'|'country'} fieldName
   * @param {string} value
   */
  async fillField(fieldName, value) {
    const fieldMap = {
      firstName : this.firstNameInput,
      lastName  : this.lastNameInput,
      email     : this.emailInput,
      phone     : this.phoneInput,
      address   : this.addressInput,
      pinCode   : this.pinCodeInput,
      city      : this.cityInput,
      state     : this.stateInput,
      country   : this.countryInput,
    };
    const field = fieldMap[fieldName];
    await field.click();
    await field.fill('');
    await field.fill(value);
    await this.page.keyboard.press('Tab');
    await this.wait(500);
  }

  /** Clear a specific address field and tab out (triggers validation). */
  async clearField(fieldName) {
    await this.fillField(fieldName, '');
  }

  /** Get the current value of a specific address field. */
  async getFieldValue(fieldName) {
    const fieldMap = {
      firstName : this.firstNameInput,
      lastName  : this.lastNameInput,
      email     : this.emailInput,
      phone     : this.phoneInput,
      address   : this.addressInput,
      pinCode   : this.pinCodeInput,
      city      : this.cityInput,
      state     : this.stateInput,
      country   : this.countryInput,
    };
    return fieldMap[fieldName].inputValue();
  }

  /**
   * Fill ALL address fields with the supplied data object.
   * @param {Object} data — keys: firstName, lastName, email, phone, address, pinCode, city, state, country
   */
  async fillAllFields(data) {
    for (const [key, value] of Object.entries(data)) {
      await this.fillField(key, value);
    }
  }

  /** Clear ALL address fields (for empty-form submission tests). */
  async clearAllFields() {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'pinCode', 'city', 'state', 'country'];
    for (const field of fields) {
      await this.clearField(field);
    }
  }

  // ── Billing Address ────────────────────────────────────────────────────────

  /** Check if "Use as billing" checkbox is checked. */
  async isSameAsBillingChecked() {
    return this.sameAsBillingCheckbox.isChecked();
  }

  /** Uncheck the "Use as billing" checkbox. */
  async uncheckSameAsBilling() {
    if (await this.isSameAsBillingChecked()) {
      await this.sameAsBillingCheckbox.uncheck();
      await this.wait(500);
    }
  }

  /** Check the "Use as billing" checkbox. */
  async checkSameAsBilling() {
    if (!(await this.isSameAsBillingChecked())) {
      await this.sameAsBillingCheckbox.check();
      await this.wait(500);
    }
  }

  // ── Coupon & Gift Card ─────────────────────────────────────────────────────

  /**
   * Apply a coupon code.
   * @param {string} code
   */
  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.couponApplyBtn.click();
    await this.wait(2000);
  }

  /** Click Apply for coupon with empty input. */
  async applyEmptyCoupon() {
    await this.couponInput.fill('');
    await this.couponApplyBtn.click();
    await this.wait(1000);
  }

  /**
   * Apply a gift card.
   * @param {string} cardNumber
   */
  async applyGiftCard(cardNumber) {
    await this.giftCardInput.fill(cardNumber);
    await this.giftApplyBtn.click();
    await this.wait(2000);
  }

  // ── Payment ────────────────────────────────────────────────────────────────

  /** Select Cash on Delivery payment method. */
  async selectCOD() {
    await this.codCard.click();
    await this.wait(500);
  }

  /** Select Pay Online payment method. */
  async selectPayOnline() {
    await this.payOnlineCard.click();
    await this.wait(500);
  }

  /** Click PAY NOW button. */
  async clickPayNow() {
    await this.payNowBtn.click();
    await this.wait(2000);
  }

  /** Check if PAY NOW button is disabled. */
  async isPayNowDisabled() {
    return this.payNowBtn.isDisabled();
  }

  // ── Order Summary ──────────────────────────────────────────────────────────

  /** Get the full text of the Order Summary section. */
  async getOrderSummaryText() {
    return this.orderSummary.textContent();
  }

  /**
   * Parse a price string (e.g. "₹ 30,094" or "₹30,094") to an integer.
   * @param {string} raw
   * @returns {number}
   */
  parsePrice(raw) {
    const m = (raw || '').replace(/,/g, '').match(/₹\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Extract the Subtotal value from Order Summary. */
  async getSubtotal() {
    const text = await this.getOrderSummaryText();
    const m = text.replace(/,/g, '').match(/Subtotal₹\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Extract the Total value from Order Summary. */
  async getTotal() {
    const text = await this.getOrderSummaryText();
    const m = text.replace(/,/g, '').match(/Total₹\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Extract the Coupon Discount value from Order Summary. */
  async getCouponDiscount() {
    const text = await this.getOrderSummaryText();
    const m = text.replace(/,/g, '').match(/Coupon Code Discount₹\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Extract the Redeemed Amount from Order Summary. */
  async getRedeemedAmount() {
    const text = await this.getOrderSummaryText();
    const m = text.replace(/,/g, '').match(/Redeemed Amount₹\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Get the count of items in Order Summary. */
  async getOrderItemCount() {
    return this.orderItems.count();
  }

  // ── Validation Errors ──────────────────────────────────────────────────────

  /** Get all visible validation error messages. */
  async getVisibleErrors() {
    return this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('span.checkout-form_errorText__F8qUE'))
        .filter(el => !el.classList.contains('checkout-form_errorHidden__2i') && el.textContent.trim())
        .map(el => el.textContent.trim());
    });
  }

  /** Get the error message near a specific field (by index). */
  async getFieldError(index) {
    const allErrors = await this.page.locator('span.checkout-form_errorText__F8qUE').all();
    if (index < allErrors.length) {
      const text = await allErrors[index].textContent();
      return text.trim();
    }
    return '';
  }

  /** Check if any validation errors are visible. */
  async hasVisibleErrors() {
    const errors = await this.getVisibleErrors();
    return errors.length > 0;
  }

  // ── Newsletter ─────────────────────────────────────────────────────────────

  /** Subscribe to newsletter with given email. */
  async subscribeNewsletter(email) {
    await this.newsletterInput.scrollIntoViewIfNeeded();
    await this.newsletterInput.fill(email);
    await this.newsletterSubmit.click();
    await this.wait(2000);
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /** Assert we are on the Checkout page. */
  async assertOnCheckoutPage() {
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  /** Assert PAY NOW button is visible. */
  async assertPayNowVisible() {
    await expect(this.payNowBtn).toBeVisible();
  }

  /** Assert Order Summary section is visible. */
  async assertOrderSummaryVisible() {
    await expect(this.orderSummary).toBeVisible();
  }

  /** Assert the "Use as billing" checkbox is checked. */
  async assertSameAsBillingChecked() {
    await expect(this.sameAsBillingCheckbox).toBeChecked();
  }

  /** Assert specific error text is visible on the page. */
  async assertErrorContains(errorSubstring) {
    const errors = await this.getVisibleErrors();
    const found = errors.some(e => e.toLowerCase().includes(errorSubstring.toLowerCase()));
    expect(found).toBeTruthy();
  }

  /** Assert no validation errors are visible. */
  async assertNoErrors() {
    const errors = await this.getVisibleErrors();
    expect(errors.length).toBe(0);
  }

  /** Assert the Subtotal equals the Total (no discounts). */
  async assertSubtotalEqualsTotal() {
    const sub = await this.getSubtotal();
    const total = await this.getTotal();
    expect(sub).toBeGreaterThan(0);
    expect(sub).toBe(total);
  }

  /** Assert COD radio is selected. */
  async assertCODSelected() {
    await expect(this.codRadio).toBeChecked();
  }

  /** Assert reCAPTCHA is present on the page. */
  async assertRecaptchaPresent() {
    const count = await this.recaptchaFrame.count();
    expect(count).toBeGreaterThan(0);
  }

  /** Assert redirected to login (not on checkout). */
  async assertRedirectedToLogin() {
    await expect(this.page).toHaveURL(/\/login/, { timeout: 8000 });
  }
}

module.exports = CheckoutPage;
