"use client";

import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { ComboChartCard } from "@/components/application/charts/combo-chart-card";

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

const USAGE_CODE = `// One row per category, carrying both series' fields.
const data = [
  { label: "Jan", sessions: 4200, rate: 2.4 },
  { label: "Feb", sessions: 4800, rate: 2.6 },
  // …
];

<ComboChartCard
  title="Sessions"
  data={data}
  bar={{ key: "sessions", label: "Sessions", format: (n) => n.toLocaleString() }}
  line={{
    key: "rate",
    label: "Conversion",
    color: "var(--color-chart-6)",
    format: (n) => \`\${n}%\`,     // the right axis keeps its own formatting
  }}
  delta={0.094}
  ranges={[                      // period dropdown
    { id: "year", label: "This year", data: thisYear, delta: 0.094 },
    { id: "prev", label: "Last year", data: lastYear, delta: -0.028 },
  ]}
  tiles                          // bar total + line average below the chart
/>`;
export default function ComboChartCardPage() {
  return (
    <DocsLayout variant="library" title="Combo Chart Card">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="purple">
              Pro
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Volume and rate on one canvas - rounded bars on the left axis, a line on its own right axis, each
            with its own formatting. Hovering a category darkens its bar, dims the rest, pops a pulsing dot on
            the line, and swaps the headline; the tiles below hold the bar total and the line average.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Combo Chart Card is part of BoardUI Pro.</p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this component and all of its source files. Activate your license
            once, then install it directly into your project with the CLI.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">1 — Activate your license</p>
          <CodeBlock code={`npx boardui@latest login YOUR_LICENSE_KEY`} />
          <p className="text-body-regular text-text-secondary">
            Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">2 — Install the component</p>
          <CodeBlock code={`npx boardui@latest add combo-chart-card`} />
          <p className="text-body-regular text-text-secondary">
            The CLI copies the source and resolves every BoardUI and npm dependency for you.
          </p>
          <p className="text-body-regular text-text-secondary">
            This component is included in BoardUI Pro. Get BoardUI Pro now and install it end away.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="Data">
          <p className="text-body-regular text-text-secondary">
            Both series read from the same rows: <code>bar</code> and <code>line</code> each name a field, a
            label, an optional colour and their own format - the axes are independent, so a count and a percentage
            sit together without one flattening the other. The period pill is a dropdown when you pass{" "}
            <code>ranges</code>; with no data props the card ships three demo periods.
          </p>
          <Demo>
            <ComboChartCard />
          </Demo>
          <CodeBlock code={USAGE_CODE} />
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

// 已按原版逐字校对：boardui.com/components/combo-chart-card（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
