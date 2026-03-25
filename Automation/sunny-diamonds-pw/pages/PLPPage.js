/**
 * PLPPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for: https://qa-sunnydiamonds.webc.in/jewellery  (Product Listing Page)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { expect } = require('@playwright/test');
const BasePage   = require('./BasePage');

class PLPPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/jewellery';

    // ── Locators ──────────────────────────────────────────────────────────────
    this.allJewelleryNavLink = page.locator('a.navbar_navLink__1Ai1z:has-text("ALL JEWELLERY")').first();
    this.productCards        = page.locator('[class*="Item_item"], [class*="product_card"]');
    this.productLinks        = page.locator('a[href*="?variant_id="]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate to the All Jewellery PLP. */
  async navigate() {
    await this.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  /** Click ALL JEWELLERY from the navigation menu. */
  async clickAllJewellery() {
    await this.allJewelleryNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the Nth product link on the PLP (0-indexed).
   * @param {number} index - Default 0 (first product)
   */
  async clickProductAtIndex(index = 0) {
    const links = this.productLinks;
    await links.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Return the href of the Nth product link. */
  async getProductUrl(index = 0) {
    return await this.productLinks.nth(index).getAttribute('href');
  }

  /** Return the total number of product links visible on current page. */
  async getProductCount() {
    return await this.productLinks.count();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Assert PLP loaded (URL contains /jewellery). */
  async assertOnPLP() {
    await expect(this.page).toHaveURL(/jewellery/, { timeout: 8000 });
  }
}

module.exports = PLPPage;
