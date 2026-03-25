const BasePage = require('./BasePage');

class PLPPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.baseUrl = '/jewellery';

    // ==================== PAGE HEADING & DESCRIPTION ====================
    this.pageHeading = page.locator('h1.CategoryDescrption_title__2ZYHz');
    this.productCountLabel = page.locator('.lisitng_product_count__Om9WM');
    this.mobileProductCount = page.locator('.MobileFilterPanel_total__1zYtA');

    // ==================== BREADCRUMBS ====================
    this.breadcrumbHome = page.locator('.breadcrumb a[href="/"], [class*="breadcrumb"] a[href="/"]').first();
    this.breadcrumbLinks = page.locator('[class*="breadcrumb"] a, [class*="breadcrumb"] span');

    // ==================== FILTER PANEL ====================
    this.filterPanel = page.locator('.filter_filter__3noTO');
    this.filterTitle = page.locator('.filter_title__DKP7s');
    this.filterItems = page.locator('.filter_filter_item__32lC1');

    // Category filter checkboxes/links
    this.filterCategorySection = page.locator('.filter_filter_item__32lC1:has-text("category")');
    this.filterRings = page.locator('.filter_filter__3noTO label:has-text("Rings"), .filter_filter__3noTO a:has-text("Rings")').first();
    this.filterEarrings = page.locator('.filter_filter__3noTO label:has-text("Earrings"), .filter_filter__3noTO a:has-text("Earrings")').first();
    this.filterPendants = page.locator('.filter_filter__3noTO label:has-text("Pendants"), .filter_filter__3noTO a:has-text("Pendants")').first();
    this.filterNosepins = page.locator('.filter_filter__3noTO label:has-text("Nosepins"), .filter_filter__3noTO a:has-text("Nosepins")').first();

    // Metal color filter
    this.filterYellowGold = page.locator('.filter_filter__3noTO label:has-text("yellow gold"), .filter_filter__3noTO label:has-text("Yellow gold")').first();
    this.filterRoseGold = page.locator('.filter_filter__3noTO label:has-text("rose gold"), .filter_filter__3noTO label:has-text("Rose gold")').first();
    this.filterWhiteGold = page.locator('.filter_filter__3noTO label:has-text("white gold"), .filter_filter__3noTO label:has-text("White gold")').first();

    // Metal purity filter
    this.filter18K = page.locator('.filter_filter__3noTO label:has-text("18k"), .filter_filter__3noTO label:has-text("18K")').first();
    this.filter22K = page.locator('.filter_filter__3noTO label:has-text("22k"), .filter_filter__3noTO label:has-text("22K")').first();

    // ==================== SORT ====================
    this.sortDropdownDesktop = page.locator('button.lisitng_sorting_button__3sx5Y');
    this.sortSelect = page.locator('select.MobileFilterPanel_sort_select__1rjEa');
    this.sortDropdownMenu = page.locator('.lisitng_sort_dropdown, [class*="lisitng_sort"] [class*="dropdown"]');

    // ==================== PRODUCT GRID ====================
    this.productCards = page.locator('.Item_item__2fD-S');
    this.productNames = page.locator('h2.Item_title__20dum');
    this.productPrices = page.locator('[class*="Item_price"]');
    this.productImages = page.locator('.Item_image_wrap__18FvA img').first();
    this.productLinks = page.locator('a.product-item-content');
    this.addToCartButtons = page.locator('a.Item_add_to_cart_btn__3aY4Y, button.Item_add_to_cart_btn__3aY4Y');

    // ==================== PAGINATION ====================
    this.paginationWrapper = page.locator('.pagination-wrapper');
    this.paginationList = page.locator('ul.pagination');
    this.paginationPrevious = page.locator('.pagination button:has-text("Previous")');
    this.paginationNext = page.locator('.pagination button:has-text("Next")');
    this.paginationActivePage = page.locator('.pagination li.active button');
    this.paginationButtons = page.locator('.pagination li button');

    // ==================== MOBILE FILTER ====================
    this.mobileFilterButton = page.locator('button.MobileFilterPanel_filter_btn__2aZG0');
    this.mobileSortButton = page.locator('.MobileFilterPanel_sort_btn__2rib3');

    // ==================== COOKIE ====================
    this.cookieAcceptBtn = page.locator('button.cookie-consent_accept_btn__39jUd');
  }

  // ==================== Navigation ====================

  async navigate(path) {
    await this.navigateTo(path || this.baseUrl);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async navigateToJewellery() {
    await this.navigate('/jewellery');
  }

  async dismissCookieBanner() {
    try {
      if (await this.cookieAcceptBtn.isVisible({ timeout: 2000 })) await this.cookieAcceptBtn.click();
    } catch {}
    await this.page.waitForTimeout(500);
  }

  async goBackToPlp() {
    try {
      await this.page.goBack({ waitUntil: 'domcontentloaded', timeout: 10000 });
      await this.page.waitForTimeout(2000);
      if (!this.page.url().includes('/jewellery')) {
        await this.navigateToJewellery();
      }
    } catch {
      await this.navigateToJewellery();
    }
  }

  // ==================== Product Count ====================

  async getProductCountText() {
    const desktopVisible = await this.productCountLabel.isVisible().catch(() => false);
    if (desktopVisible) return (await this.productCountLabel.textContent()).trim();
    return (await this.mobileProductCount.textContent()).trim();
  }

  async getProductCountNumber() {
    const text = await this.getProductCountText();
    const match = text.match(/(\d[\d,]*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }

  // ==================== Filters ====================

  async expandFilterSection(sectionText) {
    const section = this.page.locator(`.filter_filter_item__32lC1:has-text("${sectionText}")`);
    const isOpen = await section.evaluate(el => el.classList.contains('uk-open')).catch(() => false);
    if (!isOpen) await section.click();
    await this.page.waitForTimeout(500);
  }

  async clickFilterOption(label) {
    await this.page.locator(`.filter_filter__3noTO label:has-text("${label}")`).first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickCategoryFilter(category) {
    await this.expandFilterSection('category');
    await this.page.waitForTimeout(500);
    await this.clickFilterOption(category);
  }

  async clickMetalColorFilter(color) {
    await this.expandFilterSection('Color');
    await this.page.waitForTimeout(500);
    await this.clickFilterOption(color);
  }

  async clickMetalPurityFilter(purity) {
    await this.expandFilterSection('metal purity');
    await this.page.waitForTimeout(500);
    await this.clickFilterOption(purity);
  }

  // ==================== Sort ====================

  async sortBy(optionValue) {
    // Use the mobile/hidden select which works reliably
    await this.sortSelect.selectOption(optionValue);
    await this.page.waitForTimeout(3000);
  }

  async sortByPriceLowToHigh() {
    await this.sortBy('product_list_new_price_asc');
  }

  async sortByPriceHighToLow() {
    await this.sortBy('product_list_new_price_desc');
  }

  async sortByNameAtoZ() {
    await this.sortBy('product_list_new_atoz');
  }

  async sortByNameZtoA() {
    await this.sortBy('product_list_new_ztoa');
  }

  // ==================== Product Data ====================

  async getVisibleProductNames() {
    return await this.productNames.allTextContents();
  }

  async getVisibleProductPrices() {
    const priceTexts = await this.page.locator('.Item_item__2fD-S [class*="Item_price"]:not([class*="wrap"])').allTextContents();
    return priceTexts.map(t => {
      const match = t.replace(/,/g, '').match(/₹\s*([\d]+)/);
      return match ? parseInt(match[1]) : 0;
    }).filter(p => p > 0);
  }

  async getProductCardCount() {
    return await this.productCards.count();
  }

  async clickFirstProduct() {
    await this.productLinks.first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickAddToCartFirst() {
    const btn = this.addToCartButtons.first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  // ==================== Pagination ====================

  async clickNextPage() {
    await this.paginationWrapper.scrollIntoViewIfNeeded();
    await this.paginationNext.click();
    await this.page.waitForTimeout(3000);
  }

  async clickPreviousPage() {
    await this.paginationWrapper.scrollIntoViewIfNeeded();
    await this.paginationPrevious.click();
    await this.page.waitForTimeout(3000);
  }

  async clickPageNumber(num) {
    await this.paginationWrapper.scrollIntoViewIfNeeded();
    await this.page.locator(`.pagination li button:has-text("${num}")`).click();
    await this.page.waitForTimeout(3000);
  }

  async getActivePage() {
    return (await this.paginationActivePage.textContent()).trim();
  }

  async isPreviousDisabled() {
    const li = this.page.locator('.pagination li:has(button:has-text("Previous"))');
    return (await li.getAttribute('class')).includes('disabled');
  }

  async isNextDisabled() {
    const li = this.page.locator('.pagination li:has(button:has-text("Next"))');
    return (await li.getAttribute('class')).includes('disabled');
  }

  // ==================== Breadcrumb ====================

  async clickBreadcrumbHome() {
    await this.breadcrumbHome.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Page State ====================

  async isOnPLP() {
    return this.page.url().includes('/jewellery');
  }

  async isPageSecure() {
    return this.page.url().startsWith('https://');
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getMetaDescription() {
    return await this.page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.getAttribute('content') : '';
    });
  }

  // ==================== Cart ====================

  async getCartCount() {
    return await this.page.evaluate(() => {
      const badge = document.querySelector('[class*="cart"] [class*="count"], [class*="cart"] [class*="badge"], [class*="cart_count"]');
      if (!badge) return 0;
      const num = parseInt(badge.textContent.trim());
      return isNaN(num) ? 0 : num;
    });
  }
}

module.exports = PLPPage;
