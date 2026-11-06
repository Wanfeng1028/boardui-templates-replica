const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3100/templates/multi-agent-chat', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  // 1. default: sidebar avatars + header capsule
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-avatar/mac-avatar-default-1440.png' });
  // 2. editor: large preview + 9 shapes + 9 gradient dots
  await page.click('main header button');
  await page.waitForTimeout(900);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-avatar/mac-avatar-editor-1440.png' });
  // 3. scroll editor panel to the expression grid
  await page.evaluate(() => {
    const grid = document.querySelector('div[aria-label="Agent emotion"]');
    if (grid) grid.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-avatar/mac-avatar-expressions-1440.png' });
  // checks: gradient defs present, no circle shape buttons, 16 expression buttons, 9 shape buttons
  const checks = await page.evaluate(() => {
    const svg = document.querySelector('aside[aria-label="Conversations"] svg');
    const grads = document.querySelectorAll('radialGradient').length;
    const exprBtns = document.querySelectorAll('div[aria-label="Agent emotion"] button').length;
    const shapeBtns = document.querySelectorAll('button[aria-label^="Shape "]').length;
    const colorBtns = document.querySelectorAll('button[aria-label^="Color "]').length;
    const reduced = !!document.querySelector('style');
    return { grads, exprBtns, shapeBtns, colorBtns, sidebarSvg: !!svg };
  });
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
