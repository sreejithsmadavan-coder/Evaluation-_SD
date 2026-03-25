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
  newsletter,
  viewports,
};
