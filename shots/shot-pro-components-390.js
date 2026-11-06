const { chromium } = require('/home/hatch/workspace/muse-build/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3004/pro-components', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(5000);
  const chips = await p.evaluate(() => {
    const sec = document.getElementById('calendar');
    if (!sec) return 'NO SECTION';
    const btns = [...sec.querySelectorAll('button')].filter((b) => b.className.includes('truncate'));
    return btns.slice(0, 6).map((b) => ({ text: b.textContent.trim(), w: Math.round(b.getBoundingClientRect().width), scrollW: b.scrollWidth, clientW: b.clientWidth, truncated: b.scrollWidth > b.clientWidth }));
  });
  console.log(JSON.stringify(chips, null, 1));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('overflow px:', overflow);
  await p.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/shot-pro-components-390.png', fullPage: true });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
