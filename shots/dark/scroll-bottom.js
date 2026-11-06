const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const pages = [
    ['dashboard-bottom', '/templates/dashboard.html'],
    ['hr-bottom', '/templates/hr-management.html'],
    ['marketing-bottom', '/templates/marketing.html'],
    ['medical-bottom', '/templates/medical-profile.html'],
    ['calendar-bottom', '/templates/calendar.html'],
  ];
  for (const [slug, url] of pages) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => { localStorage.setItem('boardui:theme', 'dark'); });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:8931' + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && e.clientHeight > 300);
      els.sort((a, b) => b.scrollHeight - a.scrollHeight);
      if (els[0]) els[0].scrollTop = els[0].scrollHeight;
    });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `/home/hatch/workspace/boardui-templates-replica/shots/dark/view2-dark-${slug}.png` });
    console.log(slug, 'ok');
    await ctx.close();
  }
  await browser.close();
  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
