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
  // 1. Group empty state: click first sidebar item (group chat)
  await page.click('aside[aria-label="Conversations"] button:first-of-type');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-1440-group.png' });
  // 2. Back to landing, open editor
  await page.click('aside[aria-label="Conversations"] button[aria-current="page"]');
  await page.waitForTimeout(400);
  const items = await page.$$('aside[aria-label="Conversations"] button');
  // click landing page designer (2nd item)
  await items[1].click();
  await page.waitForTimeout(400);
  await page.click('main header button');
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-1440-editor2.png' });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
