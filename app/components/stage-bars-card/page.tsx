"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";

function CodeBlock({ code, label = "Code" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-2">
        <span className="text-caption-1-medium text-text-tertiary">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre dir="ltr" className="overflow-x-auto p-4 font-mono text-caption-1-regular text-text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/components"
      className="inline-flex w-fit items-center gap-1.5 rounded-md text-body-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <RiArrowLeftLine className="size-4" />
      Back to components
    </Link>
  );
}

import { StageBarsCard } from "@/components/application/charts/stage-bars-card";

export default function StageBarsCardPage() {
  return (
    <DocsLayout variant="library" title="Stage Bars">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          The funnel as a list — one rounded pill per stage over the chart track, name on the left, value and
          share of the top stage on the right. Widths animate in on mount, hovering a stage darkens its pill
          and fades the rest, and the headline follows. Takes the same stages as the Funnel Chart Card.
        </p>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Stage Bars Card is part of BoardUI Pro. Your BoardUI Pro license unlocks this component and all of its
            source files. Activate your license once, then install it directly into your project with the CLI.
          </p>
          <CodeBlock label="1 — Activate your license" code={`npx boardui@latest login YOUR_LICENSE_KEY`} />
          <CodeBlock label="2 — Install the component" code={`npx boardui@latest add stage-bars-card`} />
        </Section>

        <Section title="Mono">
          <p className="text-body-regular text-text-secondary">
            mono drops the per-stage hues for a single ink — mid grey on light, near-white on dark — the
            reference&apos;s mono stage funnel.
          </p>
          <StageBarsCard />
          <CodeBlock
            code={`{/* Single ink: every pill in one grey (mid grey on light, near-white on dark) */}
<StageBarsCard mono />`}
          />
        </Section>

        <Section title="Data">
          <p className="text-body-regular text-text-secondary">
            stages is a flat label, value, color list, top of the funnel first. Add a stage and it gets a row
            and a tile (three tiles per row, the card grows to fit); the label column sizes to the longest
            name, shares are derived from the first stage. Each stage may carry a 14px icon drawn at the left
            end inside its bar — showIcons set to false hides them all. The period pill is a dropdown when
            you pass ranges — each range carries its own data (and optionally delta / headline) and the chart
            re-animates on selection; onRangeChange lets you fetch instead. With no data props the card ships
            three demo ranges, which is what the preview above uses.
          </p>
          <CodeBlock
            code={`import { RiEyeLine, RiUserAddLine } from "@remixicon/react";

// One entry per stage, top of the funnel first - the same shape FunnelChartCard
// takes, plus an optional 14px icon drawn at the left end inside the bar.
const stages = [
  { label: "Visits", value: 4820, icon: <RiEyeLine className="size-3.5 text-neutral-950" /> },
  { label: "Sign-up", value: 3260, icon: <RiUserAddLine className="size-3.5 text-neutral-950" /> },
  { label: "Active", value: 2010 },
  { label: "Pro", value: 1160 },
  { label: "Team", value: 540 },
  { label: "Enterprise", value: 180, color: "var(--color-chart-1)" }, // override any colour
];

<StageBarsCard
  title="Pipeline"
  stages={stages}
  headline={4820}    // optional resting headline (defaults to the first stage)
  delta={0.024}      // "+2.4%" chip
  range="Last 30 days"   // static pill...
  showIcons          // default; false hides the icons without removing them from the data
/>

// ...or a working period dropdown: each range overrides stages / delta / headline.
<StageBarsCard
  title="Pipeline"
  ranges={[
    { id: "7d", label: "Last 7 days", stages: week, delta: 0.024 },
    { id: "30d", label: "Last 30 days", stages: month, delta: 0.061 },
    { id: "90d", label: "Last 90 days", stages: quarter, delta: -0.012 },
  ]}
/>`}
          />
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}
