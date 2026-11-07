"use client";

import { useState } from "react";
import Link from "next/link";
import { Time } from "@internationalized/date";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { TimeField } from "@/components/base/time-field/time-field";

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

const INSTALL_CMD = "npx boardui@latest add time-field";

const FORMATS_CODE = `<TimeField label="Departure" hourCycle={24} defaultValue={new Time(21, 45)} />
<TimeField label="Lap time" granularity="second" hourCycle={24} defaultValue={new Time(0, 4, 32)} icon={null} />
<TimeField label="Reminder" size="small" defaultValue={new Time(8, 30)} />
<TimeField label="Reminder" size="small" isDisabled defaultValue={new Time(8, 30)} hint="Reminders are off." />`;

const LIMITS_CODE = `<TimeField
  label="Delivery time"
  validationBehavior="aria"
  minValue={new Time(8)}
  maxValue={new Time(20)}
  defaultValue={new Time(21, 30)}
  hint="Between 8:00 AM and 8:00 PM."
/>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <TimeField label="يفتح" defaultValue={new Time(9, 0)} />
  <TimeField label="يغلق" defaultValue={new Time(18, 0)} />
</DirectionProvider>`;

/** Time Field detail page, mirroring boardui.com/components/time-field. */
export default function TimeFieldPage() {
  return (
    <DocsLayout variant="library" title="Time Field">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Take a time of day without a picker: type the hours and minutes, or nudge each one with the arrow
            keys.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the time field using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Hour cycle and seconds">
          <p className="text-body-regular text-text-secondary">
            The field follows the locale&apos;s format and hour cycle. Force one with hourCycle={"{"}24{"}"}, add
            seconds with granularity=&quot;second&quot;, and hide the clock with icon={"{"}null{"}"}. Values are
            Time objects from @internationalized/date.
          </p>
          <Demo>
            <div className="grid gap-4 sm:grid-cols-2">
              <TimeField label="Departure" hourCycle={24} defaultValue={new Time(21, 45)} />
              <TimeField
                label="Lap time"
                granularity="second"
                hourCycle={24}
                defaultValue={new Time(0, 4, 32)}
                icon={null}
              />
              <TimeField label="Reminder" size="small" defaultValue={new Time(8, 30)} />
              <TimeField
                label="Reminder"
                size="small"
                isDisabled
                defaultValue={new Time(8, 30)}
                hint="Reminders are off."
              />
            </div>
          </Demo>
          <CodeBlock code={FORMATS_CODE} />
        </Section>

        <Section title="Limits">
          <p className="text-body-regular text-text-secondary">
            A time outside minValue and maxValue marks the field invalid and turns the hint into an error. With
            validationBehavior=&quot;aria&quot;, that happens as people type; by default it waits for the form to
            submit.
          </p>
          <Demo>
            <TimeField
              label="Delivery time"
              validationBehavior="aria"
              minValue={new Time(8)}
              maxValue={new Time(20)}
              defaultValue={new Time(21, 30)}
              hint="Between 8:00 AM and 8:00 PM."
            />
          </Demo>
          <CodeBlock code={LIMITS_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the clock moves to the right, and the segments take the locale&apos;s order,
            digits, and day period.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="grid gap-4 sm:grid-cols-2">
                <TimeField label="يفتح" defaultValue={new Time(9, 0)} />
                <TimeField label="يغلق" defaultValue={new Time(18, 0)} />
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Each segment is its own stop. Typing digits fills the focused segment and moves to the next one, Up
            and Down change it, Left and Right move between segments, and the day period toggles with A and P.
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
    </DocsLayout>
  );
}
