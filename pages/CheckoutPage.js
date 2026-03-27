const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ==================== URLS ====================
    this.checkoutUrl = '/checkout';
    this.cartUrl = '/cart';
    this.loginUrl = '/login';
    this.plpUrl = '/jewellery';

    // ==================== SHIPPING ADDRESS FIELDS ====================
    this.firstName = page.locator('input[placeholder="First Name*"]');
    this.lastName = page.locator('input[placeholder="Last Name*"]');
    this.email = page.locator('input[placeholder="Email Address*"]');
    this.phone = page.locator('input[placeholder="Phone Number*"]');
    this.address = page.locator('input[placeholder="Address*"]');
    this.pinCode = page.locator('input[placeholder="Pin Code*"]');
    this.city = page.locator('input[placeholder="City*"]');
    this.state = page.locator('input[placeholder="State*"]');
    this.country = page.locator('input[placeholder="Country*"]');

    // ==================== BILLING ADDRESS ====================
    this.billingCheckbox = page.locator('#same_shipping_address');

    // ==================== COUPON & GIFT CARD ====================
    this.couponInput = page.locator('input[placeholder="Enter coupon code"]');
    this.couponApplyBtn = page.locator('button.checkout-form_promoButton__2Rlw0').first();
    this.giftCardInput = page.locator('input[placeholder="Enter card number"]');
    this.giftCardApplyBtn = page.locator('button.checkout-form_promoButton__2Rlw0').nth(1);

    // ==================== PAYMENT METHOD ====================
    this.codCard = page.locator('.checkout-form_paymentCard__2gBYQ').filter({ hasText: 'Cash on Delivery' });
    this.payOnlineCard = page.locator('.checkout-form_paymentCard__2gBYQ').filter({ hasText: 'Pay Online' });
    this.codRadio = this.codCard.locator('input[type="radio"]');
    this.payOnlineRadio = this.payOnlineCard.locator('input[type="radio"]');
    this.paymentSection = page.locator('.checkout-form_paymentSection__2HpwE');

    // ==================== SUBMIT / PAY NOW BUTTON ====================
    this.payNowBtn = page.locator('button.checkout-form_orderPayBtn__urOTK');

    // ==================== ORDER SUMMARY ====================
    this.orderSummary = page.locator('.checkout-form_summary_wrap__2BlTT');
    this.orderItemRemoveBtn = page.locator('button.checkout-form_orderItemRemove__2Y3ts');
    this.editCartLink = page.locator('a:has-text("Edit Cart"), a[href*="/cart"]').first();

    // ==================== VALIDATION ERRORS ====================
    this.errorTexts = page.locator('span.checkout-form_errorText__F8qUE');

    // ==================== OTP MODAL ====================
    this.otpInputs = page.locator('input[maxlength="1"]');
    this.otpTelInput = page.locator('input[type="tel"][maxlength="4"]');
    this.confirmOrderBtn = page.locator('button:has-text("CONFIRM"), button:has-text("Confirm")').first();

    // ==================== COOKIE CONSENT ====================
    this.cookieAcceptBtn = page.locator('button.cookie-consent_accept_btn__39jUd');

    // ==================== reCAPTCHA ====================
    this.recaptcha = page.locator('iframe[src*="recaptcha"], .g-recaptcha, #g-recaptcha-response');
  }

  // ==================== NAVIGATION ====================

  async navigate() {
    await this.navigateTo(this.checkoutUrl);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async navigateToCart() {
    await this.navigateTo(this.cartUrl);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async dismissCookieBanner() {
    try {
      if (await this.cookieAcceptBtn.isVisible({ timeout: 2000 })) await this.cookieAcceptBtn.click();
    } catch {}
    await this.page.waitForTimeout(500);
  }

  // ==================== LOGIN HELPER ====================

  async login(email, password) {
    await this.navigateTo(this.loginUrl);
    await this.page.waitForTimeout(2000);
    await this.dismissCookieBanner();
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button.login_login_btn__8VNqS');
    await this.page.waitForTimeout(5000);
  }

  async addProductToCart() {
    await this.navigateTo(this.plpUrl);
    await this.page.waitForTimeout(3000);
    await this.page.locator('a.product-item-content').first().click();
    await this.page.waitForTimeout(3000);
    await this.page.locator('button.add-cart').first().click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async addTwoProductsToCart() {
    await this.addProductToCart();
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
    await this.page.locator('a.product-item-content').nth(1).click();
    await this.page.waitForTimeout(3000);
    await this.page.locator('button.add-cart').first().click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async loginAndSetupCheckout(email, password, addTwo = true) {
    await this.login(email, password);
    if (addTwo) {
      await this.addTwoProductsToCart();
    } else {
      await this.addProductToCart();
    }
    await this.navigate();
  }

  // ==================== GUEST CHECKOUT SETUP ====================

  async guestCheckoutSetup() {
    await this.addProductToCart();
    await this.navigateToCart();
    await this.page.locator('a[href="/checkout"], button:has-text("CHECKOUT SECURELY"), a:has-text("CHECKOUT")').first().click();
    await this.page.waitForTimeout(3000);
    const url = this.page.url();
    if (url.includes('/checkout-auth') || url.includes('/login')) {
      try {
        await this.page.locator('button:has-text("CONTINUE AS GUEST"), a:has-text("CONTINUE AS GUEST")').first().click({ timeout: 5000 });
        await this.page.waitForTimeout(5000);
      } catch {}
    }
    try { await this.page.waitForSelector('input[placeholder="First Name*"]', { timeout: 10000 }); } catch {}
  }

  // ==================== FIELD ACTIONS ====================

  async fillShippingField(fieldLocator, value) {
    await fieldLocator.click();
    await fieldLocator.fill('');
    await fieldLocator.fill(value);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
  }

  async clearShippingField(fieldLocator) {
    await fieldLocator.click();
    await fieldLocator.fill('');
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
  }

  async fillAllShippingFields(data) {
    await this.fillShippingField(this.firstName, data.firstName);
    await this.fillShippingField(this.lastName, data.lastName);
    await this.fillShippingField(this.email, data.email);
    await this.fillShippingField(this.phone, data.phone);
    await this.fillShippingField(this.address, data.address);
    await this.fillShippingField(this.pinCode, data.pinCode);
    await this.fillShippingField(this.city, data.city);
    await this.fillShippingField(this.state, data.state);
    await this.fillShippingField(this.country, data.country || 'India');
  }

  async clearAllShippingFields() {
    const fields = [this.firstName, this.lastName, this.email, this.phone, this.address, this.pinCode, this.city, this.state, this.country];
    for (const f of fields) { await this.clearShippingField(f); }
  }

  async getFieldValue(fieldLocator) {
    return await fieldLocator.inputValue();
  }

  // ==================== VALIDATION ERRORS ====================

  async getVisibleErrors() {
    return await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('span.checkout-form_errorText__F8qUE'))
        .filter(el => !el.classList.contains('checkout-form_errorHidden__2i-nZ') && el.textContent.trim())
        .map(el => el.textContent.trim());
    });
  }

  async hasFieldError(keyword) {
    const errors = await this.getVisibleErrors();
    return errors.some(e => e.toLowerCase().includes(keyword.toLowerCase()));
  }

  // ==================== ORDER SUMMARY ====================

  async getOrderSummaryText() {
    return await this.page.evaluate(() => {
      const el = document.querySelector('.checkout-form_summary_wrap__2BlTT');
      return el ? el.textContent : '';
    });
  }

  async getSubtotal() {
    const t = (await this.getOrderSummaryText()).replace(/,/g, '');
    const m = t.match(/Subtotal₹\s*(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }

  async getTotal() {
    const t = (await this.getOrderSummaryText()).replace(/,/g, '');
    const m = t.match(/Total₹\s*(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }

  async getOrderItemCount() {
    return await this.orderItemRemoveBtn.count();
  }

  async removeOrderItem(index = 0) {
    await this.orderItemRemoveBtn.nth(index).click({ force: true });
    await this.page.waitForTimeout(4000);
  }

  // ==================== PAYMENT ====================

  async selectCOD() {
    await this.codCard.click();
    await this.page.waitForTimeout(500);
  }

  async selectPayOnline() {
    await this.payOnlineCard.click();
    await this.page.waitForTimeout(500);
  }

  async isCODVisible() {
    return await this.codCard.isVisible().catch(() => false);
  }

  async isPayOnlineVisible() {
    return await this.payOnlineCard.isVisible().catch(() => false);
  }

  async isCODChecked() {
    return await this.codRadio.isChecked().catch(() => false);
  }

  async getPayButtonText() {
    return (await this.payNowBtn.textContent()).trim();
  }

  async clickPayNow() {
    await this.payNowBtn.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== COUPON & GIFT CARD ====================

  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.couponApplyBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async applyGiftCard(number) {
    await this.giftCardInput.fill(number);
    await this.giftCardApplyBtn.click();
    await this.page.waitForTimeout(2000);
  }

  // ==================== BILLING CHECKBOX ====================

  async isBillingCheckboxChecked() {
    return await this.billingCheckbox.isChecked();
  }

  async uncheckBillingCheckbox() {
    await this.billingCheckbox.uncheck();
    await this.page.waitForTimeout(1000);
  }

  // ==================== OTP MODAL ====================

  async isOTPModalVisible() {
    const bodyText = await this.page.evaluate(() => document.body.innerText);
    return bodyText.includes('Verify') || bodyText.includes('OTP') || bodyText.includes('Mobile Number');
  }

  async isProcessingModalVisible() {
    const bodyText = await this.page.evaluate(() => document.body.innerText);
    return bodyText.includes('processing') || bodyText.includes('Processing') || bodyText.includes('please wait') || bodyText.includes('Please wait');
  }

  async enterOTP(digits) {
    const inputs = this.otpInputs;
    const count = await inputs.count();
    if (count >= 4) {
      for (let i = 0; i < 4; i++) {
        await inputs.nth(i).fill(digits[i] || '0');
      }
    } else {
      // Single OTP input
      await this.otpTelInput.fill(digits);
    }
    await this.page.waitForTimeout(500);
  }

  async clickConfirmOrder() {
    await this.confirmOrderBtn.click();
    await this.page.waitForTimeout(3000);
  }

  async hasResendOTPText() {
    const bodyText = await this.page.evaluate(() => document.body.innerText);
    return bodyText.includes('Resend') || bodyText.includes('resend') || bodyText.includes('seconds');
  }

  async hasMaskedPhone() {
    const bodyText = await this.page.evaluate(() => document.body.innerText);
    return bodyText.includes('XXXXXX') || bodyText.includes('****') || bodyText.includes('+91');
  }

  // ==================== reCAPTCHA ====================

  async isRecaptchaPresent() {
    const iframes = await this.page.locator('iframe[src*="recaptcha"]').count();
    const divs = await this.page.locator('.g-recaptcha, [class*="recaptcha"]').count();
    return iframes > 0 || divs > 0;
  }

  // ==================== PAGE STATE ====================

  async isOnCheckout() {
    return this.page.url().includes('/checkout');
  }

  async isOnCart() {
    return this.page.url().includes('/cart');
  }

  async isOnLogin() {
    return this.page.url().includes('/login');
  }

  async getBodyText() {
    return await this.page.evaluate(() => document.body.innerText);
  }

  async isCartEmpty() {
    const bodyText = await this.getBodyText();
    return bodyText.includes('Cart is Empty') || bodyText.includes('empty');
  }

  async getCartIconCount() {
    return await this.page.evaluate(() => {
      const badge = document.querySelector('[class*="cart_count"], [class*="cartCount"], .header_cart_count__1Yz1v, [class*="badge"]');
      return badge ? badge.textContent.trim() : '0';
    });
  }

  // ==================== CART PAGE ACTIONS ====================

  async clickCheckoutSecurely() {
    await this.page.locator('a[href="/checkout"], button:has-text("CHECKOUT SECURELY"), a:has-text("CHECKOUT")').first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickExploreProducts() {
    await this.page.locator('a:has-text("EXPLORE PRODUCTS"), button:has-text("EXPLORE PRODUCTS")').first().click();
    await this.page.waitForTimeout(3000);
  }

  async incrementCartItem() {
    await this.page.locator('button:has-text("+"), .cartItem_counter_btn__3VMJF:has-text("+")').first().click();
    await this.page.waitForTimeout(2000);
  }

  async decrementCartItem() {
    await this.page.locator('button:has-text("-"), .cartItem_counter_btn__3VMJF:has-text("-")').first().click();
    await this.page.waitForTimeout(2000);
  }
}

module.exports = CheckoutPage;
