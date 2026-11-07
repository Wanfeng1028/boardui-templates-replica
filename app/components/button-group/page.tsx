"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBold,
  RiCheckLine,
  RiFileCopyLine,
  RiItalic,
  RiListCheck,
  RiTableLine,
  RiUnderline,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/buttons/button-group";

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

const INSTALL_CMD = "npx boardui@latest add button-group";

const SELECTED_CODE = `const [view, setView] = useState("list");

<ButtonGroup aria-label="View">
  {views.map(({ id, label, icon }) => (
    <ButtonGroupItem
      key={id}
      leadingIcon={icon}
      selected={view === id}
      onClick={() => setView(id)}
    >
      {label}
    </ButtonGroupItem>
  ))}
</ButtonGroup>`;

const ICON_ONLY_CODE = `{/* Icon-only items are square - aria-label each one */}
<ButtonGroup size="small" aria-label="Formatting">
  <ButtonGroupItem iconOnly leadingIcon={RiBold} aria-label="Bold" />
  <ButtonGroupItem iconOnly leadingIcon={RiItalic} aria-label="Italic" />
  <ButtonGroupItem iconOnly leadingIcon={RiUnderline} aria-label="Underline" />
</ButtonGroup>`;

const VIEWS = [
  { id: "list", label: "List", icon: RiListCheck },
  { id: "table", label: "Table", icon: RiTableLine },
];

/** Button Group detail page, mirroring boardui.com/components/button-group. */
export default function ButtonGroupPage() {
  const [view, setView] = useState("list");
  return (
    <DocsLayout variant="library" title="Button Group">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A row of secondary-style buttons fused into one control — shared border, radius/2lg and shadow/xs from
            the Button family, items divided by hairlines with only the outer corners rounded. For a segmented
            switcher with an animated thumb, reach for Segmented Control instead; the button group is the
            toolbar/filter flavor.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this button group component using our CLI or manually. The CLI copies the component source
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

        <Section title="Selected item">
          <p className="text-body-regular text-text-secondary">
            selected keeps an item on its hover fill and sets aria-pressed — drive it from state for single or
            multi-select toolbars.
          </p>
          <Demo>
            <ButtonGroup aria-label="View">
              {VIEWS.map(({ id, label, icon }) => (
                <ButtonGroupItem key={id} leadingIcon={icon} selected={view === id} onClick={() => setView(id)}>
                  {label}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </Demo>
          <CodeBlock code={SELECTED_CODE} />
        </Section>

        <Section title="Icon only">
          <p className="text-body-regular text-text-secondary">
            iconOnly items collapse to squares — give each an aria-label since there is no visible text.
          </p>
          <Demo>
            <ButtonGroup size="small" aria-label="Formatting">
              <ButtonGroupItem iconOnly leadingIcon={RiBold} aria-label="Bold" />
              <ButtonGroupItem iconOnly leadingIcon={RiItalic} aria-label="Italic" />
              <ButtonGroupItem iconOnly leadingIcon={RiUnderline} aria-label="Underline" />
            </ButtonGroup>
          </Demo>
          <CodeBlock code={ICON_ONLY_CODE} />
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
