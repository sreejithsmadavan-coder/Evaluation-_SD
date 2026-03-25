/**
 * LoginPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for: https://qa-sunnydiamonds.webc.in/login
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { expect } = require('@playwright/test');
const BasePage   = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/login';

    // ── Locators ──────────────────────────────────────────────────────────────
    this.emailInput    = page.locator('input[type="email"], input[name="email"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.signInBtn     = page.locator('button[type="submit"]').first();
    this.errorMsg      = page.locator('[class*="error"], [class*="alert"], .form-error').first();
    this.logoutLink    = page.locator('a[href*="logout"], button:has-text("Log Out")').first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate to the Login page. */
  async navigate() {
    await this.goto(this.url);
    await this.acceptCookies();
  }

  /**
   * Fill in credentials and click Sign In.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Full login flow: navigate to /login, enter credentials, submit.
   * @param {string} email
   * @param {string} password
   */
  async loginWithCredentials(email, password) {
    await this.navigate();
    await this.login(email, password);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Assert user is successfully logged in (no longer on /login). */
  async assertLoginSuccess() {
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 8000 });
  }

  /** Assert user is still on the login page (login failed). */
  async assertLoginFailed() {
    await expect(this.page).toHaveURL(/\/login/, { timeout: 5000 });
  }

  /** Assert an error message is visible after invalid login attempt. */
  async assertErrorVisible() {
    await expect(this.errorMsg).toBeVisible({ timeout: 5000 });
  }
}

module.exports = LoginPage;
