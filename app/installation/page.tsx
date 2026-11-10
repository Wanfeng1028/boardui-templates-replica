"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption-1-semibold text-text-secondary">
        {n} — {title}
      </p>
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

function FileBlock({ file, code }: { file: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-caption-1-medium text-text-secondary">{file}</p>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

function Command({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <code className="font-mono text-caption-1-medium text-text-primary">{cmd}</code>
      <CopyButton text={cmd} />
    </div>
  );
}


function PkgCommand({ npm, pnpm, yarn }: { npm: string; pnpm: string; yarn: string }) {
  const [pm, setPm] = useState<"npm" | "pnpm" | "yarn">("npm");
  const cmd = pm === "npm" ? npm : pm === "pnpm" ? pnpm : yarn;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {(["npm", "pnpm", "yarn"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setPm(name)}
            className={cx(
              "rounded-full border px-3 py-1 text-caption-1-semibold transition-colors",
              pm === name
                ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <Command cmd={cmd} />
    </div>
  );
}

export const VITE_CONFIG_CODE = `// vite.config.ts
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});`;

export const VITE_TSCONFIG_CODE = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}`;

export const VITE_MAIN_CODE = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`;

export const RR_TSCONFIG_CODE = `// tsconfig.json — add "@/*" next to the template's "~/*" alias
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./app/*"],
      "@/*": ["./app/*"]
    }
  }
}`;

export const RR_ROOT_CODE = `// app/root.tsx
import "@/styles/globals.css"; // replaces the default "./app.css" import`;

export const ASTRO_TSCONFIG_CODE = `// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}`;

export const ASTRO_LAYOUT_CODE = `---
// src/layouts/Layout.astro
import "@/styles/globals.css";
---`;

export const ASTRO_USAGE_CODE = `---
// src/pages/index.astro
import { Button } from "@/components/base/buttons/button";
---
<Button client:load>Get started</Button>`;

export const LAYOUT_CODE = `// app/layout.tsx
import { Inter } from "next/font/google";
import "@/styles/globals.css";
// replaces the default "./globals.css" import
// BoardUI's theme reads its typeface from --font-inter (styles/theme.css).
// The opsz axis renders display sizes in Inter Display, as on boardui.com.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // On <html>, where theme.css resolves the font, in place of the Geist variables.
    <html lang="en" className={\`\${inter.variable} h-full antialiased\`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}`;

export const BOARDUI_JSON_CODE = `{
  "paths": {
    "components": "src/components",
    "utils": "src/utils",
    "hooks": "src/hooks",
    "styles": "src/styles",
    "lib": "src/lib"
  },
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "@workspace/ui/utils",
    "hooks": "@workspace/ui/hooks",
    "styles": "@workspace/ui/styles",
    "lib": "@workspace/ui/lib"
  }
}`;

export const CONSUMING_GLOBALS_CODE = `/* apps/web/app/globals.css — repeat in apps/admin/app/globals.css */
@import "@workspace/ui/styles/globals.css";
@source "../../../packages/ui/src";`;

export const ADD_COMPONENT_CODE = `import { Button } from "@/components/base/buttons/button";

export default function Page() {
  return <Button>Get started</Button>;
}`;

export const DARK_LAYOUT_CODE = `// app/layout.tsx
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css"; // replaces the default "./globals.css" import

// BoardUI's theme reads its typeface from --font-inter (styles/theme.css).
// The opsz axis renders display sizes in Inter Display, as on boardui.com.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

const themeScript = '(function(){try{var dark=localStorage.getItem("boardui:theme")==="dark";document.documentElement.classList.toggle("dark",dark)}catch(e){document.documentElement.classList.remove("dark")}})();';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // On <html>, where theme.css resolves the font, in place of the Geist variables.
    <html lang="en" className={\`\${inter.variable} h-full antialiased\`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="boardui-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}`;

export const ACCENT_CODE = `/* BoardUI accent - pink.
 * Paste anywhere after importing styles/theme.css. */
:root {
  --color-accent-50:   oklch(97.1% 0.014 343.198);
  --color-accent-100:  oklch(94.8% 0.028 342.258);
  --color-accent-200:  oklch(89.9% 0.061 343.231);
  --color-accent-300:  oklch(82.3% 0.12 346.018);
  --color-accent-400:  oklch(71.8% 0.202 349.761);
  --color-accent-500:  oklch(65.6% 0.241 354.308);
  --color-accent-600:  oklch(59.2% 0.249 0.584);
  --color-accent-700:  oklch(52.5% 0.223 3.958);
  --color-accent-800:  oklch(45.9% 0.187 3.815);
  --color-accent-900:  oklch(40.8% 0.153 2.432);
  --color-accent-950:  oklch(28.4% 0.109 3.907);
}`;

export const THEME_CSS = `/* ---------------------------------------------------------------------------
 * BoardUI theme tokens
 *
 * Layered as Tailwind v4 expects:
 *   @theme { ... }     primitives + ramp overrides → Tailwind utilities
 *   :root { ... }      semantic tokens (light mode) — reference primitives
 *   .dark { ... }      semantic overrides (dark mode) — landed when designed
 *   @theme inline {..} re-export of semantic tokens so they become utilities
 *
 * See docs/FIGMA_WORKFLOW.md for how tokens get added (Figma is source of truth).
 * --------------------------------------------------------------------------- */

@theme {
  /* ----- Color primitives ----------------------------------------------------
   * Almost the entire palette matches Tailwind v4's OKLCH defaults. The four
   * overrides below are the only intentional deviations (see Figma → variables
   * → color/...).
   * --------------------------------------------------------------------------*/
  --color-slate-200:   #ebeff5;
  --color-neutral-100: #f7f7f7;
  --color-neutral-200: #ebebeb;
  --color-neutral-925: #121212;
  --color-blue-400:    #3392ff;

  /* ----- Accent ramp ---------------------------------------------------------
   * The CTA hue. Interactive/selection surfaces (primary button gradient,
   * ghost + link buttons, checkbox, radio, switch, slider, tabs, sidebar
   * selected, focus ring, date-range selection) reference accent-* instead of
   * a raw hue, so the whole system re-tints by overriding these eleven
   * variables at runtime (see components/application/theme/accent.ts) or in
   * a customer project after importing this file. Defaults to the blue
   * primitives above. Content/data blues (charts, status chips, calendar
   * events, info notifications) deliberately keep referencing blue-*.
   * --------------------------------------------------------------------------*/
  --color-accent-50:  var(--color-blue-50);
  --color-accent-100: var(--color-blue-100);
  --color-accent-200: var(--color-blue-200);
  --color-accent-300: var(--color-blue-300);
  --color-accent-400: var(--color-blue-400);
  --color-accent-500: var(--color-blue-500);
  --color-accent-600: var(--color-blue-600);
  --color-accent-700: var(--color-blue-700);
  --color-accent-800: var(--color-blue-800);
  --color-accent-900: var(--color-blue-900);
  --color-accent-950: var(--color-blue-950);

  /* ----- Typography ----------------------------------------------------------
   * Font sizes, weights, line-heights, and tracking all match Tailwind v4
   * defaults. The only override is the family: Inter, loaded via next/font
   * in app/layout.tsx, which exposes --font-inter to the document.
   * --------------------------------------------------------------------------*/
  --font-mono-source: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo,
                      Consolas, "Liberation Mono", monospace;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif,
               "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
               "Noto Color Emoji";

  /* Monospace ramp for code blocks. Loaded via next/font in app/layout.tsx
   * (--font-mono-source → JetBrains Mono). Figma's spec uses IBM Plex Mono;
   * JetBrains Mono is the closest already-bundled face. */
  --font-mono: var(--font-mono-source), ui-monospace, "SFMono-Regular", Menlo,
               Consolas, "Liberation Mono", monospace;

  /* ----- Radii ---------------------------------------------------------------
   * Extra step between lg (8) and xl (12). Used by medium-size buttons.
   * Figma name: radius/2lg.
   * --------------------------------------------------------------------------*/
  --radius-2lg: 10px;
  /* Figma \`radius/2,5xl\`: kanban columns and other large inset panels. */
  --radius-2-5xl: 20px;
  --radius-notification-card: 10px;

  /* ----- Shadows -------------------------------------------------------------
   * 2xs, xs, 2xl and the inner shadows already match Tailwind v4. Sizes sm, md,
   * lg, xl follow the Figma 6%/10% recipe (slightly softer than Tailwind v4's
   * 10%/10% default).
   * --------------------------------------------------------------------------*/
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.10);
  --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.06), 0 4px 6px -1px rgb(0 0 0 / 0.10);
  --shadow-lg: 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.10);
  --shadow-xl: 0 10px 10px -5px rgb(0 0 0 / 0.04), 0 20px 25px -5px rgb(0 0 0 / 0.10);

  /* Figma effect style "Background/Sidebar Elevation" — copied 1:1:
   *   DROP_SHADOW #00000005 offset(0,1) radius 0  spread 0  → 0 1px 0px  0 / 0.0196
   *   DROP_SHADOW #0000000F offset(0,1) radius 12 spread 0  → 0 1px 12px 0 / 0.0588
   *   DROP_SHADOW #00000052 offset(0,0) radius 1  spread 0  → 0 0   1px  0 / 0.3216
   * (alpha = hex byte / 255: 05→0.0196, 0F→0.0588, 52→0.3216). */
  --shadow-sidebar:
    0 1px 0 0 rgb(0 0 0 / 0.0196),
    0 1px 12px 0 rgb(0 0 0 / 0.0588),
    0 0 1px 0 rgb(0 0 0 / 0.3216);

  /* Figma effect style "Sidebar selected" — copied 1:1:
   *   DROP_SHADOW  color/blue/500 offset(0,0) radius 0 spread 1 → 0 0 0 1px blue-500
   *   INNER_SHADOW #FFFFFF40       offset(0,1) radius 0 spread 0 → inset 0 1px 0 0 / 0.251
   * (#FFFFFF40 alpha = 0x40/255 = 0.251). */
  --shadow-nav-selected:
    0 0 0 1px var(--color-accent-500),
    inset 0 1px 0 0 rgb(255 255 255 / 0.251);

  /* Checkbox checked/indeterminate surface (from the Figma Checkbox component):
   * inner top highlight + 1px inner blue edge over the primary gradient. */
  --shadow-checkbox-selected:
    inset 0 2px 0 0 rgb(255 255 255 / 0.25),
    inset 0 0 0 1px var(--color-accent-500);

  /* 1px contact shadow used on white cards/dropdown triggers sitting on the
   * secondary background (Figma drop shadow 0 1 1 5%). */
  --shadow-card: 0 1px 1px 0 rgb(0 0 0 / 0.05);

  /* Floating menu/dropdown panel (Figma → sidebar profile menu node 3823:3699):
   *   DROP_SHADOW #0000000A offset(0,1) radius 1 → 0 1px 1px 0 / 0.04
   *   DROP_SHADOW #00000005 offset(0,4) radius 4 → 0 4px 4px 0 / 0.02 */
  --shadow-dropdown:
    0 1px 1px 0 rgb(0 0 0 / 0.04),
    0 4px 4px 0 rgb(0 0 0 / 0.02);

  /* Floating template waitlist (Figma node 4117:32737). This extends the
   * sidebar elevation recipe with the two broad ambient layers used by the
   * signup surface. */
  --shadow-waitlist:
    0 0 6px 0 rgb(0 0 0 / 0.06),
    0 0 64px 0 rgb(0 0 0 / 0.16),
    0 0 1px 0 rgb(0 0 0 / 0.32),
    0 1px 12px 0 rgb(0 0 0 / 0.06),
    0 1px 0 0 rgb(0 0 0 / 0.02);

  /* Inner shadows (Figma names inner-shadow/*; Tailwind utility prefix is
   * inset-shadow-*).
   */
  --inset-shadow-2xs: inset 0 1px 0 0 rgb(0 0 0 / 0.05);
  --inset-shadow-xs:  inset 0 1px 1px 0 rgb(0 0 0 / 0.05);
  --inset-shadow-sm:  inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}

/* ---------------------------------------------------------------------------
 * Semantic tokens — light mode.
 *
 * All values reference primitives via var(--color-{family}-{shade}). Edit the
 * primitives in @theme above and these update automatically.
 *
 * Figma name on the left, var name on the right:
 *   foreground/full                  → --color-foreground-full
 *   foreground/icon/primary          → --color-foreground-icon-primary
 *   foreground/disabled              → --color-foreground-disabled
 *   foreground/disabled-danger       → --color-foreground-disabled-danger
 *   text/primary                     → --color-text-primary
 *   text/tertiary                    → --color-text-tertiary
 *   text/disabled-danger             → --color-text-disabled-danger
 *   background/primary/default       → --color-background-primary-default
 *   background/primary/hover         → --color-background-primary-hover
 *   background/primary/active        → --color-background-primary-active
 *   background/primary/disabled      → --color-background-primary-disabled
 *   background/secondary/default     → --color-background-secondary-default
 *   border/button/default            → --color-border-button-default
 *   border/button/hover              → --color-border-button-hover
 *   border/button/active             → --color-border-button-active
 *
 * Button gradients (linear, 180°, light stop → dark stop) sourced from the
 * blue/red primitives that each Button/{type}/{state} style references in
 * Figma. Direction inferred — confirm visually against Figma.
 * --------------------------------------------------------------------------- */
:root {
  /* Foreground (icons + on-fill content) */
  --color-foreground-full:               var(--color-white);
  --color-foreground-icon-primary:       var(--color-neutral-950);
  --color-foreground-icon-hover:         var(--color-black);
  --color-foreground-icon-secondary:     var(--color-neutral-500);
  --color-foreground-icon-tertiary:      var(--color-neutral-400);
  --color-foreground-icon-quaternary:    var(--color-neutral-300);
  --color-foreground-icon-error:         var(--color-red-600);
  --color-foreground-icon-disabled:      var(--color-neutral-300);
  --color-foreground-disabled:           var(--color-neutral-400);
  --color-foreground-disabled-danger:    var(--color-red-300);
  --color-input-disabled-foreground:     var(--color-neutral-300);
  --color-icon-button-disabled-foreground: var(--color-neutral-300);
  --color-button-primary-disabled-foreground: var(--color-neutral-400);

  /* Text */
  --color-text-primary:         var(--color-neutral-950);
  --color-text-secondary:       var(--color-neutral-500);
  --color-text-tertiary:        var(--color-neutral-400);
  --color-text-disabled:        var(--color-neutral-300);
  --color-text-disabled-danger: var(--color-red-300);
  --color-text-placeholder:     var(--color-neutral-400);
  --color-text-error-primary:   var(--color-red-500);
  --color-text-destructive: color-mix(in srgb, var(--color-red-700) 80%, var(--color-neutral-600));
  --color-input-disabled-text:  var(--color-neutral-300);
  --color-text-white:           var(--color-white);

  /* Background */
  --color-background-full:              var(--color-white);
  /* Ticket detail, Figma 4509:12272. The raw #fafafa surface matches neutral/50. */
  --color-ticket-detail-surface: var(--color-white);
  --color-ticket-detail-low-background: var(--color-indigo-200);
  --color-ticket-detail-low-hover: var(--color-indigo-300);
  --color-ticket-detail-medium-hover: var(--color-yellow-300);
  --color-ticket-detail-high-hover: var(--color-orange-300);
  --color-ticket-detail-urgent-hover: var(--color-rose-300);
  --color-ticket-detail-low-text: var(--color-indigo-800);
  --color-ticket-detail-resource-background: var(--color-blue-100);
  --color-ticket-detail-resource-text: var(--color-blue-600);
  --color-ticket-detail-favorite: #ffb83c; /* raw Figma fill, no token yet */
  /* Empty-state illustration: raw Figma fills from node 4488:11848. */
  --color-project-board-empty-panel: rgb(242 242 242 / 0.8);
  --color-project-board-empty-front: #d9d9d9;
  --color-project-board-empty-middle: #e5e5e5;
  --color-project-board-empty-back: #ededed;
  --color-project-board-empty-detail: var(--color-white);
  --color-background-primary-default:   var(--color-white);
  --color-background-inner-default:     var(--color-white);
  --color-background-primary-hover:     var(--color-neutral-100);
  --color-background-primary-active:    var(--color-neutral-200);
  --color-background-primary-disabled:  var(--color-neutral-100);
  --color-input-disabled-background:    var(--color-neutral-100);
  --color-background-secondary-default: var(--color-neutral-100);
  --color-background-secondary-hover:   var(--color-neutral-200);
  --color-background-tertiary-default:  var(--color-neutral-200);
  --color-background-tertiary-hover:    var(--color-neutral-300);
  --color-background-tertiary-error:    var(--color-red-100);
  --color-background-recent-hire-role:  var(--color-neutral-100);
  --color-avatar-neutral-background:    var(--color-neutral-300);
  /* Figma background/quaternary/default — first used by the Storage
   * dropzone's upload-icon disc (node 4106:26587). */
  --color-background-quaternary-default: var(--color-neutral-300);
  --color-background-quaternary-hover:   var(--color-neutral-400);
  --color-background-quaternary-error:   var(--color-red-200);
  --color-file-upload-icon-background:   var(--color-neutral-300);
  --color-file-upload-icon-foreground:   var(--color-neutral-400);
  --color-file-upload-icon-foreground-hover: var(--color-neutral-500);

  /* Border */
  --color-border-button-default:   var(--color-neutral-200);
  --color-border-button-hover:     var(--color-neutral-300);
  --color-border-button-active:    var(--color-neutral-400);
  --color-border-button-white:     var(--color-white);
  /* The system had no red border. Matches text/error/primary so an invalid
     field's edge and its message are the same red. */
  --color-border-error-default:    var(--color-red-500);
  --color-border-checkbox-default: var(--color-neutral-300);
  --color-border-checkbox-hover:   var(--color-neutral-400);
  --color-border-checkbox-active:  var(--color-neutral-400);
  --color-border-checkbox-white:   var(--color-white);
  --color-border-component-detail-container: var(--color-neutral-200);
  --color-border-ai-profile-card:             var(--color-neutral-200);
  --color-border-table:            var(--color-neutral-200);
  --color-border-button-group:     var(--color-neutral-200);
  --color-border-sidebar-profile-hover: var(--color-neutral-300);
  --color-separator-border:        var(--color-neutral-200);
  --color-separator-border-strong: var(--color-neutral-200);
  --color-border-focus-ring:       var(--color-accent-500);

  /* State */
  --color-state-success-text: var(--color-lime-800);
  --color-state-success-base: var(--color-lime-200);

  /* Selected control interiors remain light on colored tracks in both themes. */
  --color-control-indicator-background:        var(--color-white);
  --color-control-indicator-background-subtle: var(--color-neutral-100);
  --color-switch-off-chip-start:                var(--color-white);
  --color-switch-off-chip-end:                  var(--color-neutral-100);
  /* Selected switch chip: the Figma comps use hexes a touch deeper than the
   * plain 500→600 ramp (#2473fe → #0450e2 for blue). Expressed as oklab mixes
   * of neighbouring accent stops so the recipe survives a re-tint. */
  --color-switch-on-chip-start:                 color-mix(in oklab, var(--color-accent-500) 63%, var(--color-accent-600));
  --color-switch-on-chip-end:                   color-mix(in oklab, var(--color-accent-600) 16%, var(--color-accent-700));
  --color-stat-card-icon-background:            var(--color-white);
  --color-segmented-control-background:          var(--color-neutral-100);
  --color-segmented-control-selected-background: var(--color-white);
  --color-theme-toggle-sidebar-background:       var(--color-neutral-200);
  --color-theme-toggle-sidebar-selected-background: var(--color-white);
  /* Stepped against the composer: the pill is white and the add button is the
   * subtle grey sitting on it, so the control separates from the surface it
   * shares an edge with. Dark mode keeps its own pair, where the pill is the
   * lighter of the two and the button steps the other way. */
  --color-ai-chat-composer-add-background:       var(--color-neutral-100);
  --color-ai-chat-composer-add-hover-background: var(--color-neutral-200);
  /* Composer Panel (Figma node 4430:12203): the status tab hanging off the
   * card's top edge and the card's plus button are both neutral-200 in light
   * mode. Dark mode steps them up instead, so they still separate from the
   * neutral-800 card they touch. */
  --color-composer-panel-tab-background:         var(--color-neutral-200);
  --color-composer-panel-add-background:         var(--color-neutral-200);
  --color-composer-panel-add-hover-background:   var(--color-neutral-300);
  /* Attachment tile edge: the Figma neutral-200 in light mode; dark mode
   * uses a translucent white so the ring reads on the neutral-800 card
   * (border/button/default is one neutral step away there and vanishes). */
  --color-composer-panel-tile-border:            var(--color-neutral-200);
  /* Model picker provider rail: background/secondary in light mode, at
   * half opacity in dark so it recedes on the neutral-800 panel. */
  --color-composer-panel-rail-background:        var(--color-neutral-100);
  /* Questionnaire (Figma nodes 4435:14749 / 4435:15042): the answer rows share
   * the card's background/primary surface in both modes, separated by their
   * border alone, and the "Other" row uses the stock Input untouched. The
   * single-select number key is background/secondary in light mode and one
   * tone lighter than the row in dark mode (never darker), stepping again
   * while its row is hovered so it stays legible on the lifted fill. */
  --color-questionnaire-key-background:          var(--color-neutral-100);
  --color-questionnaire-key-hover-background:    var(--color-neutral-200);
  --color-agent-progress-ring:                     var(--color-neutral-700);
  --color-button-ghost-background:                var(--color-accent-100);
  --color-button-ghost-hover:                     var(--color-accent-200);
  --color-button-ghost-active:                    var(--color-accent-300);
  --color-button-ghost-disabled:                  var(--color-accent-50);
  --color-button-ghost-foreground:                var(--color-accent-700);
  --color-button-ghost-disabled-foreground:       var(--color-accent-300);
  --color-dropdown-item-hover-background:        var(--color-neutral-100);
  --color-kbd-background:                        var(--color-neutral-300);
  --color-kbd-foreground:                        var(--color-neutral-500);
  --color-docs-file-chip-background:             var(--color-purple-50);
  --color-docs-file-chip-border:                 var(--color-purple-100);
  --color-docs-file-chip-foreground:             var(--color-purple-500);
  --color-docs-command-accent:                    var(--color-purple-400);
  --color-docs-code-background:                   var(--color-background-primary-default);
  --color-docs-install-rail:                      var(--color-border-button-default);

  /* Recently shipped component badge. Kept semantic so its compact blue
   * surface can retain the same hierarchy in both themes. */
  --color-badge-neutral-background: var(--color-neutral-200);
  --color-team-menu-count-background: var(--color-neutral-200);
  --color-team-menu-count-foreground: var(--color-neutral-500);
  --color-badge-new-background: var(--color-accent-100);
  --color-badge-new-text:       var(--color-accent-600);
  --color-tab-count-selected-background: var(--color-accent-100);
  --color-pill-tab-blue-selected-background: var(--color-accent-50);
  --color-pill-tab-blue-hover-background: var(--color-neutral-100);

  /* Notification status-icon surfaces. */
  --color-notification-information-background: var(--color-blue-100);
  --color-notification-information-foreground: var(--color-blue-600);
  --color-notification-success-background:     var(--color-lime-100);
  --color-notification-success-foreground:     var(--color-lime-600);
  --color-notification-error-background:       var(--color-rose-100);
  --color-notification-error-foreground:       var(--color-rose-600);
  --color-notification-center-background:      var(--color-white);

  /* Table status chips. Dark mappings come from the medical dashboard table
   * in Figma (4139:7202, 4139:7240, 4139:7278, 4139:7315). */
  --color-status-lime-background:   var(--color-lime-200);
  --color-status-lime-text:         var(--color-lime-800);
  --color-status-yellow-background: var(--color-yellow-200);
  --color-status-yellow-text:       var(--color-yellow-800);
  --color-status-rose-background:   var(--color-rose-200);
  --color-status-rose-text:         var(--color-rose-800);
  --color-status-cyan-background:   var(--color-cyan-200);
  --color-status-cyan-text:         var(--color-cyan-800);
  --color-status-orange-background: var(--color-orange-200);
  --color-status-orange-text: var(--color-orange-800);
  --color-status-blue-background:   var(--color-blue-200);
  --color-status-blue-text:         var(--color-blue-800);
  --color-status-purple-background: var(--color-purple-100);
  --color-status-purple-text:       var(--color-purple-600);
  --color-status-dot-green-halo:    var(--color-green-100);
  --color-status-dot-yellow-halo:   var(--color-yellow-200);
  --color-status-dot-indigo-halo:   var(--color-indigo-100);

  /* Date range selection: the connecting band and its start/end caps. */
  --color-date-range-background:      var(--color-accent-100);
  --color-date-range-edge-background: var(--color-accent-300);

  /* Calendar event chips. Title/time stay separate so the original light
   * hierarchy remains intact while dark mode can normalize both to /300. */
  --color-calendar-event-blue-background:    var(--color-blue-100);
  --color-calendar-event-blue-title:         var(--color-blue-700);
  --color-calendar-event-blue-time:          var(--color-blue-700);
  --color-calendar-event-pink-background:    var(--color-pink-100);
  --color-calendar-event-pink-title:         var(--color-pink-700);
  --color-calendar-event-pink-time:          var(--color-pink-700);
  --color-calendar-event-purple-background:  var(--color-purple-100);
  --color-calendar-event-purple-title:       var(--color-purple-700);
  --color-calendar-event-purple-time:        var(--color-purple-700);
  --color-calendar-event-lime-background:    var(--color-lime-100);
  --color-calendar-event-lime-title:         var(--color-lime-800);
  --color-calendar-event-lime-time:          var(--color-lime-700);
  --color-calendar-event-emerald-background: var(--color-emerald-100);
  --color-calendar-event-emerald-title:      var(--color-emerald-800);
  --color-calendar-event-emerald-time:       var(--color-emerald-700);

  /* Placeholder colors that don't map cleanly to existing text tokens */
  --color-text-error-placeholder: var(--color-red-400);

  /* Charts (graphs) — shared neutrals + a categorical accent ramp.
   * \`track\` is the background bar/ring behind a series; \`cursor\` the hover
   * outline / dashed reference line; \`neutral\` a data color for "other"-style
   * slices. Each numbered accent pairs a base fill with a one-tone-darker
   * \`-active\` used for hover emphasis (the 400 → 500 recipe every chart
   * follows). Numbered (not hue-named) so the palette can be retuned without
   * renaming, mirroring the chart-1…n convention common to chart systems. */
  --color-chart-track:    var(--color-neutral-200);
  --color-chart-cursor:   var(--color-neutral-300);
  --color-chart-neutral:  var(--color-neutral-300);
  --color-chart-1:        var(--color-teal-400);
  --color-chart-1-active: var(--color-teal-500);
  --color-chart-2:        var(--color-lime-400);
  --color-chart-2-active: var(--color-lime-500);
  --color-chart-3:        var(--color-pink-400);
  --color-chart-3-active: var(--color-pink-500);
  --color-chart-4:        var(--color-sky-400);
  --color-chart-4-active: var(--color-sky-500);
  --color-chart-5:        var(--color-purple-400);
  --color-chart-5-active: var(--color-purple-500);
  --color-chart-6:        var(--color-blue-400);
  --color-chart-6-active: var(--color-blue-500);
  --color-chart-7:        var(--color-emerald-400);
  --color-chart-7-active: var(--color-emerald-500);
  --color-chart-8:        var(--color-yellow-400);
  --color-chart-8-active: var(--color-yellow-500);
  --color-chart-9:        var(--color-indigo-400);
  --color-chart-9-active: var(--color-indigo-500);
  --color-chart-agents-bar:        var(--color-purple-300);
  --color-chart-agents-bar-active: var(--color-purple-400);

  /* Button gradients */
  --gradient-button-primary-default:  linear-gradient(180deg, var(--color-accent-500)    0%, var(--color-accent-600)    100%);
  --gradient-button-primary-hover:    linear-gradient(180deg, var(--color-accent-400)    0%, var(--color-accent-500)    100%);
  --gradient-button-primary-active:   linear-gradient(180deg, var(--color-accent-600)    0%, var(--color-accent-700)    100%);
  --gradient-button-primary-disabled: linear-gradient(180deg, var(--color-neutral-200) 0%, var(--color-neutral-300) 100%);

  --gradient-button-danger-default:   linear-gradient(180deg, var(--color-red-500) 0%, var(--color-red-600) 100%);
  --gradient-button-danger-hover:     linear-gradient(180deg, var(--color-red-400) 0%, var(--color-red-500) 100%);
  --gradient-button-danger-active:    linear-gradient(180deg, var(--color-red-600) 0%, var(--color-red-700) 100%);
  --gradient-button-danger-disabled:  linear-gradient(180deg, var(--color-red-100) 0%, var(--color-red-200) 100%);
}

.dark {
  /* Foreground */
  --color-foreground-full:            var(--color-neutral-700);
  --color-foreground-icon-primary:    var(--color-neutral-50);
  --color-foreground-icon-hover:      var(--color-white);
  --color-foreground-icon-error:      var(--color-red-400);
  --color-foreground-icon-tertiary:   var(--color-neutral-600);
  --color-foreground-icon-quaternary: var(--color-neutral-700);
  --color-foreground-icon-disabled:   var(--color-neutral-800);
  --color-foreground-disabled:        var(--color-neutral-700);
  --color-foreground-disabled-danger: var(--color-red-400);
  --color-input-disabled-foreground:  var(--color-neutral-600);
  --color-icon-button-disabled-foreground: var(--color-neutral-500);
  --color-button-primary-disabled-foreground: var(--color-neutral-500);

  /* Text */
  --color-text-primary:  var(--color-neutral-50);
  --color-text-tertiary: var(--color-neutral-600);
  --color-text-disabled: var(--color-neutral-800);
  --color-text-error-primary: var(--color-red-400);
  --color-text-destructive: color-mix(in srgb, var(--color-red-500) 80%, var(--color-neutral-500));
  --color-input-disabled-text: color-mix(in srgb, var(--color-neutral-500) 40%, transparent);

  /* Background */
  --color-background-full:              var(--color-neutral-925);
  --color-ticket-detail-surface: var(--color-neutral-925);
  --color-ticket-detail-low-background: color-mix(in srgb, var(--color-indigo-950) 60%, transparent);
  --color-ticket-detail-low-hover: color-mix(in srgb, var(--color-indigo-950) 80%, transparent);
  --color-ticket-detail-medium-hover: color-mix(in srgb, var(--color-yellow-950) 80%, transparent);
  --color-ticket-detail-high-hover: color-mix(in srgb, var(--color-orange-950) 80%, transparent);
  --color-ticket-detail-urgent-hover: color-mix(in srgb, var(--color-rose-950) 80%, transparent);
  --color-ticket-detail-low-text: var(--color-indigo-300);
  --color-ticket-detail-resource-background: color-mix(in srgb, var(--color-blue-950) 60%, transparent);
  --color-ticket-detail-resource-text: var(--color-blue-300);
  --color-project-board-empty-panel: color-mix(in srgb, var(--color-neutral-800) 60%, transparent);
  --color-project-board-empty-front: color-mix(in srgb, var(--color-neutral-800) 75%, var(--color-neutral-700));
  --color-project-board-empty-middle: var(--color-neutral-700);
  --color-project-board-empty-back: color-mix(in srgb, var(--color-neutral-600) 35%, var(--color-neutral-700));
  --color-project-board-empty-detail: var(--color-neutral-500);
  --color-background-primary-default:   var(--color-neutral-800);
  --color-background-inner-default:     color-mix(in srgb, var(--color-neutral-800) 60%, transparent);
  --color-background-primary-hover:     color-mix(in srgb, var(--color-neutral-700) 60%, transparent);
  --color-background-primary-active:    var(--color-neutral-800);
  --color-background-primary-disabled:  var(--color-neutral-800);
  --color-input-disabled-background:    color-mix(in srgb, var(--color-neutral-800) 30%, transparent);
  --color-switch-off-chip-start:        var(--color-background-tertiary-default);
  --color-switch-off-chip-end:          var(--color-background-tertiary-default);
  --color-background-secondary-default: var(--color-neutral-900);
  --color-background-secondary-hover:   var(--color-neutral-800);
  --color-background-tertiary-default:  var(--color-neutral-800);
  --color-background-tertiary-hover:    var(--color-neutral-700);
  --color-background-tertiary-error:    color-mix(in srgb, var(--color-red-950) 60%, transparent);
  --color-background-quaternary-default: var(--color-neutral-700);
  --color-background-quaternary-hover:   var(--color-neutral-600);
  --color-background-recent-hire-role:  color-mix(in srgb, var(--color-neutral-900) 60%, transparent);
  --color-avatar-neutral-background:    var(--color-background-primary-default);
  --color-file-upload-icon-background:  var(--color-neutral-600);
  --color-file-upload-icon-foreground:  var(--color-neutral-400);
  --color-file-upload-icon-foreground-hover: var(--color-neutral-300);
  --color-stat-card-icon-background:    var(--color-neutral-800);
  --color-segmented-control-background:          var(--color-neutral-925);
  --color-segmented-control-selected-background: var(--color-neutral-800);
  --color-theme-toggle-sidebar-background:       var(--color-neutral-800);
  --color-theme-toggle-sidebar-selected-background: var(--color-neutral-700);
  --color-ai-chat-composer-add-background:       var(--color-neutral-700);
  --color-ai-chat-composer-add-hover-background: var(--color-neutral-600);
  --color-composer-panel-tab-background:         color-mix(in srgb, var(--color-neutral-700) 50%, transparent);
  --color-composer-panel-add-background:         var(--color-neutral-700);
  --color-composer-panel-add-hover-background:   var(--color-neutral-600);
  --color-composer-panel-tile-border:            color-mix(in srgb, var(--color-white) 14%, transparent);
  --color-composer-panel-rail-background:        color-mix(in srgb, var(--color-neutral-900) 50%, transparent);
  --color-questionnaire-key-background:          var(--color-neutral-700);
  --color-questionnaire-key-hover-background:    var(--color-neutral-600);
  --color-agent-progress-ring:                     color-mix(in srgb, var(--color-white) 50%, transparent);
  --color-button-ghost-background:                var(--color-accent-900);
  --color-button-ghost-hover:                     var(--color-accent-800);
  --color-button-ghost-active:                    var(--color-accent-700);
  --color-button-ghost-disabled:                  var(--color-neutral-800);
  --color-button-ghost-foreground:                var(--color-accent-300);
  --color-button-ghost-disabled-foreground:       var(--color-neutral-600);
  --color-dropdown-item-hover-background:        color-mix(in srgb, var(--color-neutral-700) 60%, transparent);
  --color-kbd-background:                        var(--color-neutral-700);
  --color-kbd-foreground:                        var(--color-neutral-400);
  --color-docs-file-chip-background:             color-mix(in srgb, var(--color-purple-950) 50%, transparent);
  --color-docs-file-chip-border:                 var(--color-purple-800);
  --color-docs-file-chip-foreground:             var(--color-purple-400);
  --color-docs-code-background:                  var(--color-background-full);
  --color-docs-install-rail:                     color-mix(in srgb, var(--color-neutral-800) 60%, transparent);

  /* Dark surfaces absorb low-alpha shadows more readily than white ones.
   * Preserve the light-mode geometry and raise only the black alpha: tighter
   * contact shadows stay crisp, while higher elevations receive a restrained
   * ambient layer without introducing a grey glow. */
  --shadow-2xs: 0 1px rgb(0 0 0 / 0.16);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.18);
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.12), 0 1px 3px 0 rgb(0 0 0 / 0.16);
  --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.18);
  --shadow-lg: 0 4px 6px -2px rgb(0 0 0 / 0.10), 0 10px 15px -3px rgb(0 0 0 / 0.18);
  --shadow-xl: 0 10px 10px -5px rgb(0 0 0 / 0.08), 0 20px 25px -5px rgb(0 0 0 / 0.20);
  --shadow-card: 0 1px 1px 0 rgb(0 0 0 / 0.14);
  --shadow-dropdown:
    0 1px 1px 0 rgb(0 0 0 / 0.14),
    0 4px 4px 0 rgb(0 0 0 / 0.10);
  --shadow-sidebar:
    0 1px 0 0 rgb(0 0 0 / 0.10),
    0 1px 12px 0 rgb(0 0 0 / 0.16),
    0 0 1px 0 rgb(0 0 0 / 0.42);
  --shadow-waitlist:
    0 0 6px 0 rgb(0 0 0 / 0.12),
    0 0 64px 0 rgb(0 0 0 / 0.22),
    0 0 1px 0 rgb(0 0 0 / 0.42),
    0 1px 12px 0 rgb(0 0 0 / 0.14),
    0 1px 0 0 rgb(0 0 0 / 0.08);

  /* Badges */
  --color-badge-neutral-background: var(--color-neutral-800);
  --color-team-menu-count-background: var(--color-neutral-700);
  --color-team-menu-count-foreground: var(--color-neutral-400);
  --color-badge-new-background: var(--color-accent-950);
  --color-badge-new-text:       var(--color-accent-400);
  --color-tab-count-selected-background: color-mix(in srgb, var(--color-accent-800) 60%, transparent);

  /* Dark status discs use /800 surfaces with /300 foregrounds so the icon
   * remains crisp without reverting to a bright pastel circle. */
  --color-notification-information-background: color-mix(in srgb, var(--color-blue-800) 50%, transparent);
  --color-notification-information-foreground: var(--color-blue-300);
  --color-notification-success-background:     color-mix(in srgb, var(--color-lime-800) 50%, transparent);
  --color-notification-success-foreground:     var(--color-lime-300);
  --color-notification-error-background:       color-mix(in srgb, var(--color-rose-800) 50%, transparent);
  --color-notification-error-foreground:       var(--color-rose-300);
  --color-notification-center-background:      var(--color-neutral-900);

  /* Borders and separators */
  --color-border-button-default:   var(--color-neutral-700);
  --color-border-button-hover:     var(--color-neutral-500);
  --color-border-button-active:    var(--color-neutral-600);
  --color-border-button-white:     var(--color-zinc-800);
  --color-border-error-default:    var(--color-red-400);
  --color-border-checkbox-default: var(--color-neutral-700);
  --color-border-checkbox-hover:   var(--color-neutral-500);
  --color-border-checkbox-active:  var(--color-neutral-500);
  --color-border-component-detail-container: var(--color-neutral-800);
  --color-border-ai-profile-card:             var(--color-neutral-800);
  --color-border-table:            var(--color-neutral-800);
  --color-border-button-group:     color-mix(in srgb, var(--color-neutral-600) 60%, transparent);
  --color-border-sidebar-profile-hover: var(--color-neutral-600);
  --color-separator-border:        var(--color-neutral-800);
  --color-separator-border-strong: color-mix(in srgb, var(--color-neutral-700) 60%, transparent);

  /* Figma's dark table status pairs. */
  --color-status-lime-background:   color-mix(in srgb, var(--color-lime-950) 60%, transparent);
  --color-status-lime-text:         var(--color-lime-500);
  --color-status-yellow-background: color-mix(in srgb, var(--color-yellow-950) 60%, transparent);
  --color-status-yellow-text:       var(--color-yellow-500);
  --color-status-rose-background:   color-mix(in srgb, var(--color-rose-950) 60%, transparent);
  --color-status-rose-text:         var(--color-rose-500);
  --color-status-cyan-background:   color-mix(in srgb, var(--color-cyan-950) 60%, transparent);
  --color-status-cyan-text:         var(--color-cyan-400);
  --color-status-orange-background: color-mix(in srgb, var(--color-orange-950) 60%, transparent);
  --color-status-orange-text: var(--color-orange-500);
  --color-status-blue-background:   color-mix(in srgb, var(--color-blue-950) 60%, transparent);
  --color-status-blue-text:         var(--color-blue-300);
  --color-status-purple-background: color-mix(in srgb, var(--color-purple-900) 50%, transparent);
  --color-status-purple-text:       var(--color-purple-300);
  --color-status-dot-green-halo:    color-mix(in srgb, var(--color-green-800) 40%, transparent);
  --color-status-dot-yellow-halo:   color-mix(in srgb, var(--color-yellow-800) 40%, transparent);
  --color-status-dot-indigo-halo:   color-mix(in srgb, var(--color-indigo-800) 40%, transparent);

  --color-date-range-background:      var(--color-accent-950);
  --color-date-range-edge-background: var(--color-accent-800);

  --color-pill-tab-blue-selected-background: color-mix(in srgb, var(--color-accent-950) 60%, transparent);
  --color-pill-tab-blue-hover-background: var(--color-neutral-800);

  /* Calendar event families share the same dark-mode depth/contrast recipe. */
  --color-calendar-event-blue-background:    var(--color-blue-950);
  --color-calendar-event-blue-title:         var(--color-blue-300);
  --color-calendar-event-blue-time:          var(--color-blue-300);
  --color-calendar-event-pink-background:    var(--color-pink-950);
  --color-calendar-event-pink-title:         var(--color-pink-300);
  --color-calendar-event-pink-time:          var(--color-pink-300);
  --color-calendar-event-purple-background:  var(--color-purple-950);
  --color-calendar-event-purple-title:       var(--color-purple-300);
  --color-calendar-event-purple-time:        var(--color-purple-300);
  --color-calendar-event-lime-background:    var(--color-lime-950);
  --color-calendar-event-lime-title:         var(--color-lime-300);
  --color-calendar-event-lime-time:          var(--color-lime-300);
  --color-calendar-event-emerald-background: var(--color-emerald-950);
  --color-calendar-event-emerald-title:      var(--color-emerald-300);
  --color-calendar-event-emerald-time:       var(--color-emerald-300);

  /* Disabled primary CTA: dark, low-emphasis fill with readable muted text. */
  --gradient-button-primary-disabled: linear-gradient(
    180deg,
    var(--color-neutral-700) 0%,
    var(--color-neutral-800) 100%
  );
  --gradient-button-danger-disabled: linear-gradient(
    180deg,
    var(--color-red-900) 0%,
    var(--color-red-950) 100%
  );

  /* Neutral graph structure; categorical and status colors stay unchanged. */
  --color-chart-track:   var(--color-neutral-800);
  --color-chart-cursor:  var(--color-neutral-700);
  --color-chart-neutral: var(--color-neutral-800);
  --color-chart-agents-bar:        var(--color-purple-500);
  --color-chart-agents-bar-active: var(--color-purple-600);
}

/* Non-default accents (data-accent set by the accent engine) can land on a
 * /950 that glows too loudly against the dark sidebar; halve the NEW badge
 * fill there. Light mode keeps the solid /100 surface. */
.dark[data-accent] {
  --color-badge-new-background: color-mix(in srgb, var(--color-accent-950) 50%, transparent);
}

/* Re-export semantic tokens as Tailwind utilities. The \`inline\` form means
 * Tailwind reads the *current* computed value of the variable, so light↔dark
 * flips work without rebuild. */
@theme inline {
  --color-foreground-full:            var(--color-foreground-full);
  --color-foreground-icon-primary:    var(--color-foreground-icon-primary);
  --color-foreground-icon-hover:      var(--color-foreground-icon-hover);
  --color-foreground-icon-secondary:  var(--color-foreground-icon-secondary);
  --color-foreground-icon-tertiary:   var(--color-foreground-icon-tertiary);
  --color-foreground-icon-quaternary: var(--color-foreground-icon-quaternary);
  --color-foreground-icon-error:      var(--color-foreground-icon-error);
  --color-foreground-icon-disabled:   var(--color-foreground-icon-disabled);
  --color-foreground-disabled:        var(--color-foreground-disabled);
  --color-foreground-disabled-danger: var(--color-foreground-disabled-danger);
  --color-input-disabled-foreground:  var(--color-input-disabled-foreground);
  --color-icon-button-disabled-foreground: var(--color-icon-button-disabled-foreground);
  --color-button-primary-disabled-foreground: var(--color-button-primary-disabled-foreground);

  --color-text-primary:         var(--color-text-primary);
  --color-text-secondary:       var(--color-text-secondary);
  --color-text-tertiary:        var(--color-text-tertiary);
  --color-text-disabled:        var(--color-text-disabled);
  --color-text-disabled-danger: var(--color-text-disabled-danger);
  --color-text-placeholder:     var(--color-text-placeholder);
  --color-text-error-primary:   var(--color-text-error-primary);
  --color-text-destructive: var(--color-text-destructive);
  --color-input-disabled-text:  var(--color-input-disabled-text);
  --color-text-white:           var(--color-text-white);

  --color-background-full:              var(--color-background-full);
  --color-ticket-detail-surface: var(--color-ticket-detail-surface);
  --color-ticket-detail-low-background: var(--color-ticket-detail-low-background);
  --color-ticket-detail-low-hover: var(--color-ticket-detail-low-hover);
  --color-ticket-detail-medium-hover: var(--color-ticket-detail-medium-hover);
  --color-ticket-detail-high-hover: var(--color-ticket-detail-high-hover);
  --color-ticket-detail-urgent-hover: var(--color-ticket-detail-urgent-hover);
  --color-ticket-detail-low-text: var(--color-ticket-detail-low-text);
  --color-ticket-detail-resource-background: var(--color-ticket-detail-resource-background);
  --color-ticket-detail-resource-text: var(--color-ticket-detail-resource-text);
  --color-ticket-detail-favorite: var(--color-ticket-detail-favorite);
  --color-background-primary-default:   var(--color-background-primary-default);
  --color-background-inner-default:     var(--color-background-inner-default);
  --color-background-primary-hover:     var(--color-background-primary-hover);
  --color-background-primary-active:    var(--color-background-primary-active);
  --color-background-primary-disabled:  var(--color-background-primary-disabled);
  --color-input-disabled-background:    var(--color-input-disabled-background);
  --color-background-secondary-default: var(--color-background-secondary-default);
  --color-background-secondary-hover:   var(--color-background-secondary-hover);
  --color-background-tertiary-default:  var(--color-background-tertiary-default);
  --color-background-tertiary-hover:    var(--color-background-tertiary-hover);
  --color-background-tertiary-error:    var(--color-background-tertiary-error);
  --color-background-recent-hire-role:  var(--color-background-recent-hire-role);
  --color-avatar-neutral-background:    var(--color-avatar-neutral-background);
  --color-background-quaternary-default: var(--color-background-quaternary-default);
  --color-background-quaternary-hover:   var(--color-background-quaternary-hover);
  --color-background-quaternary-error:   var(--color-background-quaternary-error);
  --color-file-upload-icon-background:   var(--color-file-upload-icon-background);
  --color-file-upload-icon-foreground:   var(--color-file-upload-icon-foreground);
  --color-file-upload-icon-foreground-hover: var(--color-file-upload-icon-foreground-hover);

  --color-border-button-default:   var(--color-border-button-default);
  --color-border-button-hover:     var(--color-border-button-hover);
  --color-border-button-active:    var(--color-border-button-active);
  --color-border-button-white:     var(--color-border-button-white);
  --color-border-error-default:    var(--color-border-error-default);
  --color-border-checkbox-default: var(--color-border-checkbox-default);
  --color-border-checkbox-hover:   var(--color-border-checkbox-hover);
  --color-border-checkbox-active:  var(--color-border-checkbox-active);
  --color-border-checkbox-white:   var(--color-border-checkbox-white);
  --color-border-component-detail-container: var(--color-border-component-detail-container);
  --color-border-ai-profile-card:             var(--color-border-ai-profile-card);
  --color-border-table:            var(--color-border-table);
  --color-border-button-group:     var(--color-border-button-group);
  --color-border-sidebar-profile-hover: var(--color-border-sidebar-profile-hover);
  --color-separator-border:        var(--color-separator-border);
  --color-separator-border-strong: var(--color-separator-border-strong);
  --color-border-focus-ring:       var(--color-border-focus-ring);

  --color-state-success-text: var(--color-state-success-text);
  --color-state-success-base: var(--color-state-success-base);
  --color-control-indicator-background:        var(--color-control-indicator-background);
  --color-control-indicator-background-subtle: var(--color-control-indicator-background-subtle);
  --color-switch-off-chip-start:                var(--color-switch-off-chip-start);
  --color-switch-off-chip-end:                  var(--color-switch-off-chip-end);
  --color-switch-on-chip-start:                 var(--color-switch-on-chip-start);
  --color-switch-on-chip-end:                   var(--color-switch-on-chip-end);
  --color-stat-card-icon-background:            var(--color-stat-card-icon-background);
  --color-segmented-control-background:          var(--color-segmented-control-background);
  --color-segmented-control-selected-background: var(--color-segmented-control-selected-background);
  --color-theme-toggle-sidebar-background:       var(--color-theme-toggle-sidebar-background);
  --color-theme-toggle-sidebar-selected-background: var(--color-theme-toggle-sidebar-selected-background);
  --color-ai-chat-composer-add-background:       var(--color-ai-chat-composer-add-background);
  --color-ai-chat-composer-add-hover-background: var(--color-ai-chat-composer-add-hover-background);
  --color-composer-panel-tab-background:         var(--color-composer-panel-tab-background);
  --color-composer-panel-add-background:         var(--color-composer-panel-add-background);
  --color-composer-panel-add-hover-background:   var(--color-composer-panel-add-hover-background);
  --color-composer-panel-tile-border:            var(--color-composer-panel-tile-border);
  --color-composer-panel-rail-background:        var(--color-composer-panel-rail-background);
  --color-questionnaire-key-background:          var(--color-questionnaire-key-background);
  --color-questionnaire-key-hover-background:    var(--color-questionnaire-key-hover-background);
  --color-agent-progress-ring:                     var(--color-agent-progress-ring);
  --color-button-ghost-background:                var(--color-button-ghost-background);
  --color-button-ghost-hover:                     var(--color-button-ghost-hover);
  --color-button-ghost-active:                    var(--color-button-ghost-active);
  --color-button-ghost-disabled:                  var(--color-button-ghost-disabled);
  --color-button-ghost-foreground:                var(--color-button-ghost-foreground);
  --color-button-ghost-disabled-foreground:       var(--color-button-ghost-disabled-foreground);
  --color-dropdown-item-hover-background:        var(--color-dropdown-item-hover-background);
  --color-kbd-background:                        var(--color-kbd-background);
  --color-kbd-foreground:                        var(--color-kbd-foreground);
  --color-docs-file-chip-background:             var(--color-docs-file-chip-background);
  --color-docs-file-chip-border:                 var(--color-docs-file-chip-border);
  --color-docs-file-chip-foreground:             var(--color-docs-file-chip-foreground);
  --color-docs-command-accent:                    var(--color-docs-command-accent);
  --color-docs-code-background:                   var(--color-docs-code-background);
  --color-docs-install-rail:                      var(--color-docs-install-rail);
  --color-badge-neutral-background: var(--color-badge-neutral-background);
  --color-team-menu-count-background: var(--color-team-menu-count-background);
  --color-team-menu-count-foreground: var(--color-team-menu-count-foreground);
  --color-badge-new-background: var(--color-badge-new-background);
  --color-badge-new-text:       var(--color-badge-new-text);
  --color-tab-count-selected-background: var(--color-tab-count-selected-background);
  --color-pill-tab-blue-selected-background: var(--color-pill-tab-blue-selected-background);
  --color-pill-tab-blue-hover-background: var(--color-pill-tab-blue-hover-background);
  --color-notification-information-background: var(--color-notification-information-background);
  --color-notification-information-foreground: var(--color-notification-information-foreground);
  --color-notification-success-background:     var(--color-notification-success-background);
  --color-notification-success-foreground:     var(--color-notification-success-foreground);
  --color-notification-error-background:       var(--color-notification-error-background);
  --color-notification-error-foreground:       var(--color-notification-error-foreground);
  --color-notification-center-background:      var(--color-notification-center-background);
  --color-status-lime-background:   var(--color-status-lime-background);
  --color-status-lime-text:         var(--color-status-lime-text);
  --color-status-yellow-background: var(--color-status-yellow-background);
  --color-status-yellow-text:       var(--color-status-yellow-text);
  --color-status-rose-background:   var(--color-status-rose-background);
  --color-status-rose-text:         var(--color-status-rose-text);
  --color-status-cyan-background:   var(--color-status-cyan-background);
  --color-status-cyan-text:         var(--color-status-cyan-text);
  --color-status-orange-background: var(--color-status-orange-background);
  --color-status-orange-text: var(--color-status-orange-text);
  --color-status-blue-background:   var(--color-status-blue-background);
  --color-status-blue-text:         var(--color-status-blue-text);
  --color-status-purple-background: var(--color-status-purple-background);
  --color-status-purple-text:       var(--color-status-purple-text);
  --color-status-dot-green-halo:    var(--color-status-dot-green-halo);
  --color-status-dot-yellow-halo:   var(--color-status-dot-yellow-halo);
  --color-status-dot-indigo-halo:   var(--color-status-dot-indigo-halo);
  --color-date-range-background:      var(--color-date-range-background);
  --color-date-range-edge-background: var(--color-date-range-edge-background);
  --color-calendar-event-blue-background:    var(--color-calendar-event-blue-background);
  --color-calendar-event-blue-title:         var(--color-calendar-event-blue-title);
  --color-calendar-event-blue-time:          var(--color-calendar-event-blue-time);
  --color-calendar-event-pink-background:    var(--color-calendar-event-pink-background);
  --color-calendar-event-pink-title:         var(--color-calendar-event-pink-title);
  --color-calendar-event-pink-time:          var(--color-calendar-event-pink-time);
  --color-calendar-event-purple-background:  var(--color-calendar-event-purple-background);
  --color-calendar-event-purple-title:       var(--color-calendar-event-purple-title);
  --color-calendar-event-purple-time:        var(--color-calendar-event-purple-time);
  --color-calendar-event-lime-background:    var(--color-calendar-event-lime-background);
  --color-calendar-event-lime-title:         var(--color-calendar-event-lime-title);
  --color-calendar-event-lime-time:          var(--color-calendar-event-lime-time);
  --color-calendar-event-emerald-background: var(--color-calendar-event-emerald-background);
  --color-calendar-event-emerald-title:      var(--color-calendar-event-emerald-title);
  --color-calendar-event-emerald-time:       var(--color-calendar-event-emerald-time);

  --color-text-error-placeholder: var(--color-text-error-placeholder);

  --color-chart-track:    var(--color-chart-track);
  --color-chart-cursor:   var(--color-chart-cursor);
  --color-chart-neutral:  var(--color-chart-neutral);
  --color-chart-1:        var(--color-chart-1);
  --color-chart-1-active: var(--color-chart-1-active);
  --color-chart-2:        var(--color-chart-2);
  --color-chart-2-active: var(--color-chart-2-active);
  --color-chart-3:        var(--color-chart-3);
  --color-chart-3-active: var(--color-chart-3-active);
  --color-chart-4:        var(--color-chart-4);
  --color-chart-4-active: var(--color-chart-4-active);
  --color-chart-5:        var(--color-chart-5);
  --color-chart-5-active: var(--color-chart-5-active);
  --color-chart-6:        var(--color-chart-6);
  --color-chart-6-active: var(--color-chart-6-active);
  --color-chart-7:        var(--color-chart-7);
  --color-chart-7-active: var(--color-chart-7-active);
  --color-chart-8:        var(--color-chart-8);
  --color-chart-8-active: var(--color-chart-8-active);
  --color-chart-9:        var(--color-chart-9);
  --color-chart-9-active: var(--color-chart-9-active);
  --color-chart-agents-bar:        var(--color-chart-agents-bar);
  --color-chart-agents-bar-active: var(--color-chart-agents-bar-active);
}

/* ---------------------------------------------------------------------------
 * Component utilities — Buttons
 *
 * Each variant collapses the four interactive states (default / hover / active
 * / disabled) into a single class. Use them on the component:
 *
 *   <button class="bg-button-primary">…</button>
 *   <button class="bg-button-danger">…</button>
 *
 * Smooth default→hover transition trick:
 *   CSS can't interpolate \`background-image\`, so swapping gradients on :hover
 *   would snap. Instead we keep the *default* gradient on the element and
 *   layer the *hover* gradient on a \`::before\` pseudo-element whose opacity
 *   fades 0→1 over \`--button-transition-ms\`. Active/disabled gradients still
 *   swap instantly (we hide the pseudo to reveal them).
 *
 * Stacking: \`isolation: isolate\` keeps the pseudo behind the button's text
 * and icons (z-index -1) while staying above the element's own background.
 * \`border-radius: inherit\` + \`overflow: hidden\` keeps it within the rounded
 * corners.
 * --------------------------------------------------------------------------- */
@theme {
  --button-transition-ms: 150ms;
  --input-transition-ms:  150ms;
}

/* Keep color feedback quick while the physical press motion remains soft.
 * The transform uses a shorter duration on press and the slower duration only
 * when returning to rest, so hover styles never inherit the 700ms timing. */
@utility button-press-motion {
  transition:
    background-color var(--button-transition-ms) ease,
    border-color var(--button-transition-ms) ease,
    box-shadow var(--button-transition-ms) ease,
    color var(--button-transition-ms) ease,
    transform 420ms cubic-bezier(0.4, 0, 0.2, 1);

  &:active:not(:disabled):not([aria-disabled="true"]) {
    transform: scale(0.98);
    transition-duration: 150ms, 150ms, 150ms, 150ms, 220ms;
  }

  &:disabled,
  &[aria-disabled="true"] {
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
}

@utility bg-button-primary {
  position: relative;
  isolation: isolate;
  background-image: var(--gradient-button-primary-default);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background-image: var(--gradient-button-primary-hover);
    opacity: 0;
    transition: opacity var(--button-transition-ms) ease;
  }
  &:hover:not(:disabled):not([aria-disabled="true"])::before {
    opacity: 1;
  }
  &:active:not(:disabled):not([aria-disabled="true"]) {
    background-image: var(--gradient-button-primary-active);
  }
  &:active:not(:disabled):not([aria-disabled="true"])::before {
    opacity: 0;
  }
  &:disabled,
  &[aria-disabled="true"] {
    background-image: var(--gradient-button-primary-disabled);
  }
  &:disabled::before,
  &[aria-disabled="true"]::before {
    display: none;
  }
}

@utility bg-button-danger {
  position: relative;
  isolation: isolate;
  background-image: var(--gradient-button-danger-default);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background-image: var(--gradient-button-danger-hover);
    opacity: 0;
    transition: opacity var(--button-transition-ms) ease;
  }
  &:hover:not(:disabled):not([aria-disabled="true"])::before {
    opacity: 1;
  }
  &:active:not(:disabled):not([aria-disabled="true"]) {
    background-image: var(--gradient-button-danger-active);
  }
  &:active:not(:disabled):not([aria-disabled="true"])::before {
    opacity: 0;
  }
  &:disabled,
  &[aria-disabled="true"] {
    background-image: var(--gradient-button-danger-disabled);
  }
  &:disabled::before,
  &[aria-disabled="true"]::before {
    display: none;
  }
}
`;

export const TYPOGRAPHY_CSS = `/* ---------------------------------------------------------------------------
 * BoardUI typography
 *
 * Type ramp from Figma → text styles. Each style registers a Tailwind v4
 * text utility — \`text-{name}\` applies font-size + line-height + letter-spacing
 * + font-weight in one go.
 *
 * Family: Inter for the whole ramp. (The Figma export marks Large Title /
 * Regular as "Inter Display"; we map everything to Inter for consistency since
 * Inter ships a variable optical-size axis. Flag if a true Inter Display load
 * is needed.)
 *
 * Weight mapping (mirrors Figma variables — font/weight/*):
 *   Regular   = 400
 *   Medium    = 500
 *   Semibold  = 600  (Figma variable font/weight/semibold = 600)
 *   Bold      = 700
 *
 * Naming: \`<family>-<weight>\` in lowercase kebab — e.g. \`text-body-medium\`,
 * \`text-title-1-semibold\`, \`text-caption-2-bold\`.
 * --------------------------------------------------------------------------- */

@theme {
  /* ===== Large Title — 64 / 80 ============================================= */
  --text-large-title-regular: 4rem;
  --text-large-title-regular--line-height: 5rem;
  --text-large-title-regular--letter-spacing: 0;
  --text-large-title-regular--font-weight: 400;
  --text-large-title-medium: 4rem;
  --text-large-title-medium--line-height: 5rem;
  --text-large-title-medium--letter-spacing: 0;
  --text-large-title-medium--font-weight: 500;
  --text-large-title-semibold: 4rem;
  --text-large-title-semibold--line-height: 5rem;
  --text-large-title-semibold--letter-spacing: 0;
  --text-large-title-semibold--font-weight: 600;
  --text-large-title-bold: 4rem;
  --text-large-title-bold--line-height: 5rem;
  --text-large-title-bold--letter-spacing: 0;
  --text-large-title-bold--font-weight: 700;

  /* ===== Display 1 — 56 / 72 =============================================== */
  --text-display-1-regular: 3.5rem;
  --text-display-1-regular--line-height: 4.5rem;
  --text-display-1-regular--letter-spacing: 0;
  --text-display-1-regular--font-weight: 400;
  --text-display-1-medium: 3.5rem;
  --text-display-1-medium--line-height: 4.5rem;
  --text-display-1-medium--letter-spacing: 0;
  --text-display-1-medium--font-weight: 500;
  --text-display-1-semibold: 3.5rem;
  --text-display-1-semibold--line-height: 4.5rem;
  --text-display-1-semibold--letter-spacing: 0;
  --text-display-1-semibold--font-weight: 600;
  --text-display-1-bold: 3.5rem;
  --text-display-1-bold--line-height: 4.5rem;
  --text-display-1-bold--letter-spacing: 0;
  --text-display-1-bold--font-weight: 700;

  /* ===== Display 2 — 48 / 64 =============================================== */
  --text-display-2-regular: 3rem;
  --text-display-2-regular--line-height: 4rem;
  --text-display-2-regular--letter-spacing: 0;
  --text-display-2-regular--font-weight: 400;
  --text-display-2-medium: 3rem;
  --text-display-2-medium--line-height: 4rem;
  --text-display-2-medium--letter-spacing: 0;
  --text-display-2-medium--font-weight: 500;
  --text-display-2-semibold: 3rem;
  --text-display-2-semibold--line-height: 4rem;
  --text-display-2-semibold--letter-spacing: 0;
  --text-display-2-semibold--font-weight: 600;
  --text-display-2-bold: 3rem;
  --text-display-2-bold--line-height: 4rem;
  --text-display-2-bold--letter-spacing: 0;
  --text-display-2-bold--font-weight: 700;

  /* ===== Display 3 — 40 / 54 =============================================== */
  --text-display-3-regular: 2.5rem;
  --text-display-3-regular--line-height: 3.375rem;
  --text-display-3-regular--letter-spacing: 0;
  --text-display-3-regular--font-weight: 400;
  --text-display-3-medium: 2.5rem;
  --text-display-3-medium--line-height: 3.375rem;
  --text-display-3-medium--letter-spacing: 0;
  --text-display-3-medium--font-weight: 500;
  --text-display-3-semibold: 2.5rem;
  --text-display-3-semibold--line-height: 3.375rem;
  --text-display-3-semibold--letter-spacing: 0;
  --text-display-3-semibold--font-weight: 600;
  --text-display-3-bold: 2.5rem;
  --text-display-3-bold--line-height: 3.375rem;
  --text-display-3-bold--letter-spacing: 0;
  --text-display-3-bold--font-weight: 700;

  /* ===== Display 4 — 32 / 44 =============================================== */
  --text-display-4-regular: 2rem;
  --text-display-4-regular--line-height: 2.75rem;
  --text-display-4-regular--letter-spacing: 0;
  --text-display-4-regular--font-weight: 400;
  --text-display-4-medium: 2rem;
  --text-display-4-medium--line-height: 2.75rem;
  --text-display-4-medium--letter-spacing: 0;
  --text-display-4-medium--font-weight: 500;
  --text-display-4-semibold: 2rem;
  --text-display-4-semibold--line-height: 2.75rem;
  --text-display-4-semibold--letter-spacing: 0;
  --text-display-4-semibold--font-weight: 600;
  --text-display-4-bold: 2rem;
  --text-display-4-bold--line-height: 2.75rem;
  --text-display-4-bold--letter-spacing: 0;
  --text-display-4-bold--font-weight: 700;

  /* ===== Title 1 — 24 / 34 ================================================= */
  --text-title-1-regular: 1.5rem;
  --text-title-1-regular--line-height: 2.125rem;
  --text-title-1-regular--letter-spacing: 0;
  --text-title-1-regular--font-weight: 400;
  --text-title-1-medium: 1.5rem;
  --text-title-1-medium--line-height: 2.125rem;
  --text-title-1-medium--letter-spacing: 0;
  --text-title-1-medium--font-weight: 500;
  --text-title-1-semibold: 1.5rem;
  --text-title-1-semibold--line-height: 2.125rem;
  --text-title-1-semibold--letter-spacing: 0;
  --text-title-1-semibold--font-weight: 600;
  --text-title-1-bold: 1.5rem;
  --text-title-1-bold--line-height: 2.125rem;
  --text-title-1-bold--letter-spacing: 0;
  --text-title-1-bold--font-weight: 700;

  /* ===== Title 2 — 20 / 26 ================================================= */
  --text-title-2-regular: 1.25rem;
  --text-title-2-regular--line-height: 1.625rem;
  --text-title-2-regular--letter-spacing: 0;
  --text-title-2-regular--font-weight: 400;
  --text-title-2-medium: 1.25rem;
  --text-title-2-medium--line-height: 1.625rem;
  --text-title-2-medium--letter-spacing: 0;
  --text-title-2-medium--font-weight: 500;
  --text-title-2-semibold: 1.25rem;
  --text-title-2-semibold--line-height: 1.625rem;
  --text-title-2-semibold--letter-spacing: 0;
  --text-title-2-semibold--font-weight: 600;
  --text-title-2-bold: 1.25rem;
  --text-title-2-bold--line-height: 1.625rem;
  --text-title-2-bold--letter-spacing: 0;
  --text-title-2-bold--font-weight: 700;

  /* ===== Title 3 — 18 / 24-26 ============================================== */
  --text-title-3-regular: 1.125rem;
  --text-title-3-regular--line-height: 1.5rem;     /* 24 per Figma */
  --text-title-3-regular--letter-spacing: 0;
  --text-title-3-regular--font-weight: 400;
  --text-title-3-medium: 1.125rem;
  --text-title-3-medium--line-height: 1.625rem;    /* 26 per Figma */
  --text-title-3-medium--letter-spacing: 0;
  --text-title-3-medium--font-weight: 500;
  --text-title-3-semibold: 1.125rem;
  --text-title-3-semibold--line-height: 1.625rem;
  --text-title-3-semibold--letter-spacing: 0;
  --text-title-3-semibold--font-weight: 600;
  --text-title-3-bold: 1.125rem;
  --text-title-3-bold--line-height: 1.625rem;
  --text-title-3-bold--letter-spacing: 0;
  --text-title-3-bold--font-weight: 700;

  /* ===== Headline — 16 / 22 ================================================ */
  --text-headline-regular: 1rem;
  --text-headline-regular--line-height: 1.375rem;
  --text-headline-regular--letter-spacing: 0;
  --text-headline-regular--font-weight: 400;
  --text-headline-medium: 1rem;
  --text-headline-medium--line-height: 1.375rem;
  --text-headline-medium--letter-spacing: 0;
  --text-headline-medium--font-weight: 500;
  --text-headline-semibold: 1rem;
  --text-headline-semibold--line-height: 1.375rem;
  --text-headline-semibold--letter-spacing: 0;
  --text-headline-semibold--font-weight: 600;
  --text-headline-bold: 1rem;
  --text-headline-bold--line-height: 1.375rem;
  --text-headline-bold--letter-spacing: 0;
  --text-headline-bold--font-weight: 700;

  /* ===== Body — 14 / 20 ==================================================== */
  --text-body-regular: 0.875rem;
  --text-body-regular--line-height: 1.25rem;
  --text-body-regular--letter-spacing: 0;
  --text-body-regular--font-weight: 400;
  --text-body-medium: 0.875rem;
  --text-body-medium--line-height: 1.25rem;
  --text-body-medium--letter-spacing: 0;
  --text-body-medium--font-weight: 500;
  --text-body-semibold: 0.875rem;
  --text-body-semibold--line-height: 1.25rem;
  --text-body-semibold--letter-spacing: 0;
  --text-body-semibold--font-weight: 600;
  --text-body-bold: 0.875rem;
  --text-body-bold--line-height: 1.25rem;
  --text-body-bold--letter-spacing: 0;
  --text-body-bold--font-weight: 700;

  /* ===== Body 2 — 13 / 18 ================================================== */
  --text-body-2-regular: 0.8125rem;
  --text-body-2-regular--line-height: 1.125rem;
  --text-body-2-regular--letter-spacing: 0;
  --text-body-2-regular--font-weight: 400;
  --text-body-2-medium: 0.8125rem;
  --text-body-2-medium--line-height: 1.125rem;
  --text-body-2-medium--letter-spacing: 0;
  --text-body-2-medium--font-weight: 500;
  --text-body-2-semibold: 0.8125rem;
  --text-body-2-semibold--line-height: 1.125rem;
  --text-body-2-semibold--letter-spacing: 0;
  --text-body-2-semibold--font-weight: 600;
  --text-body-2-bold: 0.8125rem;
  --text-body-2-bold--line-height: 1.125rem;
  --text-body-2-bold--letter-spacing: 0;
  --text-body-2-bold--font-weight: 700;

  /* ===== Caption 1 — 12 / 16 (tracking 0.15) =============================== */
  --text-caption-1-regular: 0.75rem;
  --text-caption-1-regular--line-height: 1rem;
  --text-caption-1-regular--letter-spacing: 0.15px;
  --text-caption-1-regular--font-weight: 400;
  --text-caption-1-medium: 0.75rem;
  --text-caption-1-medium--line-height: 1rem;
  --text-caption-1-medium--letter-spacing: 0.15px;
  --text-caption-1-medium--font-weight: 500;
  --text-caption-1-semibold: 0.75rem;
  --text-caption-1-semibold--line-height: 1rem;
  --text-caption-1-semibold--letter-spacing: 0.15px;
  --text-caption-1-semibold--font-weight: 600;
  --text-caption-1-bold: 0.75rem;
  --text-caption-1-bold--line-height: 1rem;
  --text-caption-1-bold--letter-spacing: 0.15px;
  --text-caption-1-bold--font-weight: 700;

  /* ===== Caption 2 — 11 / 15 (tracking 0.2) ================================ */
  --text-caption-2-regular: 0.6875rem;
  --text-caption-2-regular--line-height: 0.9375rem;
  --text-caption-2-regular--letter-spacing: 0.2px;
  --text-caption-2-regular--font-weight: 400;
  --text-caption-2-medium: 0.6875rem;
  --text-caption-2-medium--line-height: 0.9375rem;
  --text-caption-2-medium--letter-spacing: 0.2px;
  --text-caption-2-medium--font-weight: 500;
  --text-caption-2-semibold: 0.6875rem;
  --text-caption-2-semibold--line-height: 0.9375rem;
  --text-caption-2-semibold--letter-spacing: 0.2px;
  --text-caption-2-semibold--font-weight: 600;
  --text-caption-2-bold: 0.6875rem;
  --text-caption-2-bold--line-height: 0.9375rem;
  --text-caption-2-bold--letter-spacing: 0.2px;
  --text-caption-2-bold--font-weight: 700;
}
`;

export const GLOBALS_CSS = `@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";

/* ---------------------------------------------------------------------------
 * Dark mode strategy
 *
 * We use a class-based dark variant. Toggle dark mode by adding the \`.dark\`
 * class to <html> (a theme provider like \`next-themes\` can do this later).
 *
 *   <html class="dark">  →  every \`dark:*\` utility activates
 *
 * Components should NOT use \`dark:\` prefixes directly. Instead they reference
 * semantic color tokens (e.g. \`bg-bg-primary\`, \`text-text-primary\`) that flip
 * under \`.dark\` in styles/theme.css.
 * --------------------------------------------------------------------------- */
@custom-variant dark (&:where(.dark, .dark *));

/* Resolve the nearest direction boundary, including nested LTR regions.
 * Tailwind's ancestor-based defaults also match inside an opposing region. */
@custom-variant rtl (&:dir(rtl));
@custom-variant ltr (&:dir(ltr));

/* The next theme is revealed by ThemeToggle from the exact interaction point.
 * Native view-transition crossfades are disabled so only the soft circular
 * clip-path animation runs; unsupported browsers simply ignore these rules. */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

@keyframes ai-chat-text-shimmer {
  from {
    background-position: 200% center;
  }

  to {
    background-position: -100% center;
  }
}

.agent-progress-loading-text {
  color: transparent;
  background-image: linear-gradient(
    100deg,
    var(--color-text-secondary) 16%,
    var(--color-text-secondary) 38%,
    var(--color-text-primary) 50%,
    var(--color-text-secondary) 62%,
    var(--color-text-secondary) 84%
  );
  background-position: 200% center;
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ai-chat-text-shimmer 3.4s linear infinite;
  will-change: background-position;
}

@media (prefers-reduced-motion: reduce) {
  .agent-progress-loading-text {
    color: var(--color-text-secondary);
    background-image: none;
    animation: none;
  }
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2;
}

/* Components often have their own hover/focus color transitions. Freeze them
 * while the browser captures the next theme so the expanding circle contains
 * the fully resolved new palette instead of a frame that is still fading from
 * the old one. This is what makes the click-origin reveal read clearly. */
.theme-transitioning,
.theme-transitioning * {
  transition: none !important;
}

/* Reset + base */
html,
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-variant-ligatures: contextual;
  font-kerning: normal;
}

html {
  color-scheme: light;
  background-color: var(--color-background-full);
}
html.dark {
  color-scheme: dark;
}
body {
  background-color: var(--color-background-full);
  color: var(--color-text-primary);
}

/* Theme-aware monochrome BoardUI mark. Both images keep their intrinsic
 * dimensions while the root theme class decides which one participates in
 * layout, avoiding a light-logo flash during hydration. */
.theme-logo-dark,
.theme-asset-dark {
  display: none;
}
.dark .theme-logo-light,
.dark .theme-asset-light {
  display: none;
}
.dark .theme-logo-dark,
.dark .theme-asset-dark {
  display: block;
}

/* Tailwind expands shadow utilities into \`--tw-shadow\` at build time. Point
 * those generated utilities back to the live dark elevation tokens so the
 * class-based theme can adjust opacity without component-level overrides. */
.dark .shadow-2xs {
  --tw-shadow: var(--shadow-2xs);
}
.dark .shadow-xs {
  --tw-shadow: var(--shadow-xs);
}
.dark .shadow-sm {
  --tw-shadow: var(--shadow-sm);
}
.dark .shadow-md {
  --tw-shadow: var(--shadow-md);
}
.dark .shadow-lg {
  --tw-shadow: var(--shadow-lg);
}
.dark .shadow-xl {
  --tw-shadow: var(--shadow-xl);
}
.dark .shadow-card {
  --tw-shadow: var(--shadow-card);
}
.dark .shadow-dropdown {
  --tw-shadow: var(--shadow-dropdown);
}
.dark .shadow-sidebar {
  --tw-shadow: var(--shadow-sidebar);
}
.dark .shadow-waitlist {
  --tw-shadow: var(--shadow-waitlist);
}

/* Hide default expand arrow on Safari */
details summary::-webkit-details-marker {
  display: none;
}

/* Hide default number-input spinners */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Hide default search clear button */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

/* iOS Safari auto-zooms the page when a focused form field's font-size is
 * under 16px — our text-body-regular/medium tokens are 14px by design, so
 * bump just the font-size (not the whole token) on small screens instead of
 * changing the design system's type scale. */
@media (max-width: 639px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
}

/* Soft fade applied to an animated number each time its target changes */
@keyframes number-fade {
  from {
    opacity: 0.35;
  }
  to {
    opacity: 1;
  }
}
.animate-number-fade {
  animation: number-fade 220ms ease-out;
}

/* Recharts' accessibility layer makes the chart surface and its shapes
 * (bars, sectors, dots) keyboard-focusable, and Chrome paints the UA focus
 * outline around whichever one you click - a blue box around a ring segment
 * or a bar. Every chart card drives its own focus feedback (hover darkening,
 * headline swap), so the outline is noise: hide it across every Recharts
 * chart. Keyboard users still get the cards' own active states. */
.recharts-wrapper {
  /* SVG axes use physical coordinates. Keep their data and numeric labels in
   * order while card headers, legends and surrounding controls follow RTL. */
  direction: ltr;
}

.recharts-wrapper:focus,
.recharts-wrapper:focus-visible,
.recharts-wrapper :focus,
.recharts-wrapper :focus-visible {
  outline: none;
}

/* Liquid glass (landing nav + hero) — the rim light.
 *
 * A fixed conic gradient standing in for a bevel lit from a single direction:
 * bright along the top edge where the light source is, dark down both sides
 * where the glass turns away, and a weaker bounce along the bottom. It does
 * not rotate — a travelling highlight reads as an animation playing on the
 * control, where a real edge just sits there catching the room.
 *
 * Achromatic on purpose: highlights are white, shading is black, nothing in
 * between carries a hue.
 *
 * The two-layer mask (padding-box XOR full box) keeps only the 1.5px ring,
 * letting the gradient paint the stroke without covering the glass. */

.landing-glass-stroke {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  /* Every value here is set inline by \`LiquidGlassSurface\` from the shared
   * glass config; the fallbacks are only for a bare use of the class. */
  padding: var(--lg-rim-width, 1.5px);
  background: conic-gradient(
    from var(--lg-rim-angle, 0deg),
    var(--lg-rim-hi, rgb(255 255 255 / 0.9)) 0deg,
    var(--lg-rim-sh, rgb(0 0 0 / 0.14)) 70deg,
    var(--lg-rim-dim, rgb(255 255 255 / 0.1)) 140deg,
    var(--lg-rim-bounce, rgb(255 255 255 / 0.55)) 180deg,
    var(--lg-rim-dim, rgb(255 255 255 / 0.1)) 220deg,
    var(--lg-rim-sh, rgb(0 0 0 / 0.14)) 290deg,
    var(--lg-rim-hi, rgb(255 255 255 / 0.9)) 360deg
  );
  /* Shorthands first, composites last: \`-webkit-mask\` aliases \`mask\` in
   * Chromium, so a shorthand placed after a composite silently resets it to
   * \`add\` — and an un-composited mask paints the full conic wash over the
   * button instead of a ring. */
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: var(--lg-rim-o, 1);
  transition: opacity var(--lg-ms, 200ms) ease;
}

/* Liquid glass hover.
 *
 * Resting and hover values arrive together as inline custom properties, and
 * the swap happens here in CSS rather than in React state — hover then costs
 * a style recalculation instead of a re-render of everything inside the glass.
 * \`.lg-hover\` is the opt-in: a surface without it keeps its resting value. */
.lg-tint {
  background-color: var(--lg-tint, transparent);
  transition: background-color var(--lg-ms, 200ms) ease;
}

.lg-sheen {
  opacity: var(--lg-sheen, 0.5);
  transition: opacity var(--lg-ms, 200ms) ease;
}

.lg-host {
  box-shadow: var(--lg-shadow, none);
  transition:
    box-shadow var(--lg-ms, 200ms) ease,
    transform var(--lg-ms, 200ms) ease;
}

.lg-host:hover {
  box-shadow: var(--lg-shadow-hover, var(--lg-shadow, none));
  transform: translateY(var(--lg-lift, 0px)) scale(var(--lg-scale, 1));
}

.group:hover .lg-tint.lg-hover {
  background-color: var(--lg-tint-hover, var(--lg-tint, transparent));
}

.group:hover .lg-sheen.lg-hover {
  opacity: var(--lg-sheen-hover, var(--lg-sheen, 0.5));
}

.group:hover .landing-glass-stroke.lg-hover {
  opacity: var(--lg-rim-o-hover, var(--lg-rim-o, 1));
}

@media (prefers-reduced-motion: reduce) {
  .lg-tint,
  .lg-sheen,
  .lg-host,
  .landing-glass-stroke {
    transition: none;
  }

  .lg-host:hover {
    transform: none;
  }
}

/* Split-flap ("Solari" board) digit, used by the image-generation countdown.
 * Two leaves hinged on the card's centre seam:
 *   flap-fall  the outgoing digit's TOP half swings down over the incoming
 *              bottom half. Eased IN, because a real flap is falling under
 *              gravity — it accelerates — and it darkens as it tips away
 *              from the light.
 *   flap-rise  the incoming digit's BOTTOM half swings up from edge-on,
 *              starting exactly when the fall lands (delay = fall duration,
 *              \`both\` so it waits at 90deg instead of flashing flat). The
 *              small overshoot past 0deg is the slap against the stop —
 *              that bounce is what makes it read mechanical rather than
 *              like a plain rotation. */
@keyframes flap-fall {
  from {
    transform: rotateX(0deg);
    filter: brightness(1);
  }
  to {
    transform: rotateX(-90deg);
    filter: brightness(0.86);
  }
}
@keyframes flap-rise {
  0% {
    transform: rotateX(90deg);
    filter: brightness(0.86);
  }
  70% {
    transform: rotateX(-9deg);
  }
  86% {
    transform: rotateX(4deg);
  }
  100% {
    transform: rotateX(0deg);
    filter: brightness(1);
  }
}
.animate-flap-fall {
  transform-origin: bottom center;
  backface-visibility: hidden;
  animation: flap-fall 150ms cubic-bezier(0.55, 0, 0.9, 0.35) forwards;
}
.animate-flap-rise {
  transform-origin: top center;
  backface-visibility: hidden;
  animation: flap-rise 230ms cubic-bezier(0.25, 0.7, 0.35, 1) 150ms both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-flap-fall,
  .animate-flap-rise {
    animation-duration: 1ms;
    animation-delay: 0ms;
  }
}

/* New-row entrance for the Storage settings table. Three coordinated
 * pieces (wrapper pairs with \`grid grid-rows-[1fr]\` + an overflow-hidden
 * middle layer, content carries the slide):
 *   row-grow-in   wrapper's grid track 0fr → 1fr — pushes the rows below
 *                 down smoothly.
 *   row-slide-in  content translates -100% → 0 with the SAME duration and
 *                 easing, so it stays glued to the growing wrapper's bottom
 *                 edge — visually the row slides out from underneath the
 *                 header row above it.
 *   row-fade-in   opacity/blur on a SHORTER clock than the movement — the
 *                 row is fully visible before it finishes settling (fades
 *                 must complete before movement ends). */
@keyframes row-grow-in {
  from {
    grid-template-rows: 0fr;
  }
  to {
    grid-template-rows: 1fr;
  }
}
@keyframes row-slide-in {
  from {
    translate: 0 -100%;
  }
}
@keyframes row-fade-in {
  from {
    opacity: 0;
    filter: blur(2px);
  }
}
.animate-row-grow-in {
  animation: row-grow-in 400ms ease-out;
}
.animate-row-slide-in {
  animation:
    row-slide-in 400ms ease-out,
    row-fade-in 240ms ease-out;
}

/* Reverse of the Storage row entrance. The content rises into the clipped
 * top edge while its grid track collapses, so the following rows move upward
 * continuously and the deleted row disappears beneath the header surface. */
@keyframes row-collapse-out {
  from {
    grid-template-rows: 1fr;
  }
  to {
    grid-template-rows: 0fr;
  }
}
@keyframes row-slide-out {
  to {
    translate: 0 -100%;
  }
}
@keyframes row-fade-out {
  to {
    opacity: 0;
    filter: blur(2px);
  }
}
.animate-row-collapse-out {
  animation: row-collapse-out 225ms ease-in forwards;
}
.animate-row-slide-out {
  animation:
    row-slide-out 225ms ease-in forwards,
    row-fade-out 160ms ease-in forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-row-grow-in,
  .animate-row-slide-in,
  .animate-row-collapse-out,
  .animate-row-slide-out {
    animation-duration: 1ms;
  }
}

/* Transitions.dev — "Texts reveal", used by the Storage dropzone's content
 * swaps (idle copy ↔ file name + status line).
 *
 * Entrance (\`.is-shown\` on the parent): lines rise 12px from below while
 * un-blurring, 500ms on a soft-landing bezier, staggered 40ms per line so
 * the eye lands on the first line first.
 * Exit (\`.is-hiding\`): a single quiet 200ms opacity fade in place — no Y
 * return, no blur, no stagger — so the disappearance never reads as a
 * reverse reveal.
 *
 * Deviations from the original snippet: custom props are scoped to
 * \`.t-stagger\` instead of :root, and \`.t-stagger-line\` doesn't force
 * \`display: block\` so flex-based lines (the icon disc) keep their layout. */
.t-stagger {
  --stagger-dur: 500ms;
  --stagger-distance: 12px;
  --stagger-stagger: 40ms;
  --stagger-blur: 3px;
  --stagger-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
.t-stagger-line {
  opacity: 0;
  transform: translateY(var(--stagger-distance));
  filter: blur(var(--stagger-blur));
  transition:
    opacity var(--stagger-dur) var(--stagger-ease),
    transform var(--stagger-dur) var(--stagger-ease),
    filter var(--stagger-dur) var(--stagger-ease);
  will-change: transform, opacity, filter;
}
.t-stagger-line--2 {
  transition-delay: var(--stagger-stagger);
}
.t-stagger-line--3 {
  transition-delay: calc(var(--stagger-stagger) * 2);
}
.t-stagger.is-shown .t-stagger-line {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
.t-stagger.is-hiding .t-stagger-line {
  opacity: 0;
  transform: translateY(0);
  filter: blur(0);
  transition:
    opacity 200ms ease,
    transform 0s linear,
    filter 0s linear;
  transition-delay: 0s;
}
@media (prefers-reduced-motion: reduce) {
  .t-stagger-line {
    transition: none !important;
  }
}

/* Rolling-counter label swap: the old value lifts 5px and fades out while the
 * new one rises in from 5px below and fades in. */
@keyframes label-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-10px);
    opacity: 0;
  }
}
@keyframes label-in {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-label-out {
  animation: label-out 220ms ease-out forwards;
}
.animate-label-in {
  animation: label-in 220ms ease-out;
}

/* Checkbox tick: draws the stroke on like it's being ticked by hand.
 * The path sets pathLength=1 so the dash math is resolution-independent. */
@keyframes check-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.animate-check-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: check-draw 200ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@media (prefers-reduced-motion: reduce) {
  .animate-check-draw {
    animation: none;
    stroke-dashoffset: 0;
  }
}

/* ---------------------------------------------------------------------------
 * Chart entrance animations (AI profile template & contributions heatmap)
 * ------------------------------------------------------------------------- */

/* Heatmap cells pop in softly — each cell gets a random-looking per-cell
 * animation-delay so the grid fills in a scattered order. */
.contributions-grid {
  --contribution-tier-0: var(--color-chart-neutral);
}
.contributions-grid[data-accent="emerald"] {
  --contribution-tier-1: var(--color-emerald-200); --contribution-tier-2: var(--color-emerald-400); --contribution-tier-3: var(--color-emerald-500); --contribution-tier-4: var(--color-emerald-600); --contribution-tier-5: var(--color-emerald-700);
}
.contributions-grid[data-accent="green"] {
  --contribution-tier-1: var(--color-green-200); --contribution-tier-2: var(--color-green-400); --contribution-tier-3: var(--color-green-500); --contribution-tier-4: var(--color-green-600); --contribution-tier-5: var(--color-green-700);
}
.contributions-grid[data-accent="teal"] {
  --contribution-tier-1: var(--color-teal-200); --contribution-tier-2: var(--color-teal-400); --contribution-tier-3: var(--color-teal-500); --contribution-tier-4: var(--color-teal-600); --contribution-tier-5: var(--color-teal-700);
}
.contributions-grid[data-accent="cyan"] {
  --contribution-tier-1: var(--color-cyan-200); --contribution-tier-2: var(--color-cyan-400); --contribution-tier-3: var(--color-cyan-500); --contribution-tier-4: var(--color-cyan-600); --contribution-tier-5: var(--color-cyan-700);
}
.contributions-grid[data-accent="blue"] {
  --contribution-tier-1: var(--color-blue-200); --contribution-tier-2: var(--color-blue-400); --contribution-tier-3: var(--color-blue-500); --contribution-tier-4: var(--color-blue-600); --contribution-tier-5: var(--color-blue-700);
}
.contributions-grid[data-accent="indigo"] {
  --contribution-tier-1: var(--color-indigo-200); --contribution-tier-2: var(--color-indigo-400); --contribution-tier-3: var(--color-indigo-500); --contribution-tier-4: var(--color-indigo-600); --contribution-tier-5: var(--color-indigo-700);
}
.contributions-grid[data-accent="violet"] {
  --contribution-tier-1: var(--color-violet-200); --contribution-tier-2: var(--color-violet-400); --contribution-tier-3: var(--color-violet-500); --contribution-tier-4: var(--color-violet-600); --contribution-tier-5: var(--color-violet-700);
}
.contributions-grid[data-accent="rose"] {
  --contribution-tier-1: var(--color-rose-200); --contribution-tier-2: var(--color-rose-400); --contribution-tier-3: var(--color-rose-500); --contribution-tier-4: var(--color-rose-600); --contribution-tier-5: var(--color-rose-700);
}
.contributions-grid[data-accent="amber"] {
  --contribution-tier-1: var(--color-amber-200); --contribution-tier-2: var(--color-amber-400); --contribution-tier-3: var(--color-amber-500); --contribution-tier-4: var(--color-amber-600); --contribution-tier-5: var(--color-amber-700);
}

.dark .contributions-grid[data-accent="emerald"] {
  --contribution-tier-1: var(--color-emerald-950); --contribution-tier-2: var(--color-emerald-800); --contribution-tier-3: var(--color-emerald-700); --contribution-tier-4: var(--color-emerald-600); --contribution-tier-5: var(--color-emerald-500);
}
.dark .contributions-grid[data-accent="green"] {
  --contribution-tier-1: var(--color-green-950); --contribution-tier-2: var(--color-green-800); --contribution-tier-3: var(--color-green-700); --contribution-tier-4: var(--color-green-600); --contribution-tier-5: var(--color-green-500);
}
.dark .contributions-grid[data-accent="teal"] {
  --contribution-tier-1: var(--color-teal-950); --contribution-tier-2: var(--color-teal-800); --contribution-tier-3: var(--color-teal-700); --contribution-tier-4: var(--color-teal-600); --contribution-tier-5: var(--color-teal-500);
}
.dark .contributions-grid[data-accent="cyan"] {
  --contribution-tier-1: var(--color-cyan-950); --contribution-tier-2: var(--color-cyan-800); --contribution-tier-3: var(--color-cyan-700); --contribution-tier-4: var(--color-cyan-600); --contribution-tier-5: var(--color-cyan-500);
}
.dark .contributions-grid[data-accent="blue"] {
  --contribution-tier-1: var(--color-blue-950); --contribution-tier-2: var(--color-blue-800); --contribution-tier-3: var(--color-blue-700); --contribution-tier-4: var(--color-blue-600); --contribution-tier-5: var(--color-blue-500);
}
.dark .contributions-grid[data-accent="indigo"] {
  --contribution-tier-1: var(--color-indigo-950); --contribution-tier-2: var(--color-indigo-800); --contribution-tier-3: var(--color-indigo-700); --contribution-tier-4: var(--color-indigo-600); --contribution-tier-5: var(--color-indigo-500);
}
.dark .contributions-grid[data-accent="violet"] {
  --contribution-tier-1: var(--color-violet-950); --contribution-tier-2: var(--color-violet-800); --contribution-tier-3: var(--color-violet-700); --contribution-tier-4: var(--color-violet-600); --contribution-tier-5: var(--color-violet-500);
}
.dark .contributions-grid[data-accent="rose"] {
  --contribution-tier-1: var(--color-rose-950); --contribution-tier-2: var(--color-rose-800); --contribution-tier-3: var(--color-rose-700); --contribution-tier-4: var(--color-rose-600); --contribution-tier-5: var(--color-rose-500);
}
.dark .contributions-grid[data-accent="amber"] {
  --contribution-tier-1: var(--color-amber-950); --contribution-tier-2: var(--color-amber-800); --contribution-tier-3: var(--color-amber-700); --contribution-tier-4: var(--color-amber-600); --contribution-tier-5: var(--color-amber-500);
}

.contribution-cell[data-tier="0"] { background-color: var(--contribution-tier-0); }
.contribution-cell[data-tier="1"] { background-color: var(--contribution-tier-1); }
.contribution-cell[data-tier="2"] { background-color: var(--contribution-tier-2); }
.contribution-cell[data-tier="3"] { background-color: var(--contribution-tier-3); }
.contribution-cell[data-tier="4"] { background-color: var(--contribution-tier-4); }
.contribution-cell[data-tier="5"] { background-color: var(--contribution-tier-5); }

@keyframes cell-pop {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-cell-pop {
  animation: cell-pop 380ms ease-out both;
}

/* Bars grow up from the baseline; a per-bar delay staggers them left→right. */
@keyframes bar-rise {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
.animate-bar-rise {
  transform-origin: bottom;
  animation: bar-rise 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Line chart draws in left→right via a clip-path sweep over the whole plot
 * (line + gradient area together). */
@keyframes chart-reveal {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
.animate-chart-reveal {
  animation: chart-reveal 1800ms cubic-bezier(0.33, 0, 0.15, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-cell-pop,
  .animate-bar-rise,
  .animate-chart-reveal {
    animation: none;
  }
}

/* ---------------------------------------------------------------------------
 * Table primitive (components/base/table)
 *
 * React Aria's collection components (Column/Row/Cell/…) can't be wrapped in
 * custom components without losing collection behaviour, so the primitive
 * re-exports them untouched and styling lives here, scoped to \`.bui-table\`.
 * React Aria renders real <table>/<thead>/<th>/<tr>/<td> elements.
 * --------------------------------------------------------------------------- */
.bui-table {
  @apply w-full border-collapse text-start;
}
/* Header background + border-y live on the cells: with border-collapse the
 * browser doesn't paint backgrounds/borders set on the <thead> row group.
 * Backgrounds/borders are set with explicit CSS (theme vars) rather than
 * @apply, which drops border-width/bg on these row-group cells. */
.bui-table th {
  @apply px-3 py-2.5 text-start align-middle text-body-medium text-text-tertiary whitespace-nowrap outline-none;
  background-color: var(--color-background-secondary-default);
  border-top: 1px solid var(--color-separator-border);
  border-bottom: 1px solid var(--color-separator-border);
  transition: padding 200ms ease, font-size 200ms ease;
}
.bui-table td {
  @apply px-3 py-2.5 align-middle text-body-medium text-text-primary outline-none;
  transition: padding 200ms ease, font-size 200ms ease;
}
/* Separators sit *between* rows only: the trailing row's boundary is drawn by
 * whatever follows the table (the container's bottom edge, or the pagination
 * footer's own border-top), so a filtered-down table never doubles up lines. */
.bui-table tbody tr:not(:last-child) {
  border-bottom: 1px solid var(--color-separator-border);
}
.bui-table tbody tr {
  @apply transition-colors duration-150;
}
.bui-table tbody tr[data-focus-visible] {
  @apply ring-2 ring-inset ring-border-focus-ring;
}
.bui-table.bui-table-sm th,
.bui-table.bui-table-sm td {
  @apply px-2.5 py-1.5 text-body-2-medium;
}

/* Agent Thinking (components/application/agent-thinking): the agent thinking state
 * above a chat composer. The label reuses the ai-chat-text-shimmer travel;
 * its base/highlight both derive from the tone the component sets via
 * --bui-agent-thinking-tone, so every tone shimmers consistently. */
.bui-agent-thinking-label {
  color: transparent;
  background-image: linear-gradient(
    100deg,
    color-mix(in oklab, var(--bui-agent-thinking-tone) 55%, transparent) 30%,
    var(--bui-agent-thinking-tone) 50%,
    color-mix(in oklab, var(--bui-agent-thinking-tone) 55%, transparent) 70%
  );
  background-position: 200% center;
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ai-chat-text-shimmer 2.6s linear infinite;
  will-change: background-position;
}

/* Star sparkle: scale + fade in, settle, and vanish; per-star duration and
 * stagger come in via inline animation-duration/-delay. */
@keyframes bui-agent-thinking-star {
  0%,
  100% {
    transform: scale(0);
    opacity: 0;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
  60% {
    transform: scale(0.8);
    opacity: 0.9;
  }
}

.bui-agent-thinking-star {
  transform: scale(0);
  animation-name: bui-agent-thinking-star;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* Infinity comet: the dash segment laps the normalized (pathLength=100)
 * figure-eight once per animation-duration. */
@keyframes bui-agent-thinking-dash {
  to {
    stroke-dashoffset: -100;
  }
}

.bui-agent-thinking-comet {
  animation-name: bui-agent-thinking-dash;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@media (prefers-reduced-motion: reduce) {
  .bui-agent-thinking-label {
    color: var(--bui-agent-thinking-tone);
    background-image: none;
    animation: none;
  }

  /* Stars rest visible instead of frozen at scale(0). */
  .bui-agent-thinking-star {
    animation: none;
    transform: none;
    opacity: 0.7;
  }

  .bui-agent-thinking-comet {
    animation: none;
  }
}

/* Star glyphs read a touch heavier than the dot grids on light backgrounds;
 * soften only them (not the label) there. Dark mode keeps the full tone. */
.bui-agent-thinking-stars {
  color: color-mix(in oklab, currentColor 75%, transparent);
}

.dark .bui-agent-thinking-stars {
  color: inherit;
}

/* Composer Loader (components/application/composer-loader): the light band
 * orbiting the composer while the agent works. Dash segments on a
 * pathLength-normalized SVG stroke — the offset laps once per duration. */
@keyframes bui-composer-loader-dash {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: -100;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bui-composer-loader-rect {
    animation: none !important;
  }
}

/* Composer mic listening state (components/application/ai-chat): equalizer
 * bars dancing while voice input is active. Per-bar duration/delay come in
 * inline so the bars drift out of phase like real audio. */
@keyframes bui-composer-mic-bars {
  0%,
  100% {
    transform: scaleY(0.4);
  }

  50% {
    transform: scaleY(1);
  }
}

.bui-composer-mic-bar {
  animation: bui-composer-mic-bars 0.9s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .bui-composer-mic-bar {
    animation: none;
    transform: scaleY(0.7);
  }
}

/* Shimmer sweep on a primary call to action (the Pro prompt card). */
@keyframes bui-badge-shimmer {
  0% {
    transform: translateX(0) skewX(-12deg);
  }
  40%,
  100% {
    transform: translateX(350%) skewX(-12deg);
  }
}

.bui-badge-shimmer {
  animation: bui-badge-shimmer 2.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .bui-badge-shimmer {
      animation: none;
      opacity: 0;
    }
}

/* Showcase card (docs index, landing, the starter's catalogue). */
.landing-showcase-card {
  transition: box-shadow 280ms ease;
}

.landing-showcase-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  border: 1px solid var(--color-border-button-default);
  border-radius: inherit;
  transition:
    border-color 280ms ease,
    box-shadow 280ms ease;
}

.dark .landing-showcase-card::after {
  border-color: rgb(255 255 255 / 0.08);
}

@media (min-width: 640px) and (hover: hover) {
  .landing-showcase-card:hover::after,
  .landing-showcase-card:focus-within::after {
    border-color: var(--color-border-button-hover);
    box-shadow: inset 0 0 0 2px var(--color-border-button-hover);
  }
}
`;

export const CX_TS = `import { extendTailwindMerge } from "tailwind-merge";

/**
 * Text-style classes from styles/typography.css.
 *
 * IMPORTANT: every text-* utility we define via @theme (e.g. \`text-body-medium\`,
 * \`text-title-1-semibold\`) must be listed here. Otherwise tailwind-merge — which
 * has no view of our Tailwind theme — treats them as text-color utilities and
 * silently drops them when they appear in the same className as a real color
 * (\`text-foreground-full\`, \`text-text-primary\`, etc).
 *
 * If you add or rename a text style in typography.css, mirror the change here.
 */
const TEXT_FAMILIES = [
  "large-title",
  "display-1",
  "display-2",
  "display-3",
  "display-4",
  "title-1",
  "title-2",
  "title-3",
  "headline",
  "body",
  "body-2",
  "caption-1",
  "caption-2",
] as const;

const TEXT_WEIGHTS = ["regular", "medium", "semibold", "bold"] as const;

const TEXT_STYLE_SUFFIXES = TEXT_FAMILIES.flatMap((family) =>
  TEXT_WEIGHTS.map((weight) => \`\${family}-\${weight}\`),
);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TEXT_STYLE_SUFFIXES }],
    },
  },
});

/**
 * Merge Tailwind classes safely. Last-write-wins on conflicting utilities.
 */
export const cx = twMerge;

/**
 * Identity helper that gives the Tailwind IntelliSense extension a hook for
 * sorting classes inside style objects (the extension doesn't sort inside
 * plain object literals otherwise).
 */
export function sortCx<
  T extends Record<
    string,
    string | number | Record<string, string | number | Record<string, string | number>>
  >,
>(classes: T): T {
  return classes;
}
`;

const FRAMEWORKS = ["Next.js", "Vite", "React Router", "Astro"] as const;

/** Installation guide, mirroring boardui.com/installation. */
export default function InstallationPage() {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>("Next.js");
  return (
    <DocsLayout variant="library" title="Installation">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUI works with any React 19 + Tailwind CSS v4 setup. Pick your framework below for a
            step-by-step guide, or follow the manual steps to copy the foundations in yourself.
          </p>
          <p className="text-body-regular text-text-secondary">
            Skip the steps below: connect the BoardUI MCP server and let your agent install everything.
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              Start with MCP
            </LinkButton>
          </div>
        </div>

        <Section title="Quick start">
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Follow the monorepo and alias setup before
            running your first install. The standard setup below needs no configuration file.
          </p>
          <p className="text-body-regular text-text-secondary">
            In any React + Tailwind v4 project,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> installs the
            required packages, writes the theme, typography, and global styles plus the{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx</code> utility, and prints
            the lines left to add to your root layout:
          </p>
          <Command cmd="npx boardui@latest init" />
          <p className="text-body-regular text-text-secondary">
            Then add any component — internal dependencies and npm packages resolve automatically:
          </p>
          <Command cmd="npx boardui@latest add button select date-picker" />
          <p className="text-body-regular text-text-secondary">
            Running the CLI from CI, a script, or a coding agent? Add{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> to both commands.
            Without a terminal to answer its prompts, the CLI stops with exit code 1 instead of guessing, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> answers them with
            the defaults: install the dependencies and keep files that already exist.
          </p>
        </Section>

        <Section title="Framework guides">
          <p className="text-body-regular text-text-secondary">
            Full setup from an empty folder. The steps only differ in how each framework wires Tailwind, the{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/</code> import alias, and
            the global stylesheet.
          </p>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFramework(name)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                  framework === name
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          {framework === "Next.js" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Create a project (skip if you have one).">
                <p className="text-body-regular text-text-secondary">
                  The create-next-app defaults — TypeScript, Tailwind CSS, and the{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias — match
                  BoardUI&apos;s default setup.
                </p>
                <Command cmd="npx create-next-app@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # TypeScript: Yes · Tailwind CSS: Yes · import alias: @/* (the defaults)
                </p>
              </Step>
              <Step n={2} title="Run init in the project root.">
                <p className="text-body-regular text-text-secondary">
                  Installs <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>, and{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>,
                  and writes styles/ and utils/.
                </p>
                <Command cmd="npx boardui@latest init" />
              </Step>
              <Step n={3} title="Import the stylesheet and load Inter in your root layout.">
                <p className="text-body-regular text-text-secondary">
                  BoardUI&apos;s theme reads its typeface from{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--font-inter</code>, so
                  load Inter with <code className="font-mono text-caption-1-medium text-text-primary">next/font</code>{" "}
                  in place of create-next-app&apos;s Geist fonts and put its variable on{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">&lt;html&gt;</code>.
                  Without it, text falls back to the system font.
                </p>
                <CodeBlock code={LAYOUT_CODE} />
              </Step>
              <Step n={4} title="Add components.">
                <Command cmd="npx boardui@latest add button" />
              </Step>
            </div>
          ) : framework === "Vite" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Create a project (skip if you have one).">
                <Command cmd="npm create vite@latest my-app -- --template react-ts" />
              </Step>
              <Step n={2} title="Install Tailwind CSS v4 and register the Vite plugin.">
                <p className="text-body-regular text-text-secondary">
                  The plugin handles the stylesheet and the{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@theme</code> tokens for
                  you:
                </p>
                <Command cmd="npm install tailwindcss @tailwindcss/vite" />
                <FileBlock file="vite.config.ts" code={VITE_CONFIG_CODE} />
              </Step>
              <Step n={3} title="Add the @/* import alias to tsconfig.json.">
                <FileBlock file="tsconfig.json" code={VITE_TSCONFIG_CODE} />
              </Step>
              <Step n={4} title="Run init.">
                <p className="text-body-regular text-text-secondary">
                  It will prompt you for a few choices: a default style, a base color, and whether to install
                  the design rules. When in doubt, accept the defaults — you can change them later in{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>.
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={5} title="Import the stylesheet in your app entry.">
                <p className="text-body-regular text-text-secondary">
                  The init step created{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/styles/globals.css</code>{" "}
                  for you:
                </p>
                <FileBlock file="main.tsx" code={VITE_MAIN_CODE} />
              </Step>
              <Step n={6} title="Add components.">
                <p className="text-body-regular text-text-secondary">For example, the Button:</p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
              </Step>
            </div>
          ) : framework === "React Router" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Create a project (skip if you have one).">
                <p className="text-body-regular text-text-secondary">
                  React Router v7 is the successor to Remix — these steps apply to both.
                </p>
                <Command cmd="npx create-react-router@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # the default template ships with Tailwind CSS v4 already wired up
                </p>
              </Step>
              <Step n={2} title="Add the @/* import alias.">
                <p className="text-body-regular text-text-secondary">
                  The template already uses{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">vite-tsconfig-paths</code>
                  , so a tsconfig entry is all you need:
                </p>
                <FileBlock file="tsconfig.json" code={RR_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="Run init, targeting the app directory.">
                <PkgCommand
                  npm="npx boardui@latest init --dir app"
                  pnpm="pnpm dlx boardui@latest init --dir app"
                  yarn="yarn dlx boardui@latest init --dir app"
                />
              </Step>
              <Step n={4} title="Import the stylesheet in your root route.">
                <FileBlock file="app/root.tsx" code={RR_ROOT_CODE} />
              </Step>
              <Step n={5} title="Add components, targeting the app directory.">
                <PkgCommand
                  npm="npx boardui@latest add button --dir app"
                  pnpm="pnpm dlx boardui@latest add button --dir app"
                  yarn="yarn dlx boardui@latest add button --dir app"
                />
              </Step>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Create a project and add the React + Tailwind integrations.">
                <Command cmd="npm create astro@latest my-app" />
                <Command cmd="npx astro add react tailwind" />
                <p className="text-body-2-regular text-text-tertiary">
                  # installs the React integration and the Tailwind CSS v4 Vite plugin
                </p>
              </Step>
              <Step n={2} title="Add the @/* import alias.">
                <FileBlock file="tsconfig.json" code={ASTRO_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="Run init in the project root.">
                <p className="text-body-regular text-text-secondary">
                  Styles and utils are written into{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/</code> automatically.
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={4} title="Import the stylesheet in your base layout.">
                <FileBlock file="src/layouts/Layout.astro" code={ASTRO_LAYOUT_CODE} />
              </Step>
              <Step n={5} title="Add components and hydrate them in .astro files.">
                <p className="text-body-regular text-text-secondary">
                  Interactive components need a{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">client:*</code> directive
                  to hydrate on the page:
                </p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
                <FileBlock file="src/pages/index.astro" code={ASTRO_USAGE_CODE} />
              </Step>
            </div>
          )}
          <p className="text-body-regular text-text-secondary">
            Using something else? Any framework that runs React 19 with Tailwind CSS v4 works — wire up the{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias, run{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>, and
            import the stylesheet. Or skip the CLI entirely with the manual steps below.
          </p>

        </Section>

        <Section title="Monorepos and custom aliases" id="monorepos">
          <p className="text-body-regular text-text-secondary">
            Install components into a shared UI package used by multiple apps, or match your project&apos;s
            existing folders and import aliases. Add an optional{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> next to the
            destination package&apos;s{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code>. Without
            it, the usual root or <code className="font-mono text-caption-1-medium text-text-primary">src/</code>{" "}
            layout and <code className="font-mono text-caption-1-medium text-text-primary">@/</code> imports
            stay the same.
          </p>
          <Step n={1} title="Configure the destination package.">
            <p className="text-body-regular text-text-secondary">
              For a package named{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui</code> in{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">packages/ui</code>, create
              this config and merge the exports into its package manifest. Adapt file extensions to your
              package&apos;s source or build output.
            </p>
            <CodeBlock code={BOARDUI_JSON_CODE} />
            <p className="text-body-regular text-text-secondary">
              Paths are relative to this package and must stay inside it. Set both a path and an alias for
              each group you change; omitted groups keep their defaults. Aliases are import prefixes without
              wildcards and must resolve through your package exports or TypeScript and bundler configuration.
            </p>
          </Step>
          <Step n={2} title="Run BoardUI from the shared package.">
            <Command cmd="cd packages/ui" />
            <Command cmd="npx boardui@latest init" />
            <Command cmd="npx boardui@latest add button" />
            <p className="text-body-regular text-text-secondary">
              Components and their npm dependencies install into this package. For example, an import of{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/utils/cx</code> becomes{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/utils/cx</code>
              . Free and Pro components use the same config. With MCP, pass this package&apos;s absolute path
              as <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code>.
            </p>
          </Step>
          <Step n={3} title="Connect each consuming app.">
            <p className="text-body-regular text-text-secondary">
              Add the UI package as a workspace dependency of each app and make sure its bundler can compile
              the package&apos;s TypeScript and TSX. Import the BoardUI stylesheet and include the shared
              source in Tailwind&apos;s source detection:
            </p>
            <CodeBlock code={CONSUMING_GLOBALS_CODE} />
            <p className="text-body-regular text-text-secondary">
              Import this app stylesheet from your root layout or entry point. Adjust the{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@source</code> path relative
              to the stylesheet&apos;s location. Component imports can then use{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/components/base/buttons/button</code>
              .
            </p>
          </Step>
          <p className="text-body-regular text-text-secondary">
            Configure paths before installing. Changing the config does not move existing files or update your
            app&apos;s imports. Use the config instead of combining it with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> or{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code>. Full-page
            templates belong in the consuming app: their routes and public assets are not split across
            workspace packages. Manual copy-paste keeps the original imports, so adjust those yourself.
          </p>
        </Section>

        <Section title="Manual installation">
          <p className="text-body-regular text-text-secondary">
            Prefer to wire things up yourself? Make sure you have a project with Tailwind CSS v4 set up, then
            follow these steps.
          </p>
          <Step n={1} title="Install the required packages">
            <Command cmd="npm install react-aria-components tailwind-merge @remixicon/react" />
          </Step>
          <Step n={2} title="Create styles/theme.css with the design tokens.">
            <FileBlock file="styles/theme.css" code={THEME_CSS} />
          </Step>
          <Step n={3} title="Create styles/typography.css with the type scale.">
            <FileBlock file="styles/typography.css" code={TYPOGRAPHY_CSS} />
          </Step>
          <Step n={4} title="Create styles/globals.css as your Tailwind entry point.">
            <FileBlock file="styles/globals.css" code={GLOBALS_CSS} />
          </Step>
          <Step n={5} title="Add the utils/cx.ts class-merge utility.">
            <FileBlock file="utils/cx.ts" code={CX_TS} />
          </Step>
          <Step n={6} title="Import the stylesheet and load Inter in your root layout.">
            <CodeBlock code={LAYOUT_CODE} />
          </Step>
        </Section>

        <Section title="Add a component">
          <p className="text-body-regular text-text-secondary">
            Components live under{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code> and
            import via the <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            alias. Copy the code from any component page — or let the CLI do it — then import:
          </p>
          <CodeBlock code={ADD_COMPONENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            Browse everything with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui list</code>, or
            copy per-component install commands from the individual component pages.
          </p>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            Pro components and templates install through the same CLI once your license is activated — no zip
            juggling, no copy-paste. Your license key is in your Lemon Squeezy receipt (and under{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">My Orders</code> on Lemon
            Squeezy). One purchase unlocks everything, with updates included.
          </p>
          <p className="text-body-regular text-text-secondary">
            Activate the license on your machine once:
          </p>
          <Command cmd="npx boardui@latest login YOUR_LICENSE_KEY" />
          <p className="text-body-regular text-text-secondary">
            From then on, Pro components work exactly like free ones — the CLI installs the source plus any
            free components it depends on:
          </p>
          <Command cmd="npx boardui@latest add agent-progress" />
          <p className="text-body-regular text-text-secondary">
            Templates pull the same way — the full page, every component it uses, and its imagery land in your
            project in one command (
            <code className="font-mono text-caption-1-medium text-text-primary">template-home-dashboard</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-medical-profile</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-chat</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-image-generation</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-profile</code>):
          </p>
          <Command cmd="npx boardui@latest add template-ai-chat" />
          <p className="text-body-regular text-text-secondary">
            To pull the latest version of anything you already installed, re-run the same command with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. Every Pro
            component is marked with a{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">PRO</code> badge on the{" "}
            <Link href="/components" className="text-accent-600 underline">
              components page
            </Link>
            .
          </p>
          <p className="text-body-regular text-text-secondary">
            Each machine you log in on takes one of your license&apos;s seats: one on 1 Year of Updates and
            Lifetime Access, five on Unlimited for Startups. Licenses bought through Lemon Squeezy keep the
            limit they were sold with.{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui logout</code>{" "}
            releases the current machine&apos;s seat; in CI, skip{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">login</code> and set the{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_LICENSE_KEY</code>{" "}
            environment variable instead. Templates are also available as complete project downloads from your
            Lemon Squeezy order. Lost your key? Write to hi@boardui.com.
          </p>
        </Section>

        <Section title="Dark mode">
          <p className="text-body-regular text-text-secondary">
            Dark mode is manual and class-based. Light is the default; BoardUI stores a manual choice under{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> and never
            reads the operating-system preference. Run the saved-theme lookup before hydration so returning
            users do not see a light-mode flash.
          </p>
          <CodeBlock code={DARK_LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            Add the reusable control, then place{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">&lt;ThemeToggle /&gt;</code>{" "}
            in your sidebar or settings surface. It keeps visible toggles synchronized and persists the
            selection automatically.
          </p>
          <Command cmd="npx boardui@latest add theme-toggle" />
          <p className="text-body-regular text-text-secondary">
            Components use semantic utilities only. Customize light values in{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">:root</code> and dark values in{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.dark</code> inside{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>; avoid
            component-level{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">dark:</code> overrides and raw
            structural colors. See the full mapping on the{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              Color page
            </Link>
            .
          </p>
        </Section>

        <Section title="Accent color">
          <p className="text-body-regular text-text-secondary">
            The CTA color is a theme decision, not fifty component edits. Every interactive surface - primary
            button gradients, ghost and link buttons, checkboxes, radios, switches, sliders, tabs, the
            selected sidebar item, focus rings - reads from one{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--color-accent-50…950</code>{" "}
            ramp in <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>,
            which defaults to blue. Override those eleven variables after the theme import and the whole
            system re-tints in both light and dark mode; charts and status colors keep their own hues.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">
            styles/globals.css (or any imported stylesheet)
          </p>
          <CodeBlock code={ACCENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            You do not have to write this block by hand. Open any component page, hit the palette button in
            the bottom-right corner, and try hues live - or pick a fully custom color. It lands exactly on
            accent-500, where primary buttons start their gradient, and BoardUI builds the other ten stops
            around it. When it looks right,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Copy theme CSS</code> exports
            exactly this override. The{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              Color page
            </Link>{" "}
            has the same controls inline.
          </p>
        </Section>

        <Section title="Tech stack">
          <p className="text-body-regular text-text-secondary">
            BoardUI components are built with React 19, TypeScript 5, Tailwind CSS v4, and React Aria for
            accessibility. You own the code — no runtime package, no third-party maintainers to wait on. Chart
            cards additionally use Recharts, and the data table uses TanStack Table; the CLI installs those
            automatically when a component needs them.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
