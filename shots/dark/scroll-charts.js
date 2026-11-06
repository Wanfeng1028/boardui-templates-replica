const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const targets = [
    ['earnings-line', 'Earnings'],
    ['radar-radial', 'Engagement radar'],
    ['area', 'Requests by surface'],
    ['combo', 'Signups & conversion'],
    ['scatter', 'Deal size vs close rate'],
    ['steps', 'Week total'],
  ];
  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => { localStorage.setItem('boardui:theme', t); }, theme);
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:8931/pro-components/charts.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    for (const [slug, text] of targets) {
      const loc = page.locator(`text=${text}`).first();
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `/home/hatch/workspace/boardui-templates-replica/shots/dark/view-${theme}-charts-${slug}.png` });
      console.log(theme, slug, 'ok');
    }
    await ctx.close();
  }
  await browser.close();
  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
