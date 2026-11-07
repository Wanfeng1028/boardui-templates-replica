"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { DateRangePicker } from "@/components/base/date-picker/date-range-picker";
import type { DateRangeValue } from "@/components/base/date-picker/date-range-picker";

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
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
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

const INSTALL_CMD = "npx boardui@latest add date-range-picker";

const PRESETS_CODE = `// Computed with @internationalized/date, re-derived each time the popover opens:
Today, Yesterday, Last week, This month, Last month, This year, Last year, All time

// Clicking a preset sets the *pending* range (Apply still commits it):
<button onClick={() => setPendingValue(preset.range)}>{preset.label}</button>`;

const CONTROLLED_CODE = `const [value, setValue] = useState<DateRangeValue | null>(null);

<DateRangePicker aria-label="Report period" value={value} onChange={setValue} />`;

const UNCONTROLLED_CODE = `<DateRangePicker
  aria-label="Report period"
  defaultValue={{ start: someStart, end: someEnd }}
  onChange={(value) => console.log(value)}
/>`;

const DISABLED_CODE = `<DateRangePicker aria-label="Report period" isDisabled />`;

/** Date Range Picker detail page. The original site has no standalone page
 *  for it (boardui.com/components/date-range-picker returns 404); this page
 *  is built from the registry description, llms.txt, and the Date Picker
 *  page (boardui.com/components/date-picker), which documents the range
 *  picker in full. */
export default function DateRangePickerPage() {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppShell title="Date Range Picker" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Two-month range picker sharing the date-picker chrome. A dual-month date range picker built on React
            Aria&apos;s RangeCalendar. A quick-select sidebar (Today, Last week, This month, etc.), two adjacent
            months, and a footer with an editable date range and Cancel/Apply — the calendar only commits a new
            range once Apply is pressed.
          </p>
          <p className="text-body-regular text-text-secondary">
            Note: the original site has no standalone page for Date Range Picker
            (boardui.com/components/date-range-picker returns 404). The content here follows the registry
            description and the original Date Picker page, which documents the range picker in full.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this date range picker using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Quick select">
          <p className="text-body-regular text-text-secondary">
            The sidebar presets are computed from @internationalized/date each time the popover opens (so
            &quot;Today&quot; stays today). Selecting one updates the pending range and highlights the two months
            to match — it still requires Apply to commit, same as dragging a range directly on the calendar.
          </p>
          <Demo>
            {mounted ? (
              <div className="flex flex-col gap-3">
                <DateRangePicker aria-label="Report period" value={value} onChange={setValue} />
                <p className="text-body-regular text-text-secondary">
                  {value ? value.start.toString() + " – " + value.end.toString() : "No range selected yet."}
                </p>
              </div>
            ) : (
              <div className="h-[52px]" aria-hidden />
            )}
          </Demo>
          <CodeBlock code={PRESETS_CODE} />
        </Section>

        <Section title="Controlled & uncontrolled value">
          <p className="text-body-regular text-text-secondary">
            Pass value + onChange for a controlled range, or defaultValue for uncontrolled. Either way, the popover
            keeps its own pending draft internally — onChange only fires when the user presses Apply; Cancel discards
            the draft and reverts to the last committed value. The start/end chips in the footer are editable inputs
            (DD/MM/YYYY) that update the same pending draft.
          </p>
          <CodeBlock code={CONTROLLED_CODE} />
          <CodeBlock code={UNCONTROLLED_CODE} />
        </Section>

        <Section title="Disabled">
          <p className="text-body-regular text-text-secondary">
            isDisabled dims the trigger button and blocks opening the popover.
          </p>
          <Demo>
            {mounted ? <DateRangePicker aria-label="Report period" isDisabled /> : <div className="h-[52px]" aria-hidden />}
          </Demo>
          <CodeBlock code={DISABLED_CODE} />
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
