"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiMoonLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { SleepScoreCard } from "@/components/application/charts/sleep-score-card";

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

function CommandRow({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <code className="font-mono text-body-2-medium text-text-primary">{command}</code>
      <CopyButton text={command} />
    </div>
  );
}

/** Sleep Score Card detail page: boardui.com/components/sleep-score-card, in-site. */
export default function SleepScoreCardPage() {
  return (
    <AppShell title="Sleep Score Card" icon={RiMoonLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="purple" variant="subtle">
            Pro
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Charts</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          The sleep score ring from the medical dashboard - a segmented arc gauge where hovering a metric row focuses
          its segment, with duration, quality, and consistency sub-scores below.
        </p>
        <SleepScoreCard />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Sleep Score Card is part of BoardUI Pro.</p>
          <p className="text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this component and all of its source files. Activate your license once,
            then install it directly into your project with the CLI.
          </p>
          <div className="flex flex-col gap-3">
            <p className="text-body-medium text-text-primary">1. Activate your license</p>
            <p className="text-body-regular text-text-secondary">
              Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.
            </p>
            <CommandRow command="npx boardui@latest login YOUR_LICENSE_KEY" />
            <p className="text-body-medium text-text-primary">2. Install the component</p>
            <p className="text-body-regular text-text-secondary">
              The CLI copies the source and resolves every BoardUI and npm dependency for you.
            </p>
            <CommandRow command="npx boardui@latest add sleep-score-card" />
          </div>
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
