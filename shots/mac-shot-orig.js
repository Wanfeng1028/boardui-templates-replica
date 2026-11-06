const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3101/index.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '/home/hatch/workspace/boardui-templates-replica/shots/mac-1440-original.png' });
  const m = await page.evaluate(() => {
    const q = (s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, radius: cs.borderRadius }; };
    return {
      sidebar: q('aside[aria-label="Conversations"]'),
      main: q('main[aria-label="Agent conversation"]'),
      userBubble: q('main .me-3.ms-auto'),
      agentBubble: q('main article.group\\/reply > div'),
      composer: q('main .shrink-0.p-1 > div > div'),
      sidebarItem: q('aside[aria-label="Conversations"] button[aria-current="page"]'),
    };
  });
  console.log(JSON.stringify(m, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
