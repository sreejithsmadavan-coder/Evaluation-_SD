# Sunny Diamonds — Playwright Automation Framework

**Target:** https://qa-sunnydiamonds.webc.in
**Module:** Cart Page
**TC Coverage:** TC_CART_001 → TC_CART_042 (42 test cases)

---

## Project Structure

```
sunny-diamonds-pw/
├── playwright.config.js          # Playwright configuration (browsers, timeouts, reporters)
├── package.json                  # NPM scripts and dependencies
│
├── pages/                        # Page Object Model classes
│   ├── BasePage.js               # Shared navigation, cookie consent, header helpers
│   ├── LoginPage.js              # /login page interactions and assertions
│   ├── PLPPage.js                # /jewellery product listing page
│   ├── PDPPage.js                # Product detail page (Add to Cart)
│   └── CartPage.js               # /cart — all cart interactions and assertions
│
├── tests/
│   └── cart.spec.js              # 42 test cases (TC_CART_001–042)
│
└── utils/
    └── testData.js               # Centralised credentials, URLs, products, viewports
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npm run install:browsers
```

---

## Running Tests

```bash
# Run all cart tests (default: Chromium, headed)
npm run test:cart

# Run on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run in debug mode (step-through)
npm run test:debug

# View HTML report after run
npm run report
```

---

## Test Flow

### First Test (TC_CART_001 — `test.beforeAll`)
Runs **once** before all tests to establish session and cart state:
1. Navigate to `/login`
2. Login: `sreejith.s+4@webandcrafts.com` / `Password`
3. Navigate to Home → **ALL JEWELLERY** (PLP)
4. Click **Aminah Diamond Ring** → Add to Cart → Back
5. Click **18K Rose Gold Eden Diamond Ring** → Add to Cart
6. Navigate to **Cart page** via cart icon

### Subsequent Tests (TC_CART_002–041)
- Each test calls `cartPage.navigate()` to restore to `/cart`
- Session is preserved across all tests via `sharedContext`
- No repeated login or navigation from scratch

### Last Test (TC_CART_042)
- Uses a **fresh browser context** to perform clean login verification
- Confirms Cart page is accessible with a valid authenticated session

---

## TC Distribution

| Type      | Count | TC Range            |
|-----------|-------|---------------------|
| Positive  | 26    | 001–025 + 042       |
| Negative  | 8     | 026–033             |
| Edge Case | 8     | 034–041             |
| **Total** | **42**|                     |

---

## Excel Test Cases
Located at:
`C:\Users\wac.DESKTOP-UU75C42\Documents\Evaluation_SunnyDimonds\TestCase\SunnyDiamonds_v2.xlsx`
Sheet: **Cart Page**

Each TC ID in this spec maps 1:1 to a row in the Excel sheet.

---

## Credentials (QA Environment Only)
```
Email    : sreejith.s+4@webandcrafts.com
Password : Password
```

> ⚠️ Do NOT execute tests until instructed by the QA Lead.
