"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { AgentLimitsCard } from "@/components/application/pro/agent-limits-card";
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

const EXPANDED_CODE = `<AgentLimitsCard
  context={{
    max: 1_000_000,
    segments: [
      { label: "Messages", tokens: 520_000 },
      { label: "System tools", tokens: 96_000 },
      { label: "MCP tools", tokens: 68_000 },
      { label: "Skills", tokens: 54_000, color: "var(--color-chart-8)" },
      // Deferred segments are listed, not counted
      { label: "MCP tools (deferred)", tokens: 69_900, deferred: true },
    ],
    groups: [
      // Collapsible member lists
      { label: "MCP tools", tokens: 137_900, items: [{ label: "browser", tokens: 54_200 }] },
    ],
  }}
  plan="Max (5x)"
  planHref="/settings/plan"
  limits={[
    { label: "5-hour limit", used: 0.38, resets: "Resets in 2 hr 46 min" },
    { label: "Weekly · all models", used: 0.03, resets: "Resets Tue 3:00 PM" },
    { label: "Weekly · Pro", used: 0.05, resets: "Resets Tue 3:00 PM" },
  ]}
  defaultExpanded
  onExpandedChange={(open) => track("context_breakdown", { open })}
/>`;

/** Agent Limits Card — boardui.com/components/agent-limits-card (Pro). */
export default function AgentLimitsCardPage() {
  const command = "npx boardui@latest add agent-limits-card";
  return (
    <AppShell title="Agent Limits Card" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        The agent budget widget — a context window usage bar segmented by token bucket with a used / max readout,
        and plan usage limits with reset times and progress bars. Expanding the context window grows the whole card
        to reveal the per-bucket breakdown, free space, deferred buckets, and collapsible member lists.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          Agent Limits Card is part of BoardUI Pro. Dark mode ready — this component follows BoardUI semantic
          tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Expanded">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">defaultExpanded</code> opens the breakdown on
          mount; the groups (<code className="text-body-2-regular text-text-primary">context.groups</code>) each
          collapse independently. Deferred segments are listed with a dash and left out of the bar and the total.
        </p>
        <Demo>
          <div className="w-full max-w-[560px]">
            <AgentLimitsCard />
          </div>
        </Demo>
        <Code code={EXPANDED_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
