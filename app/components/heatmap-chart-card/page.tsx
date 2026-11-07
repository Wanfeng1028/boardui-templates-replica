"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { HeatmapChartCard } from "@/components/application/charts/heatmap-chart-card";

/** Detail page for heatmap-chart-card - content mirrors boardui.com/components/heatmap-chart-card. */

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

const CODE_0_CODE = "// One entry per row; values line up with `columns`.\nconst columns = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\"];\nconst rows = [\n  { label: \"EMEA\", values: [42, 48, 55, 61, 70, 74] },\n  { label: \"AMER\", values: [38, 40, 47, 52, 58, 66] },\n  { label: \"APAC\", values: [21, 25, 29, 36, 41, 49] },\n  { label: \"LATAM\", values: [12, 14, 15, 19, 24, 27] },\n];\n\n<HeatmapChartCard\n  title=\"Revenue by region\"\n  columns={columns}\n  color=\"var(--color-chart-7)\" // ramp accent; defaults to chart-6 blue\n  max={80} // fully saturated cell; defaults to the largest value\n  ranges={[ // period dropdown - each range overrides rows / columns / max / delta\n    { id: \"h1\", label: \"H1 2024\", rows: h1Rows, delta: 0.118 },\n    { id: \"h2\", label: \"H2 2024\", rows: h2Rows, delta: 0.064 },\n  ]}\n/>\n\n// Or a static pill: rows={rows} range=\"H1 2024\"";

export default function HeatmapChartCardPage() {
  return (
    <AppShell title="Heatmap Chart Card" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/heatmap-chart-card</span>
        </div>
        <p className="text-body-regular text-text-secondary">A matrix heatmap in the dashboard card shell - weekday x hour, region x month, anything with two axes. Cells mix the accent into the chart track by value so the ramp follows the theme in both modes; hovering a cell rings it, darkens its row and column labels, and swaps the headline to that cell's value. Plain CSS grid, no chart library.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">Heatmap Chart Card is part of BoardUI Pro. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add heatmap-chart-card</code>
            <CopyButton text={"npx boardui@latest add heatmap-chart-card"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Data</h2>
          <p className="text-body-regular text-text-secondary">rows is a list of label/values entries and columns names the value slots. Add a row or a column and the grid reflows; color swaps the ramp accent and max pins the saturated end. The period pill is a dropdown when you pass ranges - each range carries its own data (and optionally delta / headline) and the chart re-animates on selection; onRangeChange lets you fetch instead. With no data props the card ships three demo ranges, which is what the previews above use.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              <HeatmapChartCard />
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}
