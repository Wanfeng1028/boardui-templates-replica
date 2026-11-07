"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { FunnelChartCard } from "@/components/application/charts/funnel-chart-card";

/** Detail page for funnel-chart-card - content mirrors boardui.com/components/funnel-chart-card. */

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

const CODE_0_CODE = "{/* Straight-edged trapezoids, no edge layers */}\n<FunnelChartCard shape=\"sharp\" title=\"Hiring\" ranges={HIRING_RANGES} />\n\n{/* Single ink: mid grey on light, near-white on dark */}\n<FunnelChartCard mono title=\"Checkout\" ranges={CHECKOUT_RANGES} />\n\n{/* Both */}\n<FunnelChartCard mono shape=\"sharp\" title=\"Hiring\" ranges={HIRING_RANGES} />";
const CODE_1_CODE = "// One entry per stage, top of the funnel first.\nconst stages = [\n  { label: \"Link opened\", value: 197 },\n  { label: \"Started\", value: 110 },\n  { label: \"Completed\", value: 77 },\n  { label: \"Converted\", value: 38, color: \"var(--color-chart-3)\" }, // override any colour\n];\n\n<FunnelChartCard\n  title=\"Sign-up funnel\"\n  stages={stages}\n  headline={197} // optional resting headline (defaults to the first stage)\n  delta={0.052} // \"+5.2%\" chip\n  range=\"Last 30 days\" // static pill...\n/>\n\n// ...or a working period dropdown: each range overrides stages / delta / headline.\n<FunnelChartCard\n  title=\"Checkout funnel\"\n  ranges={[\n    { id: \"7d\", label: \"Last 7 days\", stages: week, delta: -0.018 },\n    { id: \"30d\", label: \"Last 30 days\", stages: month, delta: 0.042 },\n    { id: \"90d\", label: \"Last 90 days\", stages: quarter, delta: 0.097 },\n  ]}\n/>";

export default function FunnelChartCardPage() {
  return (
    <AppShell title="Funnel Chart Card" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/funnel-chart-card</span>
        </div>
        <p className="text-body-regular text-text-secondary">A horizontal flow funnel in the dashboard card shell. Every stage is a column sized to its share of the top of the funnel that tapers into the next, with a centred percentage pill and a value/name footer; hovering a stage lifts it out by dimming the rest and swaps the headline. Recharts' funnel is a vertical trapezoid stack, so this one is hand-drawn from the same tokens. For the list version see the Stage Bars Card.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">Funnel Chart Card is part of BoardUI Pro. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add funnel-chart-card</code>
            <CopyButton text={"npx boardui@latest add funnel-chart-card"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Shapes and mono</h2>
          <p className="text-body-regular text-text-secondary">shape="sharp" swaps the eased taper and layered edges for plain trapezoids, and mono paints every stage in the text colour - black on light, white on dark - for a single-ink card. They combine.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              <FunnelChartCard />
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Data</h2>
          <p className="text-body-regular text-text-secondary">stages is a flat list of label, value and optional color entries, top of the funnel first. Add a stage and it gets a column - widths, necks, percentages, and the footer are all derived. Colours cycle the chart palette unless overridden. The period pill is a dropdown when you pass ranges - each range carries its own data (and optionally delta / headline) and the chart re-animates on selection; onRangeChange lets you fetch instead. With no data props the card ships three demo ranges, which is what the previews above use.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_1_CODE}</code></pre>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}
