"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiInformationLine, RiLinkM } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Input } from "@/components/base/input/input";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { Popover, PopoverFooter, PopoverHeader, PopoverTrigger } from "@/components/base/popover/popover";

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

const INSTALL_CMD = "npx boardui@latest add popover";

const ARROW_CODE = `<span className="text-body-medium text-text-secondary">Net revenue retention</span>
<PopoverTrigger>
  <IconButton icon={RiInformationLine} size="small" aria-label="About net revenue retention" />
  <Popover showArrow placement="top" className="w-72">
    <PopoverHeader
      title="Net revenue retention"
      description="Revenue kept from existing customers over 12 months, upgrades included and churn taken out. Above 100% the base grows on its own."
    />
  </Popover>
</PopoverTrigger>`;

const FORMS_CODE = `const [isOpen, setIsOpen] = useState(false);

<PopoverTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
  <Button variant="secondary" leadingIcon={RiLinkM}>Add link</Button>
  <Popover placement="bottom start">
    <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); addLink(); setIsOpen(false); }}>
      <PopoverHeader title="Add link" />
      <Input label="URL" type="url" placeholder="https://" inputDir="ltr" autoFocus isRequired />
      <Input label="Text" placeholder="Shown instead of the URL" />
      <PopoverFooter>
        <Button variant="secondary" size="small" onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit" size="small">Add link</Button>
      </PopoverFooter>
    </form>
  </Popover>
</PopoverTrigger>`;

const PLACEMENT_CODE = `<PopoverTrigger>
  <Button variant="secondary">Top</Button>
  <Popover showArrow placement="top" className="w-auto">…</Popover>
</PopoverTrigger>

// Also: "bottom" (the default), "start", "end",
// and aligned variants such as "bottom start" or "top end".`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <PopoverTrigger>
    <Button variant="secondary">مشاركة</Button>
    <Popover showArrow>
      <PopoverHeader title="مشاركة لوحة المعلومات" description="يمكن لأي شخص في مساحة العمل لديه الرابط عرضها." />
      <Input aria-label="رابط لوحة المعلومات" value={url} isReadOnly inputDir="ltr" />
    </Popover>
  </PopoverTrigger>
</DirectionProvider>`;

/** Popover detail page, mirroring boardui.com/components/popover. */
export default function PopoverPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [url] = useState("https://boardui.com/share/acme-dashboard");
  return (
    <DocsLayout variant="library" title="Popover">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Open free-form content next to its trigger: a share link, a short form, or the story behind a number.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the popover using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            PopoverTrigger takes the trigger, any BoardUI button, followed by the Popover. PopoverHeader names the
            popover for assistive technology and PopoverFooter lines up actions. The popover positions itself,
            flips when it runs out of room, and grows out of the point closest to its trigger. It is non-modal
            like Select and Dropdown: the page keeps scrolling, a press outside closes it, and so does pressing
            the trigger again. Use Modal for content that needs the whole screen.
          </p>
        </Section>

        <Section title="Arrow">
          <p className="text-body-regular text-text-secondary">
            Set showArrow to draw the caret Tooltip uses, in the popover&apos;s own colours. It points at the
            middle of the trigger on every side.
          </p>
          <Demo>
            <div className="flex items-center gap-2">
              <span className="text-body-medium text-text-secondary">Net revenue retention</span>
              <PopoverTrigger>
                <IconButton icon={RiInformationLine} size="small" aria-label="About net revenue retention" />
                <Popover showArrow placement="top" className="w-72">
                  <PopoverHeader
                    title="Net revenue retention"
                    description="Revenue kept from existing customers over 12 months, upgrades included and churn taken out. Above 100% the base grows on its own."
                  />
                </Popover>
              </PopoverTrigger>
            </div>
          </Demo>
          <CodeBlock code={ARROW_CODE} />
        </Section>

        <Section title="Forms">
          <p className="text-body-regular text-text-secondary">
            Control the open state with isOpen and onOpenChange to close the popover when a form submits. Anchor
            it with placement=&quot;bottom start&quot; so it stays put while the trigger&apos;s label changes.
          </p>
          <Demo>
            <PopoverTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
              <Button variant="secondary" leadingIcon={RiLinkM}>
                Add link
              </Button>
              <Popover placement="bottom start">
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setIsOpen(false);
                  }}
                >
                  <PopoverHeader title="Add link" />
                  <Input label="URL" type="url" placeholder="https://" inputDir="ltr" autoFocus isRequired />
                  <Input label="Text" placeholder="Shown instead of the URL" />
                  <PopoverFooter>
                    <Button variant="secondary" size="small" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="small">
                      Add link
                    </Button>
                  </PopoverFooter>
                </form>
              </Popover>
            </PopoverTrigger>
          </Demo>
          <CodeBlock code={FORMS_CODE} />
        </Section>

        <Section title="Placement">
          <p className="text-body-regular text-text-secondary">
            placement takes a side and an optional alignment. Start and end follow the reading direction, and every
            side flips to the opposite one when the screen edge is too close.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <PopoverTrigger>
                <Button variant="secondary">Top</Button>
                <Popover showArrow placement="top" className="w-auto">
                  <PopoverHeader title="Top" description="Anchored above the trigger." />
                </Popover>
              </PopoverTrigger>
              <PopoverTrigger>
                <Button variant="secondary">Bottom</Button>
                <Popover showArrow placement="bottom" className="w-auto">
                  <PopoverHeader title="Bottom" description="Anchored below the trigger." />
                </Popover>
              </PopoverTrigger>
              <PopoverTrigger>
                <Button variant="secondary">Start</Button>
                <Popover showArrow placement="start" className="w-auto">
                  <PopoverHeader title="Start" description="Anchored to the start side." />
                </Popover>
              </PopoverTrigger>
              <PopoverTrigger>
                <Button variant="secondary">End</Button>
                <Popover showArrow placement="end" className="w-auto">
                  <PopoverHeader title="End" description="Anchored to the end side." />
                </Popover>
              </PopoverTrigger>
            </div>
          </Demo>
          <CodeBlock code={PLACEMENT_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Wrap the region in DirectionProvider. The popover carries the direction into its portal, so its text,
            alignment, and start and end placements mirror.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <PopoverTrigger>
                <Button variant="secondary">مشاركة</Button>
                <Popover showArrow>
                  <PopoverHeader
                    title="مشاركة لوحة المعلومات"
                    description="يمكن لأي شخص في مساحة العمل لديه الرابط عرضها."
                  />
                  <Input aria-label="رابط لوحة المعلومات" value={url} isReadOnly inputDir="ltr" />
                </Popover>
              </PopoverTrigger>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Opening the popover moves focus into it. Escape closes it and returns focus to the trigger, and
            tabbing out of it closes it too. The trigger announces the popover&apos;s title. Reduced motion keeps
            the fade and drops the scale and blur.
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
