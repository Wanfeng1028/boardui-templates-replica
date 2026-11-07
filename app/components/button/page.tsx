"use client";

import { useState } from "react";
import Link from "next/link";
import { RiAddLine, RiArrowLeftLine, RiArrowRightLine, RiCheckLine, RiDeleteBinLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";

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

const INSTALL_CMD = "npx boardui@latest add button";

const VARIANTS_CODE = `<Button variant="primary">Primary</Button>     {/* blue gradient (default) */}
<Button variant="secondary">Secondary</Button> {/* white surface + hairline border */}
<Button variant="ghost">Ghost</Button>         {/* blue-100 semantic surface */}
<Button variant="danger">Danger</Button>       {/* red gradient */}`;

const SIZES_CODE = `<Button size="medium">Medium</Button> {/* 36px (default) */}
<Button size="small">Small</Button>   {/* 32px */}
<Button size="xs">Xs</Button>         {/* 24px */}`;

const ICONS_CODE = `import { RiAddLine, RiArrowRightLine } from "@remixicon/react";

{/* Pass component references, not rendered elements */}
<Button leadingIcon={RiAddLine}>New project</Button>
<Button trailingIcon={RiArrowRightLine}>Continue</Button>

{/* Icon-only requires an aria-label */}
<Button iconOnly leadingIcon={RiAddLine} aria-label="Add" />`;

/** Button detail page, mirroring boardui.com/components/button. */
export default function ButtonPage() {
  return (
    <AppShell title="Button" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Buttons matching BoardUI’s design system — primary, secondary, ghost, and danger variants in three
            sizes, with leading/trailing icon slots, an icon-only mode, and semantic hover, press, and disabled
            states.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this button component using our CLI or manually. The CLI copies the component source (with
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

        <Section title="Variants">
          <p className="text-body-regular text-text-secondary">
            Four variants via the variant prop. Primary and danger use vertical gradients, secondary is a bordered
            surface, and ghost uses the subtle blue action surface.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </Demo>
          <CodeBlock code={VARIANTS_CODE} />
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Three sizes — medium (36px, the default), small (32px), and xs (24px). Icon-only buttons become square
            at every size.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="medium">Medium</Button>
              <Button size="small">Small</Button>
              <Button size="xs">Xs</Button>
            </div>
          </Demo>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="Icons">
          <p className="text-body-regular text-text-secondary">
            Pass any Remix Icon component reference to leadingIcon / trailingIcon. Combine iconOnly with an
            aria-label for square icon buttons.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Button leadingIcon={RiAddLine}>New project</Button>
              <Button trailingIcon={RiArrowRightLine}>Continue</Button>
              <Button iconOnly leadingIcon={RiAddLine} aria-label="Add" />
            </div>
          </Demo>
          <CodeBlock code={ICONS_CODE} />
        </Section>

        <Section title="Disabled">
          <p className="text-body-regular text-text-secondary">
            The native disabled attribute switches every variant to its muted disabled surface.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Button disabled>Primary</Button>
              <Button variant="secondary" disabled>
                Secondary
              </Button>
              <Button variant="ghost" disabled>
                Ghost
              </Button>
              <Button variant="danger" leadingIcon={RiDeleteBinLine} disabled>
                Delete
              </Button>
            </div>
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
    </AppShell>
  );
}
