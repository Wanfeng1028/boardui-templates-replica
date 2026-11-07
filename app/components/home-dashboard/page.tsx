"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiArrowRightSLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { LinkButton } from "@/components/base/buttons/link-button";

/** Detail page for home-dashboard - content mirrors boardui.com/components/home-dashboard. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function HomeDashboardPage() {
  return (
    <AppShell title="Home Dashboard" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/home-dashboard</span>
        </div>
        <p className="text-body-regular text-text-secondary">A complete admin dashboard screen - floating sidebar navigation, header with search and notifications, KPI stat cards, an earnings bar chart, and a customers data table with filtering, sorting, and pagination. Fully responsive, down to a slide-in drawer on mobile.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <h3 className="text-title-3-semibold text-text-primary">Home Dashboard is a Pro template.</h3>
          <p className="text-body-regular text-text-secondary">Home Dashboard is a BoardUI Pro template, sold separately.</p>
          <p className="text-body-regular text-text-secondary">Dark mode ready - this template follows BoardUI semantic tokens automatically. Set up theme switching.</p>
          <p className="text-body-regular text-text-secondary">Your BoardUI Pro license unlocks this template and all of its source files. Activate your license once, then install it directly into your project with the CLI.</p>
          <p className="text-caption-1-semibold text-text-secondary">1 — Activate your license</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest login YOUR_LICENSE_KEY</code>
            <CopyButton text={"npx boardui@latest login YOUR_LICENSE_KEY"} />
          </div>
          <p className="text-body-regular text-text-secondary">Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.</p>
          <p className="text-caption-1-semibold text-text-secondary">2 — Install the template</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add template-home-dashboard</code>
            <CopyButton text={"npx boardui@latest add template-home-dashboard"} />
          </div>
          <p className="text-body-regular text-text-secondary">The CLI copies the source and resolves every BoardUI and npm dependency for you.</p>
          <p className="text-body-regular text-text-secondary">This template is included in BoardUI Pro. Get BoardUI Pro now and install it end away.</p>
          <p className="text-body-regular text-text-secondary">Using a shared UI package or custom import aliases? Configure your installation paths before running the CLI. Copy-paste examples use the default imports.</p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">What&apos;s included</h2>
          <p className="text-body-regular text-text-secondary">The template ships as a complete source package: the responsive app shell with the floating sidebar and mobile drawer, the header with breadcrumb, search, and notifications, KPI stat cards, the earnings bar chart, the full customers data table (search, filters, sorting, row selection, pagination), and every base component and data file they depend on.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">{`import { DashboardShell } from "@/components/application/dashboard/dashboard-shell";

export default function DashboardPage() {
  // Full screen: floating sidebar, header, KPI cards,
  // earnings bar chart, and the customers data table.
  return <DashboardShell />;
}`}</pre>
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-5">
              <p className="text-body-regular text-text-secondary">The full template lives on this site - open it to explore the complete screen.</p>
              <LinkButton href="/templates/dashboard" trailingIcon={RiArrowRightSLine}>Open the Dashboard template</LinkButton>
            </div>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/home-dashboard（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
