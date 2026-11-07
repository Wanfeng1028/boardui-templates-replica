"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { BarListCard } from "@/components/application/charts/bar-list-card";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="medium"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

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

const TABS_CODE = `import * as Flags from "country-flag-icons/react/3x2";

<BarListCard
  metricLabel="Visitors"
  tabs={[
    {
      id: "countries",
      label: "Countries",
      items: [
        { label: "United States of America", value: 3120, icon: <Flags.US className="h-3 w-[18px] rounded-[2px]" /> },
        { label: "India", value: 2160, icon: <Flags.IN className="h-3 w-[18px] rounded-[2px]" /> },
        // …
      ],
    },
    { id: "sources", label: "Sources", items: [{ label: "Direct", value: 5240 }] },
  ]}
  defaultTab="countries"
  onTabChange={(id) => track("breakdown_tab", { id })}
/>`;

const SINGLE_CODE = `{/* One list, no tabs - a heading takes the tab strip's place */}
<BarListCard title="Pages" metricLabel="Views" metric="value" items={pages} limit={4} />

{/* Single ink, mono grey bars */}
<BarListCard mono />`;

/** Bar List Card — boardui.com/components/bar-list-card (Pro). */
export default function BarListCardPage() {
  const command = "npx boardui@latest add bar-list-card";
  return (
    <AppShell title="Bar List Card" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        The analytics breakdown list — traffic by device, browser, OS, country, or source as ranked rows whose
        background bars encode each item&apos;s share, label on the bar, metric on the right. Our underline Tabs
        switch between lists, the metric caption sits on the same baseline, and long lists fade behind a small pill
        that expands the rest so the card grows with them.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          Bar List Card is part of BoardUI Pro. Dark mode ready — this component follows BoardUI semantic tokens
          automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Tabbed lists">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">tabs</code> is{" "}
          <code className="text-body-2-regular text-text-primary">{`{ id, label, items }[]`}</code>; each item may
          carry an <code className="text-body-2-regular text-text-primary">icon</code> — flags, favicons, anything
          16px. Shares are relative to the tab&apos;s total, bar widths to its largest item.
        </p>
        <Demo>
          <div className="w-full">
            <BarListCard />
          </div>
        </Demo>
        <Code code={TABS_CODE} />
      </Section>

      <Section title="Single list and mono">
        <p className="text-body-regular text-text-secondary">
          Pass <code className="text-body-2-regular text-text-primary">items</code> +{" "}
          <code className="text-body-2-regular text-text-primary">title</code> for one list without tabs,{" "}
          <code className="text-body-2-regular text-text-primary">metric=&quot;value&quot;</code> to print raw
          numbers instead of shares, and <code className="text-body-2-regular text-text-primary">mono</code> for a
          single grey ink.
        </p>
        <Code code={SINGLE_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
