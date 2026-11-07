"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiToggleLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";

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

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const CONTROLLED_CODE = `const [period, setPeriod] = useState(new Set(["weekly"]));

<SegmentedControl
  selectedKeys={period}
  onSelectionChange={(keys) => keys.size > 0 && setPeriod(new Set(keys))}
  aria-label="Period"
>
  <SegmentedControlItem id="weekly">Weekly</SegmentedControlItem>
  <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
</SegmentedControl>`;

/** Segmented Control detail page: boardui.com/components/segmented-control, in-site. */
export default function SegmentedControlPage() {
  const [period, setPeriod] = useState<Set<string>>(new Set(["weekly"]));
  return (
    <AppShell title="Segmented Control" icon={RiToggleLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A single-select switch on a tertiary track with a sliding white thumb - the Weekly / Monthly / Yearly
          switcher from the chart cards. Built on React Aria ToggleButtonGroup: arrow keys move, Space selects.
        </p>
        <Demo>
          <SegmentedControl
            selectedKeys={period}
            onSelectionChange={(keys) => {
              if (keys.size > 0) setPeriod(new Set(Array.from(keys, (k) => String(k))));
            }}
            aria-label="Period"
          >
            <SegmentedControlItem id="weekly">Weekly</SegmentedControlItem>
            <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
          </SegmentedControl>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this segmented control using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add segmented-control</code>
            <CopyButton text="npx boardui@latest add segmented-control" />
          </div>
        </Section>
        <Section title="Controlled selection">
          <p className="text-body-regular text-text-secondary">
            Selection uses React Aria&apos;s key-set API: pass{" "}
            <code className="font-mono text-body-2-medium text-text-primary">selectedKeys</code> +{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onSelectionChange</code> to control it,
            or <code className="font-mono text-body-2-medium text-text-primary">defaultSelectedKeys</code> for
            uncontrolled. Guard against empty sets to keep one segment always active.
          </p>
          <Code code={CONTROLLED_CODE} />
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
