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
  await page.click('aside[aria-label="Conversations"] button:has-text("Design + Marketing + Product")');
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-1440-group2.png' });
  const state = await page.evaluate(() => {
    const main = document.querySelector('main');
    return { hasEmpty: main.textContent.includes('A few minds'), header: main.querySelector('header').textContent.trim() };
  });
  console.log(JSON.stringify(state));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
