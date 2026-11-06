// Worker A verification: dashboard + finance at 1440/768/390 (tall viewports so the
// inner-scrolling main column is fully visible in one shot) + interaction smoke test.
const { chromium } = require('/home/hatch/workspace/muse-build/node_modules/playwright-core');
const BASE = process.env.BASE || 'http://localhost:3004';
const OUT = '/home/hatch/workspace/boardui-templates-replica/shots';
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox'],
  });
  // --- interaction smoke test on dashboard (1440) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('dash-interact pageerror:', String(e).slice(0, 200)));
    await page.goto(BASE + '/templates/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(6000);
    const before = await page.evaluate(() => document.body.innerText.includes('$7,462'));
    await page.getByRole('radio', { name: 'Monthly' }).first().click().catch((e) => console.log('monthly click fail', e.message.slice(0, 120)));
    await page.waitForTimeout(800);
    const afterMonthly = await page.evaluate(() => document.body.innerText.includes('$29,220'));
    console.log('dash: weekly $7,462 present:', before, '| monthly switches to $29,220:', afterMonthly);
    await page.getByRole('button', { name: 'Filters' }).first().click();
    await page.waitForTimeout(500);
    console.log('dash: filter panel opens:', await page.evaluate(() => document.body.innerText.includes('Filter customers')));
    await page.getByRole('button', { name: 'Create ticket' }).click();
    await page.waitForTimeout(500);
    console.log('dash: create modal opens:', await page.evaluate(() => document.body.innerText.includes('Create ticket') && !!document.querySelector('[role="dialog"]')));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    // table pagination: go to page 2
    await page.getByRole('button', { name: 'Go to page 2' }).first().click().catch((e) => console.log('page2 click fail', e.message.slice(0, 120)));
    await page.waitForTimeout(500);
    console.log('dash: table page 2:', await page.evaluate(() => document.body.innerText.includes('Page 2 of 55')));
    await ctx.close();
  }
  // --- interaction smoke test on finance (1440) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('fin-interact pageerror:', String(e).slice(0, 200)));
    await page.goto(BASE + '/templates/finance', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.getByRole('button', { name: 'Add transaction' }).click();
    await page.waitForTimeout(500);
    console.log('fin: add modal opens:', await page.evaluate(() => !!document.querySelector('[role="dialog"]')));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Go to page 2' }).first().click().catch((e) => console.log('fin page2 click fail', e.message.slice(0, 120)));
    await page.waitForTimeout(500);
    console.log('fin: table page 2:', await page.evaluate(() => document.body.innerText.includes('Page 2 of 14')));
    await ctx.close();
  }
  // --- screenshots ---
  const shots = [
    ['dashboard', '/templates/dashboard', 1440, 2300],
    ['dashboard', '/templates/dashboard', 768, 2900],
    ['dashboard', '/templates/dashboard', 390, 3800],
    ['finance', '/templates/finance', 1440, 2300],
    ['finance', '/templates/finance', 768, 2900],
    ['finance', '/templates/finance', 390, 3800],
  ];
  for (const [name, path, w, h] of shots) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log(name, w, 'pageerror:', String(e).slice(0, 200)));
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(6000);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(name, w, 'horizontal-overflow-px:', overflow);
    await page.screenshot({ path: `${OUT}/shot-${name}-${w}.png` });
    console.log(name, w, 'saved');
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
