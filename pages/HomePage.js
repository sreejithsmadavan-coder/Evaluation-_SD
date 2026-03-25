const BasePage = require('./BasePage');

class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.url = '/';

    // ==================== TOP BAR ====================
    this.announcementBanner = page.locator('.topbar_topbarText__3OIoY');
    this.storeLocatorLink = page.locator('.topbar_storeLocator__QhFEp');
    this.orderTrackingLink = page.locator('.topbar_orderTracking__2Qb5N');

    // ==================== HEADER ====================
    this.logo = page.locator('a[href="/"] img[alt="Sunny Diamonds"].img-fluid').first();
    this.logoLink = page.locator('a[href="/"]').first();
    this.searchButton = page.locator('button.uk-button.uk-button-link.uk-padding-remove').first();
    this.wishlistLink = page.locator('a[href="/wishlists"]').first();
    this.cartIcon = page.locator('.header-body_cart__8VP9a').first();
    this.cartLink = page.locator('a[href="/cart"]').first();
    this.loginLink = page.locator('a.header-body_dropdown_btn_primary__1TCuY');
    this.signUpLink = page.locator('a.header-body_dropdown_btn_secondary__1O3PQ');

    // ==================== NAVIGATION MENU ====================
    this.navAllJewellery = page.locator('a.navbar_navLink__1Ai1z:has-text("ALL JEWELLERY")');
    this.navEarrings = page.locator('a.navbar_navLink__1Ai1z:has-text("EARRINGS")');
    this.navNosepins = page.locator('a.navbar_navLink__1Ai1z:has-text("NOSEPINS")');
    this.navRings = page.locator('a.navbar_navLink__1Ai1z:has-text("RINGS")');
    this.navPendants = page.locator('a.navbar_navLink__1Ai1z:has-text("PENDANTS")');
    this.navGiftCards = page.locator('a.navbar_navLink__1Ai1z:has-text("GIFT CARDS")');
    this.navTrending = page.locator('a.navbar_trendingLink__2AW9I');
    this.navMonthlyPlans = page.locator('a.navbar_navLink__1Ai1z:has-text("MONTHLY PLANS")');
    this.navEducation = page.locator('a.navbar_navLink__1Ai1z:has-text("EDUCATION")');

    // Mega menu dropdowns
    this.megaMenuColumns = page.locator('.navbar_columnHeading__cM6dW');
    this.megaMenuDropdown = page.locator('.navbar_megaMenu__container, [class*="navbar_dropdown"], [class*="megamenu"]');

    // ==================== HERO BANNER ====================
    this.heroBannerSection = page.locator('.HomeNewBanner_bannerSection__qmNB4');
    this.heroShopNowButtons = page.locator('.HomeNewBanner_banner_content__1NtVP a, .HomeNewBanner_cta__btn a, .HomeNewBanner_bannerSection__qmNB4 a');

    // ==================== SHOP BY CATEGORY ====================
    this.shopByCategorySection = page.locator('.HomeShopByCategory_shopByCategorySection__3dnDe');
    this.shopByCategoryHeading = page.locator('h2.HomeShopByCategory_headingTitle__3Gkzb');
    this.categoryTiles = page.locator('h3.HomeShopByCategory_categoryName__3aIKY');
    this.shopAllLink = page.locator('.HomeShopByCategory_shopByCategorySection__3dnDe a:has-text("SHOP ALL")').first();

    // ==================== FEATURED BANNERS ====================
    this.featuredBannerSection = page.locator('.category-showcase_categoryShowcase__1B5G2');
    this.featuredBannerTitles = page.locator('h2.category-showcase_title__1wrQK');

    // ==================== TRENDING PRODUCTS ====================
    this.trendingSection = page.locator('.homeTrendingProducts_trending_products_section__3CRH6');
    this.trendingHeading = page.locator('h2.homeTrendingProducts_title__1YbU3');
    this.trendingViewAll = page.locator('.homeTrendingProducts_trending_products_section__3CRH6 a:has-text("View All")');
    this.trendingProductCards = page.locator('.homeTrendingProducts_trending_products_section__3CRH6 .Item_item_wrap__pMmZs, .homeTrendingProducts_trending_products_section__3CRH6 [class*="Item_item"]');
    this.trendingProductNames = page.locator('.homeTrendingProducts_trending_products_section__3CRH6 h2[class*="Item_title"]');
    this.trendingProductPrices = page.locator('.homeTrendingProducts_trending_products_section__3CRH6 [class*="Item_price"], .homeTrendingProducts_trending_products_section__3CRH6 [class*="price"]');
    this.trendingAddToCartButtons = page.locator('.homeTrendingProducts_trending_products_section__3CRH6 [class*="add_to_cart"]');

    // ==================== GIFT IDEAS ====================
    this.giftSection = page.locator('[class*="gift"], [class*="Gift"]');
    this.findYourGiftCTA = page.locator('a:has-text("Find Your Gift"), button:has-text("Find Your Gift")');
    this.giftsUnder10k = page.locator('a:has-text("Gifts Under"), a[href*="range=0TO10000"]');

    // ==================== PRODUCT CAROUSEL ====================
    this.productCarouselCards = page.locator('.homeGlitz_product_card__7SBHv');
    this.productCarouselShopNow = page.locator('.homeGlitz_product_card__7SBHv a:has-text("SHOP NOW")');

    // ==================== TESTIMONIALS ====================
    this.testimonialsSection = page.locator('[class*="testimonial"], [class*="Testimonial"]');

    // ==================== TRUST BADGES ====================
    this.trustBadgesSection = page.locator('[class*="promise"], [class*="Promise"], [class*="trust"], [class*="Trust"]');

    // ==================== NEWSLETTER ====================
    this.newsletterInput = page.locator('#newsletter');
    this.newsletterSubmit = page.locator('button.footer_newsletter_submit__Qqn5f');
    this.newsletterForm = page.locator('.footer_newsletter_form__1LI1R');

    // ==================== FOOTER ====================
    this.footer = page.locator('footer, [class*="footer"]').first();
    this.footerAboutUs = page.locator('footer a[href="/about-us"], [class*="footer"] a[href="/about-us"]');
    this.footerFAQ = page.locator('footer a[href="/faq"], [class*="footer"] a[href="/faq"]');
    this.footerTerms = page.locator('a[href="/terms-and-conditions"]').last();
    this.footerPrivacy = page.locator('a[href="/privacy-policy"]').last();
    this.footerCopyright = page.locator('[class*="footer"] [class*="copyright"], footer [class*="copyright"]');

    // ==================== COOKIE CONSENT ====================
    this.cookieBanner = page.locator('[class*="cookie-consent"]').first();
    this.cookieAcceptBtn = page.locator('button.cookie-consent_accept_btn__39jUd');
    this.cookieDeclineBtn = page.locator('button.cookie-consent_decline_btn__2lSLW');
    this.cookieCloseBtn = page.locator('button.cookie-consent_close_btn__3CHmD');

    // ==================== MOBILE NAV ====================
    this.mobileBottomNav = page.locator('[class*="mobile-sticky-navbar"]');
  }

  // ==================== Navigation ====================

  async navigate() {
    await this.navigateTo(this.url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async dismissCookieBanner() {
    try {
      if (await this.cookieAcceptBtn.isVisible({ timeout: 3000 })) {
        await this.cookieAcceptBtn.click();
        await this.page.waitForTimeout(500);
      }
    } catch { /* not present */ }
  }

  async ensureOnHomePage() {
    const url = this.page.url();
    if (url === 'https://qa-sunnydiamonds.webc.in/' || url === 'https://qa-sunnydiamonds.webc.in') return;
    await this.page.goBack();
    await this.page.waitForTimeout(2000);
    // If goBack didn't work, navigate directly
    if (!this.isOnHomePage()) {
      await this.navigate();
    }
  }

  isOnHomePage() {
    const url = this.page.url();
    return url === 'https://qa-sunnydiamonds.webc.in/' || url === 'https://qa-sunnydiamonds.webc.in';
  }

  // ==================== Header Actions ====================

  async clickLogo() {
    await this.logoLink.click();
    await this.page.waitForTimeout(2000);
  }

  async clickLogin() {
    await this.loginLink.click();
    await this.page.waitForTimeout(2000);
  }

  async clickSignUp() {
    await this.signUpLink.click();
    await this.page.waitForTimeout(2000);
  }

  async clickStoreLocator() {
    await this.storeLocatorLink.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOrderTracking() {
    await this.orderTrackingLink.click();
    await this.page.waitForTimeout(2000);
  }

  // ==================== Navigation Menu ====================

  async hoverAllJewellery() {
    await this.navAllJewellery.hover();
    await this.page.waitForTimeout(1000);
  }

  async clickNavEarrings() {
    await this.navEarrings.click();
    await this.page.waitForTimeout(3000);
  }

  async clickNavTrending() {
    await this.navTrending.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Hero Section ====================

  async clickHeroShopNow() {
    await this.heroShopNowButtons.first().click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Shop by Category ====================

  async clickCategoryTile(name) {
    await this.page.locator(`.HomeShopByCategory_shopByCategorySection__3dnDe a:has-text("${name}")`).first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickShopAll() {
    await this.shopAllLink.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Featured Banners ====================

  async clickExploreEarrings() {
    const link = this.page.locator('.category-showcase_categoryShowcase__1B5G2 a:has-text("EXPLORE"), .category-showcase_categoryShowcase__1B5G2 a[href*="earrings"]').first();
    await link.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Trending Products ====================

  async getTrendingProductCount() {
    return await this.trendingProductNames.count();
  }

  async getTrendingProductDetails() {
    const names = await this.trendingProductNames.allTextContents();
    return names;
  }

  async clickTrendingViewAll() {
    await this.trendingViewAll.click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Gift Section ====================

  async clickFindYourGift() {
    await this.findYourGiftCTA.first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickGiftsUnder10k() {
    await this.giftsUnder10k.first().click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Product Carousel ====================

  async clickCarouselShopNow(productName) {
    const card = this.page.locator(`.homeGlitz_product_card__7SBHv:has-text("${productName}")`);
    await card.locator('a:has-text("SHOP NOW")').click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== Newsletter ====================

  async subscribeNewsletter(email) {
    await this.newsletterInput.scrollIntoViewIfNeeded();
    await this.newsletterInput.fill(email);
    await this.newsletterSubmit.click();
    await this.page.waitForTimeout(2000);
  }

  async getNewsletterMessages() {
    return await this.page.evaluate(() => {
      const msgs = document.querySelectorAll('[class*="newsletter"] [class*="message"], [class*="newsletter"] [class*="error"], [class*="newsletter"] [class*="success"], .footer_error_message__1U8rJ, .footer_success_message__1U8rJ, [class*="footer_error"], [class*="footer_success"]');
      return Array.from(msgs).filter(el => el.textContent.trim()).map(el => el.textContent.trim());
    });
  }

  // ==================== Footer ====================

  async clickFooterAboutUs() {
    await this.footerAboutUs.first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickFooterFAQ() {
    await this.footerFAQ.first().click();
    await this.page.waitForTimeout(3000);
  }

  async clickFooterTerms() {
    await this.footerTerms.click();
    await this.page.waitForTimeout(3000);
  }

  async clickFooterPrivacy() {
    await this.footerPrivacy.click();
    await this.page.waitForTimeout(3000);
  }

  async getFooterCopyrightText() {
    return await this.page.evaluate(() => {
      const footerText = document.querySelector('footer, [class*="footer"]')?.innerText || '';
      const match = footerText.match(/©.*/);
      return match ? match[0].trim() : '';
    });
  }

  // ==================== Cookie Consent ====================

  async acceptCookies() {
    await this.cookieAcceptBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async declineCookies() {
    await this.cookieDeclineBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async isCookieBannerVisible() {
    return await this.cookieBanner.isVisible().catch(() => false);
  }

  // ==================== Search ====================

  async openSearch() {
    await this.searchButton.click();
    await this.page.waitForTimeout(1000);
  }

  async searchFor(query) {
    await this.openSearch();
    const searchInput = this.page.locator('input[type="search"], input[placeholder*="Search" i], [class*="search"] input').first();
    if (query) await searchInput.fill(query);
    await searchInput.press('Enter');
    await this.page.waitForTimeout(3000);
  }

  // ==================== Page State ====================

  async getPageTitle() {
    return await this.page.title();
  }

  async getMetaDescription() {
    return await this.page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.getAttribute('content') : '';
    });
  }

  async isPageSecure() {
    return this.page.url().startsWith('https://');
  }

  // ==================== Performance ====================

  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf ? Math.round(perf.domContentLoadedEventEnd - perf.startTime) : null,
        loadComplete: perf ? Math.round(perf.loadEventEnd - perf.startTime) : null,
      };
    });
  }

  // ==================== Trust Badges ====================

  async getTrustBadgeTexts() {
    return await this.page.evaluate(() => {
      const section = document.querySelector('[class*="promise"], [class*="Promise"], [class*="trust"], [class*="Trust"]');
      if (!section) return [];
      const items = section.querySelectorAll('[class*="item"], [class*="badge"], li, div > span, div > p');
      return Array.from(items).map(el => el.textContent.trim()).filter(t => t.length > 3 && t.length < 100);
    });
  }

  // ==================== Testimonials ====================

  async getTestimonials() {
    return await this.page.evaluate(() => {
      const section = document.querySelector('[class*="testimonial"], [class*="Testimonial"]');
      if (!section) return [];
      const cards = section.querySelectorAll('[class*="card"], [class*="item"], [class*="slide"]');
      return Array.from(cards).slice(0, 5).map(el => ({
        text: el.textContent?.trim().substring(0, 200),
      }));
    });
  }
}

module.exports = HomePage;
