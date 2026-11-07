"use client";

import { useState } from "react";
import Link from "next/link";
import { RiDeleteBinLine, RiFileTextLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { AlertDialog, Modal, ModalBody, ModalFooter, ModalHeader, ModalTrigger } from "@/components/base/modal/modal";

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

const INSTALL_CMD = "npx boardui@latest add modal";

const ALERT_DIALOG_CODE = `import { RiDeleteBinLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { AlertDialog, ModalTrigger } from "@/components/base/modal/modal";

<ModalTrigger>
  <Button variant="danger" leadingIcon={RiDeleteBinLine}>Delete project</Button>
  <AlertDialog
    title="Delete project?"
    description="Acme Dashboard and its 24 files will be deleted for everyone. You can't undo this."
    confirmLabel="Delete project"
    pendingLabel="Deleting..."
    onConfirm={() => deleteProject(projectId)} // return the promise to keep it open until done
  />
</ModalTrigger>`;

const CONFIRM_BY_TYPING_CODE = `const [phrase, setPhrase] = useState("");

<ModalTrigger onOpenChange={(open) => !open && setPhrase("")}>
  <Button variant="secondary">Transfer ownership</Button>
  <AlertDialog
    title="Transfer workspace ownership?"
    description="Maya Chen becomes the owner and you become an admin. Type acme below to confirm."
    confirmLabel="Transfer ownership"
    isConfirmDisabled={phrase !== "acme"}
  >
    <Input aria-label="Workspace name" placeholder="acme" value={phrase} onChange={setPhrase} autoComplete="off" />
  </AlertDialog>
</ModalTrigger>`;

const LONG_CONTENT_CODE = `<ModalTrigger>
  <Button variant="secondary" leadingIcon={RiFileTextLine}>Review terms</Button>
  <Modal size="lg">
    {({ close }) => (
      <>
        <ModalHeader title="Terms of service" description="Last updated 1 October 2026" />
        <ModalBody>{/* any amount of content */}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>Decline</Button>
          <Button onClick={close}>Accept</Button>
        </ModalFooter>
      </>
    )}
  </Modal>
</ModalTrigger>`;

const CONTROLLED_CODE = `const [isOpen, setIsOpen] = useState(false);

<Button variant="secondary" onClick={() => setIsOpen(true)}>Rename project</Button>

<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="sm">
  <ModalHeader title="Rename project" />
  <ModalBody>
    <form id="rename-form" onSubmit={(event) => { event.preventDefault(); save(); setIsOpen(false); }}>
      <Input aria-label="Project name" value={draft} onChange={setDraft} autoFocus />
    </form>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button type="submit" form="rename-form">Save</Button>
  </ModalFooter>
</Modal>`;

const SIZES_CODE = `<Modal size="sm">…</Modal> // 400px, the AlertDialog default
<Modal size="md">…</Modal> // 480px, the default
<Modal size="lg">…</Modal> // 640px
<Modal size="xl">…</Modal> // 800px

// Without a ModalHeader, name the dialog yourself
<Modal aria-label="Keyboard shortcuts">…</Modal>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <ModalTrigger>
    <Button variant="secondary">دعوة أعضاء الفريق</Button>
    <Modal>
      {({ close }) => (
        <>
          <ModalHeader title="دعوة أعضاء الفريق" description="سيصلهم بريد إلكتروني برابط للانضمام إلى مساحة العمل." closeLabel="إغلاق" />
          <ModalBody>
            <Input label="البريد الإلكتروني" type="email" placeholder="name@company.com" />
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={close}>إلغاء</Button>
            <Button onClick={close}>إرسال الدعوة</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  </ModalTrigger>
</DirectionProvider>`;

/** Modal detail page, mirroring boardui.com/components/modal. */
export default function ModalPage() {
  const [phrase, setPhrase] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("Acme Dashboard");
  return (
    <AppShell title="Modal" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Focus a task in a dialog over the page, with an alert dialog for destructive confirmations.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the modal using our CLI or manually. The CLI copies the component source (with its
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
            ModalTrigger takes the trigger, any BoardUI button, followed by the Modal. Inside, ModalHeader names
            the dialog and describes it to assistive technology, ModalBody holds the content, and ModalFooter
            lines up the actions, stacked full width on phones. Pass a function as the children to receive close.
            The panel fades and sharpens in from a soft blur, and plays the same transition in reverse before it
            leaves the page.
          </p>
          <Demo>
            <ModalTrigger>
              <Button variant="secondary">Invite teammates</Button>
              <Modal>
                {({ close }) => (
                  <>
                    <ModalHeader
                      title="Invite teammates"
                      description="They will get an email with a link to join the workspace."
                    />
                    <ModalBody>
                      <Input label="Email address" type="email" placeholder="name@company.com" />
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="secondary" onClick={close}>
                        Cancel
                      </Button>
                      <Button onClick={close}>Send invite</Button>
                    </ModalFooter>
                  </>
                )}
              </Modal>
            </ModalTrigger>
          </Demo>
        </Section>

        <Section title="Alert dialog">
          <p className="text-body-regular text-text-secondary">
            AlertDialog asks for an answer before a destructive action. A press on the backdrop does not close
            it, focus starts on Cancel, and screen readers announce it as an alert. Return a promise from
            onConfirm to keep it open until the work is done: Cancel is disabled, and the confirm button turns
            busy with a spinner and pendingLabel.
          </p>
          <Demo>
            <ModalTrigger>
              <Button variant="danger" leadingIcon={RiDeleteBinLine}>
                Delete project
              </Button>
              <AlertDialog
                title="Delete project?"
                description="Acme Dashboard and its 24 files will be deleted for everyone. You can't undo this."
                confirmLabel="Delete project"
                pendingLabel="Deleting..."
                onConfirm={() => new Promise<void>((resolve) => window.setTimeout(resolve, 1200))}
              />
            </ModalTrigger>
          </Demo>
          <CodeBlock code={ALERT_DIALOG_CODE} />
        </Section>

        <Section title="Confirm by typing">
          <p className="text-body-regular text-text-secondary">
            Children render between the description and the actions. Pair an input with isConfirmDisabled for
            actions that deserve a second look.
          </p>
          <Demo>
            <ModalTrigger onOpenChange={(open) => !open && setPhrase("")}>
              <Button variant="secondary">Transfer ownership</Button>
              <AlertDialog
                title="Transfer workspace ownership?"
                description="Maya Chen becomes the owner and you become an admin. Type acme below to confirm."
                confirmLabel="Transfer ownership"
                isConfirmDisabled={phrase !== "acme"}
              >
                <Input
                  aria-label="Workspace name"
                  placeholder="acme"
                  value={phrase}
                  onChange={setPhrase}
                  autoComplete="off"
                />
              </AlertDialog>
            </ModalTrigger>
          </Demo>
          <CodeBlock code={CONFIRM_BY_TYPING_CODE} />
        </Section>

        <Section title="Long content">
          <p className="text-body-regular text-text-secondary">
            When the content is taller than the screen, only ModalBody scrolls. The header and actions stay in
            place, and a progressive blur softens the top edge once the content moves under it.
          </p>
          <Demo>
            <ModalTrigger>
              <Button variant="secondary" leadingIcon={RiFileTextLine}>
                Review terms
              </Button>
              <Modal size="lg">
                {({ close }) => (
                  <>
                    <ModalHeader title="Terms of service" description="Last updated 1 October 2026" />
                    <ModalBody>
                      <div className="flex flex-col gap-3">
                        <p>1. Accepting these terms gives you access to the workspace and its projects.</p>
                        <p>2. You are responsible for the content you upload and share with your team.</p>
                        <p>3. We may update these terms from time to time and will notify you of changes.</p>
                        <p>4. Either party may end the agreement with thirty days of written notice.</p>
                        <p>5. Your data stays yours. Export it at any time from workspace settings.</p>
                        <p>6. Support is available on every plan during business hours.</p>
                        <p>7. These terms are governed by the laws of the jurisdiction of incorporation.</p>
                        <p>8. Questions about these terms go to legal@acme.example.</p>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="secondary" onClick={close}>
                        Decline
                      </Button>
                      <Button onClick={close}>Accept</Button>
                    </ModalFooter>
                  </>
                )}
              </Modal>
            </ModalTrigger>
          </Demo>
          <CodeBlock code={LONG_CONTENT_CODE} />
        </Section>

        <Section title="Controlled">
          <p className="text-body-regular text-text-secondary">
            Leave out ModalTrigger and drive the dialog with isOpen and onOpenChange, for example from a menu item
            or after a request finishes.
          </p>
          <Demo>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              Rename project
            </Button>
            <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="sm">
              <ModalHeader title="Rename project" />
              <ModalBody>
                <form
                  id="rename-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setIsOpen(false);
                  }}
                >
                  <Input aria-label="Project name" value={draft} onChange={setDraft} autoFocus />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" form="rename-form">
                  Save
                </Button>
              </ModalFooter>
            </Modal>
          </Demo>
          <CodeBlock code={CONTROLLED_CODE} />
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Four widths, all capped by the screen. Without a header title, give the dialog an aria-label.
          </p>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Wrap the region in DirectionProvider. The dialog renders in a portal and carries the direction with
            it, so the close button, actions, and text alignment mirror.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <ModalTrigger>
                <Button variant="secondary">دعوة أعضاء الفريق</Button>
                <Modal>
                  {({ close }) => (
                    <>
                      <ModalHeader
                        title="دعوة أعضاء الفريق"
                        description="سيصلهم بريد إلكتروني برابط للانضمام إلى مساحة العمل."
                        closeLabel="إغلاق"
                      />
                      <ModalBody>
                        <Input label="البريد الإلكتروني" type="email" placeholder="name@company.com" />
                      </ModalBody>
                      <ModalFooter>
                        <Button variant="secondary" onClick={close}>
                          إلغاء
                        </Button>
                        <Button onClick={close}>إرسال الدعوة</Button>
                      </ModalFooter>
                    </>
                  )}
                </Modal>
              </ModalTrigger>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Opening the dialog moves focus inside it, Tab and Shift+Tab cycle through its controls, and Escape
            closes it. Focus then returns to the trigger. The page behind stops scrolling and is hidden from
            screen readers. The header title becomes the dialog&apos;s accessible name and the description its
            accessible description. Reduced motion keeps the fade and drops the scale and blur.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
