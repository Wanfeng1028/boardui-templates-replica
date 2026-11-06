const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => { localStorage.setItem('boardui:theme', t); }, theme);
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:8931/pro-components/charts.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const out = {};
      // earnings bars: first chart card svg rects inside .recharts-bar-rectangle
      out.barRects = document.querySelectorAll('.recharts-bar-rectangle path').length;
      out.barFills = [...new Set([...document.querySelectorAll('.recharts-bar-rectangle path')].map(e => e.getAttribute('fill')))].slice(0, 6);
      out.linePaths = document.querySelectorAll('.recharts-line-curve, .recharts-area-area').length;
      out.lineStrokes = [...new Set([...document.querySelectorAll('.recharts-line-curve')].map(e => e.getAttribute('stroke')))].slice(0, 6);
      out.areaFills = [...new Set([...document.querySelectorAll('.recharts-area-area')].map(e => e.getAttribute('fill')))].slice(0, 6);
      out.radarPolygons = document.querySelectorAll('.recharts-radar-polygon').length;
      out.radarFills = [...new Set([...document.querySelectorAll('.recharts-radar-polygon')].map(e => e.getAttribute('fill')))].slice(0, 6);
      out.radialSectors = document.querySelectorAll('.recharts-radial-bar-sector path').length;
      out.radialFills = [...new Set([...document.querySelectorAll('.recharts-radial-bar-sector path')].map(e => e.getAttribute('fill')))].slice(0, 8);
      out.svgCount = document.querySelectorAll('svg.recharts-surface').length;
      // computed fill of first bar rect
      const firstBar = document.querySelector('.recharts-bar-rectangle path');
      out.firstBarComputedFill = firstBar ? getComputedStyle(firstBar).fill : null;
      const firstLine = document.querySelector('.recharts-line-curve');
      out.firstLineStroke = firstLine ? getComputedStyle(firstLine).stroke : null;
      return out;
    });
    console.log(theme, JSON.stringify(info, null, 1));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
