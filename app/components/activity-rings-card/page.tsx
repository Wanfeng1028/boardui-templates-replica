"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { ActivityRingsCard } from "@/components/application/charts/activity-rings-card";
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

/** Activity Rings Card — boardui.com/components/activity-rings-card (Pro). */
export default function ActivityRingsCardPage() {
  const command = "npx boardui@latest add activity-rings-card";
  return (
    <AppShell title="Activity Rings Card" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        Apple Watch-style concentric goal rings — move, exercise, and running progress with hoverable ring focus and
        stat tiles below. Pairs with the Most Active Days card to show any selected day.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          Activity Rings Card is part of BoardUI Pro. Dark mode ready — this component follows BoardUI semantic
          tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Preview">
        <Demo>
          <div className="w-full max-w-[560px]">
            <ActivityRingsCard />
          </div>
        </Demo>
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
