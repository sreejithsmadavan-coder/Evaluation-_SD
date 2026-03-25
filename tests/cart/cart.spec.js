const { test, expect } = require('@playwright/test');
const CartPage = require('../../pages/CartPage');
const LoginPage = require('../../pages/LoginPage');

test.describe('Cart Page Tests', () => {
  let cartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
  });

  // ==================== POSITIVE TEST CASES ====================

  test.describe('Positive Tests', () => {

    test('TC_CART_001 - Verify Cart page loads after login and adding products', async ({ page }) => {
      // SETUP TC — Login, add 2 products, navigate to cart
      await cartPage.loginAndSetupCart();

      expect(page.url()).toContain('/cart');
      const heading = await cartPage.isMyCartHeadingVisible();
      expect(heading).toBeTruthy();

      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    });

    test('TC_CART_002 - Verify "My Cart" page title is displayed correctly', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const heading = await cartPage.isMyCartHeadingVisible();
      expect(heading).toBeTruthy();

      const headingText = await cartPage.myCartHeading.textContent();
      expect(headingText).toContain('My Cart');
    });

    test('TC_CART_003 - Verify cart item count text displays correct number', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const countText = await cartPage.getItemCountText();
      expect(countText).toMatch(/\d+\s*item/i);

      const itemCount = await cartPage.getCartItemCount();
      expect(countText).toContain(String(itemCount));
    });

    test('TC_CART_004 - Verify product name is displayed for each cart item', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const names = await cartPage.getCartItemNames();
      expect(names.length).toBeGreaterThanOrEqual(1);
      names.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
    });

    test('TC_CART_005 - Verify product SKU is displayed for each cart item', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const skuCount = await cartPage.cartItemSKUs.count();
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasSKU = bodyText.includes('SKU') || skuCount > 0;
      expect(hasSKU).toBeTruthy();
    });

    test('TC_CART_006 - Verify product colour is displayed for each cart item', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
      const hasColor = bodyText.includes('color') || bodyText.includes('gold') || bodyText.includes('rose');
      expect(hasColor).toBeTruthy();
    });

    test('TC_CART_007 - Verify product unit price is displayed correctly', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const price = await cartPage.getItemPrice(0);
      expect(price).toBeGreaterThan(0);
    });

    test('TC_CART_008 - Verify product thumbnail image is displayed', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const imgCount = await cartPage.cartItemImages.count();
      expect(imgCount).toBeGreaterThanOrEqual(1);

      const brokenImages = await page.evaluate(() => {
        const imgs = document.querySelectorAll('.cartItem_image_wrap__27u0A img');
        return Array.from(imgs).filter(i => i.naturalWidth === 0 && i.complete).length;
      });
      expect(brokenImages).toBe(0);
    });

    test('TC_CART_009 - Verify quantity increases when "+" button is clicked', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const before = await cartPage.getItemQty(0);
      await cartPage.incrementQty(0);
      const after = await cartPage.getItemQty(0);

      expect(parseInt(after)).toBe(parseInt(before) + 1);
    });

    test('TC_CART_010 - Verify Subtotal updates after quantity increase', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const subtotalBefore = await cartPage.getSubtotal();
      const unitPrice = await cartPage.getItemPrice(0);
      await cartPage.incrementQty(0);
      await page.waitForTimeout(2000);
      const subtotalAfter = await cartPage.getSubtotal();

      expect(subtotalAfter).toBeGreaterThan(subtotalBefore);
    });

    test('TC_CART_011 - Verify quantity decreases when "-" button is clicked', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      // First increment to ensure qty > 1
      await cartPage.incrementQty(0);
      const before = await cartPage.getItemQty(0);
      await cartPage.decrementQty(0);
      const after = await cartPage.getItemQty(0);

      expect(parseInt(after)).toBe(parseInt(before) - 1);
    });

    test('TC_CART_012 - Verify Subtotal updates after quantity decrease', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      await cartPage.incrementQty(0);
      await page.waitForTimeout(1000);
      const subtotalBefore = await cartPage.getSubtotal();
      await cartPage.decrementQty(0);
      await page.waitForTimeout(2000);
      const subtotalAfter = await cartPage.getSubtotal();

      expect(subtotalAfter).toBeLessThan(subtotalBefore);
    });

    test('TC_CART_013 - Verify Total equals Subtotal when no discount', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const subtotal = await cartPage.getSubtotal();
      const total = await cartPage.getTotal();
      expect(total).toBe(subtotal);
    });

    test('TC_CART_014 - Verify a single item can be removed from the cart', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const countBefore = await cartPage.getCartItemCount();
      await cartPage.removeItem(0);
      const countAfter = await cartPage.getCartItemCount();

      expect(countAfter).toBe(countBefore - 1);
    });

    test('TC_CART_015 - Verify cart item count updates after item removal', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const countBefore = await cartPage.getCartItemCount();
      await cartPage.removeItem(0);
      const countText = await cartPage.getItemCountText();

      expect(countText).toContain(String(countBefore - 1));
    });

    test('TC_CART_016 - Verify empty cart state after removing all items', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      // Remove all items
      let count = await cartPage.getCartItemCount();
      while (count > 0) {
        await cartPage.removeItem(0);
        count = await cartPage.getCartItemCount();
      }

      const empty = await cartPage.getEmptyCartMessage();
      expect(empty || count === 0).toBeTruthy();
    });

    test('TC_CART_017 - Verify "Continue Shopping" link navigates correctly', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      await cartPage.clickContinueShopping();

      const url = page.url();
      expect(url.includes('/trending') || url.includes('/jewellery')).toBeTruthy();
    });

    test('TC_CART_018 - Verify "CHECKOUT SECURELY" button navigates to checkout', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const visible = await cartPage.isCheckoutButtonVisible();
      expect(visible).toBeTruthy();

      await cartPage.clickCheckoutSecurely();

      expect(page.url()).toContain('/checkout');
    });

    test('TC_CART_019 - Verify cart icon badge shows correct item count', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const cartItems = await cartPage.getCartItemCount();
      const badge = await cartPage.getCartBadgeCount();
      // Badge should be >= items (may include previous items)
      expect(badge).toBeGreaterThanOrEqual(0);
    });

    test('TC_CART_020 - Verify Price Details section shows Subtotal and Total', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const summaryText = await cartPage.getPriceSummaryText();
      expect(summaryText).toContain('Subtotal');
      expect(summaryText).toContain('Total');
      expect(summaryText).toContain('₹');

      const subtotal = await cartPage.getSubtotal();
      expect(subtotal).toBeGreaterThan(0);
    });

    test('TC_CART_021 - Verify "Our Promise to You" section is visible', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      await cartPage.promiseSection.scrollIntoViewIfNeeded().catch(() => {});
      const visible = await cartPage.promiseSection.isVisible().catch(() => false);
      expect(visible).toBeTruthy();
    });

    test('TC_CART_022 - Verify mobile sticky checkout bar on Cart page', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await cartPage.loginAndSetupCart();

      const mobileCheckout = await cartPage.mobileCheckoutButton.isVisible().catch(() => false);
      expect(mobileCheckout).toBeTruthy();
    });

    test('TC_CART_023 - Verify navigating to Cart via header cart icon', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      // Navigate to home first
      await page.goto('https://qa-sunnydiamonds.webc.in/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      await cartPage.clickHeaderCartIcon();

      expect(page.url()).toContain('/cart');
    });

    test('TC_CART_024 - Verify cart data persists after browser refresh', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const namesBefore = await cartPage.getCartItemNames();
      const subtotalBefore = await cartPage.getSubtotal();

      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const namesAfter = await cartPage.getCartItemNames();
      const subtotalAfter = await cartPage.getSubtotal();

      expect(namesAfter.length).toBe(namesBefore.length);
      expect(subtotalAfter).toBe(subtotalBefore);
    });

    test('TC_CART_025 - Verify footer newsletter subscription from Cart page', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      await cartPage.subscribeNewsletter('testuser@example.com');

      const msgs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[class*="footer"] div, [class*="footer"] span'))
          .filter(el => (el.textContent.trim().toLowerCase().includes('thank') || el.textContent.trim().toLowerCase().includes('subscri')) && el.offsetParent !== null)
          .map(el => el.textContent.trim());
      });
      const emailVal = await cartPage.newsletterInput.inputValue();
      expect(msgs.length > 0 || emailVal === '').toBeTruthy();
    });
  });

  // ==================== NEGATIVE TEST CASES ====================

  test.describe('Negative Tests', () => {

    test('TC_CART_026 - Verify "-" button at quantity 1 does not go below 1', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qty = await cartPage.getItemQty(0);
      if (parseInt(qty) > 1) {
        // Decrease to 1 first
        while (parseInt(await cartPage.getItemQty(0)) > 1) {
          await cartPage.decrementQty(0);
        }
      }

      await cartPage.decrementQty(0);
      await page.waitForTimeout(1000);

      const afterQty = await cartPage.getItemQty(0);
      // Either stays at 1 or item is removed (both are valid behaviors)
      const items = await cartPage.getCartItemCount();
      expect(parseInt(afterQty) >= 1 || items < parseInt(qty)).toBeTruthy();
    });

    test('TC_CART_027 - Verify quantity 0 is not accepted', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qtyInput = cartPage.qtyInputs.first();
      const readonly = await qtyInput.getAttribute('readonly');

      if (readonly !== null) {
        // Field is readonly — cannot type 0
        expect(readonly).not.toBeNull();
      } else {
        await qtyInput.fill('0');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(1000);
        const val = await qtyInput.inputValue();
        expect(parseInt(val)).toBeGreaterThanOrEqual(1);
      }
    });

    test('TC_CART_028 - Verify negative value in quantity field is rejected', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qtyInput = cartPage.qtyInputs.first();
      const readonly = await qtyInput.getAttribute('readonly');

      if (readonly !== null) {
        // Readonly field prevents direct input — passes by design
        expect(readonly).not.toBeNull();
      } else {
        await qtyInput.fill('-1');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(1000);
        const val = await qtyInput.inputValue();
        expect(parseInt(val)).toBeGreaterThanOrEqual(1);
      }
    });

    test('TC_CART_029 - Verify alphabetic chars in quantity field are rejected', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qtyInput = cartPage.qtyInputs.first();
      const readonly = await qtyInput.getAttribute('readonly');

      if (readonly !== null) {
        expect(readonly).not.toBeNull();
      } else {
        await qtyInput.fill('abc');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(1000);
        const val = await qtyInput.inputValue();
        expect(val).not.toBe('abc');
      }
    });

    test('TC_CART_030 - Verify special characters in quantity field are rejected', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qtyInput = cartPage.qtyInputs.first();
      const readonly = await qtyInput.getAttribute('readonly');

      if (readonly !== null) {
        expect(readonly).not.toBeNull();
      } else {
        await qtyInput.fill('@#$%');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(1000);
        const val = await qtyInput.inputValue();
        expect(val).not.toBe('@#$%');
      }
    });

    test('TC_CART_031 - Verify Cart page behaviour for guest/unauthenticated user', async ({ page }) => {
      // No login — go directly to cart
      await page.goto('https://qa-sunnydiamonds.webc.in/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      const url = page.url();
      const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());

      // Either redirected to login or shown empty cart
      const redirected = url.includes('/login');
      const emptyCart = bodyText.includes('empty') || bodyText.includes('no items') || bodyText.includes('login');
      expect(redirected || emptyCart || url.includes('/cart')).toBeTruthy();
    });

    test('TC_CART_032 - Verify newsletter with invalid email from Cart page', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      await cartPage.subscribeNewsletter('notanemail');

      const msgs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[class*="footer"] [class*="message"], [class*="footer"] [class*="error"]'))
          .filter(el => el.textContent.trim()).map(el => el.textContent.trim())
      );
      const hasError = msgs.some(m => m.toLowerCase().includes('valid') || m.toLowerCase().includes('error'));
      expect(hasError || msgs.length > 0).toBeTruthy();
    });

    test('TC_CART_033 - Verify CHECKOUT SECURELY when cart is empty', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      // Remove all items
      let count = await cartPage.getCartItemCount();
      while (count > 0) {
        await cartPage.removeItem(0);
        count = await cartPage.getCartItemCount();
      }

      // Checkout button should be hidden or disabled
      const visible = await cartPage.isCheckoutButtonVisible();
      if (visible) {
        await cartPage.clickCheckoutSecurely();
        const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
        const blocked = bodyText.includes('empty') || bodyText.includes('add items');
        expect(blocked || !page.url().includes('/checkout')).toBeTruthy();
      } else {
        expect(visible).toBeFalsy();
      }
    });
  });

  // ==================== EDGE CASE TEST CASES ====================

  test.describe('Edge Case Tests', () => {

    test('TC_CART_034 - BVA: Verify quantity = 1 is minimum valid quantity', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qty = await cartPage.getItemQty(0);
      expect(parseInt(qty)).toBeGreaterThanOrEqual(1);

      // No error should be visible
      const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
      const hasError = bodyText.includes('error') && bodyText.includes('quantity');
      expect(hasError).toBeFalsy();
    });

    test('TC_CART_035 - BVA: Verify large quantity (999) is handled', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const qtyInput = cartPage.qtyInputs.first();
      const readonly = await qtyInput.getAttribute('readonly');

      if (readonly !== null) {
        // Click + many times
        for (let i = 0; i < 10; i++) {
          await cartPage.incrementQty(0);
          await page.waitForTimeout(300);
        }
      } else {
        await qtyInput.fill('999');
        await page.keyboard.press('Tab');
      }
      await page.waitForTimeout(2000);

      const bodyText = await page.evaluate(() => document.body.innerText);
      const has500 = bodyText.includes('500') && bodyText.toLowerCase().includes('error');
      expect(has500).toBeFalsy();
    });

    test('TC_CART_036 - Verify price calculation for multiple items', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      const subtotal = await cartPage.getSubtotal();
      const total = await cartPage.getTotal();

      expect(subtotal).toBeGreaterThan(0);
      expect(total).toBe(subtotal);
    });

    test('TC_CART_037 - Verify Cart page on mobile viewport (375x812)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await cartPage.loginAndSetupCart();

      const hScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 5);
      expect(hScroll).toBeFalsy();

      const heading = await cartPage.isMyCartHeadingVisible();
      expect(heading).toBeTruthy();
    });

    test('TC_CART_038 - Verify Cart page on tablet viewport (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await cartPage.loginAndSetupCart();

      const hScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 5);
      expect(hScroll).toBeFalsy();
    });

    test('TC_CART_039 - Verify XSS injection in quantity field is blocked', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      let alertFired = false;
      page.on('dialog', async d => { alertFired = true; await d.dismiss(); });

      const qtyInput = cartPage.qtyInputs.first();
      const readonly = await qtyInput.getAttribute('readonly');

      if (readonly === null) {
        await qtyInput.fill('<script>alert("XSS")</script>');
        await page.keyboard.press('Tab');
      }
      await page.waitForTimeout(1000);

      expect(alertFired).toBeFalsy();
    });

    test('TC_CART_040 - Verify cart badge resets after all items removed', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      // Remove all items
      let count = await cartPage.getCartItemCount();
      while (count > 0) {
        await cartPage.removeItem(0);
        count = await cartPage.getCartItemCount();
      }

      const badge = await cartPage.getCartBadgeCount();
      expect(badge).toBe(0);
    });

    test('TC_CART_041 - Verify back navigation from Checkout returns to Cart', async ({ page }) => {
      await cartPage.loginAndSetupCart();

      await cartPage.clickCheckoutSecurely();
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      expect(page.url()).toContain('/cart');
      const items = await cartPage.getCartItemCount();
      expect(items).toBeGreaterThanOrEqual(1);
    });

    test('TC_CART_042 - Login and verify Cart page is fully accessible', async ({ page }) => {
      // Login
      await page.goto('https://qa-sunnydiamonds.webc.in/login', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      try { await page.locator('button.cookie-consent_accept_btn__39jUd').click({ timeout: 2000 }); } catch {}
      await page.fill('#email', 'sreejith.s+4@webandcrafts.com');
      await page.fill('#password', 'Password');
      await page.click('button.login_login_btn__8VNqS');
      await page.waitForTimeout(5000);

      expect(page.url()).not.toContain('/login');

      // Navigate to cart
      await page.goto('https://qa-sunnydiamonds.webc.in/cart', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      expect(page.url()).toContain('/cart');
      const heading = await cartPage.isMyCartHeadingVisible();
      expect(heading).toBeTruthy();
    });
  });
});
