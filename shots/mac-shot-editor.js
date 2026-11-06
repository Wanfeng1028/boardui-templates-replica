const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3100/templates/multi-agent-chat', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  // open editor by clicking the agent capsule in header
  await page.click('main header button');
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-1440-editor.png' });
  const m = await page.evaluate(() => {
    const el = document.querySelector('aside[aria-label="Agent editor"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  console.log('editor:', JSON.stringify(m));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
