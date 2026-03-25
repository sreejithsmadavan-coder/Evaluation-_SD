const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // URL
    this.url = '/login';

    // Headings
    this.welcomeBackHeading = page.locator('h3.login_main_title__3zPXj');
    this.newHereHeading = page.locator('h4.login_sec_title__3C-aP');

    // Input fields
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');

    // Eye toggle for password visibility
    this.passwordEyeIcon = page.locator('button.passwordInput_eye_toggle__hduXa');

    // Checkbox
    this.rememberMeCheckbox = page.locator('#rememberMe');

    // Buttons
    this.signInButton = page.locator('button.login_login_btn__8VNqS');

    // Links
    this.forgotPasswordLink = page.locator('a[href="/forgot-password"]');
    this.createAccountLink = page.locator('a.login_create_acc_btn__fR4Zd');

    // Labels
    this.emailLabel = page.locator('label[for="email"].login_floating_label__1OfQV');
    this.passwordLabel = page.locator('label[for="password"].login_floating_label__1OfQV');
    this.rememberMeLabel = page.locator('label[for="rememberMe"]');

    // Validation error messages (custom JS validation — form uses novalidate)
    this.validationMessages = page.locator('.srv-validation-message');
    this.emailError = page.locator('.login_form_group__huYaE:has(#email) .srv-validation-message');
    this.passwordError = page.locator('.login_form_group__huYaE:has(#password) .srv-validation-message');

    // General error messages (server-side auth errors)
    this.authError = page.locator('.login_error__message, [class*="error_message"], [class*="login_error"], .srv-validation-message');

    // Cookie consent banner
    this.cookieAcceptButton = page.locator('button.cookie-consent_accept_btn__39jUd');
    this.cookieDeclineButton = page.locator('button.cookie-consent_decline_btn__2lSLW');
    this.cookieCloseButton = page.locator('button.cookie-consent_close_btn__3CHmD');
  }

  // ==================== Navigation ====================

  async navigate() {
    await this.navigateTo(this.url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async dismissCookieBanner() {
    try {
      const visible = await this.cookieAcceptButton.isVisible({ timeout: 3000 });
      if (visible) {
        await this.cookieAcceptButton.click();
        await this.page.waitForTimeout(500);
      }
    } catch {
      // Banner not present — ignore
    }
  }

  // ==================== Form Actions ====================

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async doubleClickSignIn() {
    await this.signInButton.dblclick();
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  async loginWithRememberMe(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.checkRememberMe();
    await this.clickSignIn();
  }

  // ==================== Checkbox Actions ====================

  async checkRememberMe() {
    if (!(await this.rememberMeCheckbox.isChecked())) {
      await this.rememberMeCheckbox.check();
    }
  }

  async uncheckRememberMe() {
    if (await this.rememberMeCheckbox.isChecked()) {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  async isRememberMeChecked() {
    return await this.rememberMeCheckbox.isChecked();
  }

  // ==================== Password Eye Toggle ====================

  async clickPasswordEyeIcon() {
    await this.passwordEyeIcon.click();
  }

  async getPasswordFieldType() {
    return await this.passwordInput.getAttribute('type');
  }

  // ==================== Link Actions ====================

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickCreateAccount() {
    await this.createAccountLink.click();
  }

  // ==================== Validation & Error Helpers ====================

  async getVisibleValidationMessages() {
    await this.page.waitForTimeout(1000);
    const messages = [];
    const elements = await this.validationMessages.all();
    for (const el of elements) {
      const visible = await el.isVisible().catch(() => false);
      if (visible) {
        const text = await el.textContent().catch(() => '');
        if (text.trim()) messages.push(text.trim());
      }
    }
    return messages;
  }

  async getEmailErrorText() {
    await this.page.waitForTimeout(500);
    const visible = await this.emailError.isVisible().catch(() => false);
    return visible ? (await this.emailError.textContent()).trim() : '';
  }

  async getPasswordErrorText() {
    await this.page.waitForTimeout(500);
    const visible = await this.passwordError.isVisible().catch(() => false);
    return visible ? (await this.passwordError.textContent()).trim() : '';
  }

  async getAllVisibleErrors() {
    await this.page.waitForTimeout(1000);
    return await this.page.evaluate(() => {
      const selectors = '.srv-validation-message, [class*="error_message"], [class*="login_error"], [class*="Error"]';
      return Array.from(document.querySelectorAll(selectors))
        .filter(el => el.offsetParent !== null && el.textContent.trim())
        .map(el => el.textContent.trim());
    });
  }

  async isValidationErrorVisible() {
    const errors = await this.getVisibleValidationMessages();
    return errors.length > 0;
  }

  // ==================== UI Element Visibility Checks ====================

  async isWelcomeBackHeadingVisible() {
    return await this.welcomeBackHeading.isVisible().catch(() => false);
  }

  async isEmailInputVisible() {
    return await this.emailInput.isVisible().catch(() => false);
  }

  async isPasswordInputVisible() {
    return await this.passwordInput.isVisible().catch(() => false);
  }

  async isPasswordEyeIconVisible() {
    return await this.passwordEyeIcon.isVisible().catch(() => false);
  }

  async isRememberMeCheckboxVisible() {
    return await this.rememberMeCheckbox.isVisible().catch(() => false);
  }

  async isForgotPasswordLinkVisible() {
    return await this.forgotPasswordLink.isVisible().catch(() => false);
  }

  async isSignInButtonVisible() {
    return await this.signInButton.isVisible().catch(() => false);
  }

  async isCreateAccountLinkVisible() {
    return await this.createAccountLink.isVisible().catch(() => false);
  }

  async isSignInButtonDisabled() {
    return await this.signInButton.isDisabled().catch(() => false);
  }

  // ==================== Page State Checks ====================

  async isOnLoginPage() {
    return this.page.url().includes('/login');
  }

  async isOnForgotPasswordPage() {
    return this.page.url().includes('/forgot-password');
  }

  async isOnRegistrationPage() {
    return this.page.url().includes('/create');
  }

  async isLoggedIn() {
    const url = this.page.url();
    return !url.includes('/login') && !url.includes('/create') && !url.includes('/forgot-password');
  }

  async isPageSecure() {
    return this.page.url().startsWith('https://');
  }

  // ==================== Field Value Getters ====================

  async getEmailValue() {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue() {
    return await this.passwordInput.inputValue();
  }

  // ==================== Post-Login Actions ====================

  async logout() {
    try {
      const profileIcon = this.page.locator('[class*="profile"], [class*="user-icon"], [class*="account"]').first();
      await profileIcon.click();
      await this.page.waitForTimeout(1000);
      const logoutBtn = this.page.locator('button:has-text("Log Out"), a:has-text("Log Out")').first();
      await logoutBtn.click();
      await this.page.waitForTimeout(1000);
      const confirmBtn = this.page.locator('button:has-text("LOG OUT")').first();
      await confirmBtn.click();
      await this.page.waitForTimeout(2000);
    } catch {
      // Logout flow may vary
    }
  }
}

module.exports = LoginPage;
