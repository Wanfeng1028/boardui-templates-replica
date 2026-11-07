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

import { StepsCard } from "@/components/application/charts/steps-card";

export default function StepsCardPage() {
  return (
    <DocsLayout variant="library" title="Steps Chart">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          The weekly steps bar chart from the medical dashboard — seven day bars with a week-range switcher, a
          count-up step total, and a hover outline on the active bar.
        </p>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Steps Card is part of BoardUI Pro. Your BoardUI Pro license unlocks this component and all of its
            source files. Activate your license once, then install it directly into your project with the CLI.
          </p>
          <CodeBlock label="1 — Activate your license" code={`npx boardui@latest login YOUR_LICENSE_KEY`} />
          <CodeBlock label="2 — Install the component" code={`npx boardui@latest add steps-card`} />
        </Section>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            Seven day bars for the selected week, with the total step count and a week-range switcher. Hover a
            bar to highlight it.
          </p>
          <StepsCard />
          <CodeBlock code={`<StepsCard />`} />
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}
