"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine, RiSparklingFill } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Announcement } from "@/components/base/announcement/announcement";
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

const VARIATIONS_CODE = `import { RiSparklingFill } from "@remixicon/react";

{/* Custom icon */}
<Announcement
  icon={RiSparklingFill}
  title="What's new in v2"
  description="Charts, command menu, and a brand-new data table."
  actionLabel="See the changelog"
/>

{/* No action */}
<Announcement
  title="You're all set"
  description="Your workspace is ready to go."
  dismissible
/>

{/* Title + action only */}
<Announcement title="2 seats left on your plan" actionLabel="Upgrade" />`;

/** Announcement — boardui.com/components/announcement (free). */
export default function AnnouncementPage() {
  const command = "npx boardui@latest add announcement";
  return (
    <AppShell title="Announcement" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        A compact onboarding / announcement card sized for the sidebar footer — leading icon, dismiss button, title,
        description, and a full-width secondary CTA. Dismissal animates out with Motion.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          You can add this announcement component using our CLI or manually. Dark mode ready — this component
          follows BoardUI semantic tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Variations">
        <p className="text-body-regular text-text-secondary">
          Every part is optional — swap the <code className="text-body-2-regular text-text-primary">icon</code>,
          drop the <code className="text-body-2-regular text-text-primary">description</code> or{" "}
          <code className="text-body-2-regular text-text-primary">actionLabel</code>, and toggle{" "}
          <code className="text-body-2-regular text-text-primary">dismissible</code>.
        </p>
        <Demo>
          <div className="flex w-full max-w-[320px] flex-col gap-4">
            <Announcement
              icon={RiSparklingFill}
              title="What's new in v2"
              description="Charts, command menu, and a brand-new data table."
              actionLabel="See the changelog"
            />
            <Announcement title="You're all set" description="Your workspace is ready to go." dismissible />
            <Announcement title="2 seats left on your plan" actionLabel="Upgrade" />
          </div>
        </Demo>
        <Code code={VARIATIONS_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
