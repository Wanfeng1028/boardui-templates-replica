// One-off: capture the Marketing campaigns table (below the fold) + project-board 390.
const { chromium } = require("/home/hatch/workspace/muse-build/node_modules/playwright-core");
const SHELL = "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-linux/headless_shell";
const BASE = "http://localhost:3004";
const OUT = "/home/hatch/workspace/boardui-templates-replica/shots";
(async () => {
  const browser = await chromium.launch({ executablePath: SHELL, args: ["--no-sandbox"] });
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/templates/marketing", { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(2000);
  await p.getByText("Total Results").scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/shot-marketing-table-1440.png` });
  // Exercise a filter + sort + pagination via the UI to prove state changes.
  await p.getByLabel("Filter by channel").selectOption("Email");
  await p.waitForTimeout(400);
  const count = await p.getByText(/campaigns$/).first().textContent();
  console.log("after Email filter, header:", count);
  await p.getByRole("button", { name: /Spend/ }).click();
  await p.waitForTimeout(300);
  const firstSpend = await p.locator("tbody tr td:nth-child(5)").first().textContent();
  console.log("first row spend after Spend sort:", firstSpend);
  await p.screenshot({ path: `${OUT}/shot-marketing-table-filtered-1440.png` });
  await p.close();
  const q = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await q.goto(BASE + "/templates/project-board", { waitUntil: "networkidle", timeout: 60000 });
  await q.waitForTimeout(2000);
  await q.screenshot({ path: `${OUT}/shot-project-board-390.png` });
  console.log("pb390 done");
  await q.close();
  await browser.close();
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
