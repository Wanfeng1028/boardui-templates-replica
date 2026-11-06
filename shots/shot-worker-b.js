// Worker B screenshot pass: project-board + marketing at 1440 / 768 / 390.
// Uses the repo's shared dev server on :3006 (a second `next dev` in the
// same directory is refused by Next itself) and the local headless shell.
const { chromium } = require("/home/hatch/workspace/muse-build/node_modules/playwright-core");

const SHELL = "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-linux/headless_shell";
const BASE = "http://localhost:3006";
const OUT = "/home/hatch/workspace/boardui-templates-replica/shots";

const SHOTS = [
  ["project-board", "/templates/project-board", 1440],
  ["project-board", "/templates/project-board", 768],
  ["project-board", "/templates/project-board", 390],
  ["marketing", "/templates/marketing", 1440],
  ["marketing", "/templates/marketing", 768],
  ["marketing", "/templates/marketing", 390],
];

(async () => {
  const browser = await chromium.launch({ executablePath: SHELL, args: ["--no-sandbox"] });
  for (const [name, path, width] of SHOTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: `${OUT}/shot-${name}-${width}.png` });
    console.log(name, width, "h-overflow px:", overflow, "errors:", errors.length ? errors : "none");
    await page.close();
  }
  // Interaction evidence: ticket detail panel + new campaign drawer (1440).
  const p1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p1.goto(BASE + "/templates/project-board", { waitUntil: "networkidle", timeout: 60000 });
  await p1.waitForTimeout(2000);
  await p1.getByRole("button", { name: /Open DS-34/ }).click();
  await p1.waitForTimeout(800);
  await p1.screenshot({ path: `${OUT}/shot-project-board-detail-1440.png` });
  console.log("detail panel open:", await p1.getByRole("dialog").count());
  await p1.close();
  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(BASE + "/templates/marketing", { waitUntil: "networkidle", timeout: 60000 });
  await p2.waitForTimeout(2000);
  await p2.getByRole("button", { name: "New campaign" }).click();
  await p2.waitForTimeout(800);
  await p2.screenshot({ path: `${OUT}/shot-marketing-new-campaign-1440.png` });
  console.log("new campaign dialog open:", await p2.getByRole("dialog").count());
  await p2.close();
  await browser.close();
})().catch((e) => { console.error("SHOT FAIL:", e.message); process.exit(1); });
