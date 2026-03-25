/**
 * PDPPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Product Detail Page (PDP)
 * Example URL: https://qa-sunnydiamonds.webc.in/aminah-diamond-ring?variant_id=1330
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { expect } = require('@playwright/test');
const BasePage   = require('./BasePage');

class PDPPage extends BasePage {
  constructor(page) {
    super(page);

    // ── Locators ──────────────────────────────────────────────────────────────
    this.addToCartBtn    = page.locator('button.add-cart').first();
    this.productTitle    = page.locator('h1, [class*="product_title"], [class*="productTitle"]').first();
    this.productPrice    = page.locator('[class*="productDetail_price"], [class*="product_price"]').first();
    this.successToast    = page.locator('[class*="toast"], [class*="notification"], [class*="success"]').first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigate to a specific PDP URL.
   * @param {string} pdpUrl - Full URL or path with variant_id
   */
  async navigate(pdpUrl) {
    await this.goto(pdpUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /** Click ADD TO CART on the current PDP. */
  async addToCart() {
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 8000 });
    await this.addToCartBtn.click();
    // Give the cart API call time to complete
    await this.page.waitForTimeout(1000);
  }

  /** Get the product name from the current PDP. */
  async getProductName() {
    return (await this.productTitle.innerText()).trim();
  }

  /** Get the unit price displayed on the current PDP. */
  async getProductPrice() {
    const raw = await this.productPrice.innerText().catch(() => '0');
    return raw.replace(/[^\d]/g, '');
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Assert the page is on a PDP (URL contains variant_id). */
  async assertOnPDP() {
    await expect(this.page).toHaveURL(/variant_id=/, { timeout: 8000 });
  }
}

module.exports = PDPPage;
