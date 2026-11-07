"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Radio, RadioGroup } from "@/components/base/radio/radio";
import { RadioCard } from "@/components/base/radio/radio-card";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const SIZES_CODE = `<Radio size="md" value="a">Medium</Radio> {/* 16px (default) */}
<Radio size="sm" value="b">Small</Radio>  {/* 14px */}`;

const RADIO_CARD_CODE = `import { RadioCard } from "@/components/base/radio/radio-card";
import { RadioGroup } from "@/components/base/radio/radio";

<RadioGroup aria-label="Plan" defaultValue="pro">
  <RadioCard value="starter" title="Starter" description="For side projects and experiments." />
  <RadioCard value="pro" title="Pro" description="For growing teams that need more." />
  <RadioCard value="enterprise" title="Enterprise" description="Custom limits and support." isDisabled />
</RadioGroup>`;

/** Radio detail page: boardui.com/components/radio, in-site. */
export default function RadioPage() {
  return (
    <DocsLayout variant="library" title="Radio">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A radio group built on React Aria - arrow-key navigation, form semantics, and label association for free.
          The selected dot wears the same blue/500 → blue/600 gradient and inset highlight as the checkbox family,
          in md (16px) and sm (14px) sizes.
        </p>
        <Demo>
          <RadioGroup defaultValue="weekly" aria-label="Frequency" className="flex flex-col gap-3">
            <Radio value="weekly">Weekly</Radio>
            <Radio value="monthly">Monthly</Radio>
            <Radio value="yearly">Yearly</Radio>
          </RadioGroup>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this radio component using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add radio</code>
            <CopyButton text="npx boardui@latest add radio" />
          </div>
        </Section>
        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Two sizes via the <code className="font-mono text-body-2-medium text-text-primary">size</code> prop -{" "}
            <code className="font-mono text-body-2-medium text-text-primary">md</code> (16px, the default) and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">sm</code> (14px, the Figma{" "}
            <code className="font-mono text-body-2-medium text-text-primary">radio_selected_sm</code> glyph used
            inside menus), paired with Body 2 labels.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <RadioGroup defaultValue="md" aria-label="Size" className="flex flex-col gap-3">
                <Radio size="md" value="md">
                  md - 16px
                </Radio>
                <Radio size="sm" value="sm">
                  sm - 14px
                </Radio>
              </RadioGroup>
            </div>
          </Demo>
          <Code code={SIZES_CODE} />
        </Section>
        <Section title="Radio card">
          <p className="text-body-regular text-text-secondary">
            Selectable card with a title and optional description - the whole card selects the radio, matching
            Checkbox Card&apos;s surface. Cards live inside a{" "}
            <code className="font-mono text-body-2-medium text-text-primary">RadioGroup</code> for single selection
            and arrow-key navigation. It&apos;s a separate registry item:{" "}
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui add radio-card</code>.
          </p>
          <Demo>
            <RadioGroup aria-label="Plan" defaultValue="pro" className="flex w-full max-w-[420px] flex-col gap-2">
              <RadioCard value="starter" title="Starter" description="For side projects and experiments." />
              <RadioCard value="pro" title="Pro" description="For growing teams that need more." />
              <RadioCard value="enterprise" title="Enterprise" description="Custom limits and support." isDisabled />
            </RadioGroup>
          </Demo>
          <Code code={RADIO_CARD_CODE} />
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
