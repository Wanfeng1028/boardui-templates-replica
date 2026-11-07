"use client";

import { RiArrowLeftLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LineChartCard } from "@/components/application/charts/line-chart-card";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
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

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

const SHARP_CODE = `{/* Straight segments between points instead of the monotone curve */}
<LineChartCard shape="sharp" />`;

/**
 * Line Chart Card — docs page replica.
 * Source: boardui.com/components/line-chart-card. Pro component.
 */
export default function LineChartCardPage() {
  return (
    <DocsLayout variant="library" title="Line Chart">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span
            className={cx(
              "w-fit rounded-full border border-border-button-default px-2.5 py-0.5",
              "text-caption-1-semibold text-text-secondary",
            )}
          >
            Pro
          </span>
          <p className="text-body-regular text-text-secondary">
            The line chart from the dashboard — a Recharts line over a soft area gradient,
            Weekly/Monthly/Yearly switcher, delta chip, and a count-up headline with a pulsing
            active dot that follows the cursor. Curved by default; one prop switches to sharp,
            straight-segment corners.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Line Chart Card is part of BoardUI Pro.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Sharp corners">
          <p className="text-body-regular text-text-secondary">
            <code>shape=&quot;sharp&quot;</code> joins the points with straight segments — same
            gradient, dot, and hover behaviour, just a crisper line for data where the in-between
            values shouldn&apos;t read as interpolated.
          </p>
          <Demo>
            <div className="w-full max-w-[560px]">
              <LineChartCard />
            </div>
          </Demo>
          <p className="text-body-2-regular text-text-tertiary">
            The live card above switches its curve with its own built-in control; the replica on
            this site has no <code>shape</code> prop, so the original example below is shown as
            text.
          </p>
          <CodeBlock code={SHARP_CODE} />
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </DocsLayout>
  );
}
