const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3100/templates/multi-agent-chat', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.click('main header button');
  await page.waitForTimeout(800);
  // pick Wink expression
  await page.click('button[aria-label="Expression Wink"]');
  await page.waitForTimeout(300);
  const previewLabel = await page.evaluate(() => {
    const ed = document.querySelector('aside[aria-label="Agent editor"]');
    const big = ed.querySelector('.absolute.left-1\\/2 [role="img"], .absolute.left-1\\/2 span[role="img"]');
    return big ? big.getAttribute('aria-label') : null;
  });
  // turn the preview
  await page.click('aside[aria-label="Agent editor"] button[aria-label*="Turn"][aria-label*="avatar"]');
  await page.waitForTimeout(600);
  const turned = await page.evaluate(() => {
    const svg = document.querySelector('aside[aria-label="Agent editor"] button[aria-label*="Turn"] svg');
    return svg ? getComputedStyle(svg).transform : null;
  });
  // save, then check sidebar avatar expression persisted
  await page.click('aside[aria-label="Agent editor"] button:has-text("Save")');
  await page.waitForTimeout(500);
  const sidebarLabel = await page.evaluate(() => {
    const items = document.querySelectorAll('aside[aria-label="Conversations"] [role="img"]');
    return Array.from(items).map(el => el.getAttribute('aria-label'));
  });
  // reduced-motion CSS present?
  const rm = await page.evaluate(() => {
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('');
    return styles.includes('prefers-reduced-motion');
  });
  console.log(JSON.stringify({ previewLabel, turned, sidebarLabel, reducedMotionCss: rm }, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
