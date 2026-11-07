"use client";

import { useState } from "react";
import type { Selection } from "react-aria-components";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiClipboardLine, RiDeleteBinLine, RiEditLine, RiExternalLinkLine, RiFileCopyLine, RiFileTextLine, RiFolderTransferLine, RiInboxLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSection,
  ContextMenuSeparator,
  ContextMenuSubmenu,
  ContextMenuTrigger,
} from "@/components/base/context-menu/context-menu";
import { cx } from "@/utils/cx";

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

const INSTALL_CMD = "npx boardui@latest add context-menu";

const ANATOMY_CODE = `<ContextMenuTrigger>
  {({ isOpen }) => (
    <>
      <FileTile name="Q3 report.pdf" className={isOpen ? "border-accent-500" : undefined} />
      <ContextMenu aria-label="File actions">…</ContextMenu>
    </>
  )}
</ContextMenuTrigger>`;

const CHECKABLE_CODE = `const [view, setView] = useState<Selection>(new Set(["grid", "snap"]));
const [zoom, setZoom] = useState<Selection>(new Set(["100"]));

<ContextMenuTrigger>
  <Canvas tabIndex={0} />
  <ContextMenu aria-label="Canvas options">
    <ContextMenuSection title="View" selectionMode="multiple" selectedKeys={view} onSelectionChange={setView}>
      <ContextMenuItem id="grid">Show grid</ContextMenuItem>
      <ContextMenuItem id="snap">Snap to grid</ContextMenuItem>
      <ContextMenuItem id="rulers">Show rulers</ContextMenuItem>
    </ContextMenuSection>
    <ContextMenuSeparator />
    <ContextMenuSection title="Zoom" selectionMode="single" disallowEmptySelection selectedKeys={zoom} onSelectionChange={setZoom}>
      <ContextMenuItem id="50">50%</ContextMenuItem>
      <ContextMenuItem id="100">100%</ContextMenuItem>
      <ContextMenuItem id="200">200%</ContextMenuItem>
    </ContextMenuSection>
    <ContextMenuSeparator />
    <ContextMenuItem id="paste" icon={RiClipboardLine} shortcut="⌘V" isDisabled>Paste</ContextMenuItem>
  </ContextMenu>
</ContextMenuTrigger>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <ContextMenuTrigger>
    <FileTile name="تقرير الربع الثالث.pdf" />
    <ContextMenu aria-label="إجراءات الملف">
      <ContextMenuItem id="open" icon={RiExternalLinkLine}>فتح</ContextMenuItem>
      <ContextMenuSubmenu label="نقل إلى" icon={RiFolderTransferLine}>
        <ContextMenuItem id="inbox" icon={RiInboxLine}>البريد الوارد</ContextMenuItem>
      </ContextMenuSubmenu>
      <ContextMenuSeparator />
      <ContextMenuItem id="delete" icon={RiDeleteBinLine} variant="danger">حذف</ContextMenuItem>
    </ContextMenu>
  </ContextMenuTrigger>
</DirectionProvider>`;

/** Context Menu detail page, mirroring boardui.com/components/context-menu. */
export default function ContextMenuPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [view, setView] = useState<Selection>(new Set(["grid", "snap"]));
  const [zoom, setZoom] = useState<Selection>(new Set(["100"]));

  return (
    <DocsLayout variant="library" title="Context Menu">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Put the actions for a file, a row, or a message where the pointer already is: right-click, long-press,
            or Shift+F10.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this context menu component using our CLI or manually. The CLI copies the component source
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
            Wrap the target and its ContextMenu in a ContextMenuTrigger. The trigger adds no box of its own, so it
            fits around a file tile, a table row, or a message bubble without touching the layout.
          </p>
          <p className="text-body-regular text-text-secondary">
            Each row is a ContextMenuItem with an optional icon, shortcut, and variant=&quot;danger&quot; for
            destructive actions. Group rows with ContextMenuSection and ContextMenuSeparator. A ContextMenuSubmenu
            opens a nested menu, and its rows report to the same onAction.
          </p>
          <p className="text-body-regular text-text-secondary">
            Pass a function as the trigger&apos;s child to highlight the target while its menu is open. With
            triggers inside triggers, the innermost one opens, and isDisabled hands the click back to the
            browser&apos;s own menu.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <p className="text-body-regular text-text-secondary">
                Right-click a file, long-press it, or focus it and press Shift+F10.
              </p>
              <ContextMenuTrigger>
                {({ isOpen }) => (
                  <>
                    <div
                      tabIndex={0}
                      className={cx(
                        "flex max-w-sm items-center gap-3 rounded-2xl border p-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        isOpen
                          ? "border-accent-500 bg-background-secondary-default"
                          : "border-border-button-default bg-background-primary-default",
                      )}
                    >
                      <RiFileTextLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                      <span className="flex-1 truncate text-body-medium text-text-primary">Q3 report.pdf</span>
                      <span className="text-body-2-regular text-text-tertiary">2.4 MB</span>
                    </div>
                    <ContextMenu aria-label="File actions" onAction={(key) => setLastAction(String(key))}>
                      <ContextMenuItem id="open" icon={RiExternalLinkLine}>
                        Open
                      </ContextMenuItem>
                      <ContextMenuItem id="rename" icon={RiEditLine}>
                        Rename
                      </ContextMenuItem>
                      <ContextMenuSubmenu label="Move to" icon={RiFolderTransferLine}>
                        <ContextMenuItem id="inbox" icon={RiInboxLine}>
                          Inbox
                        </ContextMenuItem>
                      </ContextMenuSubmenu>
                      <ContextMenuSeparator />
                      <ContextMenuItem id="delete" icon={RiDeleteBinLine} variant="danger" shortcut="⌘⌫">
                        Delete
                      </ContextMenuItem>
                    </ContextMenu>
                  </>
                )}
              </ContextMenuTrigger>
              <p className="text-body-regular text-text-secondary">
                {lastAction ? "Last action: " + lastAction : "No action run yet."}
              </p>
            </div>
          </Demo>
          <CodeBlock code={ANATOMY_CODE} />
        </Section>

        <Section title="Checkable rows">
          <p className="text-body-regular text-text-secondary">
            Give a section selectionMode=&quot;multiple&quot; for toggles or selectionMode=&quot;single&quot; for a
            choice of one, control it with selectedKeys and onSelectionChange, and the selected rows show a check.
            Toggles leave the menu open so several can change at once.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <ContextMenuTrigger>
                <div
                  tabIndex={0}
                  className="flex h-32 max-w-sm items-center justify-center rounded-2xl border border-dashed border-border-button-default bg-background-primary-default text-body-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  Canvas — right-click here
                </div>
                <ContextMenu aria-label="Canvas options">
                  <ContextMenuSection
                    title="View"
                    selectionMode="multiple"
                    selectedKeys={view}
                    onSelectionChange={setView}
                  >
                    <ContextMenuItem id="grid">Show grid</ContextMenuItem>
                    <ContextMenuItem id="snap">Snap to grid</ContextMenuItem>
                    <ContextMenuItem id="rulers">Show rulers</ContextMenuItem>
                  </ContextMenuSection>
                  <ContextMenuSeparator />
                  <ContextMenuSection
                    title="Zoom"
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={zoom}
                    onSelectionChange={setZoom}
                  >
                    <ContextMenuItem id="50">50%</ContextMenuItem>
                    <ContextMenuItem id="100">100%</ContextMenuItem>
                    <ContextMenuItem id="200">200%</ContextMenuItem>
                  </ContextMenuSection>
                  <ContextMenuSeparator />
                  <ContextMenuItem id="paste" icon={RiClipboardLine} shortcut="⌘V" isDisabled>
                    Paste
                  </ContextMenuItem>
                </ContextMenu>
              </ContextMenuTrigger>
            </div>
          </Demo>
          <CodeBlock code={CHECKABLE_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the menu opens towards the left of the pointer, its chevrons turn, and
            submenus open on the left with Left Arrow.
          </p>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Right-click or a long press opens the menu at the pointer. On a focused target, Shift+F10 or the Menu
            key opens it at the target with the first row highlighted, so make targets focusable. Arrow keys move
            through the rows, typing jumps to a row, Right Arrow opens a submenu and Left Arrow closes it, Enter
            runs the row, and Escape closes the menu and returns focus to the target.
          </p>
          <p className="text-body-regular text-text-secondary">
            Like the browser&apos;s own menu, it closes when you press outside it or the page scrolls.
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
