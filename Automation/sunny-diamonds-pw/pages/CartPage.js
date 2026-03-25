/**
 * CartPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for: https://qa-sunnydiamonds.webc.in/cart
 *
 * Crawled selectors (verified live):
 *   H1   .cart_page_title__1bHsQ          → "My Cart"
 *   P    .cart_item_count__3fNqo           → "2 items in your cart"
 *   DIV  .cartItem_cart_item__3pdCT        → each cart item row
 *   H3   .cartItem_name__1zYem             → product name
 *   P    .cartItem_sku__Xx3qc              → SKU
 *   P    .cartItem_color__3PYBl            → colour
 *   P    .cartItem_price__3zh-2            → unit price
 *   IMG  inside .cartItem_image_wrap__27u0A → thumbnail
 *   BTN  .cartItem_qty_btn__2wewf (−/+)    → qty controls
 *   INPUT .cartItem_qty_value__2xZ3a       → qty input
 *   BTN  .cartItem_remove_btn__2yLpd       → remove item
 *   A    .priceSummary_checkout_btn__3f0IY → "CHECKOUT SECURELY"
 *   A    .cart_back_link__36oRX            → "Continue Shopping"
 *   DIV  .cart_mobile_checkout_bar__S5sSK  → mobile sticky bar
 *   SECTION .sunnyPromise_sunny_promise__2UHsd → promise section
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { expect } = require('@playwright/test');
const BasePage   = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/cart';

    // ── Page-level locators ───────────────────────────────────────────────────
    this.pageTitle         = page.locator('h1.cart_page_title__1bHsQ');
    this.itemCountText     = page.locator('p.cart_item_count__3fNqo');
    this.cartContainer     = page.locator('div.cart_cart__3FTlZ');
    this.continueShopping  = page.locator('a.cart_back_link__36oRX');
    this.checkoutBtn       = page.locator('a.priceSummary_checkout_btn__3f0IY');
    this.mobileCheckoutBar = page.locator('div.cart_mobile_checkout_bar__S5sSK');
    this.mobileCheckoutBtn = page.locator('a.cart_mobile_checkout_btn__3j_PO');
    this.promiseSection    = page.locator('section.sunnyPromise_sunny_promise__2UHsd');
    this.emptyCartMsg      = page.locator('[class*="empty"], [class*="Empty"]');

    // ── Cart item rows ────────────────────────────────────────────────────────
    this.cartItems         = page.locator('div.cartItem_cart_item__3pdCT');

    // ── Price summary ─────────────────────────────────────────────────────────
    this.subtotalLabel     = page.locator('[class*="priceSummary"]').filter({ hasText: 'Subtotal' });
    this.totalLabel        = page.locator('[class*="priceSummary"]').filter({ hasText: 'Total' });
    this.priceSummaryBlock = page.locator('[class*="priceSummary_price"], [class*="price_detail"]');

    // ── Footer newsletter ─────────────────────────────────────────────────────
    this.newsletterInput   = page.locator('input.footer_newsletter_input__A6RUM');
    this.newsletterSubmit  = page.locator('button.footer_newsletter_submit__Qqn5f');
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Navigate directly to the Cart page. */
  async navigate() {
    await this.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  /** Navigate back to Cart (uses goBack; falls back to direct navigation). */
  async navigateBack() {
    try {
      await this.page.goBack({ waitUntil: 'networkidle', timeout: 6000 });
      const onCart = this.page.url().includes('/cart');
      if (!onCart) await this.navigate();
    } catch {
      await this.navigate();
    }
  }

  // ── Cart Item Helpers ─────────────────────────────────────────────────────

  /**
   * Return a Locator scoped to the Nth cart item (0-indexed).
   * @param {number} index
   */
  itemAt(index) {
    return this.cartItems.nth(index);
  }

  /** Get the product name of the Nth cart item. */
  async getItemName(index = 0) {
    return (await this.itemAt(index).locator('h3.cartItem_name__1zYem').innerText()).trim();
  }

  /** Get the SKU text of the Nth cart item. */
  async getItemSku(index = 0) {
    return (await this.itemAt(index).locator('p.cartItem_sku__Xx3qc').innerText()).trim();
  }

  /** Get the colour text of the Nth cart item. */
  async getItemColor(index = 0) {
    return (await this.itemAt(index).locator('p.cartItem_color__3PYBl').innerText()).trim();
  }

  /** Get the raw price string of the Nth cart item. */
  async getItemPriceText(index = 0) {
    return (await this.itemAt(index).locator('p.cartItem_price__3zh-2').innerText()).trim();
  }

  /** Get the numeric price (digits only) of the Nth cart item. */
  async getItemPrice(index = 0) {
    const raw = await this.getItemPriceText(index);
    return parseInt(raw.replace(/[^\d]/g, ''), 10);
  }

  /** Get the current quantity value of the Nth cart item. */
  async getItemQuantity(index = 0) {
    const input = this.itemAt(index).locator('input.cartItem_qty_value__2xZ3a');
    const val   = await input.inputValue();
    return parseInt(val, 10) || 0;
  }

  /**
   * Set quantity of the Nth cart item via the input field.
   * @param {number} index
   * @param {string|number} value
   */
  async setItemQuantity(index = 0, value) {
    const input = this.itemAt(index).locator('input.cartItem_qty_value__2xZ3a');
    await input.click({ clickCount: 3 });   // select all
    await input.fill(String(value));
    await input.press('Tab');
    await this.page.waitForTimeout(800);
  }

  /** Click the '+' (increase) button of the Nth cart item. */
  async increaseQty(index = 0) {
    const btns = this.itemAt(index).locator('button.cartItem_qty_btn__2wewf');
    await btns.last().click();               // '+' is the second button
    await this.page.waitForTimeout(600);
  }

  /** Click the '−' (decrease) button of the Nth cart item. */
  async decreaseQty(index = 0) {
    const btns = this.itemAt(index).locator('button.cartItem_qty_btn__2wewf');
    await btns.first().click();              // '−' is the first button
    await this.page.waitForTimeout(600);
  }

  /** Click the remove icon of the Nth cart item. */
  async removeItem(index = 0) {
    await this.itemAt(index).locator('button.cartItem_remove_btn__2yLpd').click();
    await this.page.waitForTimeout(800);
  }

  /** Remove all items currently in the cart. */
  async removeAllItems() {
    let count = await this.cartItems.count();
    while (count > 0) {
      await this.removeItem(0);
      count = await this.cartItems.count();
    }
  }

  // ── Price Summary Helpers ─────────────────────────────────────────────────

  /**
   * Parse a price text like "₹ 54,524" into a plain integer 54524.
   * @param {string} raw
   */
  parsePrice(raw) {
    return parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
  }

  /** Get the displayed Subtotal as an integer. */
  async getSubtotal() {
    const block = this.page.locator('[class*="priceSummary"]');
    const text  = await block.innerText().catch(() => '0');
    // Grab the first ₹ amount after "Subtotal"
    const match = text.match(/Subtotal[\s\S]*?([0-9,]+)/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
  }

  /** Get the displayed Total as an integer. */
  async getTotal() {
    const block = this.page.locator('[class*="priceSummary"]');
    const text  = await block.innerText().catch(() => '0');
    const match = text.match(/Total[\s\S]*?([0-9,]+)/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
  }

  // ── Page Actions ──────────────────────────────────────────────────────────

  /** Click Continue Shopping. */
  async clickContinueShopping() {
    await this.continueShopping.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Click the CHECKOUT SECURELY button (desktop panel). */
  async clickCheckout() {
    await this.checkoutBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Subscribe to newsletter with the given email. */
  async subscribeNewsletter(email) {
    await this.newsletterInput.fill(email);
    await this.newsletterSubmit.click();
    await this.page.waitForTimeout(1000);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Assert Cart page is loaded (URL = /cart). */
  async assertOnCartPage() {
    await expect(this.page).toHaveURL(/\/cart/, { timeout: 8000 });
  }

  /** Assert the 'My Cart' heading is visible. */
  async assertTitleVisible() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText(/My Cart/i);
  }

  /**
   * Assert item count text contains the expected number.
   * @param {number} expectedCount
   */
  async assertItemCount(expectedCount) {
    await expect(this.itemCountText).toContainText(String(expectedCount));
  }

  /**
   * Assert the total number of rendered cart item rows.
   * @param {number} expected
   */
  async assertCartItemRowCount(expected) {
    await expect(this.cartItems).toHaveCount(expected, { timeout: 6000 });
  }

  /** Assert the cart is empty (0 item rows visible). */
  async assertCartEmpty() {
    const count = await this.cartItems.count();
    expect(count).toBe(0);
  }

  /** Assert CHECKOUT SECURELY button is visible. */
  async assertCheckoutBtnVisible() {
    await expect(this.checkoutBtn).toBeVisible();
  }

  /** Assert Continue Shopping link is visible. */
  async assertContinueShoppingVisible() {
    await expect(this.continueShopping).toBeVisible();
  }

  /** Assert Sunny Promise section is visible. */
  async assertPromiseSectionVisible() {
    await expect(this.promiseSection).toBeVisible();
  }

  /** Assert mobile checkout bar is visible. */
  async assertMobileCheckoutBarVisible() {
    await expect(this.mobileCheckoutBar).toBeVisible();
  }

  /**
   * Assert the Nth item's name matches.
   * @param {number} index
   * @param {string} expectedName
   */
  async assertItemName(index, expectedName) {
    const name = await this.getItemName(index);
    expect(name).toBe(expectedName);
  }

  /**
   * Assert the Nth item's quantity equals the expected value.
   * @param {number} index
   * @param {number} expectedQty
   */
  async assertItemQuantity(index, expectedQty) {
    const qty = await this.getItemQuantity(index);
    expect(qty).toBe(expectedQty);
  }

  /**
   * Assert the quantity field of the Nth item shows a valid positive number.
   * @param {number} index
   */
  async assertQuantityIsPositive(index = 0) {
    const qty = await this.getItemQuantity(index);
    expect(qty).toBeGreaterThan(0);
  }

  /** Assert Subtotal equals Total (no discount). */
  async assertSubtotalEqualsTotal() {
    const sub = await this.getSubtotal();
    const tot = await this.getTotal();
    expect(sub).toBe(tot);
  }
}

module.exports = CartPage;
