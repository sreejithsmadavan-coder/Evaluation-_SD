const BasePage = require('./BasePage');

class PDPPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.baseUrl = '/18-k-rose-gold-mia-diamond-pendant?variant_id=45';
    this.baseUrlNoVariant = '/18-k-rose-gold-mia-diamond-pendant';

    // ==================== PRODUCT INFO ====================
    this.productTitle = page.locator('h1.productDetail_product_title__U9wVk');
    this.skuText = page.locator('.productDetail_sku_text__pW5s7');
    this.priceSection = page.locator('.productDetail_price_section__12vcM');
    this.priceText = page.locator('.productDetail_price_text__3kl4z');
    this.priceSubText = page.locator('.productDetail_price_sub_text__VWOS0');
    this.starRating = page.locator('.productDetail_star_rating__1Nfwg');

    // ==================== BREADCRUMBS ====================
    this.breadcrumbHome = page.locator('[class*="breadcrumb"] a[href="/"]').first();
    this.breadcrumbLinks = page.locator('[class*="breadcrumb"] a, [class*="breadcrumb"] span');

    // ==================== IMAGE GALLERY ====================
    this.galleryImages = page.locator('[class*="productDetail"] img, [class*="slick"] img');
    this.galleryThumbnails = page.locator('[class*="slick-slide"] img, [class*="thumb"] img');
    this.gallerySlides = page.locator('.slick-slide');

    // ==================== PRICE BREAKUP ====================
    this.priceBreakupToggle = page.locator('button.priceBreakup_trigger__kDgWD');
    this.priceBreakupSection = page.locator('.productDetail_price_breakup__2mWLB');

    // ==================== FAIR PRICING ====================
    this.fairPricingSection = page.locator('[class*="fair_pricing"], [class*="fairPricing"]');

    // ==================== QUANTITY ====================
    this.quantityContainer = page.locator('.quantityCounter_quantity_counter__3EmW9');
    this.quantityInput = page.locator('input.quantityCounter_input__1yTLV');
    this.quantityIncrement = page.locator('input.quantityCounter_button__1ZkuZ[aria-label="Increase quantity"]');
    this.quantityDecrement = page.locator('input.quantityCounter_button__1ZkuZ[aria-label="Decrease quantity"]');

    // ==================== PINCODE / CHECK AVAILABILITY ====================
    this.pincodeInput = page.locator('input[name="pincode"]');
    this.pincodeCheckBtn = page.locator('.productDetail_pincode_section__23Yq2 button, button:near(input[name="pincode"])').first();
    this.pincodeResult = page.locator('[class*="pincode_result"], [class*="delivery"], [class*="availability"]');

    // ==================== SPECIFICATION ACCORDIONS ====================
    this.metalDetailsBtn = page.locator('button.productDescription_accordion_trigger__1nOQk:has-text("Metal Details")');
    this.diamondDetailsBtn = page.locator('button.productDescription_accordion_trigger__1nOQk:has-text("Diamond Details")');
    this.manufacturedByBtn = page.locator('button.productDescription_accordion_trigger__1nOQk:has-text("Manufactured by")');
    this.metalDetailsContent = page.locator('button:has-text("Metal Details") + div, button:has-text("Metal Details") ~ [class*="accordion_content"]');
    this.diamondDetailsContent = page.locator('button:has-text("Diamond Details") + div, button:has-text("Diamond Details") ~ [class*="accordion_content"]');
    this.manufacturedByContent = page.locator('button:has-text("Manufactured by") + div, button:has-text("Manufactured by") ~ [class*="accordion_content"]');

    // ==================== CTA BUTTONS ====================
    // Sticky header CTAs
    this.stickyAddToCart = page.locator('button.add-cart');
    this.stickyBuyNow = page.locator('a.buy-now');
    // Product section CTAs
    this.productAddToCart = page.locator('button.productDetail_secondary_btn__1Dl0x');
    this.productBuyNow = page.locator('a.productDetail_primary_btn__1yxbF');
    // Any Add to Cart or Buy Now
    this.addToCartBtn = page.locator('button.add-cart, button.productDetail_secondary_btn__1Dl0x').first();
    this.buyNowBtn = page.locator('a.buy-now, a.productDetail_primary_btn__1yxbF').first();

    // ==================== YOU MAY ALSO LIKE ====================
    this.relatedHeading = page.locator('h2.productHighlights_title__3aHtt, h3:has-text("You may Also Like")');
    this.relatedSection = page.locator('.productHighlights_product_highlights_section__3BmxX');
    this.relatedProductCards = page.locator('.productHighlights_product_highlights_section__3BmxX a.product-item-content');
    this.relatedProductItems = page.locator('.productHighlights_product_highlights_section__3BmxX .Item_item__2fD-S');

    // ==================== SOCIAL SHARE ====================
    this.shareFacebook = page.locator('.share-facebook');
    this.shareWhatsapp = page.locator('.share-whatsapp');
    this.shareTwitter = page.locator('.share-twitter');

    // ==================== OUR PROMISE / TRUST BADGES ====================
    this.promiseSection = page.locator('.sunnyPromise_sunny_promise__2UHsd');
    this.promiseHeading = page.locator('.sunnyPromise_heading_section__2RXFz');

    // ==================== NEWSLETTER ====================
    this.newsletterInput = page.locator('#newsletter');
    this.newsletterSubmitBtn = page.locator('button.footer_newsletter_submit__Qqn5f');

    // ==================== COOKIE CONSENT ====================
    this.cookieAcceptBtn = page.locator('button.cookie-consent_accept_btn__39jUd');
    this.cookieDeclineBtn = page.locator('button.cookie-consent_decline_btn__2lSLW');
    this.cookieBanner = page.locator('[class*="cookie-consent"]');
  }

  // ==================== NAVIGATION ====================

  async navigate(path) {
    await this.navigateTo(path || this.baseUrl);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async navigateToProduct() {
    await this.navigate(this.baseUrl);
  }

  async navigateNoVariant() {
    await this.navigate(this.baseUrlNoVariant);
  }

  async navigateInvalidVariant() {
    await this.navigate('/18-k-rose-gold-mia-diamond-pendant?variant_id=99999');
  }

  async dismissCookieBanner() {
    try {
      if (await this.cookieAcceptBtn.isVisible({ timeout: 2000 })) await this.cookieAcceptBtn.click();
    } catch {}
    await this.page.waitForTimeout(500);
  }

  async declineCookieBanner() {
    try {
      if (await this.cookieDeclineBtn.isVisible({ timeout: 2000 })) await this.cookieDeclineBtn.click();
    } catch {}
    await this.page.waitForTimeout(500);
  }

  // ==================== PRODUCT INFO ====================

  async getProductTitle() {
    return (await this.productTitle.textContent()).trim();
  }

  async getSKU() {
    return (await this.skuText.textContent()).trim();
  }

  async getPriceText() {
    return (await this.priceText.textContent()).trim();
  }

  async getPriceSubText() {
    return (await this.priceSubText.textContent()).trim();
  }

  async getRatingText() {
    return (await this.starRating.textContent()).trim();
  }

  // ==================== BREADCRUMBS ====================

  async getBreadcrumbTexts() {
    return await this.breadcrumbLinks.allTextContents();
  }

  async clickBreadcrumbHome() {
    await this.breadcrumbHome.click();
    await this.page.waitForTimeout(3000);
  }

  async isBreadcrumbHomeClickable() {
    const href = await this.breadcrumbHome.getAttribute('href');
    return href === '/' || href === 'https://qa-sunnydiamonds.webc.in/';
  }

  // ==================== IMAGE GALLERY ====================

  async getGalleryImageCount() {
    return await this.galleryImages.count();
  }

  async clickGallerySlide(index) {
    const slide = this.gallerySlides.nth(index);
    await slide.click();
    await this.page.waitForTimeout(500);
  }

  // ==================== PRICE BREAKUP ====================

  async togglePriceBreakup() {
    await this.priceBreakupToggle.click();
    await this.page.waitForTimeout(500);
  }

  async getPriceBreakupText() {
    return await this.priceBreakupSection.textContent();
  }

  async isPriceBreakupExpanded() {
    const section = this.priceBreakupSection;
    return await section.evaluate(el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 50;
    }).catch(() => false);
  }

  // ==================== FAIR PRICING ====================

  async getFairPricingText() {
    return await this.page.evaluate(() => {
      const el = document.querySelector('[class*="fair_pricing"], [class*="fairPricing"]');
      return el ? el.textContent.trim() : '';
    });
  }

  async isFairPricingVisible() {
    return (await this.getFairPricingText()).length > 0;
  }

  // ==================== QUANTITY ====================

  async getQuantityValue() {
    return await this.quantityInput.inputValue();
  }

  async incrementQuantity() {
    await this.quantityIncrement.click();
    await this.page.waitForTimeout(300);
  }

  async decrementQuantity() {
    await this.quantityDecrement.click();
    await this.page.waitForTimeout(300);
  }

  async getQuantityMin() {
    return await this.quantityInput.getAttribute('min');
  }

  // ==================== PINCODE / CHECK AVAILABILITY ====================

  async enterPincode(pincode) {
    await this.pincodeInput.click();
    await this.pincodeInput.fill('');
    await this.pincodeInput.fill(pincode);
    await this.page.waitForTimeout(300);
  }

  async clickCheckAvailability() {
    // Try different selectors for the check button
    const btn = this.page.locator('button:near(input[name="pincode"]):visible').first();
    try {
      await btn.click({ timeout: 3000 });
    } catch {
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(2000);
  }

  async getPincodeValue() {
    return await this.pincodeInput.inputValue();
  }

  async getPincodeMaxLength() {
    return await this.pincodeInput.getAttribute('maxlength');
  }

  async getDeliveryResultText() {
    return await this.page.evaluate(() => {
      const section = document.querySelector('[class*="pincode"]');
      return section ? section.textContent.trim() : '';
    });
  }

  // ==================== SPECIFICATION ACCORDIONS ====================

  async clickMetalDetails() {
    await this.metalDetailsBtn.scrollIntoViewIfNeeded();
    await this.metalDetailsBtn.click();
    await this.page.waitForTimeout(500);
  }

  async clickDiamondDetails() {
    await this.diamondDetailsBtn.scrollIntoViewIfNeeded();
    await this.diamondDetailsBtn.click();
    await this.page.waitForTimeout(500);
  }

  async clickManufacturedBy() {
    await this.manufacturedByBtn.scrollIntoViewIfNeeded();
    await this.manufacturedByBtn.click();
    await this.page.waitForTimeout(500);
  }

  async getMetalDetailsText() {
    return await this.page.evaluate(() => {
      const triggers = document.querySelectorAll('button.productDescription_accordion_trigger__1nOQk');
      for (const t of triggers) {
        if (t.textContent.includes('Metal Details') && t.classList.contains('productDescription_show__iDlky')) {
          const content = t.nextElementSibling;
          return content ? content.textContent.trim() : '';
        }
      }
      return '';
    });
  }

  async getDiamondDetailsText() {
    return await this.page.evaluate(() => {
      const triggers = document.querySelectorAll('button.productDescription_accordion_trigger__1nOQk');
      for (const t of triggers) {
        if (t.textContent.includes('Diamond Details') && t.classList.contains('productDescription_show__iDlky')) {
          const content = t.nextElementSibling;
          return content ? content.textContent.trim() : '';
        }
      }
      return '';
    });
  }

  async getManufacturedByText() {
    return await this.page.evaluate(() => {
      const triggers = document.querySelectorAll('button.productDescription_accordion_trigger__1nOQk');
      for (const t of triggers) {
        if (t.textContent.includes('Manufactured') && t.classList.contains('productDescription_show__iDlky')) {
          const content = t.nextElementSibling;
          return content ? content.textContent.trim() : '';
        }
      }
      return '';
    });
  }

  // ==================== CTA BUTTONS ====================

  async isAddToCartVisible() {
    const sticky = await this.stickyAddToCart.isVisible().catch(() => false);
    const product = await this.productAddToCart.isVisible().catch(() => false);
    return sticky || product;
  }

  async isBuyNowVisible() {
    const sticky = await this.stickyBuyNow.isVisible().catch(() => false);
    const product = await this.productBuyNow.isVisible().catch(() => false);
    return sticky || product;
  }

  async isAddToCartEnabled() {
    return !(await this.addToCartBtn.isDisabled().catch(() => true));
  }

  async isBuyNowEnabled() {
    return !(await this.buyNowBtn.evaluate(el => el.hasAttribute('disabled')).catch(() => true));
  }

  async clickAddToCart() {
    await this.addToCartBtn.click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async clickBuyNow() {
    await this.buyNowBtn.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  // ==================== YOU MAY ALSO LIKE ====================

  async getRelatedHeadingText() {
    await this.relatedHeading.scrollIntoViewIfNeeded();
    return (await this.relatedHeading.textContent()).trim();
  }

  async getRelatedProductCount() {
    return await this.relatedProductItems.count();
  }

  async clickFirstRelatedProduct() {
    await this.relatedProductCards.first().scrollIntoViewIfNeeded();
    await this.relatedProductCards.first().click();
    await this.page.waitForTimeout(3000);
  }

  // ==================== SOCIAL SHARE ====================

  async isSocialSharePresent() {
    const fb = await this.shareFacebook.count();
    const wa = await this.shareWhatsapp.count();
    const tw = await this.shareTwitter.count();
    return fb > 0 || wa > 0 || tw > 0;
  }

  // ==================== OUR PROMISE / TRUST BADGES ====================

  async isPromiseSectionVisible() {
    await this.promiseSection.scrollIntoViewIfNeeded().catch(() => {});
    return await this.promiseSection.isVisible().catch(() => false);
  }

  async getPromiseSectionText() {
    return (await this.promiseSection.textContent()).trim();
  }

  // ==================== NEWSLETTER ====================

  async enterNewsletterEmail(email) {
    await this.newsletterInput.scrollIntoViewIfNeeded();
    await this.newsletterInput.fill(email);
  }

  async clickNewsletterSubscribe() {
    await this.newsletterSubmitBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async getNewsletterValidationMessage() {
    return await this.newsletterInput.evaluate(el => el.validationMessage);
  }

  // ==================== COOKIE CONSENT ====================

  async isCookieBannerVisible() {
    return await this.cookieBanner.isVisible().catch(() => false);
  }

  // ==================== PAGE STATE ====================

  async isOnPDP() {
    return this.page.url().includes('/18-k-rose-gold-mia-diamond-pendant');
  }

  async getPageResponseStatus() {
    const response = await this.page.goto(this.page.url(), { waitUntil: 'domcontentloaded' });
    return response ? response.status() : 0;
  }

  async getBodyText() {
    return await this.page.evaluate(() => document.body.innerText);
  }

  // ==================== LOGIN HELPER ====================

  async loginAndNavigateToPDP(email, password) {
    await this.navigateTo('/login');
    await this.page.waitForTimeout(2000);
    try { await this.cookieAcceptBtn.click({ timeout: 2000 }); } catch {}
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button.login_login_btn__8VNqS');
    await this.page.waitForTimeout(5000);
    await this.navigateToProduct();
  }
}

module.exports = PDPPage;
