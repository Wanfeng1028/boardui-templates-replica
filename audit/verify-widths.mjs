// Width self-check for the template-switching entries (v2).
// Loads key pages at 1440 / 768 / 390, reports whether each entry is
// rendered, visible, inside the viewport and clickable (click -> /templates),
// and saves a screenshot per page/width under audit/shots/.
// Results go to audit/width-check-results.json (one line per check on stdout).
// Usage: node audit/verify-widths.mjs   (serve-clean.mjs must run on 3123)
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/hatch/workspace/muse-build/shot/node_modules/playwright-core");

const BASE = "http://127.0.0.1:3123";
const EXE = "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-linux/headless_shell";
const WIDTHS = [1440, 768, 390];

mkdirSync(new URL("./shots/", import.meta.url).pathname, { recursive: true });

// Locators are scoped so a `hidden lg:flex` sidebar copy (display:none below
// lg) is never mistaken for the visible entry: the top-bar button lives in
// <header>, the index card lives in <main>, the mobile sidebar row lives in
// the fixed drawer container.
const PAGES = [
  {
    name: "home",
    url: "/",
    entries: [
      { key: "banner-button", sel: 'a[href="/templates"] >> text=浏览全部模板', click: true },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
  {
    name: "templates-index",
    url: "/templates",
    entries: [
      { key: "heading-count", sel: "h1 >> text=全部模板", click: false },
      { key: "first-card", sel: 'main a[href="/templates/dashboard"]', click: false },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
  {
    name: "template-dashboard",
    url: "/templates/dashboard",
    entries: [
      { key: "topbar-button", sel: 'header a[href="/templates"] >> text=全部模板', click: true },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
  {
    name: "template-ai-chat",
    url: "/templates/ai-chat",
    entries: [
      { key: "topbar-button", sel: 'header a[href="/templates"] >> text=全部模板', click: true },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
  {
    name: "template-ai-image",
    url: "/templates/ai-image-generation",
    entries: [
      { key: "topbar-button", sel: 'header a[href="/templates"] >> text=全部模板', click: true },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
  {
    name: "template-hr",
    url: "/templates/hr-management",
    entries: [
      { key: "topbar-button", sel: 'header a[href="/templates"] >> text=全部模板', click: true },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
  {
    name: "template-multi-agent",
    url: "/templates/multi-agent-chat",
    entries: [
      { key: "topbar-button", sel: 'header a[href="/templates"] >> text=全部模板', click: true },
    ],
  },
  {
    name: "template-finance",
    url: "/templates/finance",
    entries: [
      { key: "topbar-button", sel: 'header a[href="/templates"] >> text=全部模板', click: true },
      { key: "sidebar-row", sel: 'aside:visible a[href="/templates"] >> text=全部模板', click: false },
    ],
  },
];

const browser = await chromium.launch({ executablePath: EXE });
const results = [];

for (const width of WIDTHS) {
  for (const pageDef of PAGES) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE + pageDef.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: new URL(`shots/${pageDef.name}-${width}.png`, import.meta.url).pathname });
    for (const entry of pageDef.entries) {
      let sel = entry.sel;
      if (entry.key === "sidebar-row" && width < 1024) {
        // Sidebar is a drawer below lg: open it, then scope to the drawer.
        const burger = page.getByRole("button", { name: "Open navigation" }).first();
        if (await burger.count()) {
          await burger.click();
          await page.waitForTimeout(300);
        }
        sel = 'div.fixed aside a[href="/templates"] >> text=全部模板';
      }
      const locator = page.locator(sel).first();
      const count = await locator.count();
      let visible = false;
      let box = null;
      let inViewport = false;
      if (count > 0) {
        visible = await locator.isVisible();
        box = await locator.boundingBox();
        if (box) {
          inViewport =
            box.x >= 0 && box.y >= 0 && box.x + box.width <= width && box.y + box.height <= 900;
        }
      }
      let clickOk = null;
      if (entry.click && count > 0 && visible) {
        try {
          await locator.click({ timeout: 3000 });
          await page.waitForURL("**/templates", { timeout: 5000 });
          clickOk = page.url().endsWith("/templates");
          await page.goto(BASE + pageDef.url, { waitUntil: "networkidle" });
          await page.waitForTimeout(300);
        } catch {
          clickOk = false;
        }
      }
      const ok = visible && inViewport && clickOk !== false;
      results.push({
        width,
        page: pageDef.name,
        entry: entry.key,
        found: count,
        visible,
        inViewport,
        box: box
          ? { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) }
          : null,
        clickNavigatesToTemplates: clickOk,
        ok,
      });
      console.log(
        `${ok ? "PASS" : "FAIL"} ${width} ${pageDef.name} ${entry.key} found=${count} visible=${visible} inViewport=${inViewport} box=${box ? `${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}` : "-"} click=${clickOk}`,
      );
      if (entry.key === "sidebar-row" && width < 1024) {
        const close = page.getByRole("button", { name: "Close navigation" }).first();
        if (await close.count()) await close.click().catch(() => {});
        await page.waitForTimeout(200);
      }
    }
    await page.close();
  }
}
await browser.close();

writeFileSync(
  new URL("./width-check-results.json", import.meta.url).pathname,
  JSON.stringify(results, null, 2),
);
const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length} checks, ${fails.length} failures`);
if (fails.length) process.exit(1);
