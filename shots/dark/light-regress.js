const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { localStorage.setItem('boardui:theme', 'light'); });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:8931/pro-components.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.locator('text=Voice preference').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/dark/view2-light-voice-row.png' });
  await page.goto('http://127.0.0.1:8931/pro-components/charts.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.locator('text=Earnings').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/dark/view2-light-charts-earnings-line.png' });
  console.log('DONE');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
