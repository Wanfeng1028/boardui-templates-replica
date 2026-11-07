"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiMoonLine, RiNotification4Line } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { SwitchCard } from "@/components/base/switch/switch-card";

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

const INSTALL_CMD = "npx boardui@latest add switch-card";

const SWITCH_CARD_CODE = `import { RiNotification4Line, RiMoonLine } from "@remixicon/react";
import { SwitchCard } from "@/components/base/switch/switch-card";

export function Example() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <SwitchCard
        icon={RiNotification4Line}
        title="Push notifications"
        description="Get notified when something needs your attention."
        defaultSelected
      />
      {/* icon is optional - pass the component reference, not <RiMoonLine /> */}
      <SwitchCard icon={RiMoonLine} title="Dark mode" />
    </div>
  );
}`;

/**
 * Switch Card detail page. BoardUI has no standalone page for it:
 * boardui.com/components/switch-card returns 404, and the component is
 * documented on boardui.com/components/switch and in the registry
 * (description below) and llms.txt instead.
 */
export default function SwitchCardPage() {
  return (
    <AppShell title="Switch Card" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">Bordered settings row driven by a switch.</p>
          <p className="text-caption-1-medium text-text-tertiary">
            Source note: BoardUI documents Switch Card on the Switch page (boardui.com/components/switch), not on
            a standalone page — boardui.com/components/switch-card returns 404. Description from the BoardUI
            registry and llms.txt.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the switch card using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="Switch cards">
          <p className="text-body-regular text-text-secondary">
            Selectable settings card — an optional 24×24 leading icon, a title and short description on the left,
            and the switch on the right. The whole card toggles and shows a hover background, the switch
            counterpart to CheckboxCard. Pass any Remix icon via icon to SwitchCard.
          </p>
          <Demo>
            <div className="flex max-w-md flex-col gap-4">
              <SwitchCard
                icon={RiNotification4Line}
                title="Push notifications"
                description="Get notified when something needs your attention."
                defaultSelected
              />
              <SwitchCard icon={RiMoonLine} title="Dark mode" description="Use a dark theme across the app." />
            </div>
          </Demo>
          <CodeBlock code={SWITCH_CARD_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            The whole card is the switch&apos;s label, so a click anywhere flips the state. The card is one tab
            stop; Space toggles it, and the title and description are announced with the switch state.
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
