"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { SankeyChartCard } from "@/components/application/charts/sankey-chart-card";

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

const DATA_CODE = `// Sources carry the colour - every ribbon leaving a node takes that node's
// colour (linkColor="source", the default) - and sinks stay "neutral" so the
// ribbons paint them. Nodes without a colour cycle the palette by index.
const nodes = [
  { name: "Focus", color: "var(--color-chart-7)" },
  { name: "Meetings", color: "var(--color-chart-5)" },
  { name: "Browsing", color: "neutral" },
  { name: "Writing", color: "neutral" },
  { name: "Email", color: "neutral" },
];

// Links reference nodes by name (or index). Add a node + link and the
// layout rebalances; the right-hand percentages are shares of all sinks.
const links = [
  { source: "Focus", target: "Browsing", value: 16.2 },
  { source: "Focus", target: "Writing", value: 11.6 },
  { source: "Focus", target: "Email", value: 3.4 },
  { source: "Meetings", target: "Email", value: 1.2 },
];

<SankeyChartCard
  title="Tracked time"
  nodes={nodes}
  links={links}
  format={(n) => \`\${n}h\`} // headline + source labels
  range="This week" // static pill…
  axisLabels={["Tracked time", "Share of tracked time"]}
/>`;

const RANGES_CODE = `// …or a working period dropdown: each range overrides links (and nodes / delta / headline).
<SankeyChartCard
  nodes={nodes}
  ranges={[
    { id: "this-week", label: "This week", links: thisWeek },
    { id: "last-week", label: "Last week", links: lastWeek },
    { id: "this-month", label: "This month", links: thisMonth },
  ]}
/>`;

/** Sankey Chart Card detail page: boardui.com/components/sankey-chart-card, in-site. */
export default function SankeyChartCardPage() {
  return (
    <DocsLayout variant="library" title="Sankey Chart Card">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="purple" variant="subtle">
            Pro
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Charts</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A Sankey flow in the dashboard card shell. Recharts lays out the nodes and links; the card draws pill
          nodes in the chart tokens, tints every ribbon with its source&apos;s colour so each origin&apos;s flows read
          as one family, labels sources with name and value on the left and sinks with their share on the right, and
          isolates whatever you hover - node or link - while the headline follows.
        </p>
        <SankeyChartCard />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Sankey Chart Card is part of BoardUI Pro.</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add sankey-chart-card</code>
            <CopyButton text="npx boardui@latest add sankey-chart-card" />
          </div>
        </Section>
        <Section title="Data">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">nodes</code> is a{" "}
            <code className="font-mono text-body-2-medium text-text-primary">{`{ name, color? }`}</code> list and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">links</code> is{" "}
            <code className="font-mono text-body-2-medium text-text-primary">{`{ source, target, value }`}</code>,
            referencing nodes by name or index. Node values, the headline total, sink shares, and hover relationships
            are all derived from the links. The period pill is a dropdown when you pass{" "}
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
    </DocsLayout>
  );
}
