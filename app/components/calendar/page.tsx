"use client";

import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { Calendar } from "@/components/application/pro/calendar";

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
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

/** Calendar detail page, mirroring boardui.com/components/calendar. */
export default function CalendarPage() {
  return (
    <DocsLayout variant="library" title="Calendar">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="purple">
              Pro
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A month-view calendar — month switcher, inbox feed dropdown, and a month grid with event chips that
            overflow into a “+N more” label. Tapping an event opens an anchored details popover with attendees,
            meeting code, and a join button.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Calendar is part of BoardUI Pro.</p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Live preview">
          <p className="text-body-regular text-text-secondary">
            The month grid below is the component itself: switch months, open the inbox feed, and tap an event chip
            to see its details popover.
          </p>
          <Demo>
            <Calendar />
          </Demo>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
