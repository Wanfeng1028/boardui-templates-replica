// Worker C screenshot pass: Calendar / Medical Profile / HR Management
// at 1440 / 768 / 390 against the dev server on port 3003.
// Uses the local Playwright headless shell (chromium_headless_shell-1243).
const { chromium } = require("/home/hatch/workspace/muse-build/shot/node_modules/playwright-core");
const path = require("path");

const BASE = "http://localhost:3004";
const OUT = "/home/hatch/workspace/boardui-templates-replica/shots";
const PAGES = [
  ["calendar", "/templates/calendar"],
  ["medical-profile", "/templates/medical-profile"],
  ["hr-management", "/templates/hr-management"],
];
const WIDTHS = [1440, 768, 390];

(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
    args: ["--no-sandbox"],
  });
  for (const [name, route] of PAGES) {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text().slice(0, 200));
      });
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(3000);
      // Recharts renders client-side; give hydration a chance (chunks can
      // 403 transiently while another worker's dev server recompiles).
      await page.waitForSelector("svg.recharts-surface", { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return { scrollW: de.scrollWidth, clientW: de.clientWidth, overflowX: de.scrollWidth > de.clientWidth + 1 };
      });
      const file = path.join(OUT, `shot-${name}-${width}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log(name, width, "overflowX:", overflow.overflowX, "scrollW:", overflow.scrollW, "errors:", errors.slice(0, 3));
      await ctx.close();
    }
  }
  await browser.close();
  console.log("DONE");
})().catch((e) => {
  console.error("SHOT FAILED", e);
  process.exit(1);
});
