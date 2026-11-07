"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiBubbleChartLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { ScatterChartCard } from "@/components/application/charts/scatter-chart-card";

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

const DATA_CODE = `// Points are grouped into series - each gets a colour, a legend row and a tile.
// Any point carrying \`z\` turns the card into a bubble chart.
<ScatterChartCard
  title="Revenue per account"
  series={[
    {
      label: "Starter",
      points: [
        { x: 12, y: 180, z: 40, label: "Acme" },
        { x: 18, y: 240, z: 60, label: "Bolt" },
      ],
    },
    { label: "Growth", points: growthPoints, color: "var(--color-chart-6)" },
  ]}
  axisLabels={["Sessions", "Revenue"]} // captions under the plot
  format={(n) => \`$\${n.toLocaleString()}\`} // y measure
  formatX={(n) => \`\${n}k\`} // x measure
  bubble={false} // force plain dots even when the data carries z
  tiles // average y per series below the chart
/>`;

/** Scatter Chart Card detail page: boardui.com/components/scatter-chart-card, in-site. */
export default function ScatterChartCardPage() {
  return (
    <AppShell title="Scatter Chart Card" icon={RiBubbleChartLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="purple" variant="subtle">
            Pro
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Charts</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          The correlation view - one dot per record placed by two measures, sized by a third when the data carries
          one. Points are grouped into series so each cohort keeps its own colour; hovering one swaps the headline to
          that record and dims the other series, and axis captions sit under the plot.
        </p>
        <ScatterChartCard />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Scatter Chart Card is part of BoardUI Pro.</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add scatter-chart-card</code>
            <CopyButton text="npx boardui@latest add scatter-chart-card" />
          </div>
        </Section>
        <Section title="Without bubbles">
          <p className="text-body-regular text-text-secondary">
            Bubbles switch on automatically when any point carries a{" "}
            <code className="font-mono text-body-2-medium text-text-primary">z</code>; pass{" "}
            <code className="font-mono text-body-2-medium text-text-primary">bubble={`{false}`}</code> for even dots
            when the third measure isn&apos;t worth encoding.
          </p>
        </Section>
        <Section title="Data">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">series</code> is{" "}
            <code className="font-mono text-body-2-medium text-text-primary">{`{ label, points, color? }[]`}</code>{" "}
            and each point is{" "}
            <code className="font-mono text-body-2-medium text-text-primary">{`{ x, y, z?, label? }`}</code>. The
            point&apos;s <code className="font-mono text-body-2-medium text-text-primary">label</code> is what the
            header shows on hover; averages, the legend and the tiles are derived. The period pill is a dropdown when
            you pass <code className="font-mono text-body-2-medium text-text-primary">ranges</code>.
          </p>
          <Code code={DATA_CODE} />
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
