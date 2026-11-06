const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  // light finance 390 for Sankey comparison
  const ctxL = await browser.newContext({ viewport: { width: 390, height: 900 } });
  await ctxL.addInitScript(() => { localStorage.setItem('boardui:theme', 'light'); });
  const pL = await ctxL.newPage();
  await pL.goto('http://127.0.0.1:8931/templates/finance.html', { waitUntil: 'networkidle' });
  await pL.waitForTimeout(1500);
  await pL.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/dark/view-light-finance-390.png' });
  console.log('light finance 390 ok');
  await ctxL.close();
  // dashboard previous-series computed values, dark vs light
  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => { localStorage.setItem('boardui:theme', t); }, theme);
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:8931/templates/dashboard.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const info = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const out = { chartNeutral: cs.getPropertyValue('--color-chart-neutral').trim() };
      // revenue chart previous bars: find bar rects whose fill resolves to chart-neutral
      const bars = [...document.querySelectorAll('.recharts-bar-rectangle path')];
      out.barFills = [...new Set(bars.map(e => getComputedStyle(e).fill))];
      // legend dots with bg-chart-neutral
      const dot = document.querySelector('.bg-chart-neutral');
      out.legendDotBg = dot ? getComputedStyle(dot).backgroundColor : null;
      // card bg for reference
      const card = document.querySelector('.recharts-responsive-container')?.closest('div[class*="rounded"]');
      return out;
    });
    console.log(theme, JSON.stringify(info));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
