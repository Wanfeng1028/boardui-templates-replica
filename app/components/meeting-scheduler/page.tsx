"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { MeetingScheduler } from "@/components/base/date-picker/meeting-scheduler";
import type { MeetingSchedulerValue } from "@/components/base/date-picker/meeting-scheduler";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const INSTALL_CMD = "npx boardui@latest add meeting-scheduler";

const CONTROLLED_CODE = `const [value, setValue] = useState<MeetingSchedulerValue | null>(null);

<MeetingScheduler value={value} onChange={setValue} />`;

const CUSTOM_CODE = `<MeetingScheduler
  host={{ name: "Ada Lovelace", email: "ada@example.com", avatarInitial: "A" }}
  meeting={{
    title: "30 min intro meeting",
    description: "Let's discuss your design needs.",
    durationMinutes: 30,
    language: "English",
    conferencing: "Google meet",
  }}
  timezone="Europe/Berlin"
/>`;

/** Meeting Scheduler detail page. The original site has no standalone page
 *  for it (boardui.com/components/meeting-scheduler returns 404); this page
 *  is built from the registry description, llms.txt, and the Meeting
 *  scheduler section of boardui.com/components/date-picker. */
export default function MeetingSchedulerPage() {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<MeetingSchedulerValue | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppShell title="Meeting Scheduler" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Date + time-slot scheduler popover. A Calendly/Cal.com-style booking panel — host card and meeting
            summary on the left, a single-month calendar in the middle (the same MonthPanel from shared.tsx), and a
            timezone / hour-format / time-slot sidebar on the right.
          </p>
          <p className="text-body-regular text-text-secondary">
            Note: the original site has no standalone page for Meeting Scheduler
            (boardui.com/components/meeting-scheduler returns 404). The content here follows the registry
            description and the Meeting scheduler section of the original Date Picker page.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this meeting scheduler component using our CLI or manually. The CLI copies the component
            source (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Scheduler panel">
          <p className="text-body-regular text-text-secondary">
            Not a popover — a disclosure: the &quot;Schedule a meeting&quot; trigger toggles the whole panel
            open/closed, with the time-slot list scrolling within a fixed height instead of growing the panel.
          </p>
          <Demo>
            {mounted ? (
              <div className="flex flex-col gap-3">
                <MeetingScheduler value={value} onChange={setValue} />
                <p className="text-body-regular text-text-secondary">
                  {value
                    ? "Booked: " + value.date.toString() + " at " + (value.time ?? "no time picked yet")
                    : "No meeting booked yet."}
                </p>
              </div>
            ) : (
              <div className="h-[52px]" aria-hidden />
            )}
          </Demo>
        </Section>

        <Section title="Open on mount">
          <p className="text-body-regular text-text-secondary">
            Render the panel open on mount with defaultOpen — useful when the scheduler is the page itself rather
            than a disclosure behind a button.
          </p>
          <Demo>
            {mounted ? (
              <MeetingScheduler defaultOpen triggerLabel="Schedule a meeting" />
            ) : (
              <div className="h-[420px]" aria-hidden />
            )}
          </Demo>
        </Section>

        <Section title="Controlled value">
          <p className="text-body-regular text-text-secondary">
            The value is a date plus a 24h &quot;HH:mm&quot; time slot (or null when a date is picked but no time
            slot yet). Pass value + onChange for controlled state, or defaultValue for uncontrolled.
          </p>
          <CodeBlock code={CONTROLLED_CODE} />
        </Section>

        <Section title="Custom host and meeting">
          <p className="text-body-regular text-text-secondary">
            Pass host (name, email, avatar initial) and meeting (title, description, duration, language,
            conferencing) to brand the panel, and timezone to set the default zone shown in the sidebar.
          </p>
          <CodeBlock code={CUSTOM_CODE} />
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
