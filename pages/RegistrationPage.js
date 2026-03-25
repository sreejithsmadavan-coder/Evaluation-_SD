const BasePage = require('./BasePage');

class RegistrationPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // URL
    this.url = '/create';

    // Input fields (actual IDs from DOM inspection)
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#c_password');

    // Checkboxes
    this.newsletterCheckbox = page.locator('#subscription');
    this.termsCheckbox = page.locator('#terms_and_condition');

    // Eye toggle buttons for password visibility
    this.passwordEyeIcon = page.locator('#password ~ button.passwordInput_eye_toggle__hduXa, #password + label + button.passwordInput_eye_toggle__hduXa').first();
    this.confirmPasswordEyeIcon = page.locator('#c_password ~ button.passwordInput_eye_toggle__hduXa, #c_password + label + button.passwordInput_eye_toggle__hduXa').first();

    // Buttons
    this.createAccountButton = page.locator('button.register_register_btn__3ejME');

    // Links
    this.loginLink = page.locator('.register_login_link__12U13 a[href="/login"]');

    // Error/Validation messages
    this.emailError = page.locator('.register_email_error__10NZ5');
    this.passwordMismatchError = page.locator('.srv-validation-message');
    this.allErrors = page.locator('.register_email_error__10NZ5, .srv-validation-message, .register_error__message, [class*="error_message"], [class*="validation-message"]');

    // Form
    this.form = page.locator('form');

    // Profile and logout elements (for reset steps)
    this.profileIcon = page.locator('[class*="profile"], [class*="user-icon"], [class*="account"]').first();
    this.logoutButton = page.locator('button:has-text("Log Out"), button:has-text("LOG OUT")');
    this.logoutConfirmButton = page.locator('button:has-text("LOG OUT")');
  }

  // ---------- Navigation ----------

  async navigate() {
    await this.navigateTo(this.url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  // ---------- Form Actions ----------

  async enterFirstName(name) {
    await this.firstNameInput.fill(name);
  }

  async enterLastName(name) {
    await this.lastNameInput.fill(name);
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async enterPhone(phone) {
    await this.phoneInput.fill(phone);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async enterConfirmPassword(password) {
    await this.confirmPasswordInput.fill(password);
  }

  async checkNewsletter() {
    await this.newsletterCheckbox.check();
  }

  async uncheckNewsletter() {
    if (await this.newsletterCheckbox.isChecked()) {
      await this.newsletterCheckbox.uncheck();
    }
  }

  async checkTermsAndCondition() {
    await this.termsCheckbox.check();
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async doubleClickCreateAccount() {
    await this.createAccountButton.dblclick();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  // ---------- Password Eye Toggle ----------

  async clickPasswordEyeIcon() {
    // The eye icon is a sibling button inside the password container
    const eyeBtn = this.page.locator('.passwordInput_eye_toggle__hduXa').first();
    await eyeBtn.click();
  }

  async clickConfirmPasswordEyeIcon() {
    // The second eye icon is for confirm password
    const eyeBtn = this.page.locator('.passwordInput_eye_toggle__hduXa').nth(1);
    await eyeBtn.click();
  }

  async getPasswordFieldType() {
    return await this.passwordInput.getAttribute('type');
  }

  async getConfirmPasswordFieldType() {
    return await this.confirmPasswordInput.getAttribute('type');
  }

  // ---------- Fill Full Form ----------

  async fillRegistrationForm(data) {
    if (data.firstName !== undefined) await this.enterFirstName(data.firstName);
    if (data.lastName !== undefined) await this.enterLastName(data.lastName);
    if (data.email !== undefined) await this.enterEmail(data.email);
    if (data.phone !== undefined) await this.enterPhone(data.phone);
    if (data.password !== undefined) await this.enterPassword(data.password);
    if (data.confirmPassword !== undefined) await this.enterConfirmPassword(data.confirmPassword);

    if (data.newsletter === true) {
      await this.checkNewsletter();
    }

    if (data.termsAndCondition === true) {
      await this.checkTermsAndCondition();
    }
  }

  // ---------- Validation Helpers ----------

  async getVisibleErrors() {
    await this.page.waitForTimeout(1000);
    const errorElements = await this.allErrors.all();
    const errors = [];
    for (const el of errorElements) {
      const visible = await el.isVisible().catch(() => false);
      if (visible) {
        const text = await el.textContent().catch(() => '');
        if (text.trim()) errors.push(text.trim());
      }
    }
    return errors;
  }

  async isValidationErrorVisible() {
    await this.page.waitForTimeout(1000);
    const errors = await this.getVisibleErrors();
    return errors.length > 0;
  }

  async getEmailErrorText() {
    const visible = await this.emailError.isVisible().catch(() => false);
    return visible ? await this.emailError.textContent() : '';
  }

  async getPasswordMismatchErrorText() {
    const visible = await this.passwordMismatchError.isVisible().catch(() => false);
    return visible ? await this.passwordMismatchError.textContent() : '';
  }

  // Check if HTML5 validation prevented submission
  async isFormInvalid() {
    return await this.page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return false;
      return !form.checkValidity();
    });
  }

  // Get HTML5 validation messages for all fields
  async getHTML5ValidationMessages() {
    return await this.page.evaluate(() => {
      const fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'c_password'];
      const messages = {};
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.validationMessage) {
          messages[id] = el.validationMessage;
        }
      });
      return messages;
    });
  }

  // ---------- Field Value Getters ----------

  async getFirstNameValue() {
    return await this.firstNameInput.inputValue();
  }

  async getLastNameValue() {
    return await this.lastNameInput.inputValue();
  }

  async getEmailValue() {
    return await this.emailInput.inputValue();
  }

  async getPhoneValue() {
    return await this.phoneInput.inputValue();
  }

  // ---------- Page State Checks ----------

  async isOnRegistrationPage() {
    return this.page.url().includes('/create');
  }

  async isOnLoginPage() {
    return this.page.url().includes('/login');
  }

  async isOnDashboard() {
    const url = this.page.url();
    return !url.includes('/create') && !url.includes('/login');
  }

  async isCreateAccountButtonDisabled() {
    return await this.createAccountButton.isDisabled().catch(() => false);
  }

  async isPageSecure() {
    return this.page.url().startsWith('https://');
  }
}

module.exports = RegistrationPage;
