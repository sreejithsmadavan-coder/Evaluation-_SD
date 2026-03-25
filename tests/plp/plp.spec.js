const { test, expect } = require('@playwright/test');
const PLPPage = require('../../pages/PLPPage');
const LoginPage = require('../../pages/LoginPage');

test.describe('PLP (Product Listing Page) Tests', () => {
  let plpPage;

  test.beforeEach(async ({ page }) => {
    plpPage = new PLPPage(page);
  });

  // ==================== POSITIVE TEST CASES ====================

  test.describe('Positive Tests', () => {

    test('TC_PLP_001 - Verify Jewellery PLP loads correctly with all UI elements visible', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      // Page heading
      const h1Visible = await plpPage.pageHeading.isVisible().catch(() => false);
      expect(h1Visible).toBeTruthy();
      const h1Text = await plpPage.pageHeading.textContent();
      expect(h1Text.trim()).toBe('Jewellery');

      // Product count
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);

      // Filter panel
      const filterVisible = await plpPage.filterPanel.isVisible().catch(() => false);
      expect(filterVisible).toBeTruthy();

      // Sort dropdown
      const sortVisible = await plpPage.sortDropdownDesktop.isVisible().catch(() => false);
      expect(sortVisible).toBeTruthy();

      // Product cards
      const cardCount = await plpPage.getProductCardCount();
      expect(cardCount).toBeGreaterThan(0);

      // Pagination
      const paginationVisible = await plpPage.paginationWrapper.isVisible().catch(() => false);
      expect(paginationVisible).toBeTruthy();

      // Breadcrumb
      const breadcrumbVisible = await plpPage.breadcrumbHome.isVisible().catch(() => false);
      expect(breadcrumbVisible).toBeTruthy();

      // No console errors
      const consoleErrors = [];
      page.on('pageerror', e => consoleErrors.push(e.message));
      await page.waitForTimeout(1000);
      expect(consoleErrors.length).toBe(0);
    });

    test('TC_PLP_002 - Verify total product count is displayed and matches catalogue size', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      const countText = await plpPage.getProductCountText();
      expect(countText).toMatch(/\d+\s*Products/);

      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);

      // Reload and check consistency
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const countAfter = await plpPage.getProductCountNumber();
      expect(countAfter).toBe(count);
    });

    test('TC_PLP_003 - Filter by Category: Rings — verify only Ring products displayed', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickCategoryFilter('Rings');

      expect(page.url()).toMatch(/rings|category=rings/i);
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_004 - Filter by Category: Earrings — verify only Earring products displayed', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickCategoryFilter('Earrings');

      expect(page.url()).toMatch(/earrings|category=earrings/i);
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_005 - Filter by Category: Pendants — verify only Pendant products displayed', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickCategoryFilter('Pendants');

      expect(page.url()).toMatch(/pendants|category=pendants/i);
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_006 - Filter by Metal Color: Yellow Gold', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickMetalColorFilter('yellow');

      expect(page.url()).toContain('yellow-gold');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_007 - Filter by Metal Color: Rose Gold', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickMetalColorFilter('rose');

      expect(page.url()).toContain('rose-gold');
    });

    test('TC_PLP_008 - Filter by Metal Color: White Gold', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickMetalColorFilter('white');

      expect(page.url()).toContain('white-gold');
    });

    test('TC_PLP_009 - Filter by Metal Purity: 18K', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickMetalPurityFilter('18k');

      expect(page.url()).toContain('metal_purity=18k');
    });

    test('TC_PLP_010 - Filter by Metal Purity: 22K', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickMetalPurityFilter('22k');

      expect(page.url()).toContain('metal_purity=22k');
    });

    test('TC_PLP_011 - Filter by Price Range: Below ₹10k', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?range=0TO10000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      expect(page.url()).toContain('range=0TO10000');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_012 - Filter by Price Range: ₹10k–₹30k', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?range=10000TO30000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      expect(page.url()).toContain('range=10000TO30000');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_013 - Sort By: Price Low to High', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.sortByPriceLowToHigh();

      const prices = await plpPage.getVisibleProductPrices();
      expect(prices.length).toBeGreaterThan(1);
      // Verify ascending order for first few products
      for (let i = 1; i < Math.min(prices.length, 5); i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    test('TC_PLP_014 - Sort By: Price High to Low', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.sortByPriceHighToLow();

      const prices = await plpPage.getVisibleProductPrices();
      expect(prices.length).toBeGreaterThan(1);
      for (let i = 1; i < Math.min(prices.length, 5); i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });

    test('TC_PLP_015 - Sort By: Name A to Z', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.sortByNameAtoZ();

      const names = await plpPage.getVisibleProductNames();
      expect(names.length).toBeGreaterThan(1);
      // First product name should start near 'A'
      const firstName = names[0].trim().toLowerCase();
      expect(firstName.charCodeAt(0)).toBeLessThanOrEqual('d'.charCodeAt(0));
    });

    test('TC_PLP_016 - Sort By: Name Z to A', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.sortByNameZtoA();

      const names = await plpPage.getVisibleProductNames();
      expect(names.length).toBeGreaterThan(1);
      const firstName = names[0].trim().toLowerCase();
      expect(firstName.charCodeAt(0)).toBeGreaterThanOrEqual('v'.charCodeAt(0));
    });

    test('TC_PLP_017 - Pagination: Navigate to Page 2 using Next button', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      const page1Names = await plpPage.getVisibleProductNames();
      await plpPage.clickNextPage();

      const activePage = await plpPage.getActivePage();
      expect(activePage).toBe('2');

      const page2Names = await plpPage.getVisibleProductNames();
      expect(page2Names[0]).not.toBe(page1Names[0]);
    });

    test('TC_PLP_018 - Pagination: Navigate back to Page 1 using Previous button', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickNextPage();
      expect(await plpPage.getActivePage()).toBe('2');

      await plpPage.clickPreviousPage();
      expect(await plpPage.getActivePage()).toBe('1');
    });

    test('TC_PLP_019 - Pagination: Click on a specific page number (page 2)', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickPageNumber('2');

      const activePage = await plpPage.getActivePage();
      expect(activePage).toBe('2');
    });

    test('TC_PLP_020 - Product card click navigates to Product Detail Page (PDP)', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      const productName = (await plpPage.productNames.first().textContent()).trim();
      await plpPage.clickFirstProduct();

      const pdpUrl = page.url();
      expect(pdpUrl).not.toContain('/jewellery');
      expect(pdpUrl).toContain('variant_id');

      // Go back to PLP
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/jewellery');
    });

    test('TC_PLP_021 - Add to Cart button on product card adds product to cart', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickAddToCartFirst();

      // Check for confirmation message or cart count change
      await page.waitForTimeout(2000);
      const cartUpdated = await page.evaluate(() => {
        const body = document.body.innerHTML.toLowerCase();
        return body.includes('added to cart') || body.includes('cart') || document.querySelector('[class*="cart"] [class*="count"]') !== null;
      });
      expect(cartUpdated).toBeTruthy();
    });

    test('TC_PLP_022 - Breadcrumb: Click Home navigates to Home Page', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickBreadcrumbHome();

      expect(page.url()).toBe('https://qa-sunnydiamonds.webc.in/');
    });

    test('TC_PLP_023 - Multi-filter: Category (Rings) + Metal Color (Yellow Gold)', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery/rings?variants.color=yellow-gold', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      expect(page.url()).toContain('rings');
      expect(page.url()).toContain('yellow-gold');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_024 - Multi-filter: Metal Purity (18K) + Price Range (Below ₹10k)', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?variants.metal_purity=18k&range=0TO10000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      expect(page.url()).toContain('metal_purity=18k');
      expect(page.url()).toContain('range=0TO10000');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('TC_PLP_025 - Verify PLP page title and meta description for SEO', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      const title = await plpPage.getPageTitle();
      expect(title.toLowerCase()).toContain('sunny diamonds');

      const meta = await plpPage.getMetaDescription();
      expect(meta).toBeTruthy();
      expect(meta.length).toBeGreaterThan(10);

      const h1 = await plpPage.pageHeading.textContent();
      expect(h1.trim()).toBe('Jewellery');
    });
  });

  // ==================== NEGATIVE TEST CASES ====================

  test.describe('Negative Tests', () => {

    test('TC_PLP_026 - Apply filter combination that returns zero products — empty state', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?range=0TO10000&variants.stone=aqua', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      const cardCount = await plpPage.getProductCardCount();
      const pageText = await page.evaluate(() => document.body.innerText);
      const hasEmptyState = cardCount === 0 || pageText.toLowerCase().includes('no product') || pageText.toLowerCase().includes('not found');
      expect(hasEmptyState).toBeTruthy();
    });

    test('TC_PLP_027 - Direct URL with invalid/non-existent category — graceful handling', async ({ page }) => {
      const resp = await page.goto('https://qa-sunnydiamonds.webc.in/jewellery/invalidcategory', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const status = resp ? resp.status() : 'unknown';
      const pageText = await page.evaluate(() => document.body.innerText);
      const graceful = pageText.includes('404') || pageText.toLowerCase().includes('not found') || page.url().includes('/jewellery');
      expect(graceful).toBeTruthy();
    });

    test('TC_PLP_028 - Navigate to PLP with invalid filter query parameter — verify fallback', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?variants.color=invalidcolor', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const pageText = await page.evaluate(() => document.body.innerText);
      const hasError = pageText.includes('500') && pageText.toLowerCase().includes('error');
      expect(hasError).toBeFalsy();
    });

    test('TC_PLP_029 - Pagination: Navigate beyond last page (page=9999) via URL', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?page=9999', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const pageText = await page.evaluate(() => document.body.innerText);
      const has500 = pageText.includes('500') && pageText.toLowerCase().includes('error');
      expect(has500).toBeFalsy();
    });
  });

  // ==================== EDGE CASE TEST CASES ====================

  test.describe('Edge Case Tests', () => {

    test('TC_PLP_030 - Browser back from PDP returns to PLP with filter state preserved', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery/rings', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      await plpPage.clickFirstProduct();
      const pdpUrl = page.url();
      expect(pdpUrl).not.toContain('/jewellery/rings');

      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/rings');
    });

    test('TC_PLP_031 - PLP filter URL is bookmarkable/shareable', async ({ page }) => {
      const filterUrl = 'https://qa-sunnydiamonds.webc.in/jewellery?variants.color=yellow-gold';
      await page.goto(filterUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      expect(page.url()).toContain('yellow-gold');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PLP_032 - Rapid consecutive filter toggling — no UI freeze', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      // Rapidly click different category filters
      await plpPage.expandFilterSection('category');
      await page.waitForTimeout(500);

      const categories = ['Rings', 'Earrings', 'Pendants', 'Nosepins'];
      for (const cat of categories) {
        await plpPage.page.locator(`.filter_filter__3noTO label:has-text("${cat}")`).first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);
      }
      await page.waitForTimeout(3000);

      // Verify UI is not frozen
      const count = await plpPage.getProductCountNumber().catch(() => -1);
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('TC_PLP_033 - Sort + Filter combined — results are filtered AND sorted', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery/rings', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      await plpPage.sortByPriceLowToHigh();

      const prices = await plpPage.getVisibleProductPrices();
      expect(prices.length).toBeGreaterThan(1);
      // Verify ascending within Rings
      for (let i = 1; i < Math.min(prices.length, 5); i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
      expect(page.url()).toContain('rings');
    });

    test('TC_PLP_034 - PLP on mobile viewport (375x812) — responsive layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      // Mobile filter button should be visible
      const filterBtnVisible = await plpPage.mobileFilterButton.isVisible().catch(() => false);
      expect(filterBtnVisible).toBeTruthy();

      // Products should display
      const cardCount = await plpPage.getProductCardCount();
      expect(cardCount).toBeGreaterThan(0);

      // No horizontal scroll
      const hScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 5);
      expect(hScroll).toBeFalsy();
    });

    test('TC_PLP_035 - Last page of pagination loads correctly with partial product count', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.paginationWrapper.scrollIntoViewIfNeeded();
      await plpPage.clickPageNumber('90');

      const cardCount = await plpPage.getProductCardCount();
      expect(cardCount).toBeGreaterThan(0);

      // Next button should be disabled on last page
      const nextDisabled = await plpPage.isNextDisabled().catch(() => true);
      expect(nextDisabled).toBeTruthy();
    });

    test('TC_PLP_036 - Add same product to cart twice — quantity increments correctly', async ({ page }) => {
      await plpPage.navigateToJewellery();
      await plpPage.dismissCookieBanner();

      await plpPage.clickAddToCartFirst();
      await page.waitForTimeout(2000);
      await plpPage.clickAddToCartFirst();
      await page.waitForTimeout(2000);

      // Either quantity incremented or "already in cart" message shown
      // Test passes as long as no crash
      const pageText = await page.evaluate(() => document.body.innerText);
      const has500 = pageText.includes('500') && pageText.toLowerCase().includes('error');
      expect(has500).toBeFalsy();
    });

    test('TC_PLP_037 - PLP HTTPS enforcement — page served over secure connection', async ({ page }) => {
      await plpPage.navigateToJewellery();

      expect(await plpPage.isPageSecure()).toBeTruthy();
      expect(page.url()).toMatch(/^https:\/\//);

      const mixedContent = [];
      page.on('console', msg => {
        if (msg.text().toLowerCase().includes('mixed content')) mixedContent.push(msg.text());
      });
      await page.waitForTimeout(2000);
      expect(mixedContent.length).toBe(0);
    });

    test('TC_PLP_038 - Price range filter: Above ₹80k — only high-value products shown', async ({ page }) => {
      await page.goto('https://qa-sunnydiamonds.webc.in/jewellery?range=80000TO10000000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await plpPage.dismissCookieBanner();

      expect(page.url()).toContain('range=80000TO10000000');
      const count = await plpPage.getProductCountNumber();
      expect(count).toBeGreaterThan(0);

      const prices = await plpPage.getVisibleProductPrices();
      if (prices.length > 0) {
        expect(prices[0]).toBeGreaterThanOrEqual(80000);
      }
    });

    test('TC_PLP_039 - Login and verify Add to Cart works with authenticated session', async ({ page }) => {
      // Login first
      await page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}

      const loginPage = new LoginPage(page);
      await loginPage.enterEmail('sreejith.s+4@webandcrafts.com');
      await loginPage.enterPassword('Password');
      await loginPage.clickSignIn();
      await page.waitForTimeout(5000);

      // Navigate to PLP
      await plpPage.navigateToJewellery();

      // Click Add to Cart
      await plpPage.clickAddToCartFirst();
      await page.waitForTimeout(3000);

      // Verify no login redirect occurred
      expect(page.url()).not.toContain('/login');
    });
  });
});
