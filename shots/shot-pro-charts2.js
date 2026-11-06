// Pro charts screenshots v2: tall viewport (no fullPage resize, so Recharts
// animations don't restart mid-capture).
const { chromium } = require('/home/hatch/workspace/muse-build/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const url = 'http://localhost:3005/pro-components/charts';
  const out = '/home/hatch/workspace/boardui-templates-replica/shots';
  for (const [name, width] of [['1440', 1440], ['768', 768], ['390', 390]]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(name, 'page height:', h);
    await page.setViewportSize({ width, height: Math.min(h, 16000) });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/shot-pro-charts-${name}.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(name, 'done, horizontal-overflow-px:', overflow);
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
