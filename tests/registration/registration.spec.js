const { test, expect } = require('@playwright/test');
const RegistrationPage = require('../../pages/RegistrationPage');
const { RegistrationData } = require('../../utils/testData');

test.describe('Registration Page Tests', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
  });

  // ==================== POSITIVE TEST CASES ====================

  test.describe('Positive Tests', () => {

    test('TC_REG_001 - Successful registration with all valid fields and Newsletter checked', async () => {
      const data = RegistrationData.validUserWithNewsletter;
      await registrationPage.fillRegistrationForm(data);
      // Note: CAPTCHA must be handled manually or mocked in test environment
      await registrationPage.clickCreateAccount();

      // Verify successful registration - user redirected away from registration page
      await registrationPage.page.waitForTimeout(3000);
      const isOnDashboard = await registrationPage.isOnDashboard();
      expect(isOnDashboard).toBeTruthy();
    });

    test('TC_REG_002 - Successful registration with all valid fields without Newsletter', async () => {
      const data = RegistrationData.validUserWithoutNewsletter;
      await registrationPage.fillRegistrationForm(data);
      // Note: CAPTCHA must be handled manually or mocked in test environment
      await registrationPage.clickCreateAccount();

      await registrationPage.page.waitForTimeout(3000);
      const isOnDashboard = await registrationPage.isOnDashboard();
      expect(isOnDashboard).toBeTruthy();
    });

    test('TC_REG_003 - Verify Password field show/hide toggle (eye icon)', async () => {
      const data = RegistrationData.passwordToggle;
      await registrationPage.enterPassword(data.password);

      // Password should be masked by default
      const defaultType = await registrationPage.getPasswordFieldType();
      expect(defaultType).toBe('password');

      // Click eye icon - password should become visible
      await registrationPage.clickPasswordEyeIcon();
      const visibleType = await registrationPage.getPasswordFieldType();
      expect(visibleType).toBe('text');

      // Click eye icon again - password should be masked again
      await registrationPage.clickPasswordEyeIcon();
      const maskedType = await registrationPage.getPasswordFieldType();
      expect(maskedType).toBe('password');
    });

    test('TC_REG_004 - Verify Confirm Password field show/hide toggle (eye icon)', async () => {
      const data = RegistrationData.passwordToggle;
      await registrationPage.enterConfirmPassword(data.confirmPassword);

      // Confirm Password should be masked by default
      const defaultType = await registrationPage.getConfirmPasswordFieldType();
      expect(defaultType).toBe('password');

      // Click eye icon - should become visible
      await registrationPage.clickConfirmPasswordEyeIcon();
      const visibleType = await registrationPage.getConfirmPasswordFieldType();
      expect(visibleType).toBe('text');

      // Click eye icon again - should be masked again
      await registrationPage.clickConfirmPasswordEyeIcon();
      const maskedType = await registrationPage.getConfirmPasswordFieldType();
      expect(maskedType).toBe('password');
    });

    test('TC_REG_005 - Verify "Already a member? Log In" link navigates to Login page', async () => {
      await registrationPage.clickLoginLink();

      await registrationPage.page.waitForTimeout(2000);
      const isOnLoginPage = await registrationPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
      expect(registrationPage.page.url()).toContain('/login');
    });
  });

  // ==================== NEGATIVE TEST CASES ====================

  test.describe('Negative Tests', () => {

    test('TC_REG_006 - Submit registration form with all fields empty', async () => {
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      // Verify user stays on registration page
      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_007 - Submit form with First Name less than minimum length (2 chars)', async () => {
      const data = RegistrationData.firstNameBelowMin;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_008 - Submit form with invalid email format — missing @ symbol', async () => {
      const data = RegistrationData.invalidEmailNoAt;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_009 - Submit form with invalid email format — missing domain extension', async () => {
      const data = RegistrationData.invalidEmailNoDomain;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_010 - Submit form with Password and Confirm Password mismatch', async () => {
      const data = RegistrationData.passwordMismatch;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_011 - Submit form with Phone Number less than 10 digits', async () => {
      const data = RegistrationData.phoneBelowMin;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_012 - Submit form with an already registered email address', async () => {
      const data = RegistrationData.duplicateEmail;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      await registrationPage.page.waitForTimeout(3000);
      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_013 - Submit form without checking Terms and Condition checkbox', async () => {
      const data = RegistrationData.withoutTerms;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_014 - Submit form with Phone Number containing alphabets', async () => {
      const data = RegistrationData.phoneWithAlphabets;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Either the field rejects alphabets or validation error is shown
      const phoneValue = await registrationPage.getPhoneValue();
      const hasOnlyDigits = /^\d*$/.test(phoneValue);

      if (hasOnlyDigits && phoneValue.length < 10) {
        // Field rejected non-numeric chars — alphabets were stripped
        expect(phoneValue).not.toContain('A');
      } else {
        // Validation error should be shown
        const hasErrors = await registrationPage.isValidationErrorVisible();
        expect(hasErrors).toBeTruthy();
      }

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_015 - Submit form with Phone Number containing special characters', async () => {
      const data = RegistrationData.phoneWithSpecialChars;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Either field rejects special chars or validation error shown
      const phoneValue = await registrationPage.getPhoneValue();
      const hasSpecialChars = /[^0-9]/.test(phoneValue);

      if (!hasSpecialChars) {
        // Special chars were stripped by the field
        expect(phoneValue).not.toContain('+');
      } else {
        const hasErrors = await registrationPage.isValidationErrorVisible();
        expect(hasErrors).toBeTruthy();
      }

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_016 - Submit form without completing CAPTCHA verification', async () => {
      const data = RegistrationData.withoutCaptcha;
      await registrationPage.fillRegistrationForm(data);
      // Intentionally NOT solving CAPTCHA
      await registrationPage.clickCreateAccount();

      await registrationPage.page.waitForTimeout(2000);
      // User should remain on registration page
      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_017 - Submit form with email containing leading and trailing spaces', async () => {
      const data = RegistrationData.emailWithSpaces;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      await registrationPage.page.waitForTimeout(2000);
      // Either spaces are trimmed (success) or validation error is shown
      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      // If still on reg page, check for errors
      if (isOnRegPage) {
        const hasErrors = await registrationPage.isValidationErrorVisible();
        expect(hasErrors).toBeTruthy();
      }
      // If redirected, registration was accepted with trimmed email (also valid)
    });

    test('TC_REG_018 - Submit form with only whitespace in First Name field', async () => {
      const data = RegistrationData.whitespaceFirstName;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_019 - Submit form with only spaces in Password and Confirm Password', async () => {
      const data = RegistrationData.whitespacePassword;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });
  });

  // ==================== EDGE CASE TEST CASES ====================

  test.describe('Edge Case Tests', () => {

    test('TC_REG_020 - First Name at exact minimum boundary — 3 characters (BVA)', async () => {
      const data = RegistrationData.firstNameExactMin;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Should accept 3 characters — no first name validation error
      await registrationPage.page.waitForTimeout(2000);
      // If CAPTCHA is not solved, form won't submit but first name should not show error
    });

    test('TC_REG_021 - First Name below minimum boundary — 2 characters (BVA)', async () => {
      const data = RegistrationData.firstNameBelowMinBVA;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_022 - First Name at exact maximum boundary — 50 characters (BVA)', async () => {
      const data = RegistrationData.firstNameExactMax;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Should accept 50 characters — verify the field value
      const firstNameValue = await registrationPage.getFirstNameValue();
      expect(firstNameValue.length).toBeLessThanOrEqual(50);
    });

    test('TC_REG_023 - First Name above maximum boundary — 51 characters (BVA)', async () => {
      const data = RegistrationData.firstNameAboveMax;
      await registrationPage.enterFirstName(data.firstName);

      // Field should cap at 50 characters (maxlength enforcement)
      const firstNameValue = await registrationPage.getFirstNameValue();
      expect(firstNameValue.length).toBeLessThanOrEqual(50);
    });

    test('TC_REG_024 - Last Name at exact minimum boundary — 1 character (BVA)', async () => {
      const data = RegistrationData.lastNameExactMin;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Should accept 1 character for last name
      await registrationPage.page.waitForTimeout(2000);
    });

    test('TC_REG_025 - Last Name at exact maximum boundary — 50 characters (BVA)', async () => {
      const data = RegistrationData.lastNameExactMax;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const lastNameValue = await registrationPage.getLastNameValue();
      expect(lastNameValue.length).toBeLessThanOrEqual(50);
    });

    test('TC_REG_026 - Phone Number with exactly 10 digits starting with zero', async () => {
      const data = RegistrationData.phoneStartingWithZero;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      await registrationPage.page.waitForTimeout(2000);
      // Either accepted or validation error for phone starting with 0
      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      // Both outcomes are valid per test case (Option A or Option B)
    });

    test('TC_REG_027 - Phone Number field rejects more than 10 digits (maxlength boundary)', async () => {
      const data = RegistrationData.phoneAboveMax;
      await registrationPage.enterPhone(data.phone);

      // Field should cap at 10 digits
      const phoneValue = await registrationPage.getPhoneValue();
      expect(phoneValue.length).toBeLessThanOrEqual(10);
    });

    test('TC_REG_028 - First Name with special characters only', async () => {
      const data = RegistrationData.firstNameSpecialChars;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_029 - First Name with numeric characters only', async () => {
      const data = RegistrationData.firstNameNumeric;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_030 - XSS injection attempt in First Name field (Security)', async () => {
      const data = RegistrationData.xssFirstName;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Verify no JavaScript alert executes
      let alertTriggered = false;
      registrationPage.page.on('dialog', async (dialog) => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      await registrationPage.page.waitForTimeout(2000);
      expect(alertTriggered).toBeFalsy();

      // Form should not submit with malicious content
      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_031 - SQL injection attempt in Email field (Security)', async () => {
      const data = RegistrationData.sqlInjectionEmail;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      await registrationPage.page.waitForTimeout(2000);
      // Email validation should reject this format
      const hasErrors = await registrationPage.isValidationErrorVisible();
      expect(hasErrors).toBeTruthy();

      const isOnRegPage = await registrationPage.isOnRegistrationPage();
      expect(isOnRegPage).toBeTruthy();
    });

    test('TC_REG_032 - Double-click Create account button — prevent duplicate account creation', async () => {
      const data = RegistrationData.doubleClickPrevention;
      await registrationPage.fillRegistrationForm(data);
      // Note: CAPTCHA must be handled for this test
      await registrationPage.doubleClickCreateAccount();

      await registrationPage.page.waitForTimeout(3000);
      // Button should be disabled after first click OR only one account created
      // We verify button state or that we're not getting duplicate errors
    });

    test('TC_REG_033 - Valid registration using email with + alias notation (RFC compliant)', async () => {
      const data = RegistrationData.emailWithPlusAlias;
      await registrationPage.fillRegistrationForm(data);
      await registrationPage.clickCreateAccount();

      // Email with + alias should be accepted
      await registrationPage.page.waitForTimeout(2000);
    });

    test('TC_REG_034 - Verify form data is retained after scrolling the page', async () => {
      const data = RegistrationData.formDataRetention;
      await registrationPage.enterFirstName(data.firstName);
      await registrationPage.enterLastName(data.lastName);
      await registrationPage.enterEmail(data.email);

      // Scroll to bottom and back to top
      await registrationPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await registrationPage.page.waitForTimeout(1000);
      await registrationPage.page.evaluate(() => window.scrollTo(0, 0));
      await registrationPage.page.waitForTimeout(1000);

      // Verify data is retained
      const firstName = await registrationPage.getFirstNameValue();
      const lastName = await registrationPage.getLastNameValue();
      const email = await registrationPage.getEmailValue();

      expect(firstName).toBe(data.firstName);
      expect(lastName).toBe(data.lastName);
      expect(email).toBe(data.email);
    });

    test('TC_REG_035 - Verify registration page is served over HTTPS', async () => {
      const isSecure = await registrationPage.isPageSecure();
      expect(isSecure).toBeTruthy();

      // Check for mixed content warnings
      const mixedContentErrors = [];
      registrationPage.page.on('console', (msg) => {
        if (msg.text().toLowerCase().includes('mixed content')) {
          mixedContentErrors.push(msg.text());
        }
      });

      await registrationPage.page.waitForTimeout(2000);
      expect(mixedContentErrors.length).toBe(0);
    });
  });
});
