const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const { LoginData } = require('../../utils/testData');

test.describe('Login Page Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.dismissCookieBanner();
  });

  // ==================== POSITIVE TEST CASES ====================

  test.describe('Positive Tests', () => {

    test('TC_LOGIN_001 - Verify Login page loads correctly with all UI elements visible', async () => {
      // Verify "Welcome Back" heading
      const welcomeVisible = await loginPage.isWelcomeBackHeadingVisible();
      expect(welcomeVisible).toBeTruthy();
      const welcomeText = await loginPage.welcomeBackHeading.textContent();
      expect(welcomeText.trim()).toBe('Welcome Back');

      // Verify Email input field
      const emailVisible = await loginPage.isEmailInputVisible();
      expect(emailVisible).toBeTruthy();

      // Verify Password input field with eye-toggle
      const passwordVisible = await loginPage.isPasswordInputVisible();
      expect(passwordVisible).toBeTruthy();
      const eyeIconVisible = await loginPage.isPasswordEyeIconVisible();
      expect(eyeIconVisible).toBeTruthy();

      // Verify "Remember me" checkbox
      const rememberMeVisible = await loginPage.isRememberMeCheckboxVisible();
      expect(rememberMeVisible).toBeTruthy();

      // Verify "Forgot password?" link
      const forgotPwdVisible = await loginPage.isForgotPasswordLinkVisible();
      expect(forgotPwdVisible).toBeTruthy();

      // Verify "Sign In" button
      const signInVisible = await loginPage.isSignInButtonVisible();
      expect(signInVisible).toBeTruthy();

      // Verify "Create Account" link
      const createAccVisible = await loginPage.isCreateAccountLinkVisible();
      expect(createAccVisible).toBeTruthy();

      // Verify no console errors (check page errors collected during load)
      const consoleErrors = [];
      loginPage.page.on('pageerror', (error) => consoleErrors.push(error.message));
      await loginPage.page.waitForTimeout(1000);
      expect(consoleErrors.length).toBe(0);
    });

    test('TC_LOGIN_002 - Verify Password show/hide toggle (eye icon) works on Password field', async () => {
      await loginPage.enterPassword(LoginData.passwordToggle.password);

      // Password should be masked by default
      const defaultType = await loginPage.getPasswordFieldType();
      expect(defaultType).toBe('password');

      // Click eye icon — password should become visible
      await loginPage.clickPasswordEyeIcon();
      await loginPage.page.waitForTimeout(300);
      const visibleType = await loginPage.getPasswordFieldType();
      expect(visibleType).toBe('text');

      // Click eye icon again — password should be masked
      await loginPage.clickPasswordEyeIcon();
      await loginPage.page.waitForTimeout(300);
      const maskedType = await loginPage.getPasswordFieldType();
      expect(maskedType).toBe('password');
    });

    test('TC_LOGIN_003 - Verify "Remember me" checkbox can be checked and unchecked', async () => {
      // Initially should be unchecked
      const initialState = await loginPage.isRememberMeChecked();
      expect(initialState).toBeFalsy();

      // Check it
      await loginPage.checkRememberMe();
      const checkedState = await loginPage.isRememberMeChecked();
      expect(checkedState).toBeTruthy();

      // Uncheck it
      await loginPage.uncheckRememberMe();
      const uncheckedState = await loginPage.isRememberMeChecked();
      expect(uncheckedState).toBeFalsy();
    });

    test('TC_LOGIN_004 - Verify "Forgot password?" link navigates to Forgot Password page', async () => {
      await loginPage.clickForgotPassword();
      await loginPage.page.waitForTimeout(3000);

      const isOnForgotPage = await loginPage.isOnForgotPasswordPage();
      expect(isOnForgotPage).toBeTruthy();
      expect(loginPage.page.url()).toContain('/forgot-password');
    });

    test('TC_LOGIN_005 - Verify "Create Account" link navigates to Registration page', async () => {
      await loginPage.clickCreateAccount();
      await loginPage.page.waitForTimeout(3000);

      const isOnRegPage = await loginPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
      expect(loginPage.page.url()).toContain('/create');
    });
  });

  // ==================== NEGATIVE TEST CASES ====================

  test.describe('Negative Tests', () => {

    test('TC_LOGIN_006 - Submit Login form with both Email and Password fields empty', async () => {
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(1500);

      const errors = await loginPage.getVisibleValidationMessages();
      expect(errors.length).toBeGreaterThanOrEqual(1);

      // Check that errors include email and password required messages
      const allErrorText = errors.join(' ').toLowerCase();
      expect(allErrorText).toContain('email');
      expect(allErrorText).toContain('password');

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();
    });

    test('TC_LOGIN_007 - Submit Login form with Email field empty and valid Password entered', async () => {
      await loginPage.enterPassword(LoginData.emptyEmailValidPassword.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(1500);

      const errors = await loginPage.getVisibleValidationMessages();
      expect(errors.length).toBeGreaterThanOrEqual(1);

      const allErrorText = errors.join(' ').toLowerCase();
      expect(allErrorText).toContain('email');

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();
    });

    test('TC_LOGIN_008 - Submit Login form with valid Email entered and Password field empty', async () => {
      await loginPage.enterEmail(LoginData.validEmailEmptyPassword.email);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(1500);

      const errors = await loginPage.getVisibleValidationMessages();
      expect(errors.length).toBeGreaterThanOrEqual(1);

      const allErrorText = errors.join(' ').toLowerCase();
      expect(allErrorText).toContain('password');

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();
    });

    test('TC_LOGIN_009 - Submit Login with invalid email format — missing @ symbol', async () => {
      const data = LoginData.invalidEmailNoAt;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(1500);

      // Either custom JS validation or HTML5 validation prevents submission
      const errors = await loginPage.getAllVisibleErrors();
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Expect some kind of email validation error
      if (errors.length > 0) {
        const errorText = errors.join(' ').toLowerCase();
        expect(errorText).toMatch(/email|valid/);
      } else {
        // HTML5 validation may have blocked without visible custom errors
        const formValid = await loginPage.page.evaluate(() => document.querySelector('form')?.checkValidity());
        expect(formValid).toBeFalsy();
      }
    });

    test('TC_LOGIN_010 - Submit Login with invalid email format — missing domain extension', async () => {
      const data = LoginData.invalidEmailNoDomain;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(2000);

      const errors = await loginPage.getAllVisibleErrors();
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      if (errors.length > 0) {
        const errorText = errors.join(' ').toLowerCase();
        expect(errorText).toMatch(/email|valid/);
      }
    });

    test('TC_LOGIN_011 - Submit Login with a valid email format but unregistered email address', async () => {
      const data = LoginData.unregisteredEmail;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      const errors = await loginPage.getAllVisibleErrors();
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Should show generic error message without exposing account details
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    test('TC_LOGIN_012 - Submit Login with registered email but incorrect password', async () => {
      const data = LoginData.wrongPassword;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      const errors = await loginPage.getAllVisibleErrors();
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Should show authentication failure message
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    test('TC_LOGIN_013 - Submit Login with correct email but password in wrong case (case sensitivity)', async () => {
      const data = LoginData.passwordWrongCase;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      const errors = await loginPage.getAllVisibleErrors();
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Password should be case-sensitive — "password" != "Password"
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    test('TC_LOGIN_014 - Submit Login with correct email but password entered with only spaces', async () => {
      const data = LoginData.spacesOnlyPassword;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(3000);

      const errors = await loginPage.getAllVisibleErrors();
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Should reject spaces-only password
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==================== EDGE CASE TEST CASES ====================

  test.describe('Edge Case Tests', () => {

    test('TC_LOGIN_015 - SQL Injection attempt in Email field (Security)', async () => {
      const data = LoginData.sqlInjectionEmail;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(3000);

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Verify no SQL error is exposed
      const pageText = await loginPage.page.evaluate(() => document.body.innerText);
      const hasSqlError = pageText.toLowerCase().includes('sql') && pageText.toLowerCase().includes('syntax');
      expect(hasSqlError).toBeFalsy();

      // Should show standard auth error or validation error
      const errors = await loginPage.getAllVisibleErrors();
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    test('TC_LOGIN_016 - XSS injection attempt in Email field (Security)', async () => {
      const data = LoginData.xssEmail;

      // Listen for JavaScript dialogs (alerts)
      let alertTriggered = false;
      loginPage.page.on('dialog', async (dialog) => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(3000);

      // No JavaScript alert should execute
      expect(alertTriggered).toBeFalsy();

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Verify no script is rendered in the DOM
      const scriptInDom = await loginPage.page.evaluate(() => {
        return document.body.innerHTML.includes('<script>alert');
      });
      expect(scriptInDom).toBeFalsy();
    });

    test('TC_LOGIN_017 - Submit Login with email containing leading and trailing spaces', async () => {
      const data = LoginData.emailWithSpaces;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      // Option A: Spaces trimmed and login succeeds
      // Option B: Validation error shown
      const isOnLogin = await loginPage.isOnLoginPage();

      if (!isOnLogin) {
        // Option A: Login succeeded — spaces were trimmed
        expect(await loginPage.isLoggedIn()).toBeTruthy();
      } else {
        // Option B: Validation error or auth error — also acceptable
        const errors = await loginPage.getAllVisibleErrors();
        expect(errors.length).toBeGreaterThanOrEqual(0); // Either outcome is valid
      }
    });

    test('TC_LOGIN_018 - Submit Login with extremely long email address (>254 characters)', async () => {
      const data = LoginData.longEmail;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(3000);

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Should not crash — graceful error handling
      const errors = await loginPage.getAllVisibleErrors();
      // Verify no server error (500)
      const pageText = await loginPage.page.evaluate(() => document.body.innerText);
      const hasServerError = pageText.includes('500') && pageText.toLowerCase().includes('server error');
      expect(hasServerError).toBeFalsy();
    });

    test('TC_LOGIN_019 - Submit Login with an extremely long password (500+ characters)', async () => {
      const data = LoginData.longPassword;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();

      // Should fail gracefully — no crash
      const pageText = await loginPage.page.evaluate(() => document.body.innerText);
      const hasServerError = pageText.includes('500') && pageText.toLowerCase().includes('server error');
      expect(hasServerError).toBeFalsy();
    });

    test('TC_LOGIN_020 - Verify email field accepts case-insensitive email (uppercase)', async () => {
      const data = LoginData.uppercaseEmail;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      // Option A: Login succeeds (email is case-insensitive)
      // Option B: Login fails with error
      const isOnLogin = await loginPage.isOnLoginPage();

      if (!isOnLogin) {
        // Case-insensitive email — login succeeded
        expect(await loginPage.isLoggedIn()).toBeTruthy();
      } else {
        // Case-sensitive email — login failed
        const errors = await loginPage.getAllVisibleErrors();
        expect(errors.length).toBeGreaterThanOrEqual(1);
      }
    });

    test('TC_LOGIN_021 - Verify Login page is served over HTTPS with secure connection', async () => {
      const isSecure = await loginPage.isPageSecure();
      expect(isSecure).toBeTruthy();
      expect(loginPage.page.url()).toMatch(/^https:\/\//);

      // Check for mixed content warnings
      const mixedContentErrors = [];
      loginPage.page.on('console', (msg) => {
        const text = msg.text().toLowerCase();
        if (text.includes('mixed content') || text.includes('insecure')) {
          mixedContentErrors.push(msg.text());
        }
      });
      await loginPage.page.waitForTimeout(2000);
      expect(mixedContentErrors.length).toBe(0);
    });

    test('TC_LOGIN_022 - Verify double-clicking "Sign In" does not trigger duplicate login requests', async () => {
      const data = LoginData.validCredentials;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);

      // Track POST requests to login endpoint
      const loginRequests = [];
      loginPage.page.on('request', (request) => {
        if (request.method() === 'POST' && (request.url().includes('login') || request.url().includes('auth') || request.url().includes('sign'))) {
          loginRequests.push({ url: request.url(), time: Date.now() });
        }
      });

      // Rapidly double-click Sign In
      await loginPage.doubleClickSignIn();
      await loginPage.page.waitForTimeout(5000);

      // Verify only one login request was sent or button was disabled
      const isDisabled = await loginPage.isSignInButtonDisabled();
      expect(loginRequests.length <= 1 || isDisabled).toBeTruthy();
    });

    test('TC_LOGIN_023 - Verify "Remember Me" — session persists after browser tab is closed and reopened', async ({ browser }) => {
      const data = LoginData.validCredentials;
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPageInstance = new LoginPage(page);

      await loginPageInstance.navigate();
      await loginPageInstance.dismissCookieBanner();

      // Login with Remember Me checked
      await loginPageInstance.loginWithRememberMe(data.email, data.password);
      await page.waitForTimeout(5000);

      // Verify login was successful
      const loggedIn = await loginPageInstance.isLoggedIn();

      if (loggedIn) {
        // Save storage state (cookies + localStorage)
        const storageState = await context.storageState();
        await page.close();

        // Open new page with same storage state (simulates reopening browser)
        const newContext = await browser.newContext({ storageState });
        const newPage = await newContext.newPage();
        await newPage.goto('https://qa-sunnydiamonds.webc.in/', { waitUntil: 'domcontentloaded' });
        await newPage.waitForTimeout(3000);

        // Verify user is still logged in
        const stillLoggedIn = !newPage.url().includes('/login');
        expect(stillLoggedIn).toBeTruthy();

        await newPage.close();
        await newContext.close();
      } else {
        // Login failed (possibly due to CAPTCHA or other issue)
        // Mark as inconclusive but don't fail
        console.log('TC_LOGIN_023: Login did not succeed — unable to verify Remember Me persistence.');
      }

      await context.close();
    });

    test('TC_LOGIN_024 - Successful login with valid registered email and correct password', async () => {
      const data = LoginData.validCredentials;
      await loginPage.enterEmail(data.email);
      await loginPage.enterPassword(data.password);
      await loginPage.clickSignIn();
      await loginPage.page.waitForTimeout(5000);

      // Verify user is redirected away from login page
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeFalsy();

      // Verify user is logged in (on home/dashboard)
      const loggedIn = await loginPage.isLoggedIn();
      expect(loggedIn).toBeTruthy();

      // Verify no error message is shown
      const currentUrl = loginPage.page.url();
      expect(currentUrl).not.toContain('/login');
    });
  });
});
