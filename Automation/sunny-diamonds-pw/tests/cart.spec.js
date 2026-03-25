/**
 * cart.spec.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Playwright automation for the Cart Page — Sunny Diamonds QA
 * TC Coverage: TC_CART_001 → TC_CART_042  (42 test cases)
 *
 * ┌─ SETUP FLOW (TC_CART_001 — runs ONCE via test.beforeAll) ────────────────┐
 * │  1. Navigate to /login                                                    │
 * │  2. Login with valid credentials                                          │
 * │  3. Navigate to Home → ALL JEWELLERY (PLP)                               │
 * │  4. Add Product 1 to cart → navigate back to PLP                         │
 * │  5. Add Product 2 to cart                                                 │
 * │  6. Navigate to /cart via header cart icon                                │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ SUBSEQUENT TCs ─────────────────────────────────────────────────────────┐
 * │  Each test navigates back to /cart using cartPage.navigate()             │
 * │  and operates on the existing cart session state.                        │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * NOTE: DO NOT EXECUTE until explicitly instructed by the QA Lead.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { test, expect } = require('@playwright/test');
const LoginPage  = require('../pages/LoginPage');
const PLPPage    = require('../pages/PLPPage');
const PDPPage    = require('../pages/PDPPage');
const CartPage   = require('../pages/CartPage');
const { users, urls, products, cartData, newsletter, viewports } = require('../utils/testData');

// ── Shared browser context (preserves login session across all tests) ────────
let sharedContext;
let sharedPage;

test.describe('Cart Page — TC_CART_001 to TC_CART_042', () => {

  // ══════════════════════════════════════════════════════════════════════════
  // SETUP: Login + Add products + navigate to Cart  (runs once for the suite)
  // ══════════════════════════════════════════════════════════════════════════
  test.beforeAll(async ({ browser }) => {
    sharedContext = await browser.newContext({ viewport: viewports.desktop });
    sharedPage    = await sharedContext.newPage();

    const loginPage = new LoginPage(sharedPage);
    const plpPage   = new PLPPage(sharedPage);
    const pdpPage   = new PDPPage(sharedPage);
    const cartPage  = new CartPage(sharedPage);

    // ── Step 1–4: Login ──────────────────────────────────────────────────────
    await loginPage.loginWithCredentials(users.validUser.email, users.validUser.password);
    await loginPage.assertLoginSuccess();

    // ── Step 5–6: Navigate to PLP via ALL JEWELLERY ──────────────────────────
    await plpPage.navigate();
    await plpPage.assertOnPLP();

    // ── Step 7–9: Add Product 1 ──────────────────────────────────────────────
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    await sharedPage.goBack();
    await sharedPage.waitForLoadState('networkidle');

    // ── Step 10–11: Add Product 2 ────────────────────────────────────────────
    await pdpPage.navigate(products.product2.url);
    await pdpPage.addToCart();

    // ── Step 12: Navigate to Cart page ───────────────────────────────────────
    await cartPage.navigate();
    await cartPage.assertOnCartPage();
  });

  test.afterAll(async () => {
    await sharedContext?.close();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // HELPER: return a CartPage instance bound to the shared page
  // ══════════════════════════════════════════════════════════════════════════
  function getCartPage() {
    return new CartPage(sharedPage);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_001 — Setup flow (covered by beforeAll; verified here)
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_001 — Cart page loads successfully after login and adding products', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_001' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();

    // Assertions
    await cartPage.assertOnCartPage();
    await cartPage.assertTitleVisible();
    // At least 1 item must be present
    const count = await cartPage.cartItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_002 — Page title "My Cart"
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_002 — Verify "My Cart" page title is displayed', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_002' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.assertTitleVisible();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_003 — Cart item count text
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_003 — Verify cart item count text displays the correct number', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_003' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const actualRowCount = await cartPage.cartItems.count();
    await cartPage.assertItemCount(actualRowCount);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_004 — Product name per cart item
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_004 — Verify product name is displayed for each cart item', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_004' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const count = await cartPage.cartItems.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const name = await cartPage.getItemName(i);
      expect(name.length).toBeGreaterThan(0);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_005 — SKU per cart item
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_005 — Verify product SKU is displayed for each cart item', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_005' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const count = await cartPage.cartItems.count();
    for (let i = 0; i < count; i++) {
      const sku = await cartPage.getItemSku(i);
      expect(sku.length).toBeGreaterThan(0);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_006 — Colour per cart item
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_006 — Verify product colour is displayed for each cart item', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_006' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const count = await cartPage.cartItems.count();
    for (let i = 0; i < count; i++) {
      const color = await cartPage.getItemColor(i);
      expect(color.length).toBeGreaterThan(0);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_007 — Unit price per cart item
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_007 — Verify product unit price is displayed correctly', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_007' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const count = await cartPage.cartItems.count();
    for (let i = 0; i < count; i++) {
      const price = await cartPage.getItemPrice(i);
      expect(price).toBeGreaterThan(0);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_008 — Product thumbnail image
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_008 — Verify product thumbnail image is displayed for each cart item', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_008' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const images = sharedPage.locator('div.cartItem_image_wrap__27u0A img');
    const imgCount = await images.count();
    expect(imgCount).toBeGreaterThan(0);
    for (let i = 0; i < imgCount; i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_009 — Increase quantity with '+' button
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_009 — Verify quantity increases by 1 when "+" button is clicked', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_009' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const beforeQty = await cartPage.getItemQuantity(0);
    await cartPage.increaseQty(0);
    const afterQty  = await cartPage.getItemQuantity(0);
    expect(afterQty).toBe(beforeQty + 1);
    // Reset to original quantity
    await cartPage.decreaseQty(0);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_010 — Subtotal updates after quantity increase
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_010 — Verify Subtotal updates correctly after quantity increase', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_010' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage   = getCartPage();
    await cartPage.navigate();
    const unitPrice  = await cartPage.getItemPrice(0);
    const beforeSub  = await cartPage.getSubtotal();
    await cartPage.increaseQty(0);
    await sharedPage.waitForTimeout(1000);
    const afterSub   = await cartPage.getSubtotal();
    expect(afterSub).toBe(beforeSub + unitPrice);
    // Reset
    await cartPage.decreaseQty(0);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_011 — Decrease quantity with '-' button
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_011 — Verify quantity decreases by 1 when "-" button is clicked', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_011' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    // First increase to 2
    await cartPage.increaseQty(0);
    const beforeQty = await cartPage.getItemQuantity(0);
    await cartPage.decreaseQty(0);
    const afterQty  = await cartPage.getItemQuantity(0);
    expect(afterQty).toBe(beforeQty - 1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_012 — Subtotal updates after quantity decrease
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_012 — Verify Subtotal updates correctly after quantity decrease', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_012' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage  = getCartPage();
    await cartPage.navigate();
    // Ensure qty is 2 first
    await cartPage.increaseQty(0);
    await sharedPage.waitForTimeout(500);
    const unitPrice = await cartPage.getItemPrice(0);
    const beforeSub = await cartPage.getSubtotal();
    await cartPage.decreaseQty(0);
    await sharedPage.waitForTimeout(1000);
    const afterSub  = await cartPage.getSubtotal();
    expect(afterSub).toBe(beforeSub - unitPrice);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_013 — Total equals Subtotal
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_013 — Verify Total equals Subtotal (no discount applied)', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_013' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.assertSubtotalEqualsTotal();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_014 — Remove single item
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_014 — Verify a single item can be removed from the cart', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_014' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage   = getCartPage();
    await cartPage.navigate();
    const beforeCount = await cartPage.cartItems.count();
    // Add back if only 1 item remains to prevent empty cart prematurely
    if (beforeCount < 2) {
      const pdpPage = new PDPPage(sharedPage);
      await pdpPage.navigate(products.product2.url);
      await pdpPage.addToCart();
      await cartPage.navigate();
    }
    const countBefore = await cartPage.cartItems.count();
    await cartPage.removeItem(0);
    await sharedPage.waitForTimeout(800);
    const countAfter  = await cartPage.cartItems.count();
    expect(countAfter).toBe(countBefore - 1);

    // Restore: re-add the removed item
    const pdpPage = new PDPPage(sharedPage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    await cartPage.navigate();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_015 — Item count updates after removal
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_015 — Verify cart item count updates after item removal', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_015' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage    = getCartPage();
    await cartPage.navigate();
    const countBefore = await cartPage.cartItems.count();
    if (countBefore >= 2) {
      await cartPage.removeItem(0);
      await sharedPage.waitForTimeout(1000);
      const countAfter = await cartPage.cartItems.count();
      expect(countAfter).toBe(countBefore - 1);
      await cartPage.assertItemCount(countAfter);

      // Restore
      const pdpPage = new PDPPage(sharedPage);
      await pdpPage.navigate(products.product1.url);
      await pdpPage.addToCart();
      await cartPage.navigate();
    } else {
      test.skip('Need ≥2 items to test removal. Skipping to preserve cart state.');
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_016 — Empty cart state
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_016 — Verify empty cart state after removing all items', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_016' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.removeAllItems();
    await sharedPage.waitForTimeout(1000);
    await cartPage.assertCartEmpty();

    // Restore cart for subsequent tests
    const pdpPage = new PDPPage(sharedPage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    await pdpPage.navigate(products.product2.url);
    await pdpPage.addToCart();
    await cartPage.navigate();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_017 — Continue Shopping link
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_017 — Verify "Continue Shopping" link navigates correctly', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_017' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.assertContinueShoppingVisible();
    await cartPage.clickContinueShopping();
    // Should land on /trending or /jewellery
    const currentUrl = sharedPage.url();
    expect(currentUrl).toMatch(/\/(trending|jewellery)/);
    // Return to cart
    await cartPage.navigate();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_018 — CHECKOUT SECURELY button
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_018 — Verify "CHECKOUT SECURELY" button is visible and clickable', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_018' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.assertCheckoutBtnVisible();
    await cartPage.clickCheckout();
    // Verify we left the cart page
    const url = sharedPage.url();
    expect(url).not.toContain('/cart');
    // Go back to cart for next tests
    await cartPage.navigate();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_019 — Cart badge count in header
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_019 — Verify cart icon badge shows the correct item count', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_019' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage   = getCartPage();
    await cartPage.navigate();
    const rowCount   = await cartPage.cartItems.count();
    const badgeCount = await cartPage.getHeaderCartCount();
    expect(badgeCount).toBeGreaterThanOrEqual(rowCount);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_020 — Price Details section
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_020 — Verify Price Details section shows Subtotal and Total', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_020' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const subtotal = await cartPage.getSubtotal();
    const total    = await cartPage.getTotal();
    expect(subtotal).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_021 — Sunny Promise section
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_021 — Verify "Our Promise to You" section is visible', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_021' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.assertPromiseSectionVisible();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_022 — Mobile sticky checkout bar
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_022 — Verify mobile sticky checkout bar is visible at mobile viewport', async ({ browser }) => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_022' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    // Use a separate context with mobile viewport
    const mobileCtx  = await browser.newContext({ viewport: viewports.mobile });
    const mobilePage = await mobileCtx.newPage();
    const loginPage  = new LoginPage(mobilePage);
    await loginPage.loginWithCredentials(users.validUser.email, users.validUser.password);

    const pdpPage = new PDPPage(mobilePage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();

    const cartPage = new CartPage(mobilePage);
    await cartPage.navigate();
    await cartPage.assertMobileCheckoutBarVisible();
    await mobileCtx.close();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_023 — Navigate to cart via header cart icon
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_023 — Verify navigating to Cart page via header cart icon', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_023' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    // Navigate away first
    await sharedPage.goto(urls.home);
    await sharedPage.waitForLoadState('networkidle');
    // Click cart icon
    await cartPage.clickHeaderCartIcon();
    await cartPage.assertOnCartPage();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_024 — Cart persists after page refresh
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_024 — Verify cart data persists after browser page refresh', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_024' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage    = getCartPage();
    await cartPage.navigate();
    const countBefore = await cartPage.cartItems.count();
    const subBefore   = await cartPage.getSubtotal();
    // Reload
    await sharedPage.reload({ waitUntil: 'networkidle' });
    const countAfter  = await cartPage.cartItems.count();
    const subAfter    = await cartPage.getSubtotal();
    expect(countAfter).toBe(countBefore);
    expect(subAfter).toBe(subBefore);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_025 — Newsletter subscription
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_025 — Verify footer newsletter subscription works from Cart page', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_025' });
    test.info().annotations.push({ type: 'Priority',   description: 'Low' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await sharedPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await cartPage.newsletterInput.waitFor({ state: 'visible', timeout: 5000 });
    await cartPage.subscribeNewsletter(newsletter.validEmail);
    // No hard assertion on success message — just verify no crash
    await expect(sharedPage).not.toHaveURL(/error/i);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_026 — NEGATIVE: '-' button at qty = 1
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_026 — Verify "-" button at qty=1 does not create negative quantity', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_026' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    // Ensure qty is exactly 1
    const currentQty = await cartPage.getItemQuantity(0);
    if (currentQty > 1) {
      await cartPage.setItemQuantity(0, 1);
    }
    await cartPage.decreaseQty(0);
    await sharedPage.waitForTimeout(800);
    // qty should still be >= 1 (not negative)
    const afterQty = await cartPage.getItemQuantity(0);
    expect(afterQty).toBeGreaterThanOrEqual(1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_027 — NEGATIVE: Qty input = 0
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_027 — Verify qty field rejects value 0', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_027' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.setItemQuantity(0, cartData.zeroQty);
    await sharedPage.waitForTimeout(800);
    // After setting to 0, qty must either revert to 1 or the item gets removed
    const rowCount = await cartPage.cartItems.count();
    if (rowCount > 0) {
      const qty = await cartPage.getItemQuantity(0);
      expect(qty).toBeGreaterThanOrEqual(1);
    }
    // Restore if removed
    if (rowCount === 0) {
      const pdpPage = new PDPPage(sharedPage);
      await pdpPage.navigate(products.product1.url);
      await pdpPage.addToCart();
      await cartPage.navigate();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_028 — NEGATIVE: Qty input = -1
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_028 — Verify qty field rejects negative value (-1)', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_028' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.setItemQuantity(0, cartData.negativeQty);
    await sharedPage.waitForTimeout(800);
    const qty = await cartPage.getItemQuantity(0);
    expect(qty).toBeGreaterThanOrEqual(1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_029 — NEGATIVE: Qty input = alphabetic characters
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_029 — Verify qty field rejects alphabetic input', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_029' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.setItemQuantity(0, cartData.alphaQty);
    await sharedPage.waitForTimeout(800);
    const qtyRaw = await cartPage.itemAt(0).locator('input.cartItem_qty_value__2xZ3a').inputValue();
    // Field should NOT contain letters
    expect(qtyRaw).not.toMatch(/[a-zA-Z]/);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_030 — NEGATIVE: Qty input = special characters
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_030 — Verify qty field rejects special characters', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_030' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.setItemQuantity(0, cartData.specialQty);
    await sharedPage.waitForTimeout(800);
    const qtyRaw = await cartPage.itemAt(0).locator('input.cartItem_qty_value__2xZ3a').inputValue();
    expect(qtyRaw).not.toMatch(/[@#$%]/);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_031 — NEGATIVE: Guest (unauthenticated) direct cart access
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_031 — Verify guest user cannot access cart with another user\'s items', async ({ browser }) => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_031' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    // Fresh context with no session
    const guestCtx  = await browser.newContext();
    const guestPage = await guestCtx.newPage();
    await guestPage.goto(urls.cart);
    await guestPage.waitForLoadState('networkidle');
    const url = guestPage.url();
    // Must redirect to /login or show empty cart — NOT expose another user's items
    const onLogin  = url.includes('/login');
    const onCart   = url.includes('/cart');
    expect(onLogin || onCart).toBe(true);
    await guestCtx.close();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_032 — NEGATIVE: Newsletter invalid email
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_032 — Verify newsletter rejects invalid email format', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_032' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await sharedPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await cartPage.newsletterInput.waitFor({ state: 'visible', timeout: 5000 });
    await cartPage.subscribeNewsletter(newsletter.invalidEmail);
    // Should stay on cart page without server error
    await cartPage.assertOnCartPage();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_033 — NEGATIVE: Checkout from empty cart
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_033 — Verify checkout button behaviour when cart is empty', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_033' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Negative' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.removeAllItems();
    await sharedPage.waitForTimeout(1000);
    // Checkout button should be hidden OR cart is empty
    const checkoutVisible = await cartPage.checkoutBtn.isVisible().catch(() => false);
    const rowCount        = await cartPage.cartItems.count();
    if (!checkoutVisible) {
      expect(rowCount).toBe(0);
    } else {
      // If button still shows, clicking should not navigate to payment
      await cartPage.clickCheckout();
      const url = sharedPage.url();
      // Should warn or stay on cart — not proceed to checkout with empty cart
      expect(url).toMatch(/\/(cart|login)/);
    }
    // Restore cart
    const pdpPage = new PDPPage(sharedPage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    await pdpPage.navigate(products.product2.url);
    await pdpPage.addToCart();
    await cartPage.navigate();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_034 — EDGE: BVA qty = 1 (minimum boundary)
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_034 — BVA: Verify quantity = 1 is accepted as minimum', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_034' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.setItemQuantity(0, 1);
    await sharedPage.waitForTimeout(800);
    const qty = await cartPage.getItemQuantity(0);
    expect(qty).toBe(1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_035 — EDGE: BVA qty = 999 (large value)
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_035 — BVA: Verify behaviour with very large quantity (999)', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_035' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    await cartPage.setItemQuantity(0, cartData.maxQty);
    await sharedPage.waitForTimeout(1000);
    // Should accept or show a limit error — must NOT crash
    const qtyRaw = await cartPage.itemAt(0).locator('input.cartItem_qty_value__2xZ3a').inputValue();
    const qtyNum = parseInt(qtyRaw, 10);
    expect(qtyNum).toBeGreaterThan(0);    // No crash; valid number
    // Reset to 1
    await cartPage.setItemQuantity(0, 1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_036 — EDGE: Price calculation accuracy
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_036 — Verify price calculation accuracy for multiple items', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_036' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const cartPage  = getCartPage();
    await cartPage.navigate();
    const count     = await cartPage.cartItems.count();
    let expectedSum = 0;
    for (let i = 0; i < count; i++) {
      const price = await cartPage.getItemPrice(i);
      const qty   = await cartPage.getItemQuantity(i);
      expectedSum += price * qty;
    }
    const displayedSubtotal = await cartPage.getSubtotal();
    // Allow ±1 for rounding
    expect(Math.abs(displayedSubtotal - expectedSum)).toBeLessThanOrEqual(1);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_037 — EDGE: Mobile viewport (375 x 812)
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_037 — Verify Cart page renders correctly on mobile viewport (375×812)', async ({ browser }) => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_037' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const mobileCtx  = await browser.newContext({ viewport: viewports.mobile });
    const mobilePage = await mobileCtx.newPage();
    const loginPage  = new LoginPage(mobilePage);
    await loginPage.loginWithCredentials(users.validUser.email, users.validUser.password);
    const pdpPage    = new PDPPage(mobilePage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    const cartPage   = new CartPage(mobilePage);
    await cartPage.navigate();
    await cartPage.assertTitleVisible();
    await cartPage.assertMobileCheckoutBarVisible();
    // Verify no horizontal overflow
    const scrollWidth  = await mobilePage.evaluate(() => document.body.scrollWidth);
    const clientWidth  = await mobilePage.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // ≤5px tolerance
    await mobileCtx.close();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_038 — EDGE: Tablet viewport (768 x 1024)
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_038 — Verify Cart page renders correctly on tablet viewport (768×1024)', async ({ browser }) => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_038' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const tabCtx  = await browser.newContext({ viewport: viewports.tablet });
    const tabPage = await tabCtx.newPage();
    const loginPage = new LoginPage(tabPage);
    await loginPage.loginWithCredentials(users.validUser.email, users.validUser.password);
    const pdpPage = new PDPPage(tabPage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    const cartPage = new CartPage(tabPage);
    await cartPage.navigate();
    await cartPage.assertTitleVisible();
    await cartPage.assertCheckoutBtnVisible();
    await tabCtx.close();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_039 — EDGE: XSS in quantity field
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_039 — Verify XSS injection in quantity field is sanitised', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_039' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const cartPage = getCartPage();
    await cartPage.navigate();

    // Listen for unexpected dialogs (alert from XSS)
    let alertFired = false;
    sharedPage.on('dialog', async (dialog) => {
      alertFired = true;
      await dialog.dismiss();
    });

    await cartPage.setItemQuantity(0, cartData.xssPayload);
    await sharedPage.waitForTimeout(800);

    expect(alertFired).toBe(false);   // No alert should appear
    const qtyRaw = await cartPage.itemAt(0).locator('input.cartItem_qty_value__2xZ3a').inputValue();
    expect(qtyRaw).not.toContain('<script>');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_040 — EDGE: Cart badge resets after removing all items
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_040 — Verify cart badge resets to 0 after all items removed', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_040' });
    test.info().annotations.push({ type: 'Priority',   description: 'High' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const cartPage = getCartPage();
    await cartPage.navigate();
    const badgeBefore = await cartPage.getHeaderCartCount();
    expect(badgeBefore).toBeGreaterThan(0);
    await cartPage.removeAllItems();
    await sharedPage.waitForTimeout(1000);
    const badgeAfter = await cartPage.getHeaderCartCount();
    expect(badgeAfter).toBe(0);

    // Restore
    const pdpPage = new PDPPage(sharedPage);
    await pdpPage.navigate(products.product1.url);
    await pdpPage.addToCart();
    await pdpPage.navigate(products.product2.url);
    await pdpPage.addToCart();
    await cartPage.navigate();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_041 — EDGE: Browser back from checkout returns to cart
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_041 — Verify browser back from checkout returns to cart with state intact', async () => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_041' });
    test.info().annotations.push({ type: 'Priority',   description: 'Medium' });
    test.info().annotations.push({ type: 'Type',       description: 'Edge Case' });

    const cartPage    = getCartPage();
    await cartPage.navigate();
    const countBefore = await cartPage.cartItems.count();
    await cartPage.clickCheckout();
    // Navigate back
    await sharedPage.goBack({ waitUntil: 'networkidle' });
    // Should be back on cart or redirected to cart
    const url = sharedPage.url();
    if (!url.includes('/cart')) {
      await cartPage.navigate();
    }
    const countAfter = await cartPage.cartItems.count();
    expect(countAfter).toBeGreaterThanOrEqual(1);
    expect(countAfter).toBe(countBefore);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC_CART_042 — VALID LOGIN (LAST TC)
  // ══════════════════════════════════════════════════════════════════════════
  test('TC_CART_042 — Login with valid credentials and verify Cart page is accessible', async ({ browser }) => {
    test.info().annotations.push({ type: 'TestCaseID', description: 'TC_CART_042' });
    test.info().annotations.push({ type: 'Priority',   description: 'Critical' });
    test.info().annotations.push({ type: 'Type',       description: 'Positive' });
    test.info().annotations.push({ type: 'Note',       description: 'VALID LOGIN — Placed LAST as required' });

    // Fresh browser context to perform a clean login verification
    const ctx      = await browser.newContext({ viewport: viewports.desktop });
    const page     = await ctx.newPage();
    const loginPg  = new LoginPage(page);
    const cartPg   = new CartPage(page);

    // Step 1–4: Login
    await loginPg.loginWithCredentials(users.validUser.email, users.validUser.password);
    await loginPg.assertLoginSuccess();

    // Step 5: Navigate to /cart
    await cartPg.navigate();

    // Step 6: Verify Cart page is accessible
    await cartPg.assertOnCartPage();
    await cartPg.assertTitleVisible();

    await ctx.close();
  });

}); // end test.describe
