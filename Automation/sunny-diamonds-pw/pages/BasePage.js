/**
 * BasePage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Base class shared by all Page Objects.
 * Provides: navigation helpers, cookie consent handling, and wait utilities.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { expect } = require('@playwright/test');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.BASE_URL = 'https://qa-sunnydiamonds.webc.in';
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigate to a full URL or a path relative to BASE_URL.
   * @param {string} url - Absolute URL or path (e.g. '/cart')
   */
  async goto(url) {
    const target = url.startsWith('http') ? url : `${this.BASE_URL}${url}`;
    await this.page.goto(target, { waitUntil: 'networkidle' });
  }

  /** Navigate back to the previous page in browser history. */
  async goBack() {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /** Navigate forward to the next page in browser history. */
  async goForward() {
    await this.page.goForward({ waitUntil: 'networkidle' });
  }

  // ── Cookie Consent ─────────────────────────────────────────────────────────

  /** Accept the cookie consent banner if visible. */
  async acceptCookies() {
    try {
      const acceptBtn = this.page.locator('button.cookie-consent_accept_btn__39jUd');
      if (await acceptBtn.isVisible({ timeout: 3000 })) {
        await acceptBtn.click();
      }
    } catch {
      // Banner not present — continue silently
    }
  }

  /** Decline the cookie consent banner if visible. */
  async declineCookies() {
    try {
      const declineBtn = this.page.locator('button.cookie-consent_decline_btn__2lSLW');
      if (await declineBtn.isVisible({ timeout: 3000 })) {
        await declineBtn.click();
      }
    } catch {
      // Banner not present — continue silently
    }
  }

  // ── Wait Utilities ─────────────────────────────────────────────────────────

  /** Wait for a CSS selector to be visible. */
  async waitForSelector(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /** Wait for a given number of milliseconds. */
  async wait(ms = 500) {
    await this.page.waitForTimeout(ms);
  }

  // ── Header Helpers ─────────────────────────────────────────────────────────

  /** Return the cart badge count displayed in the site header. */
  async getHeaderCartCount() {
    const badge = this.page.locator(
      'span.mobile-sticky-navbar_cart_count__2DTGp, [class*="cart_count"]'
    ).first();
    const text = await badge.innerText().catch(() => '0');
    return parseInt(text.trim(), 10) || 0;
  }

  /** Click the cart icon in the header to navigate to /cart. */
  async clickHeaderCartIcon() {
    await this.page.locator('li.CartContainer_cart_trigger__1gv5j').click();
    await this.page.waitForURL('**/cart', { timeout: 8000 });
  }

  /** Click the Sunny Diamonds logo to navigate to the Home page. */
  async clickLogo() {
    await this.page.locator('a[href="/"], img[alt*="Sunny"], .logo a').first().click();
    await this.page.waitForLoadState('networkidle');
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /** Assert that the current page URL contains the given fragment. */
  async assertURLContains(fragment) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  /** Assert that a locator is visible on the page. */
  async assertVisible(locator) {
    await expect(locator).toBeVisible();
  }
}

module.exports = BasePage;
