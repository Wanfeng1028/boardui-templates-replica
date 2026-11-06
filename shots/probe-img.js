const { chromium } = require("/home/hatch/workspace/muse-build/node_modules/playwright-core");
(async () => {
  const browser = await chromium.launch({
    executablePath: "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3004/templates/ai-image-generation", { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(6000);
  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].map((im) => ({
      src: im.getAttribute("src")?.slice(0, 80),
      complete: im.complete,
      natural: im.naturalWidth + "x" + im.naturalHeight,
      rect: JSON.stringify(im.getBoundingClientRect()),
      cls: im.className.slice(0, 60),
    }));
    return imgs;
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });
