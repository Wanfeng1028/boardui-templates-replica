"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { CheckboxCard } from "@/components/base/checkbox/checkbox-card";

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

const INSTALL_CMD = "npx boardui@latest add checkbox";

const SIZES_CODE = `<Checkbox size="md" defaultSelected /> {/* 16px (default) */}
<Checkbox size="sm" defaultSelected /> {/* 14px */}`;

const LABELS_CODE = `{/* children become the label - clicking it toggles the box */}
<Checkbox defaultSelected>Remember me</Checkbox>
<Checkbox>Send me product updates</Checkbox>

{/* Controlled */}
<Checkbox isSelected={checked} onChange={setChecked}>Terms</Checkbox>`;

const CARD_CODE = `import { CheckboxCard } from "@/components/base/checkbox/checkbox-card";

<CheckboxCard title="Item title" description="This is for you to check." />
<CheckboxCard defaultSelected title="Item title" description="This is for you to check." />
<CheckboxCard title="No description" />`;

/** Checkbox detail page, mirroring boardui.com/components/checkbox. */
export default function CheckboxPage() {
  return (
    <AppShell title="Checkbox" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A 16px checkbox built on React Aria. Checked and indeterminate states render the primary gradient with
            the Figma inner highlight, and the tick draws itself on with a stroke animation.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this checkbox component using our CLI or manually. The CLI copies the component source
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

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Two sizes via the size prop — md (16px, the default) and sm (14px, used in dense tables).
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <Checkbox size="md" defaultSelected>
                md — 16px
              </Checkbox>
              <Checkbox size="sm" defaultSelected>
                sm — 14px
              </Checkbox>
            </div>
          </Demo>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="Labels & control">
          <p className="text-body-regular text-text-secondary">
            Pass children for a label — React Aria associates it with the input automatically. Use isSelected +
            onChange for controlled state, or defaultSelected for uncontrolled.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <Checkbox defaultSelected>Remember me</Checkbox>
              <Checkbox>Send me product updates</Checkbox>
              <Checkbox size="sm">Small with label</Checkbox>
              <Checkbox isIndeterminate>Indeterminate</Checkbox>
            </div>
          </Demo>
          <CodeBlock code={LABELS_CODE} />
        </Section>

        <Section title="Card">
          <p className="text-body-regular text-text-secondary">
            Selectable card with a title and optional description — the whole card toggles the checkbox and shows a
            hover background. It is a separate registry item: npx boardui add checkbox-card.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <CheckboxCard title="Item title" description="This is for you to check." />
              <CheckboxCard defaultSelected title="Item title" description="This is for you to check." />
              <CheckboxCard title="No description" />
            </div>
          </Demo>
          <CodeBlock code={CARD_CODE} />
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
