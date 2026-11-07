"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { RadarChartCard } from "@/components/application/charts/radar-chart-card";

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

const VARIANTS_CODE = `{/* Dots on every vertex */}
<RadarChartCard variant="dots" />

{/* Outline only - two series and a legend */}
<RadarChartCard
  variant="lines"
  series={[
    { key: "desktop", label: "Desktop" },
    { key: "mobile", label: "Mobile" },
  ]}
/>

{/* Centre score: each axis label carries its value, low ones turn rose */}
<RadarChartCard variant="score" alertBelow={30} />`;

const DATA_CODE = `const data = [
  { label: "January",  desktop: 186, mobile: 80 },
  { label: "February", desktop: 305, mobile: 200 },
  { label: "March",    desktop: 237, mobile: 120 },
  { label: "April",    desktop: 273, mobile: 190 },
  { label: "May",      desktop: 209, mobile: 130 },
  { label: "June",     desktop: 214, mobile: 140 },
];

<RadarChartCard
  title="Visitors"
  data={data}
  series={[
    { key: "desktop", label: "Desktop" }, // palette colour
    { key: "mobile",  label: "Mobile", color: "var(--color-chart-6)" }, // or your own
  ]}
  max={320} // optional radius ceiling (defaults to the largest value)
  headline={1424} // optional resting headline (defaults to the primary total)
  delta={0.052} // "+5.2%" chip
  range="Jan – Jun 2024" // static pill…
/>`;

const RANGES_CODE = `// …or a working period dropdown: each range overrides data / delta / headline.
<RadarChartCard
  title="Visitors"
  series={[{ key: "desktop", label: "Desktop" }]}
  ranges={[
    { id: "h1", label: "H1 2024", data: h1Data, delta: 0.052 },
    { id: "h2", label: "H2 2024", data: h2Data, delta: 0.081 },
    { id: "year", label: "2024", data: yearData, delta: 0.067 },
  ]}
  defaultRange="h1"
  onRangeChange={(id) => track("radar_range", { id })}
/>`;

/** Radar Chart Card detail page: boardui.com/components/radar-chart-card, in-site. */
export default function RadarChartCardPage() {
  return (
    <DocsLayout variant="library" title="Radar Chart Card">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="purple" variant="subtle">
            Pro
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Charts</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A radar chart in the dashboard card shell - polygon grid in the chart tokens, count-up headline that
          follows the hovered axis, delta chip and period pill, and a pulsing active dot on every series. One prop
          switches between filled, dotted, lines-only, and a centre-score layout.
        </p>
        <RadarChartCard />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Radar Chart Card is part of BoardUI Pro.</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add radar-chart-card</code>
            <CopyButton text="npx boardui@latest add radar-chart-card" />
          </div>
        </Section>
        <Section title="Variants">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">variant</code> picks the look:{" "}
            <code className="font-mono text-body-2-medium text-text-primary">filled</code> (default),{" "}
            <code className="font-mono text-body-2-medium text-text-primary">dots</code>,{" "}
            <code className="font-mono text-body-2-medium text-text-primary">lines</code> for comparing series, and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">score</code>, which prints each axis
            value beside its label and averages them into a raised centre disc.{" "}
            <code className="font-mono text-body-2-medium text-text-primary">tiles</code> (as in the preview above)
            adds a stat tile per axis under any of them and lets the card grow.
          </p>
          <Code code={VARIANTS_CODE} />
        </Section>
        <Section title="Data">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">data</code> is a flat list of rows - one
            per axis - keyed by <code className="font-mono text-body-2-medium text-text-primary">label</code>, with a
            numeric field per series. <code className="font-mono text-body-2-medium text-text-primary">series</code>{" "}
            names those fields and, optionally, their colours; everything else (radius ceiling, totals, legend
            values, hover states) is derived. The period pill is a dropdown when you pass{" "}
            <code className="font-mono text-body-2-medium text-text-primary">ranges</code> - each range carries its
            own data (and optionally <code className="font-mono text-body-2-medium text-text-primary">delta</code> /{" "}
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
    </DocsLayout>
  );
}
