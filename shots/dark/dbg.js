const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { localStorage.setItem('boardui:theme', 'dark'); });
  const page = await ctx.newPage();
  page.on('console', m => console.log('CONSOLE:', m.type(), m.text().slice(0, 200)));
  page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 300)));
  await page.goto('http://127.0.0.1:8931/templates', { waitUntil: 'domcontentloaded' });
  console.log('after domcontentloaded:', await page.evaluate(() => ({ ls: localStorage.getItem('boardui:theme'), cls: document.documentElement.className, scripts: [...document.querySelectorAll('script')].map(s => s.id || s.src.slice(-40)).filter(Boolean) })));
  await page.waitForTimeout(3000);
  console.log('after 3s:', await page.evaluate(() => ({ ls: localStorage.getItem('boardui:theme'), cls: document.documentElement.className })));
  // try manual apply
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(300);
  console.log('after manual add:', await page.evaluate(() => ({ cls: document.documentElement.className, bg: getComputedStyle(document.body).backgroundColor })));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
