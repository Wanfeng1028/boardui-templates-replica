"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiBarChartLine } from "@remixicon/react";
import { AppShell } from "@/components/application/app-shell/app-shell";

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

import { StatCards } from "@/components/application/dashboard/stat-cards";

export default function StatCardsPage() {
  return (
    <AppShell title="Stat Cards" icon={RiBarChartLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          KPI cards for dashboard headers, in two looks — the compact row the dashboard templates use, and a
          footer variant with a gradient icon tile, an optional info tooltip, a display-size value, and a
          footer band carrying the comparison caption and a delta pill.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the stat cards using our CLI or manually. The CLI also pulls the chip and tooltip
            primitives they compose. The CLI copies the component source (with its internal dependencies) into
            your project and installs any required npm packages.
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add stat-cards`} />
        </Section>

        <Section title="Variants">
          <p className="text-body-regular text-text-secondary">
            Two looks via the variant prop. plain (the default) is the compact card from the dashboard
            templates — neutral icon tile, label, value, and a delta chip. footer leads with a tinted gradient
            icon tile beside the label, sets the value at display size, and moves the comparison into a footer
            band with a white delta pill whose glyph follows deltaColor.
          </p>
          <StatCards />
          <StatCards variant="footer" />
          <CodeBlock
            code={`<StatCards />                  {/* compact: icon, label, value, delta chip */}
<StatCards variant="footer" /> {/* icon tile + label, display value, footer band */}`}
          />
        </Section>

        <Section title="Bring your own data">
          <p className="text-body-regular text-text-secondary">
            Pass stats to replace the demo metrics. The footer variant reads three extra optional fields per
            stat: tone tints the icon tile (blue, orange, purple, pink, sky, or emerald), caption swaps the
            footer text, and hint adds an info glyph with a tooltip.
          </p>
          <CodeBlock
            code={`import { RiCoinsFill, RiShoppingBasket2Fill } from "@remixicon/react";
import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";

const stats: Stat[] = [
  {
    icon: RiCoinsFill,
    label: "Total revenue",
    value: "$152,313.92",
    delta: "16%",
    deltaColor: "lime",              // lime | rose | neutral - picks the pill glyph too
    tone: "blue",                    // icon tile tint (footer variant)
    caption: "From last month",      // footer band caption (footer variant)
    hint: "Gross revenue across all channels.",  // info tooltip (footer variant)
  },
  {
    icon: RiShoppingBasket2Fill,
    label: "Total orders",
    value: "25,162",
    delta: "20%",
    deltaColor: "lime",
    tone: "orange",
  },
];

<StatCards variant="footer" stats={stats} />`}
          />
        </Section>

        <BackLink />
      </div>
    </AppShell>
  );
}
