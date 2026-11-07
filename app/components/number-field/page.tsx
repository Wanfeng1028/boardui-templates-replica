"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { NumberField } from "@/components/base/number-field/number-field";

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

const INSTALL_CMD = "npx boardui@latest add number-field";

const FORMATTING_CODE = `<NumberField label="Package weight" defaultValue={2.4} step={0.1}
  formatOptions={{ style: "unit", unit: "kilogram" }} />
<NumberField label="Storage" defaultValue={250} step={50}
  formatOptions={{ style: "unit", unit: "gigabyte" }} />
<NumberField label="Conversion rate" defaultValue={0.034} step={0.001}
  formatOptions={{ style: "percent", minimumFractionDigits: 1 }} />
<NumberField label="Budget" defaultValue={1500} step={100}
  formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }} />`;

const LIMITS_CODE = `<NumberField label="Quantity" defaultValue={10} minValue={1} maxValue={10} hint="Up to 10 per order." />
<NumberField label="Rating" defaultValue={4.5} minValue={0} maxValue={5} step={0.5} />
<NumberField label="Retries" size="small" defaultValue={3} minValue={0} maxValue={9} />
<NumberField label="Seats" size="small" defaultValue={8} isDisabled hint="Managed by your admin." />`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <NumberField label="عدد المقاعد" defaultValue={5} minValue={1} maxValue={50} />
  <NumberField label="سعر المقعد" defaultValue={12} formatOptions={{ style: "currency", currency: "USD" }} />
</DirectionProvider>`;

/** Number Field detail page, mirroring boardui.com/components/number-field. */
export default function NumberFieldPage() {
  return (
    <AppShell title="Number Field" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Take seats, prices, and percentages as numbers, formatted for the reader&apos;s locale and kept
            within your limits.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the number field using our CLI or manually. The CLI copies the component source (with
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

        <Section title="Formatting">
          <p className="text-body-regular text-text-secondary">
            formatOptions takes the options of Intl.NumberFormat: currency, percent, and unit styles, and how many
            decimals to show. The value stays a plain number, so a percent field holds 0.25 for 25%.
          </p>
          <Demo>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Package weight"
                defaultValue={2.4}
                step={0.1}
                formatOptions={{ style: "unit", unit: "kilogram" }}
              />
              <NumberField
                label="Storage"
                defaultValue={250}
                step={50}
                formatOptions={{ style: "unit", unit: "gigabyte" }}
              />
              <NumberField
                label="Conversion rate"
                defaultValue={0.034}
                step={0.001}
                formatOptions={{ style: "percent", minimumFractionDigits: 1 }}
              />
              <NumberField
                label="Budget"
                defaultValue={1500}
                step={100}
                formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
              />
            </div>
          </Demo>
          <CodeBlock code={FORMATTING_CODE} />
        </Section>

        <Section title="Limits and steps">
          <p className="text-body-regular text-text-secondary">
            minValue and maxValue clamp what people type when the field loses focus, and each stepper switches off
            at its limit. step sets how far a stepper or an arrow key moves the value, and typed values snap to
            it.
          </p>
          <Demo>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Quantity" defaultValue={10} minValue={1} maxValue={10} hint="Up to 10 per order." />
              <NumberField label="Rating" defaultValue={4.5} minValue={0} maxValue={5} step={0.5} />
              <NumberField label="Retries" size="small" defaultValue={3} minValue={0} maxValue={9} />
              <NumberField label="Seats" size="small" defaultValue={8} isDisabled hint="Managed by your admin." />
            </div>
          </Demo>
          <CodeBlock code={LIMITS_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the steppers move to the left and numbers are written and read in the
            locale&apos;s own digits.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField label="عدد المقاعد" defaultValue={5} minValue={1} maxValue={50} />
                <NumberField
                  label="سعر المقعد"
                  defaultValue={12}
                  formatOptions={{ style: "currency", currency: "USD" }}
                />
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Up and Down step the value, and Home and End jump to the limits when they are set. Typing accepts only
            characters that can make a number in the locale. While the field has focus, the scroll wheel steps the
            value too. Set isWheelDisabled where the field sits in a scrolling page and that would surprise
            people.
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
