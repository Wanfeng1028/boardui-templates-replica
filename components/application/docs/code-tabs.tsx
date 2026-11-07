"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { Tab, TabList, Tabs } from "@/components/base/tabs/tabs";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      aria-label="Copy code"
    >
      {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
    </button>
  );
}

/**
 * npm / pnpm / yarn pill tabs over one install command, as on
 * /installation. `yarn` is optional: some commands only ship npm + pnpm.
 */
export function PkgCommand({
  npm,
  pnpm,
  yarn,
}: {
  npm: string;
  pnpm: string;
  yarn?: string;
}) {
  const managers = (
    [
      ["npm", npm],
      ["pnpm", pnpm],
      ["yarn", yarn],
    ] as const
  ).filter(([, cmd]) => cmd !== undefined) as [string, string][];
  const [pm, setPm] = useState(managers[0][0]);
  const cmd = managers.find(([name]) => name === pm)?.[1] ?? managers[0][1];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {managers.map(([name]) => (
          <button
            key={name}
            type="button"
            onClick={() => setPm(name)}
            className={cx(
              "cursor-pointer rounded-full border px-3 py-1 text-caption-1-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              pm === name
                ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
        <code className="overflow-x-auto font-mono text-body-2-regular text-text-primary">{cmd}</code>
        <CopyButton text={cmd} />
      </div>
    </div>
  );
}

export type CodeTab = { value: string; code: string };

/**
 * Tabs over a code block, as on the original docs pages
 * (CLI / Manual, npm / pnpm, usage). The copy button copies the active tab.
 */
export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(tabs[0].value);
  const activeCode = tabs.find((tab) => tab.value === active)?.code ?? tabs[0].code;
  return (
    <div className="overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-2">
        <Tabs
          selectedKey={active}
          onSelectionChange={(key) => setActive(String(key))}
          className="min-w-0"
        >
          <TabList aria-label="Code tabs">
            {tabs.map((tab) => (
              <Tab key={tab.value} id={tab.value}>
                {tab.value}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <CopyButton text={activeCode} />
      </div>
      {tabs.map((tab) => (
        <div key={tab.value} hidden={tab.value !== active}>
          <pre dir="ltr" className="overflow-x-auto p-4 font-mono text-caption-1-regular text-text-primary">
            <code>{tab.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}
