"use client";

import { useEffect, useState } from "react";
import { CalendarDate, getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "react-aria-components";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { DateCalendar, DateRangeCalendar } from "@/components/base/date-picker/date-calendar";
import { DirectionProvider } from "@/components/foundations/direction/direction";

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

const INSTALL_CMD = "npx boardui@latest add date-calendar";

const RANGES_CODE = `import { DateRangeCalendar } from "@/components/base/date-picker/date-calendar";

const [range, setRange] = useState({ start: nextWeek, end: nextWeek.add({ days: 4 }) });

<DateRangeCalendar aria-label="Stay" value={range} onChange={setRange} minValue={today(getLocalTimeZone())} />`;

const LIMITS_CODE = `import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "react-aria-components";

const { locale } = useLocale();
const now = today(getLocalTimeZone());

<DateCalendar
  aria-label="Appointment date"
  minValue={now}
  maxValue={now.add({ weeks: 6 })}
  isDateUnavailable={(date) => isWeekend(date, locale)}
/>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <DateCalendar aria-label="تاريخ التسليم" />
</DirectionProvider>`;

/** Date Calendar detail page, mirroring boardui.com/components/date-calendar. */
export default function DateCalendarPage() {
  const { locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<CalendarDate>(() => today(getLocalTimeZone()));
  const [range, setRange] = useState(() => {
    const start = today(getLocalTimeZone()).add({ days: 7 });
    return { start, end: start.add({ days: 4 }) };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const now = today(getLocalTimeZone());

  return (
    <AppShell title="Date Calendar" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Put a month right on the page for picking a delivery day, a deadline, or a run of nights.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this date calendar component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Single date">
          <p className="text-body-regular text-text-secondary">
            Date Calendar is Date Picker&apos;s month panel, as is: the card, the 16px month chevrons, the 32px day
            cells 12px apart with the selected day&apos;s accent pill and the range band that bridges the gaps.
            Today carries a small accent dot, and days ruled out by isDateUnavailable are struck through.
          </p>
          <Demo>
            {mounted ? (
              <div className="flex flex-col gap-3">
                <DateCalendar aria-label="Delivery date" value={date} onChange={setDate} />
                <p className="text-body-regular text-text-secondary">Picked: {date.toString()}</p>
              </div>
            ) : (
              <div className="h-[300px]" aria-hidden />
            )}
          </Demo>
        </Section>

        <Section title="Ranges">
          <p className="text-body-regular text-text-secondary">
            DateRangeCalendar picks a start and an end, two months side by side that stack when space runs out. Set
            visibleMonths={1} for a single month.
          </p>
          <Demo>
            {mounted ? (
              <div className="flex flex-col gap-3">
                <DateRangeCalendar aria-label="Stay" value={range} onChange={setRange} minValue={now} />
                <p className="text-body-regular text-text-secondary">
                  Stay: {range.start.toString()} – {range.end.toString()}
                </p>
              </div>
            ) : (
              <div className="h-[300px]" aria-hidden />
            )}
          </Demo>
          <CodeBlock code={RANGES_CODE} />
        </Section>

        <Section title="Limits and unavailable days">
          <p className="text-body-regular text-text-secondary">
            Days outside minValue and maxValue fade and can&apos;t be picked. Days that isDateUnavailable rules out
            stay in the grid, struck through, so the rhythm of the month reads at a glance.
          </p>
          <Demo>
            {mounted ? (
              <DateCalendar
                aria-label="Appointment date"
                minValue={now}
                maxValue={now.add({ weeks: 6 })}
                isDateUnavailable={(d) => isWeekend(d, locale)}
              />
            ) : (
              <div className="h-[300px]" aria-hidden />
            )}
          </Demo>
          <CodeBlock code={LIMITS_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the month and weekday names follow the locale, the week starts where the
            locale starts it, and the arrows turn.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <DateCalendar aria-label="تاريخ التسليم" />
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Arrow keys move by day, Page Up and Page Down by month, and with Shift by year. Home and End jump to the
            first and last day of the month, and Enter or Space picks the focused day. Screen readers hear the month
            as it changes and each day with its full date.
          </p>
          <p className="text-body-regular text-text-secondary">
            Today on the server is not always today in the browser. On a statically rendered page, render the
            calendar after mount, as this page does, so the month and the dot under today match the reader&apos;s
            clock.
          </p>
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
