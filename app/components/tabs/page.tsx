"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";
import { RiGlobalLine, RiInfinityLine } from "@remixicon/react";

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

import { Tab, TabList, Tabs } from "@/components/base/tabs/tabs";
import { PillTab, PillTabList } from "@/components/base/tabs/pill-tab";

export default function TabsPage() {
  const [view, setView] = useState("changes");
  const [scope, setScope] = useState("Home");
  return (
    <DocsLayout variant="library" title="Tabs">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          Underline tabs built on React Aria. The active tab paints a 2px blue underline over the baseline,
          and each tab optionally takes a leading icon and a trailing count badge, as in the example below.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this tabs component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add tabs`} />
        </Section>

        <Section title="Basic tabs">
          <p className="text-body-regular text-text-secondary">
            Tabs are built on React Aria for accessible, roving-tabindex keyboard navigation and automatic
            TabList / TabPanel association.
          </p>
          <Demo>
            <Tabs defaultSelectedKey="components">
              <TabList aria-label="Sections">
                <Tab id="components" count={48}>
                  Components
                </Tab>
                <Tab id="blocks" count={6}>
                  Blocks
                </Tab>
                <Tab id="charts">Charts</Tab>
              </TabList>
            </Tabs>
          </Demo>
          <CodeBlock
            code={`<Tabs defaultSelectedKey="components">
  <TabList aria-label="Sections">
    <Tab id="components" count={48}>
      Components
    </Tab>
    <Tab id="blocks" count={6}>
      Blocks
    </Tab>
    <Tab id="charts">Charts</Tab>
  </TabList>
</Tabs>`}
          />
        </Section>

        <Section title="Table of Contents">
          <p className="text-body-regular text-text-secondary">
            The tabs guide covers the following topics:
          </p>
          <ul className="flex list-disc flex-col gap-1 ps-5 text-body-regular text-text-secondary">
            <li>Basic tabs</li>
            <li>Count badges &amp; leading icons</li>
            <li>Pill tabs</li>
            <li>Keyboard navigation</li>
            <li>Controlled selection</li>
          </ul>
        </Section>

        <Section title="Pill tabs">
          <p className="text-body-regular text-text-secondary">
            PillTab is the fully-rounded sibling for switching local views rather than routed panels. It ships
            in two styles: blue (the default — the AI chat panel&apos;s Changes/Browser switcher) and the
            quieter gray, used for scope and filter rows like the settings Tools page. Both share the same idle
            and hover treatment; only the selected pill differs.
          </p>
          <Demo>
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-2">
                <span className="text-caption-1-medium text-text-tertiary">Blue (default)</span>
                <PillTabList>
                  <PillTab icon={RiInfinityLine} isSelected={view === "changes"} onSelect={() => setView("changes")}>
                    Changes
                  </PillTab>
                  <PillTab icon={RiGlobalLine} isSelected={view === "browser"} onSelect={() => setView("browser")}>
                    Browser
                  </PillTab>
                </PillTabList>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-caption-1-medium text-text-tertiary">Gray</span>
                <PillTabList>
                  <PillTab variant="gray" isSelected={scope === "Home"} onSelect={() => setScope("Home")}>
                    Home
                  </PillTab>
                  <PillTab variant="gray" isSelected={scope === "Library"} onSelect={() => setScope("Library")}>
                    Library
                  </PillTab>
                </PillTabList>
              </div>
            </div>
          </Demo>
          <CodeBlock
            code={`import { RiGlobalLine, RiInfinityLine } from "@remixicon/react";
import { PillTab, PillTabList } from "@/components/base/tabs/pill-tab";

// Blue (default) - panel view switchers
<PillTabList>
  <PillTab icon={RiInfinityLine} isSelected={view === "changes"} onSelect={() => setView("changes")}>
    Changes
  </PillTab>
  <PillTab icon={RiGlobalLine} isSelected={view === "browser"} onSelect={() => setView("browser")}>
    Browser
  </PillTab>
</PillTabList>

// Gray - quieter scope / filter rows
<PillTabList>
  <PillTab variant="gray" isSelected={scope === "Home"} onSelect={() => setScope("Home")}>
    Home
  </PillTab>
</PillTabList>`}
          />
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}
