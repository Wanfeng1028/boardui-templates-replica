const { chromium } = require('/home/hatch/workspace/muse-build/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  for (const w of [1440, 768, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage();
    await p.goto('http://localhost:3006/pro-components', { waitUntil: 'networkidle', timeout: 60000 });
    await p.waitForTimeout(6000); // let streaming demos finish
    await p.screenshot({ path: `/home/hatch/workspace/boardui-templates-replica/shots/shot-pro-components-${w}.png`, fullPage: true });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(w, 'horizontal overflow px:', overflow);
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
