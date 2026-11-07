"use client";

import { RiArrowLeftLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { AreaChartCard } from "@/components/application/charts/area-chart-card";
import { PrevNext } from "@/components/application/docs/prev-next";
import { ProLicenseCard } from "@/components/application/docs/pro-license-card";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-3-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-secondary-default p-4">
      <pre className="text-body-2-regular whitespace-pre text-text-primary">{code}</pre>
    </div>
  );
}

const PREVIEW_CODE = `import { AreaChartCard } from "@/components/application/charts/area-chart-card";

export function Example() {
  // No props: three built-in demo periods in the top-right dropdown.
  return <AreaChartCard tiles />;
}`;

const VARIANTS_CODE = `{/* Overlapping translucent areas - comparison rather than composition */}
<AreaChartCard variant="overlap" />

{/* 100% stacked: every category fills the height, so it reads as share */}
<AreaChartCard variant="percent" />

{/* Straight segments instead of the monotone spline */}
<AreaChartCard shape="sharp" />`;

const DATA_CODE = `// One row per category, one numeric field per series.
const data = [
  { label: "Jan", organic: 2400, referral: 1200, paid: 800 },
  { label: "Feb", organic: 2800, referral: 1400, paid: 700 },
  // …
];

<AreaChartCard
  title="Visitors"
  data={data}
  series={[
    { key: "organic", label: "Organic" },                          // palette colour
    { key: "referral", label: "Referral" },
    { key: "paid", label: "Paid", color: "var(--color-chart-3)" }, // or your own
  ]}
  headline={64820}   // optional resting headline (defaults to the grand total)
  delta={0.082}      // "+8.2%" chip
  range="This year"  // static pill…
  tiles              // stat tile per series under the chart
/>

// …or a working period dropdown: each range overrides data / delta / headline.
<AreaChartCard
  ranges={[
    { id: "year", label: "This year", data: thisYear, delta: 0.082 },
    { id: "prev", label: "Last year", data: lastYear, delta: -0.036 },
  ]}
/>`;

/** Area Chart Card — boardui.com/components/area-chart-card (Pro). */
export default function AreaChartCardPage() {
  return (
    <AppShell title="Area Chart Card" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        Composition over time — several series as stacked areas with soft gradient fills, a dashed cursor, and a
        count-up headline that swaps to the hovered category&apos;s total. One prop switches between stacked,
        overlapping and 100% views; another swaps the monotone spline for straight segments.
      </p>

      <Section title="Preview">
        <Demo>
          <div className="w-full">
            <AreaChartCard tiles />
          </div>
        </Demo>
        <Code code={PREVIEW_CODE} />
      </Section>

      <Section title="Installation">
        <ProLicenseCard name="Area Chart Card" kind="component" installSlug="area-chart-card" />
      </Section>

      <Section title="Variants">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">stacked</code> (default) reads as volume,{" "}
          <code className="text-body-2-regular text-text-primary">overlap</code> compares series against each
          other, and <code className="text-body-2-regular text-text-primary">percent</code> normalises every
          category to 100% so the chart reads as share.{" "}
          <code className="text-body-2-regular text-text-primary">shape</code> picks the curve.
        </p>
        <Demo>
          <div className="grid w-full gap-4 lg:grid-cols-2">
            <AreaChartCard variant="overlap" />
            <AreaChartCard variant="percent" />
          </div>
        </Demo>
        <Code code={VARIANTS_CODE} />
      </Section>

      <Section title="Data">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">data</code> is a flat list of rows keyed by{" "}
          <code className="text-body-2-regular text-text-primary">label</code> with a numeric field per series;{" "}
          <code className="text-body-2-regular text-text-primary">series</code> names those fields and, optionally,
          their colours. Totals, the legend, the tiles and every hover state are derived. The period pill is a
          dropdown when you pass <code className="text-body-2-regular text-text-primary">ranges</code>; with no data
          props the card ships three demo periods, which is what the preview above uses.
        </p>
        <Code code={DATA_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>

      <PrevNext
        prev={{ href: "/components/activity-rings-card", label: "Activity Rings", sub: "Concentric goal rings" }}
        next={{ href: "/components/bar-list-card", label: "Bar List", sub: "Ranked horizontal bars" }}
      />
    </AppShell>
  );
}
