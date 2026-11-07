"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiBarChartLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        void navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
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

const OWN_NUMBERS_CODE = `import {
  RevenueChartCard,
  type RevenuePoint,
} from "@/components/application/dashboard/revenue-chart-card";

// Twelve points, one per month. \`current\` is this year, \`previous\` the same
// month a year earlier; the headline and the delta are computed from them.
const revenue: RevenuePoint[] = [
  { label: "Jan", current: 9840, previous: 8210 },
  { label: "Feb", current: 10120, previous: 8460 },
  // ...
  { label: "Dec", current: 14703, previous: 11924 },
];

<RevenueChartCard data={revenue} title="Net revenue" />`;

const IN_A_ROW_CODE = `{/* Fills a dashboard row beside another card; the default height is 344px */}
<div className="flex flex-col gap-4 xl:flex-row">
  <RevenueChartCard />
  <OrdersChartCard />
</div>`;

/** Revenue Chart Card detail page: boardui.com/components/revenue-chart-card, in-site. */
export default function RevenueChartCardPage() {
  return (
    <AppShell title="Revenue Chart Card" icon={RiBarChartLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Charts</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A year of monthly revenue drawn against the year before: the current year as a soft area and solid line,
          last year as a dashed line behind it, so the gap between them is the story. The headline counts up to the
          total with a delta chip, and hovering a month swaps it for that month&apos;s figure and what it was a year
          earlier. The same frame as the stat cards and the Pro chart cards, so it drops into any dashboard row.
          Free, built on Recharts.
        </p>
        <RevenueChartCard />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Add the revenue chart with the CLI, which also installs Recharts and the chip it composes, or copy the
            file. The CLI copies the component source (with its internal dependencies) into your project and installs
            any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add revenue-chart-card</code>
            <CopyButton text="npx boardui@latest add revenue-chart-card" />
          </div>
        </Section>
        <Section title="Your own numbers">
          <p className="text-body-regular text-text-secondary">
            Pass <code className="font-mono text-body-2-medium text-text-primary">data</code> as twelve points with a{" "}
            <code className="font-mono text-body-2-medium text-text-primary">current</code> and a{" "}
            <code className="font-mono text-body-2-medium text-text-primary">previous</code> value. Totals, the delta
            and the hover readout are derived, so there is nothing else to keep in sync.{" "}
            <code className="font-mono text-body-2-medium text-text-primary">title</code> sets the resting headline
            label.
          </p>
          <Code code={OWN_NUMBERS_CODE} />
        </Section>
        <Section title="In a row">
          <p className="text-body-regular text-text-secondary">
            The card is <code className="font-mono text-body-2-medium text-text-primary">flex-1</code> and 344px tall
            by default, so it shares a row with the Orders Chart Card or any other card, as on the chat starter&apos;s
            dashboard.
          </p>
          <div className="flex flex-col gap-4 xl:flex-row">
            <RevenueChartCard />
            <OrdersChartCard />
          </div>
          <Code code={IN_A_ROW_CODE} />
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
