const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { localStorage.setItem('boardui:theme', 'dark'); });
  const page = await ctx.newPage();
  // line chart card
  await page.goto('http://127.0.0.1:8931/pro-components/charts.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.locator('text=Earnings').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/dark/view2-dark-charts-earnings-line.png' });
  console.log('line chart ok');
  // dashboard: scroll main region to revenue chart (previous bars)
  await page.goto('http://127.0.0.1:8931/templates/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.locator('text=Revenue').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/dark/view2-dark-dashboard-revenue.png' });
  console.log('dashboard revenue ok');
  // orders chart legend + customers table bottom
  await page.locator('text=Customers').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/dark/view2-dark-dashboard-bottom.png' });
  console.log('dashboard bottom ok');
  await browser.close();
  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
