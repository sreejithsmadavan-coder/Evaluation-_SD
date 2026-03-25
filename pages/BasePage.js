class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getTitle() {
    return await this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  async waitForURL(url, options = {}) {
    await this.page.waitForURL(url, { timeout: 30000, ...options });
  }

  async clickElement(locator) {
    await locator.click();
  }

  async fillField(locator, text) {
    await locator.clear();
    await locator.fill(text);
  }

  async getText(locator) {
    return await locator.textContent();
  }

  async isVisible(locator) {
    return await locator.isVisible();
  }

  async isChecked(locator) {
    return await locator.isChecked();
  }

  async checkCheckbox(locator) {
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }

  async uncheckCheckbox(locator) {
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
  }

  async getInputValue(locator) {
    return await locator.inputValue();
  }

  async getAttributeValue(locator, attribute) {
    return await locator.getAttribute(attribute);
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = BasePage;
