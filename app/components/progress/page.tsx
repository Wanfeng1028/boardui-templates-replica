"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { ProgressBar, ProgressCircle } from "@/components/base/progress/progress";

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

const INSTALL_CMD = "npx boardui@latest add progress";

const SIZES_CODE = `<ProgressBar aria-label="Small" size="sm" value={30} />   // 4px
<ProgressBar aria-label="Medium" size="md" value={55} />  // 6px, the default
<ProgressBar aria-label="Large" size="lg" value={80} />   // 8px`;

const CIRCLE_CODE = `import { ProgressCircle } from "@/components/base/progress/progress";

<ProgressCircle aria-label="Upload" size="sm" value={64} />  // 16px
<ProgressCircle aria-label="Upload" size="md" value={64} />  // 24px, the default
<ProgressCircle aria-label="Upload" size="lg" value={64} />  // 32px
<ProgressCircle aria-label="Syncing" size="lg" isIndeterminate />`;

const VALUE_LABEL_CODE = `<ProgressBar label="Onboarding" value={3} maxValue={5} valueLabel="3 of 5 steps" />

<ProgressBar
  label="Monthly goal"
  value={8420}
  maxValue={12000}
  formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
/>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <ProgressBar label="جارٍ رفع التقرير" value={64} />
  <ProgressBar label="جارٍ تجهيز التصدير" isIndeterminate />
</DirectionProvider>`;

/** Progress detail page, mirroring boardui.com/components/progress. */
export default function ProgressPage() {
  return (
    <DocsLayout variant="library" title="Progress">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Show how far along a task is, or that it is still running when nobody can tell how long it will take.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the progress components using our CLI or manually. The CLI copies the component source
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

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            ProgressBar pairs a label and its value with a rounded rail, the one the agent limits card uses. The
            fill slides to each new value rather than resizing, so it eases instead of jumping. With
            isIndeterminate, a band of light sweeps the rail instead, drawn like Spinner: a crisp core with a
            rounded head, a tight glow, and a wide bloom that spills just past the rail.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <ProgressBar label="Uploading Q3-report.pdf" value={8} description="12.4 MB, about 20 seconds left" />
              <ProgressBar label="Preparing export" isIndeterminate />
            </div>
          </Demo>
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Three rail thicknesses. Without a visible label, name the bar with aria-label.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <ProgressBar aria-label="Small" size="sm" value={30} />
              <ProgressBar aria-label="Medium" size="md" value={55} />
              <ProgressBar aria-label="Large" size="lg" value={80} />
            </div>
          </Demo>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="Circle">
          <p className="text-body-regular text-text-secondary">
            ProgressCircle fits a file tile or a table cell. Its indeterminate state is Spinner&apos;s orbiting
            light at the same size.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <ProgressCircle aria-label="Upload" size="sm" value={64} />
              <ProgressCircle aria-label="Upload" size="md" value={64} />
              <ProgressCircle aria-label="Upload" size="lg" value={64} />
              <ProgressCircle aria-label="Syncing" size="lg" isIndeterminate />
            </div>
          </Demo>
          <CodeBlock code={CIRCLE_CODE} />
        </Section>

        <Section title="Value label">
          <p className="text-body-regular text-text-secondary">
            The value shows as a percentage, formatted for the reader&apos;s locale. Count steps with value and
            maxValue, write your own text with valueLabel, or format money and units with formatOptions.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <ProgressBar label="Onboarding" value={3} maxValue={5} valueLabel="3 of 5 steps" />
              <ProgressBar
                label="Monthly goal"
                value={8420}
                maxValue={12000}
                formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
              />
            </div>
          </Demo>
          <CodeBlock code={VALUE_LABEL_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the fill grows from the right and the indeterminate light sweeps from right
            to left.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="flex flex-col gap-4">
                <ProgressBar label="جارٍ رفع التقرير" value={64} />
                <ProgressBar label="جارٍ تجهيز التصدير" isIndeterminate />
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            Both shapes are announced as progress bars with their label and value; an indeterminate one is
            announced without a value. Reduced motion slows the sweep instead of stopping it.
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
