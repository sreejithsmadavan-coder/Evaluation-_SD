/**
 * MAIN TEST RUNNER
 *
 * This is the central test orchestrator (similar to TestNG main class).
 * It imports and organizes all page-level test suites into a single entry point.
 *
 * All page tests can be executed through this Main class.
 * To add new page tests in the future:
 *   1. Create a new page class in /pages
 *   2. Create a new test spec in /tests/<page-name>/
 *   3. Import the test spec below
 *
 * Run all tests:     npx playwright test tests/main.spec.js
 * Run specific page: npx playwright test tests/registration/
 */

// ==================== REGISTRATION MODULE ====================
require('./registration/registration.spec.js');

// ==================== LOGIN MODULE ====================
require('./login/login.spec.js');

// ==================== HOME PAGE MODULE ====================
require('./home/home.spec.js');

// ==================== PLP (PRODUCT LISTING PAGE) MODULE ====================
require('./plp/plp.spec.js');

// ==================== CART PAGE MODULE ====================
require('./cart/cart.spec.js');

// ==================== PDP (PRODUCT DETAIL PAGE) MODULE ====================
require('./pdp/pdp.spec.js');

// ==================== CHECKOUT PAGE MODULE ====================
require('./checkout/checkout.spec.js');

// ==================== FUTURE MODULES ====================
// Uncomment and add new page test imports below as they are created:
//
// require('./profile/profile.spec.js');
