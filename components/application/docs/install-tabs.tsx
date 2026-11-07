"use client";

import { useState } from "react";
import { RiCheckLine, RiCodeSSlashLine, RiFileCopyLine, RiTerminalBoxLine } from "@remixicon/react";

import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";

/**
 * CLI / Manual install tabs, as on the original component docs pages.
 * The CLI panel is the default tab.
 */
export function InstallTabs({ cli, manual }: { cli: React.ReactNode; manual: React.ReactNode }) {
  const [active, setActive] = useState("cli");
  return (
    <Tabs selectedKey={active} onSelectionChange={(key) => setActive(String(key))} orientation="horizontal">
      <TabList aria-label="Installation method">
        <Tab id="cli" icon={RiTerminalBoxLine}>
          CLI
        </Tab>
        <Tab id="manual" icon={RiCodeSSlashLine}>
          Manual
        </Tab>
      </TabList>
      <TabPanel id="cli" className="flex flex-col gap-4 pt-2">
        {cli}
      </TabPanel>
      <TabPanel id="manual" className="flex flex-col gap-4 pt-2">
        {manual}
      </TabPanel>
    </Tabs>
  );
}

/** One numbered step inside the Manual panel ("1 Install the following dependencies"). */
export function InstallStep({
  index,
  title,
  children,
}: {
  index: number;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 translate-y-[5px] items-center justify-center rounded-xl bg-background-secondary-default text-caption-1-semibold text-text-tertiary">
        {String(index).padStart(2, "0")}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="pt-2 text-headline-medium text-text-secondary">{title}</p>
        {children}
      </div>
    </div>
  );
}

/** A file viewer block: filename row with a copy button over the source. */
export function FileCodeBlock({ file, code }: { file: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-caption-1-medium text-text-secondary">{file}</p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
            } catch {
              // Clipboard access can be refused; still show the confirmation.
            }
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          aria-label="Copy code"
        >
          {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
        {code}
      </pre>
    </div>
  );
}
