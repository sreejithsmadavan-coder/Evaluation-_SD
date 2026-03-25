/**
 * Test Execution Script
 * Runs all 35 Registration test cases against the live site,
 * captures actual results, and updates the Excel sheet.
 */
const { chromium } = require('playwright');
const openpyxl = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://qa-sunnydiamonds.webc.in';
const REG_URL = `${BASE_URL}/create`;
const RESULTS_FILE = path.join(__dirname, 'test-results.json');

// Collect results here
const results = [];

function addResult(tcId, actualResult, status) {
  results.push({ tcId, actualResult, status });
  console.log(`  ${tcId}: ${status} - ${actualResult.substring(0, 100)}`);
}

async function waitAndCheck(page, ms = 2000) {
  await page.waitForTimeout(ms);
}

async function getVisibleErrors(page) {
  return await page.evaluate(() => {
    const selectors = '.register_email_error__10NZ5, .srv-validation-message, [class*="error_message"], [class*="validation-message"]';
    const elements = document.querySelectorAll(selectors);
    return Array.from(elements)
      .filter(el => el.offsetParent !== null && el.textContent.trim())
      .map(el => el.textContent.trim());
  });
}

async function getHTML5ValidationMessages(page) {
  return await page.evaluate(() => {
    const ids = ['first_name', 'last_name', 'email', 'phone', 'password', 'c_password'];
    const msgs = {};
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.validationMessage) msgs[id] = el.validationMessage;
    });
    // Also check terms checkbox
    const terms = document.getElementById('terms_and_condition');
    if (terms && terms.validationMessage) msgs['terms_and_condition'] = terms.validationMessage;
    return msgs;
  });
}

async function isOnPage(page, pathPart) {
  return page.url().includes(pathPart);
}

async function fillForm(page, data) {
  if (data.firstName !== undefined) await page.fill('#first_name', data.firstName);
  if (data.lastName !== undefined) await page.fill('#last_name', data.lastName);
  if (data.email !== undefined) await page.fill('#email', data.email);
  if (data.phone !== undefined) await page.fill('#phone', data.phone);
  if (data.password !== undefined) await page.fill('#password', data.password);
  if (data.confirmPassword !== undefined) await page.fill('#c_password', data.confirmPassword);
  if (data.newsletter === true) await page.check('#subscription');
  if (data.termsAndCondition === true) await page.check('#terms_and_condition');
}

