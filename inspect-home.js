const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://qa-sunnydiamonds.webc.in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Accept cookie banner if present
  try {
    const btn = page.locator('button.cookie-consent_accept_btn__39jUd');
    if (await btn.isVisible({ timeout: 2000 })) await btn.click();
  } catch {}
  await page.waitForTimeout(1000);

  // 1. Page title
  console.log('=== PAGE TITLE ===');
  console.log(await page.title());

  // 2. Header / Navigation elements
  console.log('\n=== HEADER NAV ===');
  const navItems = await page.evaluate(() => {
    const items = document.querySelectorAll('nav a, header a, [class*="navbar"] a, [class*="header"] a');
    return Array.from(items).map(a => ({
      text: a.textContent?.trim().substring(0,60),
      href: a.href,
      class: a.className.substring(0,80),
    })).filter(a => a.text);
  });
  navItems.forEach((n,i) => console.log(`[${i}]`, JSON.stringify(n)));

  // 3. Logo
  console.log('\n=== LOGO ===');
  const logos = await page.evaluate(() => {
    const imgs = document.querySelectorAll('[class*="logo"] img, header img, a[href="/"] img');
    return Array.from(imgs).map(i => ({
      src: i.src, alt: i.alt, class: i.className, parentHref: i.closest('a')?.href,
    }));
  });
  logos.forEach((l,i) => console.log(`[${i}]`, JSON.stringify(l)));

  // 4. Banner/Hero/Slider
  console.log('\n=== BANNER/SLIDER ===');
  const banners = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="banner"], [class*="slider"], [class*="hero"], [class*="carousel"], [class*="swiper"]');
    return Array.from(els).slice(0,5).map(el => ({
      tag: el.tagName, class: el.className.substring(0,100),
      childCount: el.children.length,
      hasImages: el.querySelectorAll('img').length,
      text: el.textContent?.trim().substring(0,100),
    }));
  });
  banners.forEach((b,i) => console.log(`[${i}]`, JSON.stringify(b)));

  // 5. Sections on the page
  console.log('\n=== SECTIONS / HEADINGS ===');
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, section, [class*="section"]')).slice(0,40).map(el => ({
      tag: el.tagName, class: el.className.substring(0,80),
      text: el.textContent?.trim().substring(0,120),
    }));
  });
  headings.forEach((h,i) => console.log(`[${i}]`, JSON.stringify(h)));

  // 6. Footer
  console.log('\n=== FOOTER ===');
  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer, [class*="footer"]');
    if (!f) return null;
    return {
      class: f.className.substring(0,100),
      links: Array.from(f.querySelectorAll('a')).map(a => ({
        text: a.textContent?.trim().substring(0,50), href: a.href
      })).filter(a => a.text),
      socials: Array.from(f.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="youtube"], a[href*="pinterest"], a[href*="linkedin"]')).map(a => a.href),
    };
  });
  if (footer) {
    console.log('Footer class:', footer.class);
    console.log('Links:', JSON.stringify(footer.links.slice(0,20)));
    console.log('Socials:', JSON.stringify(footer.socials));
  }

  // 7. Search
  console.log('\n=== SEARCH ===');
  const search = await page.evaluate(() => {
    const s = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], [class*="search"] input, button[class*="search"], [class*="search"] button');
    return Array.from(s).map(el => ({
      tag: el.tagName, type: el.type, class: el.className.substring(0,80),
      placeholder: el.placeholder, id: el.id, name: el.name,
      ariaLabel: el.getAttribute('aria-label'),
    }));
  });
  search.forEach((s,i) => console.log(`[${i}]`, JSON.stringify(s)));

  // 8. Cart / Wishlist icons
  console.log('\n=== CART/WISHLIST ===');
  const cartWish = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="cart"], [class*="Cart"], [class*="wishlist"], [class*="Wishlist"], a[href*="cart"], a[href*="wishlist"]');
    return Array.from(els).slice(0,10).map(el => ({
      tag: el.tagName, class: el.className.substring(0,80),
      href: el.href || '', text: el.textContent?.trim().substring(0,40),
    }));
  });
  cartWish.forEach((c,i) => console.log(`[${i}]`, JSON.stringify(c)));

  // 9. Product cards
  console.log('\n=== PRODUCT CARDS ===');
  const products = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="product_card"], [class*="productCard"], [class*="product-card"], [class*="product_item"]');
    return Array.from(cards).slice(0,3).map(el => ({
      class: el.className.substring(0,80),
      html: el.innerHTML.substring(0,300),
    }));
  });
  products.forEach((p,i) => console.log(`[${i}]`, JSON.stringify(p)));

  // 10. Newsletter / Subscribe
  console.log('\n=== NEWSLETTER ===');
  const newsletter = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="newsletter"], [class*="subscribe"], input[placeholder*="email"]');
    return Array.from(els).map(el => ({
      tag: el.tagName, class: el.className.substring(0,80),
      type: el.type, placeholder: el.placeholder, id: el.id,
    }));
  });
  newsletter.forEach((n,i) => console.log(`[${i}]`, JSON.stringify(n)));

  // 11. Check full URL
  console.log('\n=== CURRENT URL ===');
  console.log(page.url());

  await browser.close();
})();
