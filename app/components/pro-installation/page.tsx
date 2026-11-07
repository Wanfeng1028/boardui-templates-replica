"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { LinkButton } from "@/components/base/buttons/link-button";

/** Pro installation guide - content mirrors boardui.com/components/pro-installation. */

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

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
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

const LAYOUT_CODE = `// app/layout.tsx
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

const PRO_COMPONENTS = [
  "agent-limits-card",
  "agent-progress",
  "questionnaire",
  "calendar",
  "earnings-chart-card",
  "line-chart-card",
  "contributions-card",
  "steps-card",
  "sleep-score-card",
  "activity-rings-card",
  "most-active-days-card",
  "radar-chart-card",
  "radial-chart-card",
  "funnel-chart-card",
  "sankey-chart-card",
  "heatmap-chart-card",
  "stage-bars-card",
  "bar-list-card",
  "area-chart-card",
  "combo-chart-card",
  "scatter-chart-card",
];

const PRO_TEMPLATES = [
  { cmd: "template-home-dashboard", slug: "home-dashboard" },
  { cmd: "template-medical-profile", slug: "medical-profile" },
  { cmd: "template-ai-chat", slug: "ai-chat" },
  { cmd: "template-ai-image-generation", slug: "ai-image-generation" },
  { cmd: "template-ai-profile", slug: "ai-profile" },
  { cmd: "template-project-board", slug: "project-board" },
];

/** Pro installation guide, mirroring boardui.com/components/pro-installation. */
export default function ProInstallationPage() {
  return (
    <AppShell title="Pro installation" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <Section title="Welcome to BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            Thank you for your purchase. Your license unlocks every Pro component and template, including future
            updates. Let&apos;s get everything running in your project.
          </p>
          <p className="text-body-regular text-text-secondary">
            Your AI agent can do this whole page for you: connect the BoardUI MCP server in Claude Code, Cursor, VS
            Code, or Codex, paste your license key into the chat, and ask it to activate Pro and install any
            component or template.
          </p>
          <div>
            <span className="inline-flex items-center gap-1 text-body-medium text-text-tertiary">
              Start with MCP
              <RiArrowRightSLine className="size-4" aria-hidden />
            </span>
          </div>
        </Section>

        <Section title="Start from zero">
          <p className="text-body-regular text-text-secondary">
            This walkthrough assumes BoardUI has never been installed in your project. Follow every step in order
            and you&apos;ll finish with the foundations, free dependencies, Pro access, and your first component or
            template ready to use.
          </p>

          <p className="text-caption-1-semibold text-text-secondary">1 — Open your project, or create a new one</p>
          <p className="text-body-regular text-text-secondary">
            BoardUI works in a React 19 + Tailwind CSS v4 project. If you don&apos;t have one yet, the quickest
            starting point is a new Next.js app. Choose the defaults: TypeScript, Tailwind CSS, App Router, and
            the @/ alias.
          </p>
          <Command cmd="npx create-next-app@latest my-app" />
          <Command cmd="cd my-app" />
          <p className="text-body-regular text-text-secondary">
            Already have a compatible project? Open a terminal in its root folder and continue below. For Vite,
            React Router, or Astro, see the framework guides on the installation page. For a shared UI package or
            custom aliases, follow the monorepo setup guide before running init. Free and Pro components use the
            same boardui.json config. Run component installs inside the shared package, and install full-page
            templates in the consuming app.
          </p>

          <p className="text-caption-1-semibold text-text-secondary">
            2 — Initialize BoardUI and install all required dependencies
          </p>
          <Command cmd="npx boardui@latest init --pro" />
          <p className="text-body-regular text-text-secondary">
            Confirm the setup prompt. The CLI installs Tailwind v4 and BoardUI&apos;s runtime and Pro packages, then
            creates the theme, typography, global styles, and shared utilities. You do not need to install the free
            library separately.
          </p>

          <p className="text-caption-1-semibold text-text-secondary">3 — Connect the generated BoardUI styles</p>
          <p className="text-body-regular text-text-secondary">
            Replace the default global CSS import in your root layout and load Inter, the typeface BoardUI&apos;s
            theme reads. If nothing compiles Tailwind v4 in your project yet, also load its PostCSS plugin.
            create-next-app 16.4 and later already compile it through @tailwindcss/turbopack, and init prints the
            PostCSS step only when it is needed.
          </p>
          <CodeBlock code={LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            The PostCSS config (postcss.config.mjs) is only needed when your project does not already compile
            Tailwind v4 another way.
          </p>

          <p className="text-caption-1-semibold text-text-secondary">
            4 — Activate the license key from your purchase email
          </p>
          <Command cmd="npx boardui@latest login YOUR_LICENSE_KEY" />
          <p className="text-body-regular text-text-secondary">
            Replace YOUR_LICENSE_KEY with the literal key. Do not include angle brackets. Activation uses one of
            the machine seats included with your license.
          </p>

          <p className="text-caption-1-semibold text-text-secondary">5 — Install your first Pro component</p>
          <Command cmd="npx boardui@latest add agent-progress calendar" />
          <p className="text-body-regular text-text-secondary">
            This command installs both examples. Use one name if you only want one. The CLI also fetches every free
            BoardUI component or utility they depend on and offers to install missing npm packages — there is no
            separate free-component setup step.
          </p>

          <p className="text-caption-1-semibold text-text-secondary">6 — Or install a complete Pro template</p>
          <Command cmd="npx boardui@latest add template-ai-chat" />
          <p className="text-body-regular text-text-secondary">
            Templates include the page, component source, free dependencies, Pro blocks, and imagery. You can
            install components, templates, or both with the same license.
          </p>
        </Section>

        <Section title="Keeping your source up to date">
          <p className="text-body-regular text-text-secondary">
            BoardUI installs editable source code rather than a locked component package. To replace an installed
            item with its latest BoardUI version, run the same command with --overwrite and review any local
            customizations first.
          </p>
          <Command cmd="npx boardui@latest add calendar --overwrite" />
        </Section>

        <Section title="Pro components">
          <p className="text-body-regular text-text-secondary">
            Add one or several names in the same CLI command.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {PRO_COMPONENTS.map((name) => (
              <Link
                key={name}
                href={`/components/${name}`}
                className="font-mono text-caption-1-medium text-accent-600 underline"
              >
                {name}
              </Link>
            ))}
          </div>
          <div>
            <LinkButton href="/components" trailingIcon={RiArrowRightSLine}>
              Browse component previews
            </LinkButton>
          </div>
        </Section>

        <Section title="Pro templates">
          <p className="text-body-regular text-text-secondary">
            Each command installs a complete screen and everything it needs.
          </p>
          <div className="flex flex-col gap-2">
            {PRO_TEMPLATES.map(({ cmd, slug }) => (
              <div key={cmd} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <code className="font-mono text-caption-1-medium text-text-primary">{cmd}</code>
                <Link href={`/components/${slug}`} className="text-caption-1-medium text-accent-600 underline">
                  Preview
                </Link>
              </div>
            ))}
          </div>
          <div>
            <LinkButton href="/templates" trailingIcon={RiArrowRightSLine}>
              Browse template previews
            </LinkButton>
          </div>
        </Section>

        <Section title="Seats, CI, and support">
          <p className="text-body-regular text-text-secondary">
            Move your license between machines, automate installs, or reach us directly when you need help.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">License seats — manage a machine</p>
          <p className="text-body-regular text-text-secondary">
            Release the current seat before activating your license on another computer.
          </p>
          <Command cmd="npx boardui@latest logout" />
          <p className="text-caption-1-semibold text-text-secondary">Automation — use it in CI</p>
          <p className="text-body-regular text-text-secondary">
            Add your license as a secret environment variable. Interactive login isn&apos;t needed.
          </p>
          <CodeBlock code="BOARDUI_LICENSE_KEY" />
          <p className="text-caption-1-semibold text-text-secondary">Direct support — need a hand?</p>
          <p className="text-body-regular text-text-secondary">
            Send me a DM on X with your order email and a short description of what&apos;s happening.
          </p>
          <div>
            <span className="inline-flex items-center gap-1 text-body-medium text-text-tertiary">
              DM @sitenley
              <RiArrowRightSLine className="size-4" aria-hidden />
            </span>
          </div>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/pro-installation（2026-11-07，curl 抓取原版 SSR HTML 核对）
