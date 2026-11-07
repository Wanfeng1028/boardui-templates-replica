"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiSearchEyeLine } from "@remixicon/react";
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

import { WebSearch } from "@/components/application/pro/web-search";

export default function WebSearchPage() {
  return (
    <AppShell title="Web Search" icon={RiSearchEyeLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          The research counterpart to Task List: where that one logs the work an agent did, this logs where it
          went. Each step is a query it ran or a page it opened, and a step that found something branches once
          more into its sources, shown as overlapping site marks so a Reddit thread reads as one without anybody
          parsing a domain.
        </p>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Web Search is part of BoardUI Pro.</p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this component and all of its source files. Activate your license
            once, then install it directly into your project with the CLI.
          </p>
          <CodeBlock label="1 — Activate your license" code={`npx boardui@latest login YOUR_LICENSE_KEY`} />
          <p className="text-body-regular text-text-secondary">
            Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.
          </p>
          <CodeBlock label="2 — Install the component" code={`npx boardui@latest add web-search`} />
          <p className="text-body-regular text-text-secondary">
            The CLI copies the source and resolves every BoardUI and npm dependency for you.
          </p>
          <p className="text-body-regular text-text-secondary">
            This component is included in BoardUI Pro. Get BoardUI Pro now and install it end away.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="In a chat">
          <p className="text-body-regular text-text-secondary">
            Sending the message starts the trail, the sources stream in under the user turn, and the answer waits
            on <code>onComplete</code>. It shares its reveal, its clipping edge and its curved guide with Task
            List, so the two can sit in one thread without looking like two different products.
          </p>
          <WebSearch />
        </Section>

        <Section title="Sources">
          <p className="text-body-regular text-text-secondary">
            Give a step sources and it branches once more, into a Sources row carrying the marks as an
            overlapping stack. A table of five URLs is the heaviest thing that can appear in a thread and nobody
            reads it mid-run; what a reader wants at a glance is where the agent looked, which recognisable marks
            answer instantly. Each carries its title and domain on hover, lifts clear of its neighbours, and
            becomes a link when you pass an <code>href</code>. Past six, the rest collapse into a count.
          </p>
          <CodeBlock
            code={`{
  label: "Component library pricing",
  meta: "5 results",
  sources: [
    { title: "Tailwind UI vs building your own", domain: "www.reddit.com", brand: "reddit", href: "…" },
    { title: "We shipped our design system in 6 weeks", domain: "www.linkedin.com", brand: "linkedin" },
    { title: "shadcn/ui — the registry model", domain: "github.com", brand: "github" },
  ],
}`}
          />
        </Section>

        <Section title="Site marks">
          <p className="text-body-regular text-text-secondary">
            <code>brand</code> draws a site&apos;s real logo from the same 24-mark set the social buttons use, in
            the site&apos;s own colour. The handful whose brand colour is black take the text colour instead and
            invert with the theme, which is what their own guidelines ask for. Anything not in that set takes a
            plain icon.
          </p>
          <CodeBlock
            code={`// Any of the 24 marks the design system already draws.
{ label: "Searched Reddit for", query: "component library", brand: "reddit" }
{ label: "Searched X for", query: "design tokens", brand: "x" }
{ label: "Checked the repo", brand: "github" }

// Anything else takes a plain icon instead.
{ label: "Ran 3 searches", icon: RiSearchLine }`}
          />
        </Section>

        <Section title="Pacing">
          <p className="text-body-regular text-text-secondary">
            A search that hits cache and one that crawls five pages do not take the same time, and a log that
            marches at a fixed tempo reads as a list being printed rather than as work happening. Give a step{" "}
            <code>dwell</code> and the trail holds there that much longer, shimmering the whole while, before
            the next one lands. A step with sources splits in two: the step, then its Sources row a beat later.
          </p>
          <p className="text-body-regular text-text-secondary">
            While the search runs, an Agent Thinking indicator sits at the tail of the trail and moves down as
            each step lands, so the log always ends on what is being worked on rather than on the last thing
            finished. It leaves when the run completes. Pass <code>working</code> to relabel it, or{" "}
            <code>false</code> to drop it.
          </p>
          <CodeBlock
            code={`const steps = [
  { label: "Ran 3 searches", icon: RiSearchLine, heading: true, dwell: 2200 },
  { label: "Searching for what teams pay for", meta: "5 results", dwell: 2400, sources },
  { label: "Searched X for", query: "design system pricing", brand: "x", dwell: 1900 },
];`}
          />
        </Section>

        <Section title="Driving it from real events">
          <p className="text-body-regular text-text-secondary">
            Dwells are still a stand-in for real latency. Once you have a live stream, pass{" "}
            <code>revealed</code> and advance it as each query resolves; the internal timer switches off and
            every animation stays the same. It counts rows, so a step carrying sources is two of them.
          </p>
          <CodeBlock
            code={`// One unit per row, so a step that found sources is two: the step,
// then its Sources row a beat later. Advance it as each query resolves
// and the internal timer stays out of the way.
<WebSearch steps={steps} revealed={rowsSeen} />`}
          />
        </Section>

        <BackLink />
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/web-search（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
