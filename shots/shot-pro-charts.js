// Pro charts showcase screenshots (worker E): 1440 / 768 / 390, full page.
const { chromium } = require('/home/hatch/workspace/muse-build/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const url = 'http://localhost:3005/pro-components/charts';
  const out = '/home/hatch/workspace/boardui-templates-replica/shots';
  for (const [name, width, height] of [['1440', 1440, 900], ['768', 768, 1024], ['390', 390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') console.log(name, 'console-error:', m.text().slice(0, 200)); });
    page.on('pageerror', (e) => console.log(name, 'pageerror:', String(e).slice(0, 300)));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${out}/shot-pro-charts-${name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(name, 'done, horizontal-overflow-px:', overflow);
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
