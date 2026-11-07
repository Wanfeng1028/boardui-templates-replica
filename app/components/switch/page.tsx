"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiToggleLine } from "@remixicon/react";
import { AppShell } from "@/components/application/app-shell/app-shell";
import { RiMoonLine, RiNotification4Line } from "@remixicon/react";

function CodeBlock({ code, label = "Code" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-2">
        <span className="text-caption-1-medium text-text-tertiary">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre dir="ltr" className="overflow-x-auto p-4 font-mono text-caption-1-regular text-text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/components"
      className="inline-flex w-fit items-center gap-1.5 rounded-md text-body-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <RiArrowLeftLine className="size-4" />
      Back to components
    </Link>
  );
}

import { Switch } from "@/components/base/switch/switch";
import { SwitchCard } from "@/components/base/switch/switch-card";

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false);
  return (
    <AppShell title="Switch" icon={RiToggleLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          An accessible toggle switch built on React Aria — native toggle semantics, keyboard support and a
          focus-visible ring. Two shapes (pill and rectangle) in three sizes. The on state uses the primary
          gradient with an inset ring and a small blue chip embossed in the thumb, matching Figma 1:1.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this switch component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add switch`} />
        </Section>

        <Section title="Shapes">
          <p className="text-body-regular text-text-secondary">
            Two shapes via the shape prop. pill (the default) is fully rounded; rectangle uses radius/md on
            the track and radius/xs on the thumb, both scaled per size. The thumb&apos;s inner chip follows
            the same shape.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-start gap-3">
                <span className="text-caption-1-medium text-text-tertiary">Pill (default)</span>
                <Switch shape="pill" defaultSelected aria-label="Pill switch" />
              </div>
              <div className="flex flex-col items-start gap-3">
                <span className="text-caption-1-medium text-text-tertiary">Rectangle</span>
                <Switch shape="rectangle" defaultSelected aria-label="Rectangle switch" />
              </div>
            </div>
          </Demo>
          <CodeBlock
            code={`<Switch shape="pill" defaultSelected />   {/* fully rounded (default) */}
<Switch shape="rectangle" defaultSelected />   {/* radius/md track, radius/xs thumb */}`}
          />
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Three sizes via the size prop — lg (56×32), md (42×24, the default) and sm (28×16). The thumb,
            padding, travel distance and the on-state ring all scale together.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-start gap-3">
                <span className="text-caption-1-medium text-text-tertiary">Large · 56 × 32</span>
                <Switch size="lg" defaultSelected aria-label="Large switch" />
              </div>
              <div className="flex flex-col items-start gap-3">
                <span className="text-caption-1-medium text-text-tertiary">Medium · 42 × 24</span>
                <Switch size="md" defaultSelected aria-label="Medium switch" />
              </div>
              <div className="flex flex-col items-start gap-3">
                <span className="text-caption-1-medium text-text-tertiary">Small · 28 × 16</span>
                <Switch size="sm" defaultSelected aria-label="Small switch" />
              </div>
            </div>
          </Demo>
          <CodeBlock
            code={`<Switch size="lg" defaultSelected />   {/* 56 × 32 */}
<Switch size="md" defaultSelected />   {/* 42 × 24 (default) */}
<Switch size="sm" defaultSelected />   {/* 28 × 16 */}`}
          />
        </Section>

        <Section title="States & labels">
          <p className="text-body-regular text-text-secondary">
            Use isSelected + onChange for a controlled switch, or defaultSelected for uncontrolled. isDisabled
            dims the control to 50%. Pass children for a label — React Aria associates it with the input, so
            clicking the text toggles the switch.
          </p>
          <Demo>
            <div className="flex flex-col items-start gap-4">
              <Switch isSelected={enabled} onChange={setEnabled} aria-label="Controlled switch">
                Auto-sync to cloud
              </Switch>
              <Switch isDisabled defaultSelected aria-label="Disabled switch">
                Disabled, on
              </Switch>
              <Switch defaultSelected>Auto-sync to cloud</Switch>
            </div>
          </Demo>
          <CodeBlock
            code={`{/* Controlled */}
<Switch isSelected={enabled} onChange={setEnabled} />

{/* Disabled */}
<Switch isDisabled defaultSelected />

{/* With label (react-aria associates it automatically) */}
<Switch>Auto-sync to cloud</Switch>`}
          />
        </Section>

        <Section title="Card">
          <p className="text-body-regular text-text-secondary">
            Selectable settings card — an optional 24×24 leading icon, a title and short description on the
            left, and the switch on the right. The whole card toggles and shows a hover background, the switch
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
          <CodeBlock
            code={`import { RiNotification4Line, RiMoonLine } from "@remixicon/react";
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
}`}
          />
        </Section>

        <BackLink />
      </div>
    </AppShell>
  );
}
