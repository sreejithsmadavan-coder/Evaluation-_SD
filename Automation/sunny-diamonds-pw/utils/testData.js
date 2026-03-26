/**
 * testData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised test data for all Sunny Diamonds automation tests.
 * Keep credentials, URLs, and test inputs here — never hardcode in spec files.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = 'https://qa-sunnydiamonds.webc.in';

// ── User Accounts ────────────────────────────────────────────────────────────
const users = {
  validUser: {
    email    : 'sreejith.s+4@webandcrafts.com',
    password : 'Password',
  },
  invalidUser: {
    email    : 'invalid.user@test.com',
    password : 'WrongPassword123',
  },
  unregisteredUser: {
    email    : 'notregistered@example.com',
    password : 'SomePassword',
  },
};

// ── URLs ─────────────────────────────────────────────────────────────────────
const urls = {
  base          : BASE_URL,
  login         : `${BASE_URL}/login`,
  home          : `${BASE_URL}/`,
  jewellery     : `${BASE_URL}/jewellery`,
  cart          : `${BASE_URL}/cart`,
  checkout      : `${BASE_URL}/checkout`,

  // Product Detail Pages (used in setup flow for adding to cart)
  pdp1          : `${BASE_URL}/aminah-diamond-ring?variant_id=1330`,
  pdp2          : `${BASE_URL}/18k-rose-gold-eden-diamond-ring?variant_id=32`,
  pdp3          : `${BASE_URL}/18-k-rose-gold-mia-diamond-pendant?variant_id=45`,
};

// ── Products (verified on QA site) ───────────────────────────────────────────
const products = {
  product1: {
    name       : 'Aminah Diamond Ring',
    sku        : '2180422448001',
    color      : 'rose-gold',
    url        : urls.pdp1,
    variantId  : 1330,
  },
  product2: {
    name       : '18 K Rose Gold Eden Diamond Ring',
    sku        : 'sdr3858',
    color      : 'rose-gold',
    url        : urls.pdp2,
    variantId  : 32,
  },
  product3: {
    name       : '18 K Rose Gold Mia Diamond Pendant',
    url        : urls.pdp3,
    variantId  : 45,
  },
};

// ── Checkout Test Data ────────────────────────────────────────────────────────
const checkoutData = {
  validAddress: {
    firstName : 'Sreejith',
    lastName  : 'Madavan',
    email     : 'sreejith.s+4@webandcrafts.com',
    phone     : '9876543210',
    address   : '42 MG Road, Kakkanad',
    pinCode   : '682021',
    city      : 'Kochi',
    state     : 'Kerala',
    country   : 'India',
  },
  bva: {
    firstName1Char   : 'A',
    firstName2Chars  : 'Jo',
    firstName56Chars : 'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd',
    firstName57Chars : 'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcde',
    lastName56Chars  : 'A'.repeat(56),
    lastName57Chars  : 'A'.repeat(57),
    phone9Digits     : '987654321',
    phone14Digits    : '98765432101234',
    pinCode5Digits   : '68202',
    pinCode7Digits   : '1234567',
  },
  invalidInputs: {
    emailNoAt           : 'invalidemail.com',
    emailSpaces         : '  test@example.com  ',
    phoneSpecialChars   : '98765@#$!0',
    phoneDashes         : '98765-43210',
    phoneWhitespace     : ' 9876543210 ',
    phoneCountryCode    : '+919876543210',
    pinCodeAlpha        : 'ABCDEF',
    firstNameNumeric    : 'Sree123',
    firstNameSpecial    : 'John@#Doe',
    lastNameSpecial     : 'Smith!@#',
    firstNameLeadSpace  : ' John',
    lastNameLeadSpace   : ' Smith',
    addressLeadSpace    : '  123 Main Street',
    firstNameDoubleSpace: 'John  Doe',
    firstNameEmoji      : 'John😊',
    cityNumeric         : '12345',
    cityLeadSpace       : ' Mumbai',
    invalidCoupon       : 'INVALID999',
    invalidGiftCard     : 'FAKEGIFTCARD123',
    xssScript           : '<script>alert("XSS")</script>',
    xssImg              : '<img src=x onerror=alert(1)>@test.com',
    sqlInjection        : "' OR '1'='1'; DROP TABLE orders; --",
    emailInvalidXss     : '<img src=x onerror=alert(1)>@test.com',
  },
};

// ── Cart Test Data ────────────────────────────────────────────────────────────
const cartData = {
  validQty     : 1,
  increasedQty : 2,
  maxQty       : 999,
  zeroQty      : 0,
  negativeQty  : -1,
  alphaQty     : 'abc',
  specialQty   : '@#$%',
  xssPayload   : "<script>alert('XSS')</script>",
};

// ── Newsletter ────────────────────────────────────────────────────────────────
const newsletter = {
  validEmail   : 'testuser@example.com',
  invalidEmail : 'notanemail',
  invalidEmail2: 'test@',
};

// ── Viewports ─────────────────────────────────────────────────────────────────
const viewports = {
  mobile  : { width: 375,  height: 812  },
  tablet  : { width: 768,  height: 1024 },
  desktop : { width: 1280, height: 800  },
};

module.exports = {
  BASE_URL,
  users,
  urls,
  products,
  cartData,
  checkoutData,
  newsletter,
  viewports,
};
