"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { AgentProgress } from "@/components/application/pro/agent-progress";
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

const STEPS_CODE = `<AgentProgress
  steps={[
    "Analyze the request",
    "Generate the component",
    "Run accessibility checks",
    "Prepare the response",
  ]}
/>`;

const TIMING_CODE = `<AgentProgress
  steps={steps}
  stepDuration={2400}
  completionDelay={1000}
  onFinished={() => {
    sendAgentResponse();
  }}
/>`;

/** Agent Progress — boardui.com/components/agent-progress (Pro). */
export default function AgentProgressPage() {
  const command = "npx boardui@latest add agent-progress";
  return (
    <AppShell title="Agent Progress" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        A collapsible progress block for multi-step AI work. It introduces steps with a soft stagger, advances the
        active task with synchronized circular progress, preserves progress while minimized, and exposes completion
        timing for handing the UI back to an agent response.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          Agent Progress is part of BoardUI Pro. Dark mode ready — this component follows BoardUI semantic tokens
          automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Custom steps">
        <p className="text-body-regular text-text-secondary">
          Pass any ordered list through <code className="text-body-2-regular text-text-primary">steps</code>. The
          block calculates its expanded height, countdown, active state, and overall progress from that list.
        </p>
        <Demo>
          <div className="w-full max-w-[560px]">
            <AgentProgress />
          </div>
        </Demo>
        <Code code={STEPS_CODE} />
      </Section>

      <Section title="Timing and completion">
        <p className="text-body-regular text-text-secondary">
          Set the time per task with <code className="text-body-2-regular text-text-primary">stepDuration</code>.
          After the final checkmark, <code className="text-body-2-regular text-text-primary">completionDelay</code>{" "}
          controls how long the completed state remains before{" "}
          <code className="text-body-2-regular text-text-primary">onFinished</code> fires.
        </p>
        <Code code={TIMING_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
