"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiDownload2Line, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { toast, Toaster } from "@/components/base/toast/toast";

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

const INSTALL_CMD = "npx boardui@latest add toast";

const UPDATE_CODE = `const id = toast.info("Exporting customers", {
  description: "Preparing 1,284 rows.",
  icon: RiDownload2Line,
  duration: Infinity, // stays until updated or dismissed
  dismissible: false,
});

await exportCustomers();

toast.update(id, {
  title: "Export ready",
  description: "customers.csv is in your downloads.",
  status: "success",
  icon: undefined,
  duration: 4000, // a new duration restarts the countdown
  dismissible: true,
});`;

const POSITION_CODE = `<Toaster position="top-center" />

// "top-start" | "top-center" | "top-end"
// "bottom-start" | "bottom-center" | "bottom-end" (the default)`;

const DURATION_CODE = `<Toaster
  limit={3}        // toasts on screen at once; the oldest leave first
  duration={5000}  // default countdown in milliseconds
/>

toast("Saved", { duration: 2000 });          // per toast
toast("Syncing…", { duration: Infinity });   // until dismissed
toast("Draft saved", { id: "draft" });       // the same id replaces it
toast.dismiss("draft");                      // dismiss one
toast.dismiss();                             // dismiss all`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <Toaster position="bottom-end" closeLabel="إغلاق الإشعار" />
</DirectionProvider>`;

/** Toast detail page, mirroring boardui.com/components/toast. */
export default function ToastPage() {
  return (
    <DocsLayout variant="library" title="Toast">
      <Toaster />
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Confirm what just happened with a short notification from anywhere in the app, then get out of the way.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the toast using our CLI or manually. The CLI copies the component source (with its
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
            Render one Toaster near the root of the app, then call toast() from anywhere: an event handler, a
            server action&apos;s result, a data hook. Each toast is a Notification card in a NotificationViewport,
            so it has the same status icons, countdown bar, actions, and motion, and the stack closes its gaps
            with the same spring. Use toast.success, toast.error, and toast.info for the status colours. Pressing
            an action runs it and dismisses the toast.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => toast.success("Changes saved", { description: "Your edits are live." })}
              >
                Save changes
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toast("Project archived", {
                    description: "Acme Dashboard is now in the archive.",
                    actions: [{ label: "Undo", onClick: () => toast.success("Project restored") }],
                  })
                }
              >
                Archive project
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.info("Upload started", { description: "Q3-report.pdf is uploading." })}
              >
                Upload file
              </Button>
            </div>
          </Demo>
        </Section>

        <Section title="Update a toast">
          <p className="text-body-regular text-text-secondary">
            toast() returns an id. Pass it to toast.update to turn a long task&apos;s toast into its result, and
            to toast.dismiss to remove it. A toast with an Infinity duration stays until it is updated or
            dismissed.
          </p>
          <Demo>
            <Button
              variant="secondary"
              leadingIcon={RiDownload2Line}
              onClick={() => {
                const id = toast.info("Exporting customers", {
                  description: "Preparing 1,284 rows.",
                  icon: RiDownload2Line,
                  duration: Infinity,
                  dismissible: false,
                });
                window.setTimeout(() => {
                  toast.update(id, {
                    title: "Export ready",
                    description: "customers.csv is in your downloads.",
                    status: "success",
                    icon: undefined,
                    duration: 4000,
                    dismissible: true,
                  });
                }, 1500);
              }}
            >
              Export CSV
            </Button>
          </Demo>
          <CodeBlock code={UPDATE_CODE} />
        </Section>

        <Section title="Position">
          <p className="text-body-regular text-text-secondary">
            Anchor the stack to any corner or to the middle of the top or bottom edge with position. Start and end
            follow the reading direction.
          </p>
          <CodeBlock code={POSITION_CODE} />
        </Section>

        <Section title="Duration and limit">
          <p className="text-body-regular text-text-secondary">
            Toasts dismiss themselves after five seconds, with a countdown bar along the bottom edge. Set duration
            on the Toaster or on a single toast. limit caps how many show at once, and reusing an id replaces a
            toast that is still on screen.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={() => toast("Saved", { duration: 2000 })}>
                Saved, 2s
              </Button>
              <Button variant="secondary" onClick={() => toast("Syncing…", { duration: Infinity })}>
                Syncing, until dismissed
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast("Draft saved", { id: "draft", description: "Replaces the previous draft toast." })}
              >
                Draft saved
              </Button>
              <Button variant="secondary" onClick={() => toast.dismiss("draft")}>
                Dismiss draft
              </Button>
            </div>
          </Demo>
          <CodeBlock code={DURATION_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Place the Toaster inside DirectionProvider. The stack takes the direction into its portal, so end
            corners move to the left, the close button and actions mirror, and the countdown bar runs from the
            other side.
          </p>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            The stack is a labelled region and a polite live region, so screen readers announce each toast as it
            arrives, and error toasts as alerts. Every countdown is announced too. Keep toasts for confirmations
            that need no answer. Ask for a decision with an alert dialog instead.
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
