"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Meter } from "@/components/base/meter/meter";
import type { MeterTone } from "@/components/base/meter/meter";
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

const INSTALL_CMD = "npx boardui@latest add meter";

const TONES_CODE = `<Meter label="Accent" value={40} />  {/* the default */}
<Meter label="Success" value={55} tone="success" />
<Meter label="Warning" value={78} tone="warning" />
<Meter label="Error" value={94} tone="error" />`;

const THRESHOLD_CODE = `const toneFor = (percent: number): MeterTone =>
  percent >= 90 ? "error" : percent >= 75 ? "warning" : "accent";

<Meter label="Storage" value={used} tone={toneFor(used)} />`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <Meter label="التخزين" value={72} />
  <Meter label="المقاعد" value={19} maxValue={20} tone="warning" />
</DirectionProvider>`;

/** Meter detail page, mirroring boardui.com/components/meter. */
export default function MeterPage() {
  const [used, setUsed] = useState(72);
  const toneFor = (percent: number): MeterTone =>
    percent >= 90 ? "error" : percent >= 75 ? "warning" : "accent";

  return (
    <AppShell title="Meter" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Show how much of a limit is used, storage, seats, or a quota, and warn as it fills up.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this meter component using our CLI or manually. The CLI copies the component source (with
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

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            A meter describes a level within a known range, not a task moving towards done, and screen readers
            announce it that way. It is drawn on ProgressBar&apos;s track: the same rail and fill, easing to each
            new value.
          </p>
          <p className="text-body-regular text-text-secondary">
            Set the range with minValue and maxValue, write the reading yourself with valueLabel, and add a hint
            under the bar with description.
          </p>
          <Demo>
            <div className="flex max-w-md flex-col gap-4">
              <Meter label="Storage" value={7.2} maxValue={10} valueLabel="7.2 of 10 GB" />
              <Meter label="Seats" value={19} maxValue={20} valueLabel="19 of 20" description="Add seats before inviting more teammates." />
              <Meter label="API requests this month" value={96} valueLabel="96%" />
            </div>
          </Demo>
        </Section>

        <Section title="Tones">
          <p className="text-body-regular text-text-secondary">
            tone colours the fill from semantic tokens, so it follows the theme in light and dark mode.
          </p>
          <Demo>
            <div className="flex max-w-md flex-col gap-4">
              <Meter label="Accent" value={40} />
              <Meter label="Success" value={55} tone="success" />
              <Meter label="Warning" value={78} tone="warning" />
              <Meter label="Error" value={94} tone="error" />
            </div>
          </Demo>
          <CodeBlock code={TONES_CODE} />
        </Section>

        <Section title="Thresholds">
          <p className="text-body-regular text-text-secondary">
            Pick the tone from the value to warn as a limit gets close. Drag the slider to fill the meter.
          </p>
          <Demo>
            <div className="flex max-w-md flex-col gap-4">
              <Meter label="Storage" value={used} tone={toneFor(used)} />
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="small" onClick={() => setUsed((v) => Math.max(0, v - 5))}>
                  − 5%
                </Button>
                <Button variant="secondary" size="small" onClick={() => setUsed((v) => Math.min(100, v + 5))}>
                  + 5%
                </Button>
              </div>
            </div>
          </Demo>
          <CodeBlock code={THRESHOLD_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the fill grows from the right.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="flex max-w-md flex-col gap-4">
                <Meter label="التخزين" value={72} />
                <Meter label="المقاعد" value={19} maxValue={20} tone="warning" />
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            The meter is announced with its label and value, as role meter. Colour is never the only signal: keep
            the value visible, or say what the tone means in the description.
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
