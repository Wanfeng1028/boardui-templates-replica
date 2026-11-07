"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
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

const INSTALL_CMD = "npx boardui@latest add checkbox-card";

const CARD_CODE = `import { CheckboxCard } from "@/components/base/checkbox/checkbox-card";

<CheckboxCard title="Item title" description="This is for you to check." />
<CheckboxCard defaultSelected title="Item title" description="This is for you to check." />
<CheckboxCard title="No description" />`;

const CONTROLLED_CODE = `const [checked, setChecked] = useState(false);

<CheckboxCard
  title="Email notifications"
  description="Get a digest when someone mentions you."
  isSelected={checked}
  onChange={setChecked}
/>`;

/** Checkbox Card detail page. The original site has no standalone page for it
 *  (boardui.com/components/checkbox-card returns 404); this page is built
 *  from the registry description, llms.txt, and the Card section of
 *  boardui.com/components/checkbox. */
export default function CheckboxCardPage() {
  const [checked, setChecked] = useState(false);

  return (
    <AppShell title="Checkbox Card" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Bordered selectable card driven by a checkbox. A title with an optional description — the whole card
            toggles the checkbox and shows a hover background.
          </p>
          <p className="text-body-regular text-text-secondary">
            Note: the original site has no standalone page for Checkbox Card
            (boardui.com/components/checkbox-card returns 404). The content here follows the registry description
            and the Card section of the original Checkbox page.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this checkbox card component using our CLI or manually. The CLI copies the component source
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

        <Section title="Card">
          <p className="text-body-regular text-text-secondary">
            Selectable card with a title and optional description — the whole card toggles the checkbox and shows a
            hover background. It&apos;s a separate registry item: npx boardui add checkbox-card.
          </p>
          <Demo>
            <div className="flex max-w-md flex-col gap-2">
              <CheckboxCard title="Item title" description="This is for you to check." />
              <CheckboxCard defaultSelected title="Item title" description="This is for you to check." />
              <CheckboxCard title="No description" />
            </div>
          </Demo>
          <CodeBlock code={CARD_CODE} />
        </Section>

        <Section title="Controlled">
          <p className="text-body-regular text-text-secondary">
            CheckboxCard is a React Aria checkbox, so it takes isSelected + onChange for controlled state, or
            defaultSelected for uncontrolled.
          </p>
          <Demo>
            <div className="flex max-w-md flex-col gap-3">
              <CheckboxCard
                title="Email notifications"
                description="Get a digest when someone mentions you."
                isSelected={checked}
                onChange={setChecked}
              />
              <p className="text-body-regular text-text-secondary">
                {checked ? "Notifications on." : "Notifications off."}
              </p>
            </div>
          </Demo>
          <CodeBlock code={CONTROLLED_CODE} />
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
