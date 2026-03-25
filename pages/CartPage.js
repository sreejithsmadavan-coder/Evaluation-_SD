const BasePage = require('./BasePage');

class CartPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.url = '/cart';

    // ==================== PAGE HEADING ====================
    this.myCartHeading = page.locator('.cart_title_wrapper__2i267');
    this.itemCountText = page.locator('.cart_item_count__3fNqo');

    // ==================== CART ITEMS ====================
    this.cartItemsList = page.locator('.cart_items_list__3uzNf');
    this.cartItems = page.locator('.cartItem_cart_item__3pdCT');
    this.cartItemNames = page.locator('.cartItem_name__1zYem');
    this.cartItemImages = page.locator('.cartItem_image_wrap__27u0A img');
    this.cartItemPrices = page.locator('.cartItem_cart_item__3pdCT [class*="price"]');
    this.cartItemSKUs = page.locator('.cartItem_cart_item__3pdCT [class*="sku"]');
    this.cartItemColors = page.locator('.cartItem_cart_item__3pdCT [class*="color"], .cartItem_cart_item__3pdCT [class*="variant"]');

    // ==================== QUANTITY CONTROLS ====================
    this.qtyDecrementButtons = page.locator('button.cartItem_qty_btn__2wewf[aria-label="Decrease quantity"]');
    this.qtyIncrementButtons = page.locator('button.cartItem_qty_btn__2wewf[aria-label="Increase quantity"]');
    this.qtyInputs = page.locator('input.cartItem_qty_value__2xZ3a');

    // ==================== REMOVE ITEM ====================
    this.removeButtons = page.locator('.cartItem_cart_item__3pdCT button[class*="remove"], .cartItem_cart_item__3pdCT button[class*="delete"], .cartItem_cart_item__3pdCT [class*="remove"], .cartItem_cart_item__3pdCT [aria-label*="emove"]');

    // ==================== PRICE SUMMARY ====================
    this.priceSummary = page.locator('.priceSummary_wrapper__tm5VA');
    this.subtotalAmount = page.locator('.priceSummary_wrapper__tm5VA');
    this.totalAmount = page.locator('.priceSummary_wrapper__tm5VA');

    // ==================== ACTIONS ====================
    this.continueShoppingLink = page.locator('a.cart_back_link__36oRX');
    this.checkoutButton = page.locator('a.priceSummary_checkout_btn__3f0IY');
    this.mobileCheckoutButton = page.locator('a.cart_mobile_checkout_btn__3j_PO');

    // ==================== TRUST BADGES ====================
    this.promiseSection = page.locator('.sunnyPromise_sunny_promise__2UHsd');

    // ==================== NEWSLETTER ====================
    this.newsletterInput = page.locator('#newsletter');
    this.newsletterSubmit = page.locator('button.footer_newsletter_submit__Qqn5f');

    // ==================== COOKIE ====================
    this.cookieAcceptBtn = page.locator('button.cookie-consent_accept_btn__39jUd');

    // ==================== HEADER CART ====================
    this.headerCartIcon = page.locator('.header-body_cart__8VP9a, a[href="/cart"]').first();
    this.headerCartBadge = page.locator('[class*="cart_count"], [class*="CartCount"], [class*="cart_badge"]');
  }

  // ==================== Navigation ====================

  async navigate() {
    await this.navigateTo(this.url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async dismissCookieBanner() {
    try {
      if (await this.cookieAcceptBtn.isVisible({ timeout: 2000 })) await this.cookieAcceptBtn.click();
    } catch {}
    await this.page.waitForTimeout(500);
  }

  // ==================== Login Helper ====================

  async loginAndSetupCart() {
    // Login
    await this.page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(2000);
    await this.dismissCookieBanner();
    await this.page.fill('#email', 'sreejith.s+4@webandcrafts.com');
    await this.page.fill('#password', 'Password');
    await this.page.click('button.login_login_btn__8VNqS');
    await this.page.waitForTimeout(5000);

    // Add first product
    await this.page.goto('https://qa-sunnydiamonds.webc.in/jewellery', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(3000);
    await this.page.locator('a.product-item-content').first().click();
    await this.page.waitForTimeout(3000);
    await this.page.locator('button.add-cart').first().click();
    await this.page.waitForTimeout(2000);

    // Add second product
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
    await this.page.locator('a.product-item-content').nth(1).click();
    await this.page.waitForTimeout(3000);
    await this.page.locator('button.add-cart').first().click();
    await this.page.waitForTimeout(2000);

    // Go to cart
    await this.navigate();
  }

  // ==================== Cart Item Methods ====================

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getItemCountText() {
    return await this.itemCountText.textContent().catch(() => '');
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async getItemPrice(index) {
    const priceEl = this.cartItems.nth(index).locator('[class*="price"]').first();
    const text = await priceEl.textContent().catch(() => '');
    const match = text.replace(/,/g, '').match(/₹\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getItemQty(index) {
    return await this.qtyInputs.nth(index).inputValue().catch(() => '0');
  }

  async incrementQty(index) {
    await this.qtyIncrementButtons.nth(index).click();
    await this.page.waitForTimeout(2000);
  }

  async decrementQty(index) {
    await this.qtyDecrementButtons.nth(index).click();
    await this.page.waitForTimeout(2000);
  }

  async removeItem(index) {
    // Try multiple selectors for the remove button
    const item = this.cartItems.nth(index);
    const removeBtn = item.locator('button[class*="remove"], [class*="delete"], [class*="trash"], [aria-label*="emove"], button[class*="close"]').first();
    const visible = await removeBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (visible) {
      await removeBtn.click();
    } else {
      // Fallback: use JS to find and click the remove button
      await this.page.evaluate((idx) => {
        const items = document.querySelectorAll('.cartItem_cart_item__3pdCT');
        if (items[idx]) {
          const btn = items[idx].querySelector('button[class*="remove"], [class*="delete"], [class*="trash"]');
          if (btn) btn.click();
        }
      }, index);
    }
    await this.page.waitForTimeout(2000);
  }

  // ==================== Price Summary ====================

  async getSubtotal() {
    const text = await this.page.evaluate(() => {
      const el = document.querySelector('.priceSummary_wrapper__tm5VA');
      if (!el) return '';
      return el.textContent;
    });
    const match = text.replace(/,/g, '').match(/Subtotal₹\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getTotal() {
    const text = await this.page.evaluate(() => {
      const el = document.querySelector('.priceSummary_wrapper__tm5VA');
      if (!el) return '';
      return el.textContent;
    });
    const match = text.replace(/,/g, '').match(/Total₹\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getPriceSummaryText() {
    return await this.priceSummary.textContent().catch(() => '');
  }

  // ==================== Actions ====================

  async clickContinueShopping() {
    await this.continueShoppingLink.click();
    await this.page.waitForTimeout(3000);
  }

  async clickCheckoutSecurely() {
    await this.checkoutButton.click();
    await this.page.waitForTimeout(3000);
  }

  async clickHeaderCartIcon() {
    await this.headerCartIcon.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Newsletter ====================

  async subscribeNewsletter(email) {
    await this.newsletterInput.scrollIntoViewIfNeeded();
    await this.newsletterInput.fill(email);
    await this.newsletterSubmit.click();
    await this.page.waitForTimeout(2000);
  }

  // ==================== State Checks ====================

  async isOnCartPage() {
    return this.page.url().includes('/cart');
  }

  async isCartEmpty() {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async isMyCartHeadingVisible() {
    const visible = await this.myCartHeading.isVisible().catch(() => false);
    if (visible) {
      const text = await this.myCartHeading.textContent();
      return text.includes('My Cart');
    }
    return false;
  }

  async isCheckoutButtonVisible() {
    return await this.checkoutButton.isVisible().catch(() => false);
  }

  async getEmptyCartMessage() {
    return await this.page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      if (text.includes('empty') || text.includes('no items') || text.includes('your cart is empty')) {
        return true;
      }
      return false;
    });
  }

  async getCartBadgeCount() {
    return await this.page.evaluate(() => {
      const badges = document.querySelectorAll('[class*="cart_count"], [class*="CartCount"], [class*="cart_badge"], [class*="cart"] [class*="count"]');
      for (const b of badges) {
        const num = parseInt(b.textContent.trim());
        if (!isNaN(num)) return num;
      }
      return 0;
    });
  }

  async isPageSecure() {
    return this.page.url().startsWith('https://');
  }
}

module.exports = CartPage;
