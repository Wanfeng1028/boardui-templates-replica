"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiInformation2Line } from "@remixicon/react";
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

import { Focusable } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

function PlacedTooltip({ placement, label }: { placement: "top" | "bottom" | "left" | "right"; label: string }) {
  return (
    <TooltipTrigger>
      <Focusable>
        <Button variant="secondary">{label}</Button>
      </Focusable>
      <Tooltip placement={placement}>{label} tooltip</Tooltip>
    </TooltipTrigger>
  );
}

export default function TooltipPage() {
  return (
    <AppShell title="Tooltip" icon={RiInformation2Line} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          A light-surface tooltip built on React Aria - it opens on hover and focus, flips to stay on-screen,
          points a caret at its trigger, and blurs + scales from 0.9 on the way in and out. Hover any of the
          buttons below.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this tooltip component using our CLI or manually:
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add tooltip`} />
          <p className="text-body-regular text-text-secondary">
            The CLI copies the component source (with its internal dependencies) into your project and installs any
            required npm packages.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="Positions">
          <p className="text-body-regular text-text-secondary">
            A tooltip can sit on any side of its trigger - set the <code>placement</code> prop on{" "}
            <code>Tooltip</code> to <code>top</code> (default), <code>bottom</code>, <code>left</code> or{" "}
            <code>right</code>. The caret and the blur-in transform rotate to match, and React Aria automatically
            flips to the opposite side if there isn&apos;t room on-screen. Hover the buttons below.
          </p>
          <p className="text-body-regular text-text-secondary">
            Every tooltip opens the same way, regardless of side: you hover or keyboard-focus the{" "}
            <code>TooltipTrigger</code>. The trigger&apos;s first child is the thing you point at (here our{" "}
            <code>Button</code>, wrapped in <code>Focusable</code> so a plain <code>&lt;button&gt;</code>{" "}
            becomes a valid trigger), and the <code>Tooltip</code> beside it is what pops up. So a left-side
            tooltip is just <code>placement=&quot;left&quot;</code> - nothing about the interaction changes:
          </p>
          <Demo>
            <div className="grid grid-cols-2 place-items-center gap-x-5 gap-y-6">
              <PlacedTooltip placement="top" label="Top" />
              <PlacedTooltip placement="bottom" label="Bottom" />
              <PlacedTooltip placement="left" label="Left" />
              <PlacedTooltip placement="right" label="Right" />
            </div>
          </Demo>
          <CodeBlock
            code={`<TooltipTrigger delay={0}>
  <Focusable>
    <Button variant="secondary">Top</Button>
  </Focusable>
  <Tooltip placement="top">Top</Tooltip>
</TooltipTrigger>

<TooltipTrigger delay={0}>
  <Focusable>
    <Button variant="secondary">Bottom</Button>
  </Focusable>
  <Tooltip placement="bottom">Bottom</Tooltip>
</TooltipTrigger>

<TooltipTrigger delay={0}>
  <Focusable>
    <Button variant="secondary">Left</Button>
  </Focusable>
  <Tooltip placement="left">Left</Tooltip>
</TooltipTrigger>

<TooltipTrigger delay={0}>
  <Focusable>
    <Button variant="secondary">Right</Button>
  </Focusable>
  <Tooltip placement="right">Right</Tooltip>
</TooltipTrigger>`}
          />
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            The tooltip comes in 2 sizes: <code>sm</code> (12px Caption 1, the default - used by the
            Contributions heatmap) and <code>md</code> (14px Body 1, with roomier padding). Switch by changing
            the <code>size</code> prop on the <code>Tooltip</code> - compare the Small and Medium triggers in the
            preview above.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-4">
              <TooltipTrigger>
                <Focusable>
                  <Button variant="secondary">Small (default)</Button>
                </Focusable>
                <Tooltip>Small hint, Caption 1</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <Focusable>
                  <Button variant="secondary">Medium</Button>
                </Focusable>
                <Tooltip size="md">Medium hint, Body 1</Tooltip>
              </TooltipTrigger>
            </div>
          </Demo>
          <CodeBlock
            code={`<Tooltip size="sm">12 contributions on April 26</Tooltip>
<Tooltip size="md">12 contributions on April 26</Tooltip>`}
          />
        </Section>

        <Section title="Table of Contents">
          <p className="text-body-regular text-text-secondary">
            Tooltips are built on React Aria, so the trigger&apos;s single child must be a focusable component
            (react-aria <code>Button</code>, or anything using <code>useFocusable</code>). Hover and keyboard
            focus both open it, <code>Escape</code> closes it, and the trigger gets{" "}
            <code>aria-describedby</code> wired to the tooltip automatically. We&apos;ll cover the following
            topics:
          </p>
          <ul className="flex list-disc flex-col gap-1 ps-5 text-body-regular text-text-secondary">
            <li>Basic tooltip</li>
            <li>Placement &amp; the caret</li>
            <li>Arrow &amp; offset props</li>
            <li>Open / close delay</li>
            <li>Blur-and-scale transition</li>
          </ul>
          <p className="text-body-regular text-text-secondary">
            For a real-world use, hover the squares in the <code>ContributionsCard</code> - every cell is a{" "}
            <code>TooltipTrigger</code> showing its date and count.
          </p>
        </Section>

        <BackLink />
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/tooltip（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
