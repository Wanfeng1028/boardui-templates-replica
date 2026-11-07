"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { LinkButton } from "@/components/base/buttons/link-button";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
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

const INSTALL_CMD = "npx boardui@latest add theme-toggle";

const SETUP_CODE = `// app/layout.tsx
import Script from "next/script";
import "@/styles/globals.css";

const themeScript = '(function(){try{var dark=localStorage.getItem("boardui:theme")==="dark";document.documentElement.classList.toggle("dark",dark)}catch(e){document.documentElement.classList.remove("dark")}})();';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="boardui-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}`;

const COLLAPSED_CODE = `<ThemeToggle collapsed />`;

/** Theme Toggle detail page: boardui.com/components/theme-toggle, in-site. */
export default function ThemeTogglePage() {
  return (
    <AppShell title="Theme Toggle" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A manual light/dark control for application sidebars. The next theme reveals smoothly from the exact
            interaction point, the user&rsquo;s choice persists locally, and reduced-motion or unsupported browsers
            fall back to an immediate switch.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            These are live controls — press one and the whole page switches theme. The sidebar treatment is the
            one in the app sidebar; the segmented treatment is the compact form used inside menus and dropdown
            rows.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex flex-col items-center gap-2">
                <ThemeToggle />
                <span className="text-caption-1-regular text-text-tertiary">Sidebar</span>
              </span>
              <span className="flex flex-col items-center gap-2">
                <ThemeToggle appearance="sidebar-segmented" />
                <span className="text-caption-1-regular text-text-tertiary">Sidebar segmented</span>
              </span>
              <span className="flex flex-col items-center gap-2">
                <ThemeToggle appearance="segmented" size="small" />
                <span className="text-caption-1-regular text-text-tertiary">Segmented, small</span>
              </span>
              <span className="flex flex-col items-center gap-2">
                <ThemeToggle collapsed />
                <span className="text-caption-1-regular text-text-tertiary">Collapsed</span>
              </span>
            </div>
          </Demo>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Add the reusable theme toggle and its semantic theme dependencies using the CLI or manually. The CLI
            copies the component source (with its internal dependencies) into your project and installs any
            required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Project setup">
          <p className="text-body-regular text-text-secondary">
            Light is the default. Apply the saved{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> value before
            hydration to prevent a first-paint flash, and add{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">suppressHydrationWarning</code>{" "}
            because the root class is set in the browser before React hydrates.
          </p>
          <CodeBlock code={SETUP_CODE} />
          <p className="text-body-regular text-text-secondary">
            The toggle is manual-only: it does not read the operating-system theme. Its reduced-motion and
            unsupported-browser fallbacks switch immediately without the circular reveal.
          </p>
        </Section>

        <Section title="Collapsed sidebar">
          <p className="text-body-regular text-text-secondary">
            Set <code className="font-mono text-caption-1-medium text-text-primary">collapsed</code> for a 36px
            icon-only control that fits a compact sidebar rail while keeping the same accessible pressed state.
          </p>
          <CodeBlock code={COLLAPSED_CODE} />
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </AppShell>
  );
}
