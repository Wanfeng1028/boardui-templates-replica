"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { SettingsModal, type SettingsPage } from "@/components/application/settings/settings-modal";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const TRIGGER_CODE = `const [settingsOpen, setSettingsOpen] = useState(false);

<SidebarItem onPress={() => setSettingsOpen(true)}>
  Settings
</SidebarItem>

<SettingsModal
  isOpen={settingsOpen}
  onClose={() => setSettingsOpen(false)}
  defaultPage="profile"
/>`;

const INITIAL_PAGE_CODE = `<SettingsModal
  isOpen={isOpen}
  onClose={close}
  defaultPage="storage"
/>`;

const PLAN_ART_CODE = `<SettingsModal
  isOpen={isOpen}
  onClose={close}
  planArtSrc="/brand/your-plan-art.png"
/>;

// Omit planArtSrc to use the built-in token-based abstract artwork.`;

/** Settings Modal detail page: boardui.com/components/settings-modal, in-site. */
export default function SettingsModalPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<SettingsPage>("profile");
  const [planArt, setPlanArt] = useState<string | undefined>(undefined);

  const openModal = (nextPage: SettingsPage, nextPlanArt?: string) => {
    setPage(nextPage);
    setPlanArt(nextPlanArt);
    setOpen(true);
  };

  return (
    <DocsLayout variant="library" title="Settings Modal">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Blocks</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A controlled application-level settings dialog with General, Profile, Tools, and Storage views. It portals
          to the document body, owns its internal page navigation, and leaves the trigger and open state to whichever
          page, sidebar, or account menu installs it.
        </p>
        <Demo>
          <Button onClick={() => openModal("profile")}>Open settings</Button>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Settings Modal is a multi-file application block with several base-component dependencies. Install it
            through the CLI so the complete settings folder, shared components, hooks, styles, and npm packages are
            resolved together.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add settings-modal</code>
            <CopyButton text="npx boardui@latest add settings-modal" />
          </div>
        </Section>
        <Section title="Triggering the modal">
          <p className="text-body-regular text-text-secondary">
            The block deliberately does not render its own trigger. Keep{" "}
            <code className="font-mono text-body-2-medium text-text-primary">isOpen</code> in the host that owns the
            action - such as a sidebar, user menu, or settings button - and close it through{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onClose</code>. Backdrop presses,
            Escape, and the close button all call the same handler.
          </p>
          <Demo>
            <Button onClick={() => openModal("profile")}>Open settings on Profile</Button>
          </Demo>
          <Code code={TRIGGER_CODE} />
        </Section>
        <Section title="Initial page">
          <p className="text-body-regular text-text-secondary">
            Use <code className="font-mono text-body-2-medium text-text-primary">defaultPage</code> when a
            contextual action should open directly to General, Profile, Tools, or Storage. The selected page resets
            to that value each time the dialog opens.
          </p>
          <Demo>
            <Button variant="secondary" onClick={() => openModal("storage")}>
              Open settings on Storage
            </Button>
          </Demo>
          <Code code={INITIAL_PAGE_CODE} />
        </Section>
        <Section title="Plan artwork">
          <p className="text-body-regular text-text-secondary">
            The General view includes a component-native abstract treatment by default. Pass your own public image
            through <code className="font-mono text-body-2-medium text-text-primary">planArtSrc</code> to feed the
            animated Current plan artwork without coupling the installed block to BoardUI assets.
          </p>
          <Demo>
            <Button variant="secondary" onClick={() => openModal("general", "/templates/settings-plan-art.png")}>
              Open settings with plan artwork
            </Button>
          </Demo>
          <Code code={PLAN_ART_CODE} />
        </Section>
        <SettingsModal
          key={`${page}-${planArt ?? "default"}`}
          isOpen={open}
          onClose={() => setOpen(false)}
          defaultPage={page}
          planArtSrc={planArt}
        />
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
