const { chromium } = require("/home/hatch/workspace/muse-build/node_modules/playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3004/templates/ai-profile", { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(4000);
  await page.evaluate(() => {
    const mains = [...document.querySelectorAll("main")];
    const scroller = mains.find((m) => m.scrollHeight > m.clientHeight) || document.scrollingElement;
    scroller.scrollTop = scroller.scrollHeight;
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/home/hatch/workspace/boardui-templates-replica/shots/shot-ai-profile-1440-bottom.png" });
  console.log("saved bottom shot");
  await browser.close();
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });
