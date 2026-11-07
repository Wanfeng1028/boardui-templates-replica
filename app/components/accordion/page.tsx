"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import Link from "next/link";
import { RiAddLine, RiArrowLeftLine, RiBankCardLine, RiCheckLine, RiFileCopyLine, RiNotification3Line, RiShieldKeyholeLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Switch } from "@/components/base/switch/switch";
import { Accordion, AccordionItem } from "@/components/base/accordion/accordion";
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

const INSTALL_CMD = "npx boardui@latest add accordion";

const FAQ = [
  {
    id: "billing",
    question: "How does billing work?",
    answer:
      "Plans are billed at the start of each month for every active seat. Seats you add mid-month are prorated, and you can download every invoice from Settings.",
  },
  {
    id: "plans",
    question: "Can I change plans later?",
    answer:
      "Yes. Upgrades apply right away, and downgrades take effect at the end of the current billing period, so you never lose access you have paid for.",
  },
  {
    id: "data",
    question: "What happens to my data if I cancel?",
    answer:
      "Your workspace stays readable for 30 days, so you can export everything. After that it is deleted for good.",
  },
  {
    id: "nonprofits",
    question: "Do you offer discounts for nonprofits?",
    answer:
      "Registered nonprofits and schools get 50% off any plan. Write to us from the address on your registration and we will apply it.",
  },
];

const CONTAINED_CODE = `<Accordion variant="contained" indicator="plus" defaultExpandedKeys={["plans"]}>
  <AccordionItem id="billing" title="How does billing work?">…</AccordionItem>
  <AccordionItem id="plans" title="Can I change plans later?">…</AccordionItem>
  <AccordionItem id="data" title="What happens to my data if I cancel?">…</AccordionItem>
</Accordion>`;

const SEPARATED_CODE = `import { RiBankCardLine, RiNotification3Line, RiShieldKeyholeLine } from "@remixicon/react";

<Accordion variant="separated" allowsMultipleExpanded defaultExpandedKeys={["notifications"]}>
  <AccordionItem
    id="notifications"
    icon={RiNotification3Line}
    title="Notifications"
    description="Email, push, and Slack"
  >
    <Switch defaultSelected>Email me about mentions</Switch>
  </AccordionItem>
  <AccordionItem
    id="security"
    icon={RiShieldKeyholeLine}
    title="Security"
    description="Two-factor sign-in and sessions"
  >
    …
  </AccordionItem>
  <AccordionItem
    id="billing"
    icon={RiBankCardLine}
    title="Billing"
    description="Managed by your workspace owner"
    isDisabled
  >
    …
  </AccordionItem>
</Accordion>`;

const CONTROLLED_CODE = `const [expanded, setExpanded] = useState<Set<Key>>(new Set(["billing"]));

<Button variant="secondary" size="small" onClick={() => setExpanded(new Set(ids))}>
  Expand all
</Button>
<Button variant="secondary" size="small" onClick={() => setExpanded(new Set())}>
  Collapse all
</Button>

<Accordion allowsMultipleExpanded expandedKeys={expanded} onExpandedChange={setExpanded}>
  {faq.map((item) => (
    <AccordionItem key={item.id} id={item.id} title={item.question}>
      <p>{item.answer}</p>
    </AccordionItem>
  ))}
</Accordion>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <Accordion defaultExpandedKeys={["billing"]}>
    <AccordionItem id="billing" title="كيف تعمل الفوترة؟">…</AccordionItem>
    <AccordionItem id="plans" title="هل يمكنني تغيير الخطة لاحقًا؟">…</AccordionItem>
  </Accordion>
</DirectionProvider>`;

/** Accordion detail page, mirroring boardui.com/components/accordion. */
export default function AccordionPage() {
  const ids = FAQ.map((item) => item.id);
  const [expanded, setExpanded] = useState<Set<Key>>(new Set(["billing"]));

  return (
    <AppShell title="Accordion" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Fold questions, settings, and details into sections that open in place, one at a time or all together.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this accordion component using our CLI or manually. The CLI copies the component source
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
            Accordion groups the sections and AccordionItem is one section: a heading with a button that opens its
            panel. Give every item an id so you can open it from defaultExpandedKeys or control it.
          </p>
          <p className="text-body-regular text-text-secondary">
            The panel eases open while its content fades in, settles a few pixels, and sharpens from a soft blur. A
            closed panel stays in the page, hidden until found, so the browser&apos;s find-in-page still reaches its
            text and opens it.
          </p>
          <Demo>
            <Accordion defaultExpandedKeys={["billing"]}>
              {FAQ.map((item) => (
                <AccordionItem key={item.id} id={item.id} title={item.question}>
                  <p className="text-body-regular text-text-secondary">{item.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </Demo>
        </Section>

        <Section title="Contained">
          <p className="text-body-regular text-text-secondary">
            variant=&quot;contained&quot; sets each item on a tray, the look of the FAQ on the BoardUI home page.
            indicator=&quot;plus&quot; swaps the chevron for a plus that turns into a close.
          </p>
          <Demo>
            <Accordion variant="contained" indicator="plus" defaultExpandedKeys={["plans"]}>
              {FAQ.slice(0, 3).map((item) => (
                <AccordionItem key={item.id} id={item.id} title={item.question}>
                  <p className="text-body-regular text-text-secondary">{item.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </Demo>
          <CodeBlock code={CONTAINED_CODE} />
        </Section>

        <Section title="Separated, with icons">
          <p className="text-body-regular text-text-secondary">
            variant=&quot;separated&quot; gives every item its own card. Add an icon and a description for settings
            groups, and allowsMultipleExpanded to let several stay open. isDisabled locks an item.
          </p>
          <Demo>
            <Accordion variant="separated" allowsMultipleExpanded defaultExpandedKeys={["notifications"]}>
              <AccordionItem
                id="notifications"
                icon={RiNotification3Line}
                title="Notifications"
                description="Email, push, and Slack"
              >
                <Switch defaultSelected>Email me about mentions</Switch>
              </AccordionItem>
              <AccordionItem
                id="security"
                icon={RiShieldKeyholeLine}
                title="Security"
                description="Two-factor sign-in and sessions"
              >
                <p className="text-body-regular text-text-secondary">Two-factor sign-in is on for this workspace.</p>
              </AccordionItem>
              <AccordionItem
                id="billing"
                icon={RiBankCardLine}
                title="Billing"
                description="Managed by your workspace owner"
                isDisabled
              >
                <p className="text-body-regular text-text-secondary">Only the workspace owner can change billing.</p>
              </AccordionItem>
            </Accordion>
          </Demo>
          <CodeBlock code={SEPARATED_CODE} />
        </Section>

        <Section title="Controlled">
          <p className="text-body-regular text-text-secondary">
            Keep the open sections in your own state with expandedKeys and onExpandedChange, for example to expand
            or collapse them all at once.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="small" onClick={() => setExpanded(new Set<Key>(ids))}>
                  Expand all
                </Button>
                <Button variant="secondary" size="small" onClick={() => setExpanded(new Set<Key>())}>
                  Collapse all
                </Button>
              </div>
              <Accordion allowsMultipleExpanded expandedKeys={expanded} onExpandedChange={setExpanded}>
                {FAQ.map((item) => (
                  <AccordionItem key={item.id} id={item.id} title={item.question}>
                    <p className="text-body-regular text-text-secondary">{item.answer}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Demo>
          <CodeBlock code={CONTROLLED_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Wrap the accordion in DirectionProvider. Titles align to the right and the indicator moves to the left
            edge.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <Accordion defaultExpandedKeys={["billing"]}>
                <AccordionItem id="billing" title="كيف تعمل الفوترة؟">
                  <p className="text-body-regular text-text-secondary">
                    تُحتسب الخطط في بداية كل شهر لكل مقعد نشط، ويمكنك تنزيل كل فاتورة من الإعدادات.
                  </p>
                </AccordionItem>
                <AccordionItem id="plans" title="هل يمكنني تغيير الخطة لاحقًا؟">
                  <p className="text-body-regular text-text-secondary">
                    نعم. تسري الترقية فورًا، ويسري التخفيض في نهاية فترة الفوترة الحالية.
                  </p>
                </AccordionItem>
              </Accordion>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Each header is a button inside a heading (level 3 by default, set with headingLevel). Tab moves between
            headers, and Enter or Space opens and closes a section. Screen readers hear whether it is expanded and
            which panel it controls.
          </p>
          <p className="text-body-regular text-text-secondary">
            Reduced motion opens and closes sections instantly.
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
