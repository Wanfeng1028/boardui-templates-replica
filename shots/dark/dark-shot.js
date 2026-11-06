const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:8931';
const OUT = '/home/hatch/workspace/boardui-templates-replica/shots/dark';
const PAGES = [
  ['templates', '/templates.html'],
  ['dashboard', '/templates/dashboard.html'],
  ['project-board', '/templates/project-board.html'],
  ['marketing', '/templates/marketing.html'],
  ['calendar', '/templates/calendar.html'],
  ['finance', '/templates/finance.html'],
  ['medical-profile', '/templates/medical-profile.html'],
  ['hr-management', '/templates/hr-management.html'],
  ['ai-chat', '/templates/ai-chat.html'],
  ['ai-image-generation', '/templates/ai-image-generation.html'],
  ['ai-profile', '/templates/ai-profile.html'],
  ['pro-components', '/pro-components.html'],
  ['pro-charts', '/pro-components/charts.html'],
];
const WIDTHS = [1440, 768, 390];

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const results = [];
  for (const [slug, url] of PAGES) {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      await ctx.addInitScript(() => { localStorage.setItem('boardui:theme', 'dark'); });
      const page = await ctx.newPage();
      try {
        await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500);
        const info = await page.evaluate(() => ({
          dark: document.documentElement.classList.contains('dark'),
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
          bodyBg: getComputedStyle(document.body).backgroundColor,
          bodyColor: getComputedStyle(document.body).color,
        }));
        const name = `dark-${slug}-${w}.png`;
        await page.screenshot({ path: path.join(OUT, name), fullPage: true });
        results.push({ slug, w, ...info, file: name });
        console.log(JSON.stringify({ slug, w, ...info, file: name }));
      } catch (e) {
        results.push({ slug, w, error: String(e) });
        console.log(JSON.stringify({ slug, w, error: String(e) }));
      }
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'dark-shot-results.json'), JSON.stringify(results, null, 2));
  await browser.close();
  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
