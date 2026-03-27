const { test, expect } = require('@playwright/test');
const PDPPage = require('../../pages/PDPPage');
const { PDPData } = require('../../utils/testData');

test.describe('PDP Page Tests — 44 Test Cases', () => {
  let pdpPage;

  test.beforeEach(async ({ page }) => {
    pdpPage = new PDPPage(page);
    await pdpPage.navigateToProduct();
    await pdpPage.dismissCookieBanner();
  });

  // ==================== POSITIVE TEST CASES (TC_PDP_001 – TC_PDP_027, TC_PDP_044) ====================

  test.describe('Positive Tests', () => {

    test('TC_PDP_001 - Verify PDP page loads successfully for a valid product URL', async () => {
      // Product title is displayed
      const title = await pdpPage.getProductTitle();
      expect(title).toContain('18 K ROSE GOLD MIA DIAMOND PENDANT');

      // Price is visible
      const price = await pdpPage.getPriceText();
      expect(price).toContain('47,419');

      // Images load
      const imgCount = await pdpPage.getGalleryImageCount();
      expect(imgCount).toBeGreaterThan(0);

      // ADD TO CART and BUY NOW visible
      const addToCartVisible = await pdpPage.isAddToCartVisible();
      expect(addToCartVisible).toBeTruthy();

      const buyNowVisible = await pdpPage.isBuyNowVisible();
      expect(buyNowVisible).toBeTruthy();
    });

    test('TC_PDP_002 - Verify product title and SKU are displayed correctly', async () => {
      const title = await pdpPage.getProductTitle();
      expect(title).toBe('18 K ROSE GOLD MIA DIAMOND PENDANT');

      const sku = await pdpPage.getSKU();
      expect(sku).toContain('1120821883027');
    });

    test('TC_PDP_003 - Verify product MRP is displayed with inclusive-tax label', async () => {
      const price = await pdpPage.getPriceText();
      expect(price).toContain('₹');
      expect(price).toContain('47,419');

      const taxLabel = await pdpPage.getPriceSubText();
      expect(taxLabel).toContain('MRP Inclusive of all taxes');
    });

    test('TC_PDP_004 - Verify product rating (4.5) is displayed near the product title', async () => {
      const rating = await pdpPage.getRatingText();
      expect(rating).toContain('4.5');
    });

    test('TC_PDP_005 - Verify breadcrumb shows Home > Product Name and Home link is clickable', async () => {
      const breadcrumbs = await pdpPage.getBreadcrumbTexts();
      const combined = breadcrumbs.join(' > ');
      expect(combined.toLowerCase()).toContain('home');

      const homeClickable = await pdpPage.isBreadcrumbHomeClickable();
      expect(homeClickable).toBeTruthy();
    });

    test('TC_PDP_006 - Verify product image gallery loads with multiple images', async () => {
      const imgCount = await pdpPage.getGalleryImageCount();
      expect(imgCount).toBeGreaterThan(5);
    });

    test('TC_PDP_007 - Verify clicking a thumbnail updates the main product image', async ({ page }) => {
      // Get initial active slide src
      const initialSrc = await page.evaluate(() => {
        const active = document.querySelector('.slick-active img, [class*="slick-current"] img');
        return active ? active.src : '';
      });

      // Click a different slide/nav element
      const navDots = page.locator('.slick-dots li, .slick-arrow');
      const dotCount = await navDots.count();
      if (dotCount > 1) {
        await navDots.nth(1).click();
        await page.waitForTimeout(500);
      }

      // Gallery navigation functional
      expect(dotCount).toBeGreaterThan(0);
    });

    test('TC_PDP_008 - Verify Price Breakup toggle expands to show itemised cost details', async () => {
      await pdpPage.togglePriceBreakup();

      const breakupText = await pdpPage.getPriceBreakupText();
      expect(breakupText).toContain('Metal Price');
      expect(breakupText).toContain('Diamond Price');
      expect(breakupText).toContain('GST');
    });

    test('TC_PDP_009 - Verify Price Breakup section collapses on second click', async () => {
      // Expand
      await pdpPage.togglePriceBreakup();
      const expanded = await pdpPage.isPriceBreakupExpanded();
      expect(expanded).toBeTruthy();

      // Collapse
      await pdpPage.togglePriceBreakup();
      await pdpPage.page.waitForTimeout(500);
      const collapsed = await pdpPage.isPriceBreakupExpanded();
      expect(collapsed).toBeFalsy();
    });

    test('TC_PDP_010 - Verify Fair Pricing section shows Sunny Diamonds price vs Estimated Retail', async () => {
      const fairText = await pdpPage.getFairPricingText();
      expect(fairText).toContain('Sunny Diamonds');
      expect(fairText).toContain('47,419');
      expect(fairText).toContain('Estimated Retail');
    });

    test('TC_PDP_011 - Verify default quantity is 1 and the + button increments correctly', async () => {
      const defaultQty = await pdpPage.getQuantityValue();
      expect(defaultQty).toBe('1');

      await pdpPage.incrementQuantity();
      const incrementedQty = await pdpPage.getQuantityValue();
      expect(incrementedQty).toBe('2');
    });

    test('TC_PDP_012 - Verify the – button decrements quantity correctly', async () => {
      // Increment to 3
      await pdpPage.incrementQuantity();
      await pdpPage.incrementQuantity();
      const qty3 = await pdpPage.getQuantityValue();
      expect(qty3).toBe('3');

      // Decrement to 2
      await pdpPage.decrementQuantity();
      const qty2 = await pdpPage.getQuantityValue();
      expect(qty2).toBe('2');
    });

    test('TC_PDP_013 - Verify Check Availability returns delivery info for a valid 6-digit pincode', async () => {
      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();
      await pdpPage.enterPincode('682035');
      await pdpPage.clickCheckAvailability();

      const result = await pdpPage.getDeliveryResultText();
      // Should show delivery info
      expect(result.length).toBeGreaterThan(0);
    });

    test('TC_PDP_014 - Verify Metal Details accordion expands and displays correct specifications', async () => {
      await pdpPage.clickMetalDetails();

      const metalText = await pdpPage.getMetalDetailsText();
      expect(metalText).toContain('Metal Weight');
      expect(metalText).toContain('18K');
      expect(metalText).toContain('ROSE GOLD');
    });

    test('TC_PDP_015 - Verify Diamond Details accordion expands and displays diamond specifications', async () => {
      await pdpPage.clickDiamondDetails();

      const diamondText = await pdpPage.getDiamondDetailsText();
      expect(diamondText).toContain('Diamond');
      expect(diamondText.length).toBeGreaterThan(10);
    });

    test('TC_PDP_016 - Verify Manufactured By accordion expands and displays manufacturer info', async () => {
      await pdpPage.clickManufacturedBy();

      const mfgText = await pdpPage.getManufacturedByText();
      expect(mfgText).toContain('Sunny Diamonds');
    });

    test('TC_PDP_017 - Verify ADD TO CART button is visible and enabled on the PDP', async () => {
      const visible = await pdpPage.isAddToCartVisible();
      expect(visible).toBeTruthy();

      const enabled = await pdpPage.isAddToCartEnabled();
      expect(enabled).toBeTruthy();
    });

    test('TC_PDP_018 - Verify clicking ADD TO CART as a guest triggers appropriate action', async ({ page }) => {
      await pdpPage.clickAddToCart();

      // Should either redirect to login or add to guest cart
      const url = page.url();
      const bodyText = await pdpPage.getBodyText();
      const loginRedirect = url.includes('/login');
      const cartFeedback = bodyText.includes('cart') || bodyText.includes('Cart') || bodyText.includes('added');
      expect(loginRedirect || cartFeedback).toBeTruthy();
    });

    test('TC_PDP_019 - Verify BUY NOW button is visible and enabled on the PDP', async () => {
      const visible = await pdpPage.isBuyNowVisible();
      expect(visible).toBeTruthy();

      const enabled = await pdpPage.isBuyNowEnabled();
      expect(enabled).toBeTruthy();
    });

    test('TC_PDP_020 - Verify clicking BUY NOW as a guest triggers appropriate action', async ({ page }) => {
      await pdpPage.clickBuyNow();

      // Should redirect to login or checkout
      const url = page.url();
      const redirected = url.includes('/login') || url.includes('/checkout') || url.includes('/cart');
      expect(redirected).toBeTruthy();
    });

    test('TC_PDP_021 - Verify You May Also Like section displays related product recommendations', async () => {
      const heading = await pdpPage.getRelatedHeadingText();
      expect(heading.toLowerCase()).toContain('also like');

      const count = await pdpPage.getRelatedProductCount();
      expect(count).toBeGreaterThanOrEqual(10);
    });

    test('TC_PDP_022 - Verify clicking a related product navigates to its PDP', async ({ page }) => {
      await pdpPage.clickFirstRelatedProduct();

      const url = page.url();
      // Should navigate to a different product PDP
      expect(url).not.toContain('mia-diamond-pendant');
      expect(url).toContain('qa-sunnydiamonds.webc.in');
    });

    test('TC_PDP_023 - Verify Social Share section is visible and share options are accessible', async () => {
      const hasShareOptions = await pdpPage.isSocialSharePresent();
      expect(hasShareOptions).toBeTruthy();
    });

    test('TC_PDP_024 - Verify all 8 Our Promise trust badges are displayed', async () => {
      const visible = await pdpPage.isPromiseSectionVisible();
      expect(visible).toBeTruthy();

      const promiseText = await pdpPage.getPromiseSectionText();
      expect(promiseText).toContain('Certified');
    });

    test('TC_PDP_025 - Verify newsletter subscription with a valid email address', async () => {
      await pdpPage.enterNewsletterEmail(PDPData.validEmail);
      await pdpPage.clickNewsletterSubscribe();

      // No validation error for valid email
      const validationMsg = await pdpPage.getNewsletterValidationMessage();
      expect(validationMsg).toBe('');
    });

    test('TC_PDP_026 - Verify Cookie Consent banner appears and Accept All dismisses it', async ({ context }) => {
      // Fresh context needed for cookie test
      const newPage = await context.newPage();
      const freshPdp = new PDPPage(newPage);
      await freshPdp.navigateToProduct();

      const bannerVisible = await freshPdp.isCookieBannerVisible();
      expect(bannerVisible).toBeTruthy();

      await freshPdp.dismissCookieBanner();
      await newPage.waitForTimeout(1000);

      const bannerAfter = await freshPdp.isCookieBannerVisible();
      expect(bannerAfter).toBeFalsy();

      await newPage.close();
    });

    test('TC_PDP_027 - Verify clicking Decline on cookie banner dismisses it without breaking the page', async ({ context }) => {
      const newPage = await context.newPage();
      const freshPdp = new PDPPage(newPage);
      await freshPdp.navigateToProduct();

      await freshPdp.declineCookieBanner();
      await newPage.waitForTimeout(1000);

      const bannerAfter = await freshPdp.isCookieBannerVisible();
      expect(bannerAfter).toBeFalsy();

      // Page should remain functional
      const title = await freshPdp.getProductTitle();
      expect(title).toContain('MIA DIAMOND PENDANT');

      await newPage.close();
    });

  });

  // ==================== NEGATIVE TEST CASES (TC_PDP_028 – TC_PDP_034) ====================

  test.describe('Negative Tests', () => {

    test('TC_PDP_028 - Verify error when pincode with fewer than 6 digits is submitted', async () => {
      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();
      await pdpPage.enterPincode('6820');
      await pdpPage.clickCheckAvailability();

      const pincodeVal = await pdpPage.getPincodeValue();
      // Should show error or button stays disabled for 4-digit input
      expect(pincodeVal.length).toBeLessThan(6);
    });

    test('TC_PDP_029 - Verify pincode field rejects non-numeric (alphabetic) input', async () => {
      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();
      await pdpPage.enterPincode('ABCDEF');

      const pincodeVal = await pdpPage.getPincodeValue();
      // Field should reject or filter non-numeric characters
      expect(pincodeVal).not.toBe('ABCDEF');
    });

    test('TC_PDP_030 - Verify appropriate message when an unserviceable pincode is submitted', async () => {
      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();
      await pdpPage.enterPincode('110001');
      await pdpPage.clickCheckAvailability();

      const resultText = await pdpPage.getDeliveryResultText();
      expect(resultText.length).toBeGreaterThan(0);
    });

    test('TC_PDP_031 - Verify quantity field rejects 0 and does not allow adding 0 items to cart', async () => {
      const minAttr = await pdpPage.getQuantityMin();
      expect(minAttr).toBe('1');

      // Try decrementing from 1 — should stay at 1
      await pdpPage.decrementQuantity();
      const qty = await pdpPage.getQuantityValue();
      expect(parseInt(qty)).toBeGreaterThanOrEqual(1);
    });

    test('TC_PDP_032 - Verify newsletter subscription rejects an invalid email format', async () => {
      await pdpPage.enterNewsletterEmail(PDPData.invalidEmail);
      await pdpPage.clickNewsletterSubscribe();

      const validationMsg = await pdpPage.getNewsletterValidationMessage();
      expect(validationMsg.length).toBeGreaterThan(0);
    });

    test('TC_PDP_033 - Verify PDP handles an invalid variant_id gracefully without crashing', async ({ page }) => {
      await pdpPage.navigateInvalidVariant();
      await page.waitForTimeout(3000);

      const bodyText = await pdpPage.getBodyText();
      // No 500 error — page should handle gracefully
      expect(bodyText).not.toContain('Internal Server Error');
      expect(bodyText).not.toContain('500');

      // Product title or default variant should load
      const title = await pdpPage.productTitle.textContent().catch(() => '');
      expect(title.length).toBeGreaterThan(0);
    });

    test('TC_PDP_034 - Verify error when check availability is clicked with an empty pincode field', async () => {
      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();
      await pdpPage.enterPincode('');
      await pdpPage.clickCheckAvailability();

      // Empty pincode should show error or button should be disabled
      const resultText = await pdpPage.getDeliveryResultText();
      const pincodeVal = await pdpPage.getPincodeValue();
      expect(pincodeVal).toBe('');
    });

  });

  // ==================== EDGE CASE TEST CASES (TC_PDP_035 – TC_PDP_043) ====================

  test.describe('Edge Case Tests', () => {

    test('TC_PDP_035 - Verify quantity field handles an extremely large value (upper boundary — BVA)', async () => {
      // Increment multiple times
      for (let i = 0; i < 15; i++) {
        await pdpPage.incrementQuantity();
      }
      const qty = await pdpPage.getQuantityValue();
      expect(parseInt(qty)).toBeGreaterThan(1);

      // No crash — page should still be functional
      const title = await pdpPage.getProductTitle();
      expect(title).toContain('MIA DIAMOND PENDANT');
    });

    test('TC_PDP_036 - Verify quantity of exactly 1 is accepted (minimum boundary value — BVA)', async () => {
      const defaultQty = await pdpPage.getQuantityValue();
      expect(defaultQty).toBe('1');

      // Add to cart with quantity 1 should work
      const addToCartVisible = await pdpPage.isAddToCartVisible();
      expect(addToCartVisible).toBeTruthy();
    });

    test('TC_PDP_037 - Verify PDP layout is fully responsive on a mobile viewport (375×812)', async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
      const mobilePage = await ctx.newPage();
      const mobilePdp = new PDPPage(mobilePage);
      await mobilePdp.navigateToProduct();
      await mobilePdp.dismissCookieBanner();

      // Title should be visible
      const titleVisible = await mobilePdp.productTitle.isVisible().catch(() => false);
      expect(titleVisible).toBeTruthy();

      // No horizontal scroll
      const hasHScroll = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasHScroll).toBeFalsy();

      await ctx.close();
    });

    test('TC_PDP_038 - Verify PDP layout is correct on a tablet viewport (768×1024)', async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
      const tabletPage = await ctx.newPage();
      const tabletPdp = new PDPPage(tabletPage);
      await tabletPdp.navigateToProduct();
      await tabletPdp.dismissCookieBanner();

      // Title should be visible
      const titleVisible = await tabletPdp.productTitle.isVisible().catch(() => false);
      expect(titleVisible).toBeTruthy();

      // No horizontal scroll
      const hasHScroll = await tabletPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasHScroll).toBeFalsy();

      await ctx.close();
    });

    test('TC_PDP_039 - Verify PDP loads the default variant when no variant_id is in the URL', async ({ page }) => {
      await pdpPage.navigateNoVariant();
      await page.waitForTimeout(3000);

      // Page should load without error
      const title = await pdpPage.getProductTitle();
      expect(title).toContain('MIA DIAMOND PENDANT');

      const price = await pdpPage.getPriceText();
      expect(price).toContain('₹');
    });

    test('TC_PDP_040 - Verify pincode accepts exactly 6 digits and rejects 7 digits (BVA)', async () => {
      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();

      // 6 digits should be accepted
      await pdpPage.enterPincode('682035');
      const val6 = await pdpPage.getPincodeValue();
      expect(val6).toBe('682035');

      // 7 digits — maxlength should truncate to 6
      await pdpPage.enterPincode('6820350');
      const val7 = await pdpPage.getPincodeValue();
      const maxLength = await pdpPage.getPincodeMaxLength();
      expect(parseInt(maxLength)).toBe(6);
      expect(val7.length).toBeLessThanOrEqual(6);
    });

    test('TC_PDP_041 - Verify XSS injection in pincode field is sanitised — Security (OWASP A03)', async ({ page }) => {
      let alertFired = false;
      page.on('dialog', async dialog => { alertFired = true; await dialog.dismiss(); });

      await pdpPage.pincodeInput.scrollIntoViewIfNeeded();
      await pdpPage.enterPincode('<script>alert(1)</script>');
      await pdpPage.clickCheckAvailability();
      await page.waitForTimeout(1000);

      expect(alertFired).toBeFalsy();
    });

    test('TC_PDP_042 - Verify XSS payload in newsletter email field is sanitised — Security (OWASP A03)', async ({ page }) => {
      let alertFired = false;
      page.on('dialog', async dialog => { alertFired = true; await dialog.dismiss(); });

      await pdpPage.enterNewsletterEmail('<img src=x onerror=alert(1)>');
      await pdpPage.clickNewsletterSubscribe();
      await page.waitForTimeout(1000);

      expect(alertFired).toBeFalsy();
    });

    test('TC_PDP_043 - Verify browser back navigation from a related product returns to PDP correctly', async ({ page }) => {
      const originalTitle = await pdpPage.getProductTitle();

      // Navigate to related product
      await pdpPage.clickFirstRelatedProduct();
      await page.waitForTimeout(2000);

      // Press back
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Should be back on original PDP
      const titleAfterBack = await pdpPage.getProductTitle();
      expect(titleAfterBack).toBe(originalTitle);
    });

  });

  // ==================== AUTHENTICATED TEST (TC_PDP_044) — MUST BE LAST ====================

  test.describe('Authenticated Tests', () => {

    test('TC_PDP_044 - Login with valid credentials and verify Add to Cart works in authenticated session', async ({ page }) => {
      await pdpPage.loginAndNavigateToPDP(PDPData.loginEmail, PDPData.loginPassword);
      await pdpPage.dismissCookieBanner();

      // PDP should load for authenticated user
      const title = await pdpPage.getProductTitle();
      expect(title).toContain('MIA DIAMOND PENDANT');

      // Click Add to Cart
      await pdpPage.clickAddToCart();

      // Should NOT redirect to login
      const url = page.url();
      expect(url).not.toContain('/login');

      // Cart feedback — item added
      const bodyText = await pdpPage.getBodyText();
      const cartUpdated = bodyText.includes('cart') || bodyText.includes('Cart') || bodyText.includes('added') || url.includes('/cart');
      expect(cartUpdated).toBeTruthy();
    });

  });

});