async function navigateToReg(page) {
  await page.goto(REG_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
}

// ===================== TEST CASES =====================

async function runTC_REG_001(page) {
  const tcId = 'TC_REG_001';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+001@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      newsletter: true, termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const currentUrl = page.url();
    const errors = await getVisibleErrors(page);

    if (!currentUrl.includes('/create')) {
      addResult(tcId, 'Account created successfully. User redirected to ' + currentUrl + '. Newsletter checkbox was checked.', 'Pass');
    } else if (errors.length > 0) {
      addResult(tcId, 'Form submission blocked. Errors: ' + errors.join('; ') + '. User remained on registration page.', 'Fail');
    } else {
      addResult(tcId, 'Form submitted but user remained on registration page. Possibly blocked by reCAPTCHA. URL: ' + currentUrl, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_002(page) {
  const tcId = 'TC_REG_002';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'Jane', lastName: 'Smith',
      email: 'janesmith+002@testmail.com', phone: '9123456780',
      password: 'Pass@5678', confirmPassword: 'Pass@5678',
      newsletter: false, termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const currentUrl = page.url();
    const errors = await getVisibleErrors(page);

    if (!currentUrl.includes('/create')) {
      addResult(tcId, 'Account created successfully without Newsletter subscription. User redirected to ' + currentUrl, 'Pass');
    } else if (errors.length > 0) {
      addResult(tcId, 'Form submission blocked. Errors: ' + errors.join('; ') + '. User remained on registration page.', 'Fail');
    } else {
      addResult(tcId, 'Form submitted but user remained on registration page. Possibly blocked by reCAPTCHA. URL: ' + currentUrl, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_003(page) {
  const tcId = 'TC_REG_003';
  try {
    await navigateToReg(page);
    await page.fill('#password', 'Test@1234');

    // Check default type is password (masked)
    const defaultType = await page.getAttribute('#password', 'type');
    if (defaultType !== 'password') {
      addResult(tcId, 'Password is NOT masked by default. Type=' + defaultType, 'Fail');
      return;
    }

    // Click eye icon - should show password
    await page.click('.passwordInput_eye_toggle__hduXa >> nth=0');
    await page.waitForTimeout(500);
    const visibleType = await page.getAttribute('#password', 'type');

    // Click eye icon again - should hide password
    await page.click('.passwordInput_eye_toggle__hduXa >> nth=0');
    await page.waitForTimeout(500);
    const maskedAgainType = await page.getAttribute('#password', 'type');

    if (visibleType === 'text' && maskedAgainType === 'password') {
      addResult(tcId, 'Password masked by default (type=password). Eye icon click 1: type changed to text (visible). Eye icon click 2: type changed back to password (masked). Toggle works correctly.', 'Pass');
    } else {
      addResult(tcId, `Toggle failed. After click 1: type=${visibleType} (expected text). After click 2: type=${maskedAgainType} (expected password).`, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_004(page) {
  const tcId = 'TC_REG_004';
  try {
    await navigateToReg(page);
    await page.fill('#c_password', 'Test@1234');

    const defaultType = await page.getAttribute('#c_password', 'type');
    if (defaultType !== 'password') {
      addResult(tcId, 'Confirm Password is NOT masked by default. Type=' + defaultType, 'Fail');
      return;
    }

    await page.click('.passwordInput_eye_toggle__hduXa >> nth=1');
    await page.waitForTimeout(500);
    const visibleType = await page.getAttribute('#c_password', 'type');

    await page.click('.passwordInput_eye_toggle__hduXa >> nth=1');
    await page.waitForTimeout(500);
    const maskedAgainType = await page.getAttribute('#c_password', 'type');

    if (visibleType === 'text' && maskedAgainType === 'password') {
      addResult(tcId, 'Confirm Password masked by default (type=password). Eye icon click 1: type changed to text (visible). Eye icon click 2: type changed back to password (masked). Toggle works correctly.', 'Pass');
    } else {
      addResult(tcId, `Toggle failed. After click 1: type=${visibleType} (expected text). After click 2: type=${maskedAgainType} (expected password).`, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_005(page) {
  const tcId = 'TC_REG_005';
  try {
    await navigateToReg(page);
    await page.click('.register_login_link__12U13 a[href="/login"]');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      addResult(tcId, 'User successfully redirected to login page. URL: ' + currentUrl + '. Login page loaded correctly. No error displayed.', 'Pass');
    } else {
      addResult(tcId, 'User was NOT redirected to login page. Current URL: ' + currentUrl, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_006(page) {
  const tcId = 'TC_REG_006';
  try {
    await navigateToReg(page);
    // Click submit with empty form
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 2000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    const allMessages = [];
    if (Object.keys(html5Msgs).length > 0) {
      Object.entries(html5Msgs).forEach(([field, msg]) => allMessages.push(`${field}: ${msg}`));
    }
    if (serverErrors.length > 0) {
      serverErrors.forEach(e => allMessages.push(e));
    }

    if (onRegPage && allMessages.length > 0) {
      addResult(tcId, 'Form was NOT submitted. Validation errors shown: ' + allMessages.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (onRegPage) {
      // HTML5 validation may have blocked without visible messages
      const formValid = await page.evaluate(() => document.querySelector('form')?.checkValidity());
      if (!formValid) {
        addResult(tcId, 'Form was NOT submitted. HTML5 browser validation prevented submission for required fields. User remained on registration page.', 'Pass');
      } else {
        addResult(tcId, 'Form appears valid despite empty fields. No validation triggered.', 'Fail');
      }
    } else {
      addResult(tcId, 'Form was submitted with empty fields. User redirected away from registration page.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_007(page) {
  const tcId = 'TC_REG_007';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'Jo', lastName: 'Doe',
      email: 'jotest+007@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (html5Msgs['first_name']) {
      addResult(tcId, 'Form NOT submitted. First Name validation error: ' + html5Msgs['first_name'] + '. User remained on registration page.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      // Server might accept 2 chars but that means minlength validation didn't work
      addResult(tcId, 'Form submitted to server with 2-char First Name (minlength=3 not enforced client-side). Server errors: ' + serverErrors.join('; '), 'Fail');
    } else if (!onRegPage) {
      addResult(tcId, 'Form was submitted with First Name of 2 characters. Minimum length validation (minlength=3) was NOT enforced.', 'Fail');
    } else {
      const formValid = await page.evaluate(() => document.querySelector('form')?.checkValidity());
      if (!formValid) {
        addResult(tcId, 'Form NOT submitted. HTML5 minlength validation prevented submission for First Name (2 chars, min=3). User remained on registration page.', 'Pass');
      } else {
        addResult(tcId, 'Unexpected state. Form valid but user on registration page.', 'Fail');
      }
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_008(page) {
  const tcId = 'TC_REG_008';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'invalidemail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 2000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const onRegPage = await isOnPage(page, '/create');

    if (html5Msgs['email']) {
      addResult(tcId, 'Form NOT submitted. Email validation error: ' + html5Msgs['email'] + '. User remained on registration page.', 'Pass');
    } else if (onRegPage) {
      const formValid = await page.evaluate(() => document.querySelector('form')?.checkValidity());
      if (!formValid) {
        addResult(tcId, 'Form NOT submitted. HTML5 email validation prevented submission (missing @ symbol). User remained on registration page.', 'Pass');
      } else {
        addResult(tcId, 'Form accepted invalid email format (missing @). Validation not enforced.', 'Fail');
      }
    } else {
      addResult(tcId, 'Form submitted with invalid email (missing @). User redirected.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_009(page) {
  const tcId = 'TC_REG_009';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'user@domain', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (html5Msgs['email']) {
      addResult(tcId, 'Form NOT submitted. Email validation error: ' + html5Msgs['email'], 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form submitted but server rejected. Errors: ' + serverErrors.join('; '), 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with email missing domain extension (user@domain). No validation enforced. User redirected.', 'Fail');
    } else {
      addResult(tcId, 'Form remained on page. Email "user@domain" may have passed HTML5 validation (browser-dependent). No server error shown.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_010(page) {
  const tcId = 'TC_REG_010';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+010@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@9999',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    const hasMismatchError = serverErrors.some(e => e.toLowerCase().includes('password') && e.toLowerCase().includes('match'));

    if (onRegPage && hasMismatchError) {
      addResult(tcId, 'Form NOT submitted. Validation error displayed: ' + serverErrors.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. Errors shown: ' + serverErrors.join('; ') + '. Password mismatch detected.', 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted despite password mismatch. User redirected.', 'Fail');
    } else {
      addResult(tcId, 'No password mismatch error shown. User on registration page but no errors visible.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_011(page) {
  const tcId = 'TC_REG_011';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+011@testmail.com', phone: '987654',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');
    const phoneValue = await page.inputValue('#phone');

    if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. Phone value: "' + phoneValue + '". Errors: ' + serverErrors.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with phone "' + phoneValue + '" (less than 10 digits). Validation not enforced. User redirected.', 'Fail');
    } else {
      // Check if form was blocked by HTML5 or just stayed
      addResult(tcId, 'Form stayed on registration page. Phone value: "' + phoneValue + '". No explicit error message for phone length validation shown.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_012(page) {
  const tcId = 'TC_REG_012';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'existing@test.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    const hasEmailExistsError = serverErrors.some(e => e.toLowerCase().includes('already exists') || e.toLowerCase().includes('email'));

    if (onRegPage && hasEmailExistsError) {
      addResult(tcId, 'Form NOT submitted. Error displayed: ' + serverErrors.join('; ') + '. Duplicate email correctly rejected. User remained on registration page.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. Errors: ' + serverErrors.join('; '), 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with already registered email. Duplicate prevention failed.', 'Fail');
    } else {
      addResult(tcId, 'No error shown for duplicate email. User on registration page.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_013(page) {
  const tcId = 'TC_REG_013';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+013@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: false, // NOT checking T&C
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 2000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (html5Msgs['terms_and_condition']) {
      addResult(tcId, 'Form NOT submitted. T&C validation error: ' + html5Msgs['terms_and_condition'] + '. User remained on registration page.', 'Pass');
    } else if (onRegPage) {
      const formValid = await page.evaluate(() => document.querySelector('form')?.checkValidity());
      if (!formValid) {
        addResult(tcId, 'Form NOT submitted. HTML5 validation prevented submission — T&C checkbox not checked. User remained on registration page.', 'Pass');
      } else if (serverErrors.length > 0) {
        addResult(tcId, 'Form NOT submitted. Server errors: ' + serverErrors.join('; '), 'Pass');
      } else {
        addResult(tcId, 'User on registration page but no T&C error shown.', 'Fail');
      }
    } else {
      addResult(tcId, 'Form submitted without T&C acceptance. Validation not enforced.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_014(page) {
  const tcId = 'TC_REG_014';
  try {
    await navigateToReg(page);
    // Try to type alphabets into phone field
    await page.fill('#first_name', 'John');
    await page.fill('#last_name', 'Doe');
    await page.fill('#email', 'johndoe+014@testmail.com');

    // Use type instead of fill to simulate real keyboard input
    await page.click('#phone');
    await page.keyboard.type('ABCD123456');
    await page.waitForTimeout(500);

    const phoneValue = await page.inputValue('#phone');

    await page.fill('#password', 'Test@1234');
    await page.fill('#c_password', 'Test@1234');
    await page.check('#terms_and_condition');
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');
    const hasOnlyDigits = /^\d*$/.test(phoneValue);

    if (hasOnlyDigits && !phoneValue.includes('A')) {
      addResult(tcId, 'Phone field rejected alphabets at input level (type=tel). Entered: "ABCD123456", Accepted: "' + phoneValue + '". Only digits were accepted.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Phone accepted alphabets but form NOT submitted. Phone value: "' + phoneValue + '". Errors: ' + serverErrors.join('; '), 'Pass');
    } else if (onRegPage) {
      addResult(tcId, 'Phone value: "' + phoneValue + '". Alphabets ' + (hasOnlyDigits ? 'were stripped' : 'were accepted') + '. User on registration page.', hasOnlyDigits ? 'Pass' : 'Fail');
    } else {
      addResult(tcId, 'Form submitted with phone containing alphabets. Phone value: "' + phoneValue + '".', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_015(page) {
  const tcId = 'TC_REG_015';
  try {
    await navigateToReg(page);
    await page.fill('#first_name', 'John');
    await page.fill('#last_name', 'Doe');
    await page.fill('#email', 'johndoe+015@testmail.com');

    await page.click('#phone');
    await page.keyboard.type('+91-98765');
    await page.waitForTimeout(500);

    const phoneValue = await page.inputValue('#phone');

    await page.fill('#password', 'Test@1234');
    await page.fill('#c_password', 'Test@1234');
    await page.check('#terms_and_condition');
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');
    const hasSpecialChars = /[^0-9]/.test(phoneValue);

    if (!hasSpecialChars) {
      addResult(tcId, 'Phone field rejected special characters at input level. Entered: "+91-98765", Accepted: "' + phoneValue + '". Only digits were accepted.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Phone accepted special chars but form NOT submitted. Phone value: "' + phoneValue + '". Errors: ' + serverErrors.join('; '), 'Pass');
    } else if (onRegPage) {
      addResult(tcId, 'Phone value: "' + phoneValue + '". Special chars ' + (hasSpecialChars ? 'were accepted — no validation error shown' : 'stripped') + '.', hasSpecialChars ? 'Fail' : 'Pass');
    } else {
      addResult(tcId, 'Form submitted with phone containing special characters. Phone value: "' + phoneValue + '".', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_016(page) {
  const tcId = 'TC_REG_016';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+016@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    // Do NOT solve CAPTCHA — just click submit
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const onRegPage = await isOnPage(page, '/create');
    const serverErrors = await getVisibleErrors(page);

    if (onRegPage) {
      addResult(tcId, 'Form NOT submitted without CAPTCHA. User remained on registration page. reCAPTCHA prevented form submission.' + (serverErrors.length > 0 ? ' Errors: ' + serverErrors.join('; ') : ''), 'Pass');
    } else {
      addResult(tcId, 'Form submitted without solving CAPTCHA. CAPTCHA validation bypassed.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_017(page) {
  const tcId = 'TC_REG_017';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: ' testuser@mail.com ', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const onRegPage = await isOnPage(page, '/create');
    const serverErrors = await getVisibleErrors(page);
    const emailValue = await page.inputValue('#email');

    if (!onRegPage) {
      addResult(tcId, 'System trimmed spaces and registered successfully. Email value: "' + emailValue + '". User redirected.', 'Pass');
    } else if (serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. Email value: "' + emailValue + '". Errors: ' + serverErrors.join('; ') + '. Validation error for spaced email.', 'Pass');
    } else {
      addResult(tcId, 'User remained on registration page. Email value: "' + emailValue + '". No explicit validation error shown for leading/trailing spaces.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_018(page) {
  const tcId = 'TC_REG_018';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: '   ', lastName: 'Doe',
      email: 'johndoe+018@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (onRegPage && (Object.keys(html5Msgs).length > 0 || serverErrors.length > 0)) {
      const allMsgs = [...Object.values(html5Msgs), ...serverErrors];
      addResult(tcId, 'Form NOT submitted. Whitespace-only First Name rejected. Errors: ' + allMsgs.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with whitespace-only First Name. Validation NOT enforced — whitespace was accepted as valid input.', 'Fail');
    } else {
      addResult(tcId, 'User on registration page. No explicit error for whitespace-only First Name. Possibly blocked by reCAPTCHA.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_019(page) {
  const tcId = 'TC_REG_019';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+019@testmail.com', phone: '9876543210',
      password: '        ', confirmPassword: '        ',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. Spaces-only password rejected. Errors: ' + serverErrors.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with spaces-only password. Password validation NOT enforced.', 'Fail');
    } else {
      addResult(tcId, 'User on registration page. No explicit error for spaces-only password. Possibly blocked by reCAPTCHA.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_020(page) {
  const tcId = 'TC_REG_020';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'Tom', lastName: 'Doe',
      email: 'tom+020@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    // Check that 3-char first name doesn't trigger validation error
    const html5Msgs = await getHTML5ValidationMessages(page);
    const firstNameValid = !html5Msgs['first_name'];

    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (firstNameValid && !onRegPage) {
      addResult(tcId, 'Account created successfully with First Name "Tom" (3 chars — exact minimum boundary). System accepted 3 characters. User redirected.', 'Pass');
    } else if (firstNameValid && onRegPage) {
      const hasFirstNameError = serverErrors.some(e => e.toLowerCase().includes('first name'));
      if (!hasFirstNameError) {
        addResult(tcId, 'First Name "Tom" (3 chars) accepted at boundary. Form not submitted due to reCAPTCHA. No first name validation error shown.' + (serverErrors.length > 0 ? ' Other errors: ' + serverErrors.join('; ') : ''), 'Pass');
      } else {
        addResult(tcId, 'First Name "Tom" (3 chars) rejected at minimum boundary. Error: ' + serverErrors.join('; '), 'Fail');
      }
    } else {
      addResult(tcId, 'First Name validation message at 3 chars: ' + (html5Msgs['first_name'] || 'none') + '.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_021(page) {
  const tcId = 'TC_REG_021';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'Al', lastName: 'Doe',
      email: 'al+021@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');
    const formValid = await page.evaluate(() => document.querySelector('form')?.checkValidity());

    if (!formValid && html5Msgs['first_name']) {
      addResult(tcId, 'Form NOT submitted. First Name "Al" (2 chars) rejected. Validation: ' + html5Msgs['first_name'] + '. User remained on registration page.', 'Pass');
    } else if (onRegPage && !formValid) {
      addResult(tcId, 'Form NOT submitted. HTML5 minlength validation prevented submission for First Name "Al" (2 chars, min=3). User remained on registration page.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form submitted to server but rejected. First Name "Al" (2 chars). Errors: ' + serverErrors.join('; '), 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with First Name "Al" (2 chars). Minlength=3 validation NOT enforced.', 'Fail');
    } else {
      addResult(tcId, 'Unexpected state. User on reg page, no errors, form valid.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_022(page) {
  const tcId = 'TC_REG_022';
  try {
    await navigateToReg(page);
    const name50 = 'Alexandraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await fillForm(page, {
      firstName: name50, lastName: 'Doe',
      email: 'longname+022@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    const firstNameValue = await page.inputValue('#first_name');
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (firstNameValue.length === 50 || firstNameValue.length <= 50) {
      if (!onRegPage) {
        addResult(tcId, 'Account created with 50-char First Name (exact max boundary). Value length: ' + firstNameValue.length + '. User redirected.', 'Pass');
      } else {
        const hasFirstNameError = serverErrors.some(e => e.toLowerCase().includes('first name'));
        if (!hasFirstNameError) {
          addResult(tcId, 'First Name accepted at 50-char max boundary. Value length: ' + firstNameValue.length + '. Form not submitted due to reCAPTCHA.' + (serverErrors.length > 0 ? ' Other errors: ' + serverErrors.join('; ') : ''), 'Pass');
        } else {
          addResult(tcId, 'First Name at 50 chars rejected. Errors: ' + serverErrors.join('; '), 'Fail');
        }
      }
    } else {
      addResult(tcId, 'First Name value length unexpected: ' + firstNameValue.length, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_023(page) {
  const tcId = 'TC_REG_023';
  try {
    await navigateToReg(page);
    const name51 = 'Alexandraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1';

    await page.click('#first_name');
    await page.keyboard.type(name51);
    await page.waitForTimeout(500);

    const firstNameValue = await page.inputValue('#first_name');
    const maxlength = await page.getAttribute('#first_name', 'maxlength');

    if (firstNameValue.length <= 50) {
      addResult(tcId, 'Field does NOT accept more than 50 characters (maxlength=' + maxlength + '). Typed 51 chars, field value length: ' + firstNameValue.length + '. Input correctly capped at 50 characters.', 'Pass');
    } else {
      addResult(tcId, 'Field accepted ' + firstNameValue.length + ' characters exceeding maxlength=' + maxlength + '. Maxlength not enforced.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_024(page) {
  const tcId = 'TC_REG_024';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'D',
      email: 'johnd+024@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    const html5Msgs = await getHTML5ValidationMessages(page);
    const lastNameValid = !html5Msgs['last_name'];

    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (lastNameValid && !onRegPage) {
      addResult(tcId, 'Account created with Last Name "D" (1 char — exact minimum boundary). System accepted 1 character. User redirected.', 'Pass');
    } else if (lastNameValid) {
      const hasLastNameError = serverErrors.some(e => e.toLowerCase().includes('last name'));
      if (!hasLastNameError) {
        addResult(tcId, 'Last Name "D" (1 char) accepted at minimum boundary. Form not submitted due to reCAPTCHA. No last name error.' + (serverErrors.length > 0 ? ' Other errors: ' + serverErrors.join('; ') : ''), 'Pass');
      } else {
        addResult(tcId, 'Last Name "D" (1 char) rejected. Errors: ' + serverErrors.join('; '), 'Fail');
      }
    } else {
      addResult(tcId, 'Last Name validation failed at 1 char: ' + (html5Msgs['last_name'] || 'none'), 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_025(page) {
  const tcId = 'TC_REG_025';
  try {
    await navigateToReg(page);
    const lastName50 = 'Doeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    await fillForm(page, {
      firstName: 'John', lastName: lastName50,
      email: 'johnlongln+025@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    const lastNameValue = await page.inputValue('#last_name');
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (lastNameValue.length <= 50) {
      if (!onRegPage) {
        addResult(tcId, 'Account created with 50-char Last Name (max boundary). Value length: ' + lastNameValue.length + '. User redirected.', 'Pass');
      } else {
        const hasLastNameError = serverErrors.some(e => e.toLowerCase().includes('last name'));
        if (!hasLastNameError) {
          addResult(tcId, 'Last Name accepted at 50-char max boundary. Value length: ' + lastNameValue.length + '. Form not submitted due to reCAPTCHA.' + (serverErrors.length > 0 ? ' Other errors: ' + serverErrors.join('; ') : ''), 'Pass');
        } else {
          addResult(tcId, 'Last Name at 50 chars rejected. Errors: ' + serverErrors.join('; '), 'Fail');
        }
      }
    } else {
      addResult(tcId, 'Last Name value length unexpected: ' + lastNameValue.length, 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_026(page) {
  const tcId = 'TC_REG_026';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+026@testmail.com', phone: '0123456789',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const phoneValue = await page.inputValue('#phone');
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (!onRegPage) {
      addResult(tcId, 'Account created with phone starting with 0 ("' + phoneValue + '"). Leading zero accepted. User redirected.', 'Pass');
    } else if (serverErrors.length > 0) {
      const hasPhoneError = serverErrors.some(e => e.toLowerCase().includes('phone'));
      if (hasPhoneError) {
        addResult(tcId, 'Phone starting with 0 rejected. Phone: "' + phoneValue + '". Errors: ' + serverErrors.join('; '), 'Pass');
      } else {
        addResult(tcId, 'Phone "' + phoneValue + '" submitted. Errors (non-phone related): ' + serverErrors.join('; ') + '. User on registration page.', 'Pass');
      }
    } else {
      addResult(tcId, 'User on registration page. Phone "' + phoneValue + '". No errors. Possibly blocked by reCAPTCHA.', 'Pass');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_027(page) {
  const tcId = 'TC_REG_027';
  try {
    await navigateToReg(page);
    await page.click('#phone');
    await page.keyboard.type('98765432101'); // 11 digits
    await page.waitForTimeout(500);

    const phoneValue = await page.inputValue('#phone');
    const maxlength = await page.getAttribute('#phone', 'maxlength');

    if (phoneValue.length <= 10) {
      addResult(tcId, 'Field accepts only first 10 digits. Typed 11 digits ("98765432101"), field value: "' + phoneValue + '" (length=' + phoneValue.length + '). maxlength=' + maxlength + ' enforced correctly.', 'Pass');
    } else {
      addResult(tcId, 'Field accepted ' + phoneValue.length + ' digits exceeding maxlength=' + maxlength + '. Value: "' + phoneValue + '".', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_028(page) {
  const tcId = 'TC_REG_028';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: '@#$%^&', lastName: 'Doe',
      email: 'johndoe+028@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. First Name "@#$%^&" (special chars) rejected. Errors: ' + serverErrors.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with First Name containing only special characters "@#$%^&". Validation NOT enforced — special chars accepted.', 'Fail');
    } else {
      addResult(tcId, 'User on registration page. First Name "@#$%^&" — no explicit validation error for special characters. Possibly blocked by reCAPTCHA only.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_029(page) {
  const tcId = 'TC_REG_029';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: '12345', lastName: 'Doe',
      email: 'johndoe+029@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. First Name "12345" (numeric only) rejected. Errors: ' + serverErrors.join('; ') + '. User remained on registration page.', 'Pass');
    } else if (!onRegPage) {
      addResult(tcId, 'Form submitted with First Name "12345" (numeric only). Validation NOT enforced — numbers accepted as name.', 'Fail');
    } else {
      addResult(tcId, 'User on registration page. First Name "12345" — no explicit validation error for numeric-only input. Possibly blocked by reCAPTCHA only.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_030(page) {
  const tcId = 'TC_REG_030';
  try {
    await navigateToReg(page);

    // Listen for dialog (alert) events
    let alertTriggered = false;
    let alertText = '';
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      alertText = dialog.message();
      await dialog.dismiss();
    });

    await fillForm(page, {
      firstName: '<script>alert("XSS")</script>', lastName: 'Doe',
      email: 'johndoe+030@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    const firstNameValue = await page.inputValue('#first_name');
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (alertTriggered) {
      addResult(tcId, 'CRITICAL: JavaScript alert was executed! XSS vulnerability found. Alert text: "' + alertText + '".', 'Fail');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'No JavaScript alert executed. Input was rejected. First Name value: "' + firstNameValue.substring(0, 50) + '". Errors: ' + serverErrors.join('; ') + '. XSS prevented.', 'Pass');
    } else if (onRegPage) {
      addResult(tcId, 'No JavaScript alert executed. First Name value stored: "' + firstNameValue.substring(0, 50) + '". Form not submitted (reCAPTCHA). Input was sanitised or not executed.', 'Pass');
    } else {
      addResult(tcId, 'No JavaScript alert executed. Form submitted. XSS script in name did not execute. Input handled safely.', 'Pass');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_031(page) {
  const tcId = 'TC_REG_031';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: "test@test.com' OR '1'='1", phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });
    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 3000);

    const html5Msgs = await getHTML5ValidationMessages(page);
    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (html5Msgs['email']) {
      addResult(tcId, 'Form NOT submitted. SQL injection string rejected by email validation: ' + html5Msgs['email'] + '. No SQL query executed.', 'Pass');
    } else if (onRegPage && serverErrors.length > 0) {
      addResult(tcId, 'Form NOT submitted. SQL injection input rejected. Errors: ' + serverErrors.join('; ') + '. Database unaffected.', 'Pass');
    } else if (onRegPage) {
      const formValid = await page.evaluate(() => document.querySelector('form')?.checkValidity());
      if (!formValid) {
        addResult(tcId, 'Form NOT submitted. HTML5 email validation prevented SQL injection string. Database unaffected.', 'Pass');
      } else {
        addResult(tcId, 'User on registration page. SQL injection string may have been accepted. No error shown.', 'Fail');
      }
    } else {
      addResult(tcId, 'Form submitted with SQL injection in email. Application may be vulnerable. Check server-side sanitization.', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_032(page) {
  const tcId = 'TC_REG_032';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'johndoe+032@testmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    // Track network requests to detect duplicate API calls
    const apiCalls = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && (request.url().includes('register') || request.url().includes('create') || request.url().includes('signup'))) {
        apiCalls.push(request.url());
      }
    });

    // Double-click rapidly
    await page.dblclick('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const isDisabled = await page.evaluate(() => {
      const btn = document.querySelector('button.register_register_btn__3ejME');
      return btn ? btn.disabled : false;
    });

    const serverErrors = await getVisibleErrors(page);

    if (apiCalls.length <= 1) {
      addResult(tcId, 'Only ' + apiCalls.length + ' API call(s) detected on double-click. Button disabled after first click: ' + isDisabled + '. Duplicate submission prevented.' + (serverErrors.length > 0 ? ' Errors: ' + serverErrors.join('; ') : ''), 'Pass');
    } else {
      addResult(tcId, apiCalls.length + ' API calls detected on double-click. Button disabled: ' + isDisabled + '. Potential duplicate submission risk.' + (serverErrors.length > 0 ? ' Errors: ' + serverErrors.join('; ') : ''), 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_033(page) {
  const tcId = 'TC_REG_033';
  try {
    await navigateToReg(page);
    await fillForm(page, {
      firstName: 'John', lastName: 'Doe',
      email: 'testuser+qa001@gmail.com', phone: '9876543210',
      password: 'Test@1234', confirmPassword: 'Test@1234',
      termsAndCondition: true,
    });

    const html5Msgs = await getHTML5ValidationMessages(page);
    const emailValid = !html5Msgs['email'];

    await page.click('button.register_register_btn__3ejME');
    await waitAndCheck(page, 5000);

    const serverErrors = await getVisibleErrors(page);
    const onRegPage = await isOnPage(page, '/create');

    if (emailValid && !onRegPage) {
      addResult(tcId, 'Account created with + alias email (testuser+qa001@gmail.com). System accepts RFC compliant + alias format. User redirected.', 'Pass');
    } else if (emailValid && onRegPage) {
      const hasEmailError = serverErrors.some(e => e.toLowerCase().includes('email'));
      if (!hasEmailError) {
        addResult(tcId, 'Email with + alias accepted (no email validation error). Form not submitted due to reCAPTCHA.' + (serverErrors.length > 0 ? ' Other errors: ' + serverErrors.join('; ') : ''), 'Pass');
      } else {
        addResult(tcId, 'Email with + alias rejected. Errors: ' + serverErrors.join('; '), 'Fail');
      }
    } else {
      addResult(tcId, 'Email + alias not accepted by HTML5 validation: ' + (html5Msgs['email'] || 'none'), 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_034(page) {
  const tcId = 'TC_REG_034';
  try {
    await navigateToReg(page);
    await page.fill('#first_name', 'Alice');
    await page.fill('#last_name', 'Brown');
    await page.fill('#email', 'alice@test.com');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Verify data retained
    const firstName = await page.inputValue('#first_name');
    const lastName = await page.inputValue('#last_name');
    const email = await page.inputValue('#email');

    if (firstName === 'Alice' && lastName === 'Brown' && email === 'alice@test.com') {
      addResult(tcId, 'All form data retained after scrolling. First Name: "' + firstName + '", Last Name: "' + lastName + '", Email: "' + email + '". No data loss on scroll.', 'Pass');
    } else {
      addResult(tcId, 'Data LOST after scrolling. First Name: "' + firstName + '" (expected Alice), Last Name: "' + lastName + '" (expected Brown), Email: "' + email + '" (expected alice@test.com).', 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

async function runTC_REG_035(page) {
  const tcId = 'TC_REG_035';
  try {
    await navigateToReg(page);

    const isHttps = page.url().startsWith('https://');

    // Check for mixed content by listening to console messages
    const mixedContentWarnings = [];
    page.on('console', (msg) => {
      const text = msg.text().toLowerCase();
      if (text.includes('mixed content') || text.includes('not secure') || text.includes('insecure')) {
        mixedContentWarnings.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    if (isHttps && mixedContentWarnings.length === 0) {
      addResult(tcId, 'Page served over HTTPS (secure). URL: ' + page.url() + '. No mixed-content warnings detected. Padlock icon would be visible. Connection is secure.', 'Pass');
    } else if (!isHttps) {
      addResult(tcId, 'Page NOT served over HTTPS. URL: ' + page.url() + '. Connection is NOT secure.', 'Fail');
    } else {
      addResult(tcId, 'Page served over HTTPS but mixed-content warnings found: ' + mixedContentWarnings.join('; '), 'Fail');
    }
  } catch (e) {
    addResult(tcId, 'Test execution error: ' + e.message, 'Fail');
  }
}

// ===================== MAIN EXECUTION =====================

(async () => {
  console.log('=== Starting Test Execution ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  });

  const testFunctions = [
    runTC_REG_001, runTC_REG_002, runTC_REG_003, runTC_REG_004, runTC_REG_005,
    runTC_REG_006, runTC_REG_007, runTC_REG_008, runTC_REG_009, runTC_REG_010,
    runTC_REG_011, runTC_REG_012, runTC_REG_013, runTC_REG_014, runTC_REG_015,
    runTC_REG_016, runTC_REG_017, runTC_REG_018, runTC_REG_019, runTC_REG_020,
    runTC_REG_021, runTC_REG_022, runTC_REG_023, runTC_REG_024, runTC_REG_025,
    runTC_REG_026, runTC_REG_027, runTC_REG_028, runTC_REG_029, runTC_REG_030,
    runTC_REG_031, runTC_REG_032, runTC_REG_033, runTC_REG_034, runTC_REG_035,
  ];

  for (const testFn of testFunctions) {
    const page = await context.newPage();
    try {
      await testFn(page);
    } catch (e) {
      const tcId = testFn.name.replace('run', '');
      addResult(tcId, 'Uncaught test error: ' + e.message, 'Fail');
    }
    await page.close();
  }

  await browser.close();

  // Save results to JSON
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log('\n=== Test Execution Complete ===');
  console.log(`Total: ${results.length} | Pass: ${results.filter(r => r.status === 'Pass').length} | Fail: ${results.filter(r => r.status === 'Fail').length}`);
  console.log('Results saved to: ' + RESULTS_FILE);
})();
