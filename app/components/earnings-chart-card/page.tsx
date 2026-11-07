"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { EarningsChartCard } from "@/components/application/charts/earnings-chart-card";

/** Detail page for earnings-chart-card - content mirrors boardui.com/components/earnings-chart-card. */

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

export default function EarningsChartCardPage() {
  return (
    <DocsLayout variant="library" title="Earnings Chart Card">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/earnings-chart-card</span>
        </div>
        <p className="text-body-regular text-text-secondary">The “Earned so far” bar chart from the dashboard - a Recharts bar series with a Weekly / Monthly / Yearly segmented switcher, a count-up dollar headline, and a hover outline on the active bar.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">Earnings Chart Card is part of BoardUI Pro. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add earnings-chart-card</code>
            <CopyButton text={"npx boardui@latest add earnings-chart-card"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Preview</h2>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              <EarningsChartCard />
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
