"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { LinkButton } from "@/components/base/buttons/link-button";

/** Detail page for finance-dashboard - content mirrors boardui.com/components/finance-dashboard. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function FinanceDashboardPage() {
  return (
    <DocsLayout variant="library" title="Finance Dashboard">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/finance-dashboard</span>
        </div>
        <p className="text-body-regular text-text-secondary">A complete personal finance screen - balance KPI cards, a full-width cash-flow sankey from income sources to spending, spending-by-category rings, portfolio risk vs. return bubbles, a daily spending heatmap, and a transactions data table. Fully responsive, down to a slide-in drawer on mobile.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">Finance Dashboard is a BoardUI Pro template, sold separately. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add finance-dashboard</code>
            <CopyButton text={"npx boardui@latest add finance-dashboard"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">What's included</h2>
          <p className="text-body-regular text-text-secondary">The template ships as a complete source package: the responsive app shell, balance KPI stat cards, the cash-flow sankey, the spending-by-category rings, the portfolio scatter with bubble sizing, the daily spending heatmap, the transactions data table (search, filters, sorting, pagination), and every base component and data file they depend on.</p>
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-5">
              <p className="text-body-regular text-text-secondary">The full template lives on this site - open it to explore the complete screen.</p>
              <LinkButton href="/templates/finance" trailingIcon={RiArrowRightSLine}>Open the Finance template</LinkButton>
            </div>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </DocsLayout>
  );
}
