"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiDonutChartLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { RadialChartCard } from "@/components/application/charts/radial-chart-card";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const VARIANTS_CODE = `{/* Ring names set along each arc */}
<RadialChartCard variant="labels" />

{/* No tracks - rings over a circular grid */}
<RadialChartCard variant="grid" />

{/* Single value against a goal, percent in the centre */}
<RadialChartCard variant="gauge" data={[{ label: "Visitors", value: 1260 }]} max={2000} delta={0.052} range="Last 7 days" />

{/* Thicker ring on a raised disc */}
<RadialChartCard variant="solid" data={[{ label: "Visitors", value: 1260 }]} max={2000} delta={0.052} range="Last 7 days" />

{/* Half gauge of stacked segments with a legend */}
<RadialChartCard
  variant="stacked"
  data={[
    { label: "Desktop", value: 1260 },
    { label: "Mobile", value: 570 },
  ]}
  delta={0.052}
  range="Last 7 days"
/>`;

const TILES_CODE = `{/* Stat tiles under the rings: three per row, the last row full width (5 → 3 + 2) */}
<RadialChartCard tiles />`;

const DATA_CODE = `// One item per ring / segment. First item = innermost ring.
const data = [
  { label: "Other",   value: 90 },
  { label: "Edge",    value: 173 },
  { label: "Firefox", value: 187 },
  { label: "Safari",  value: 200 },
  { label: "Chrome",  value: 275, color: "var(--color-chart-6)" }, // override any colour
];

<RadialChartCard
  title="Visitors"
  data={data}
  max={300} // full-circle value; defaults to 110% of the largest ring
  headline={925} // optional resting headline (defaults to the total)
  delta={0.052}
  range="Jan – Jun 2024" // static pill…
/>`;

const RANGES_CODE = `// …or a working period dropdown: each range overrides data / max / delta / headline.
<RadialChartCard
  variant="gauge"
  ranges={[
    { id: "7d", label: "Last 7 days", data: [{ label: "Visitors", value: 1260 }], max: 2000, delta: 0.052 },
    { id: "30d", label: "Last 30 days", data: [{ label: "Visitors", value: 4820 }], max: 6000, delta: 0.081 },
    { id: "90d", label: "Last 90 days", data: [{ label: "Visitors", value: 12400 }], max: 15000, delta: -0.024 },
  ]}
/>`;

/** Radial Chart Card detail page: boardui.com/components/radial-chart-card, in-site. */
export default function RadialChartCardPage() {
  return (
    <AppShell title="Radial Chart Card" icon={RiDonutChartLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="purple" variant="subtle">
            Pro
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Charts</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          Radial bars in the dashboard card shell - rounded arcs over the chart track, hover darkening one tone like
          every other BoardUI chart, and a count-up headline that follows the hovered ring. Six looks from one prop:
          plain, labelled, or gridded rings, thin and solid single-value gauges, and a stacked half gauge.
        </p>
        <RadialChartCard />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Radial Chart Card is part of BoardUI Pro.</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add radial-chart-card</code>
            <CopyButton text="npx boardui@latest add radial-chart-card" />
          </div>
        </Section>
        <Section title="Variants">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">rings</code> (default),{" "}
            <code className="font-mono text-body-2-medium text-text-primary">labels</code>, and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">grid</code> draw one ring per item.{" "}
            <code className="font-mono text-body-2-medium text-text-primary">gauge</code> and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">solid</code> show a single value against{" "}
            <code className="font-mono text-body-2-medium text-text-primary">max</code> with the percentage in the
            centre; <code className="font-mono text-body-2-medium text-text-primary">stacked</code> folds the items
            into a half gauge whose centre shows the primary segment&apos;s share and follows the hovered one.
          </p>
          <Code code={VARIANTS_CODE} />
        </Section>
        <Section title="With tiles">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">tiles</code> adds a stat tile per item
            under the chart - swatch and name over the value, three per row with the last row stretched to full width
            - and lets the card grow to fit. Hovering a tile focuses its ring and vice-versa.
          </p>
          <Code code={TILES_CODE} />
        </Section>
        <Section title="Data">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">data</code> is a flat{" "}
            <code className="font-mono text-body-2-medium text-text-primary">{`{ label, value, color? }`}</code>{" "}
            list. Add an item and it becomes a ring or segment, colours cycle the chart palette unless you set one,
            and <code className="font-mono text-body-2-medium text-text-primary">max</code> sets the full-circle
            value. The period pill is a dropdown when you pass{" "}
            <code className="font-mono text-body-2-medium text-text-primary">ranges</code> - each range carries its
            own data (and optionally{" "}
            <code className="font-mono text-body-2-medium text-text-primary">delta</code> /{" "}
            <code className="font-mono text-body-2-medium text-text-primary">headline</code>) and the chart
            re-animates on selection;{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onRangeChange</code> lets you fetch
            instead. With no data props the card ships three demo ranges, which is what the previews above use.
          </p>
          <Code code={DATA_CODE} />
          <Code code={RANGES_CODE} />
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
