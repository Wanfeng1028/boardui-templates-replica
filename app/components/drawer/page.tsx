"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiFilterLine, RiHistoryLine, RiLinkM, RiMailLine, RiMessage2Line, RiMoreLine, RiShareForwardLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/base/drawer/drawer";
import type { DrawerPlacement } from "@/components/base/drawer/drawer";
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

const INSTALL_CMD = "npx boardui@latest add drawer";

const EVENTS = [
  { id: "1", text: "Mia Chen created the Q3 report draft." },
  { id: "2", text: "Leo Park shared the launch assets folder." },
  { id: "3", text: "Noah Kim changed the billing plan to Annual." },
  { id: "4", text: "Mia Chen invited two teammates to the workspace." },
  { id: "5", text: "Leo Park exported the September invoice." },
  { id: "6", text: "Noah Kim archived the old brand board." },
  { id: "7", text: "Mia Chen updated the onboarding checklist." },
  { id: "8", text: "Leo Park commented on the pricing page." },
];

const SHARE_TARGETS = [
  { label: "Copy link", icon: RiLinkM },
  { label: "Email", icon: RiMailLine },
  { label: "Messages", icon: RiMessage2Line },
  { label: "More", icon: RiMoreLine },
];

const BOTTOM_SHEET_CODE = `<DrawerTrigger>
  <Button variant="secondary" leadingIcon={RiShareForwardLine}>Share report</Button>
  <Drawer placement="bottom">
    {({ close }) => (
      <>
        <DrawerHeader
          title="Share Q3 report"
          description="Anyone in the Acme workspace with the link can view it."
        />
        <DrawerBody>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {targets.map((target) => (
              <button key={target.label} type="button" onClick={close}>…</button>
            ))}
          </div>
        </DrawerBody>
      </>
    )}
  </Drawer>
</DrawerTrigger>`;

const PLACEMENT_CODE = `const [placement, setPlacement] = useState<DrawerPlacement | null>(null);

<Button variant="secondary" onClick={() => setPlacement("start")}>Start</Button>
<Button variant="secondary" onClick={() => setPlacement("end")}>End</Button>
<Button variant="secondary" onClick={() => setPlacement("top")}>Top</Button>
<Button variant="secondary" onClick={() => setPlacement("bottom")}>Bottom</Button>

<Drawer
  placement={placement ?? "end"}
  isOpen={placement !== null}
  onOpenChange={(open) => !open && setPlacement(null)}
>
  <DrawerHeader
    title="Drawer"
    description="Start and end follow the reading direction. Top and bottom span the screen."
  />
</Drawer>`;

const SIZES_CODE = `<Drawer size="sm">…</Drawer> // 320px
<Drawer size="md">…</Drawer> // 400px, the default
<Drawer size="lg">…</Drawer> // 600px

// Top and bottom drawers span the screen and grow to 85% of its height
<Drawer placement="bottom">…</Drawer>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <DrawerTrigger>
    <Button variant="secondary">عوامل التصفية</Button>
    <Drawer>
      <DrawerHeader title="عوامل التصفية" description="تضييق قائمة العملاء." closeLabel="إغلاق" />
      <DrawerBody>…</DrawerBody>
    </Drawer>
  </DrawerTrigger>
</DirectionProvider>`;

/** Drawer detail page, mirroring boardui.com/components/drawer. */
export default function DrawerPage() {
  const [placement, setPlacement] = useState<DrawerPlacement | null>(null);

  return (
    <DocsLayout variant="library" title="Drawer">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Slide a panel in from any edge of the screen for filters, details, and sheets, without leaving the page.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this drawer component using our CLI or manually. The CLI copies the component source (with
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

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            Drawer is a sibling of Modal: the same trigger, header, scrolling body, and footer, re-exported as
            DrawerTrigger, DrawerHeader, DrawerBody, and DrawerFooter. The panel floats inside the edge of the
            screen with the same surface, and slides in while it sharpens from a soft blur.
          </p>
          <Demo>
            <DrawerTrigger>
              <Button variant="secondary" leadingIcon={RiFilterLine}>
                Filters
              </Button>
              <Drawer>
                {({ close }) => (
                  <>
                    <DrawerHeader title="Filters" description="Narrow down the customer list." />
                    <DrawerBody>
                      <div className="flex flex-col gap-3">
                        <p className="text-body-regular text-text-secondary">Status: Active customers only.</p>
                        <p className="text-body-regular text-text-secondary">Plan: all plans.</p>
                        <p className="text-body-regular text-text-secondary">Region: all regions.</p>
                      </div>
                    </DrawerBody>
                    <DrawerFooter>
                      <Button variant="secondary" onClick={close}>
                        Cancel
                      </Button>
                      <Button onClick={close}>Apply filters</Button>
                    </DrawerFooter>
                  </>
                )}
              </Drawer>
            </DrawerTrigger>
          </Demo>
        </Section>

        <Section title="Bottom sheet">
          <p className="text-body-regular text-text-secondary">
            Set placement=&quot;bottom&quot; for a sheet that rises from the bottom, the natural home for actions
            on a phone. It grows with its content up to 85% of the screen, then its body scrolls.
          </p>
          <Demo>
            <DrawerTrigger>
              <Button variant="secondary" leadingIcon={RiShareForwardLine}>
                Share report
              </Button>
              <Drawer placement="bottom">
                {({ close }) => (
                  <>
                    <DrawerHeader
                      title="Share Q3 report"
                      description="Anyone in the Acme workspace with the link can view it."
                    />
                    <DrawerBody>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {SHARE_TARGETS.map((target) => (
                          <button
                            key={target.label}
                            type="button"
                            onClick={close}
                            className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-border-button-default bg-background-primary-default px-3 py-4 text-body-medium text-text-primary transition-colors hover:bg-background-primary-hover"
                          >
                            <target.icon className="size-5 text-foreground-icon-secondary" aria-hidden />
                            {target.label}
                          </button>
                        ))}
                      </div>
                    </DrawerBody>
                  </>
                )}
              </Drawer>
            </DrawerTrigger>
          </Demo>
          <CodeBlock code={BOTTOM_SHEET_CODE} />
        </Section>

        <Section title="Placement">
          <p className="text-body-regular text-text-secondary">
            placement takes start, end, top, or bottom. Start and end follow the reading direction, so an end
            drawer opens from the left in Arabic and Hebrew.
          </p>
          <Demo>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setPlacement("start")}>
                Start
              </Button>
              <Button variant="secondary" onClick={() => setPlacement("end")}>
                End
              </Button>
              <Button variant="secondary" onClick={() => setPlacement("top")}>
                Top
              </Button>
              <Button variant="secondary" onClick={() => setPlacement("bottom")}>
                Bottom
              </Button>
            </div>
            <Drawer
              placement={placement ?? "end"}
              isOpen={placement !== null}
              onOpenChange={(open) => !open && setPlacement(null)}
            >
              <DrawerHeader
                title="Drawer"
                description="Start and end follow the reading direction. Top and bottom span the screen."
              />
            </Drawer>
          </Demo>
          <CodeBlock code={PLACEMENT_CODE} />
        </Section>

        <Section title="Long content">
          <p className="text-body-regular text-text-secondary">
            Side drawers take the full height of the screen, and DrawerBody scrolls on its own with the header held
            in place. A progressive blur softens the top edge once the list moves under it.
          </p>
          <Demo>
            <DrawerTrigger>
              <Button variant="secondary" leadingIcon={RiHistoryLine}>
                View activity
              </Button>
              <Drawer size="sm">
                <DrawerHeader title="Activity" description="Everything that happened in the Acme workspace." />
                <DrawerBody>
                  <ol className="flex flex-col gap-4">
                    {EVENTS.map((event) => (
                      <li key={event.id} className="flex items-start gap-3">
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-500" aria-hidden />
                        <span className="text-body-regular text-text-primary">{event.text}</span>
                      </li>
                    ))}
                  </ol>
                </DrawerBody>
              </Drawer>
            </DrawerTrigger>
          </Demo>
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Side drawers come in three widths, all capped by the screen. Control the open state with isOpen and
            onOpenChange, as with Modal.
          </p>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Wrap the region in DirectionProvider. The drawer carries the direction into its portal, so it slides in
            from the left and its contents mirror.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <DrawerTrigger>
                <Button variant="secondary">عوامل التصفية</Button>
                <Drawer>
                  <DrawerHeader title="عوامل التصفية" description="تضييق قائمة العملاء." closeLabel="إغلاق" />
                  <DrawerBody>
                    <p className="text-body-regular text-text-secondary">الحالة: العملاء النشطون فقط.</p>
                  </DrawerBody>
                </Drawer>
              </DrawerTrigger>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Opening the drawer moves focus inside it, Tab and Shift+Tab cycle through its controls, and Escape or a
            press on the backdrop closes it. Focus then returns to the trigger, and the page behind stops scrolling
            while the drawer is open.
          </p>
          <p className="text-body-regular text-text-secondary">
            Reduced motion replaces the slide and blur with a fade.
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
