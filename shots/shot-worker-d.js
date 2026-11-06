const { chromium } = require("/home/hatch/workspace/muse-build/node_modules/playwright-core");
const path = require("path");

const OUT = "/home/hatch/workspace/boardui-templates-replica/shots";
const EXE = "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const BASE = "http://localhost:3004";

const SHOTS = [
  ["ai-chat", "/templates/ai-chat"],
  ["ai-image-generation", "/templates/ai-image-generation"],
  ["ai-profile", "/templates/ai-profile"],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: EXE,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  for (const [slug, route] of SHOTS) {
    for (const width of [1440, 768, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200));
      });
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
      await page.waitForTimeout(6000);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: path.join(OUT, `shot-${slug}-${width}.png`) });
      console.log(`shot-${slug}-${width}.png overflowX=${overflow} errors=${errors.length ? errors.join(" | ") : "none"}`);
      await ctx.close();
    }
  }
  await browser.close();
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });
