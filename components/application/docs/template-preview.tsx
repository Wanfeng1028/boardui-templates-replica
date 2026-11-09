"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCodeSSlashLine,
  RiComputerLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiFileCopyLine,
  RiLayoutGridLine,
  RiSmartphoneLine,
  RiTabletLine,
} from "@remixicon/react";

import {
  Dropdown,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

type PreviewMode = "preview" | "code";
type Breakpoint = "desktop" | "tablet" | "mobile";

/** Inner canvas width per breakpoint, verbatim from boardui.com:
 * desktop fills 125% of the frame (scaled 0.8), tablet 768px, mobile 390px. */
const CANVAS_WIDTH: Record<Breakpoint, string> = {
  desktop: "125cqw",
  tablet: "768px",
  mobile: "390px",
};

const BREAKPOINTS: { id: Breakpoint; label: string; icon: typeof RiComputerLine }[] = [
  { id: "desktop", label: "Desktop", icon: RiComputerLine },
  { id: "tablet", label: "Tablet", icon: RiTabletLine },
  { id: "mobile", label: "Mobile", icon: RiSmartphoneLine },
];

function CopyPageButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be refused; leave the icon unchanged.
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    setMenuOpen(false);
  };
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={() => copy(code)}
        className="inline-flex cursor-pointer items-center justify-center gap-0.5 rounded-s-2lg border border-e-0 border-border-button-default bg-background-primary-default p-2 shadow-xs transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
          <RiFileCopyLine
            className={cx(
              "absolute size-5 text-foreground-icon-secondary transition-[transform,opacity,filter] duration-200 ease-out",
              copied ? "scale-75 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
            )}
            aria-hidden
          />
          <RiCheckLine
            className={cx(
              "absolute size-5 text-foreground-icon-secondary transition-[transform,opacity,filter] duration-200 ease-out",
              copied ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-[2px]",
            )}
            aria-hidden
          />
        </span>
        <span className="px-1 text-body-medium whitespace-nowrap text-text-primary">
          {copied ? "Copied" : "Copy Page"}
        </span>
      </button>
      <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownTrigger
          aria-label="Copy for AI options"
          className="inline-flex cursor-pointer items-center justify-center rounded-e-2lg border border-border-button-default bg-background-primary-default px-1.5 shadow-xs transition-colors hover:bg-background-primary-hover"
        >
          <RiArrowDownSLine
            className={cx(
              "size-5 shrink-0 text-foreground-icon-secondary transition-transform duration-200",
              menuOpen && "rotate-180",
            )}
            aria-hidden
          />
        </DropdownTrigger>
        <DropdownPopover aria-label="Copy options" placement="bottom end" className="w-[220px] p-2" dialogClassName="gap-1">
          <DropdownItem className="px-2 py-1.5" onSelect={() => copy(code)}>
            <span className="flex-1 text-body-medium">Copy code</span>
          </DropdownItem>
          <DropdownItem className="px-2 py-1.5" onSelect={() => copy(window.location.href)}>
            <span className="flex-1 text-body-medium">Copy page link</span>
          </DropdownItem>
        </DropdownPopover>
      </Dropdown>
    </div>
  );
}

/**
 * Template preview frame from boardui.com docs pages: Preview / Code tabs,
 * Desktop / Tablet / Mobile breakpoint switcher, Live preview button,
 * Copy Page, and the browser-chrome frame (traffic lights, tab, address
 * bar) around the embedded template. The address bar shows this site's own
 * domain (ui.gemmae.dev), matching the local template pages.
 */
export function TemplatePreview({
  title,
  slug,
  previewCode,
  children,
  height = 855,
}: {
  /** Tab title, e.g. "Chat starter". */
  title: string;
  /** Template slug, e.g. "chat-starter" (Live preview -> /templates/{slug}). */
  slug: string;
  /** Code shown on the Code tab. */
  previewCode: string;
  /** The embedded template (rendered `contained`). */
  children: React.ReactNode;
  /** Template height in px (default 855, the original's preview height). */
  height?: number;
}) {
  const [mode, setMode] = useState<PreviewMode>("preview");
  const [bp, setBp] = useState<Breakpoint>("desktop");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center justify-start">
          <SegmentedControl
            aria-label="Preview mode"
            selectedKeys={[mode]}
            onSelectionChange={(keys) => {
              const [key] = [...(keys as Set<string>)];
              if (key === "preview" || key === "code") setMode(key);
            }}
          >
            <SegmentedControlItem id="preview">
              <span className="flex items-center gap-1.5">
                <RiEyeLine className="size-4 shrink-0" aria-hidden />
                Preview
              </span>
            </SegmentedControlItem>
            <SegmentedControlItem id="code">
              <span className="flex items-center gap-1.5">
                <RiCodeSSlashLine className="size-4 shrink-0" aria-hidden />
                Code
              </span>
            </SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div className="hidden shrink-0 min-[1400px]:block">
          <SegmentedControl
            aria-label="Preview breakpoint"
            selectedKeys={[bp]}
            onSelectionChange={(keys) => {
              const [key] = [...(keys as Set<string>)];
              if (key === "desktop" || key === "tablet" || key === "mobile") setBp(key);
            }}
            className="rounded-full border border-border-button-default dark:border-separator-border [&>span]:rounded-full"
          >
            {BREAKPOINTS.map(({ id, label, icon: Icon }) => (
              <SegmentedControlItem key={id} id={id} className="rounded-full px-3">
                <span className="flex items-center gap-1.5">
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </span>
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            href="/templates"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-0.5 overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default p-2 text-body-medium whitespace-nowrap text-text-primary shadow-xs transition-colors duration-150 ease outline-none hover:border-border-button-hover hover:bg-background-primary-hover active:border-border-button-active active:bg-background-primary-active focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
          >
            <RiLayoutGridLine className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">全部模板</span>
          </Link>
          <Link
            href={`/templates/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-0.5 overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default p-2 text-body-medium whitespace-nowrap text-text-primary shadow-xs transition-colors duration-150 ease outline-none hover:border-border-button-hover hover:bg-background-primary-hover active:border-border-button-active active:bg-background-primary-active focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
          >
            <RiExternalLinkLine className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">Live preview</span>
          </Link>
          <CopyPageButton code={previewCode} />
        </div>
      </div>

      {mode === "code" ? (
        <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
          <code>{previewCode}</code>
        </pre>
      ) : (
        <div className="flex min-h-[327px] items-center justify-center rounded-3xl border border-border-component-detail-container p-2">
          <div className="flex h-[762px] w-full flex-col overflow-hidden rounded-2xl border border-separator-border bg-background-primary-default transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none">
            <div className="flex h-10 shrink-0 items-end border-b border-separator-border bg-background-secondary-default px-3">
              <div className="flex h-full shrink-0 items-center gap-1.5 pe-4" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-red-500" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-500" />
              </div>
              <div className="flex h-8 w-48 items-center gap-2 rounded-t-lg border border-b-0 border-separator-border bg-background-primary-default px-3">
                <span className="size-3 shrink-0 rounded-sm bg-background-tertiary-default" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{title}</span>
                <span className="text-caption-1-medium text-text-tertiary" aria-hidden="true">
                  ×
                </span>
              </div>
              <div className="flex h-8 w-32 items-center gap-2 px-3 text-caption-1-medium text-text-tertiary">
                <span className="size-3 shrink-0 rounded-sm bg-background-tertiary-default" aria-hidden="true" />
                New tab
              </div>
              <span className="pb-2 ps-3 text-body-regular text-text-tertiary" aria-hidden="true">
                +
              </span>
            </div>
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-separator-border bg-background-secondary-default px-3">
              <div className="flex gap-2 text-caption-1-medium text-text-tertiary" aria-hidden="true">
                <span>‹</span>
                <span>›</span>
              </div>
              <div className="flex h-6 min-w-0 flex-1 items-center rounded-full bg-background-tertiary-default px-3">
                <span className="truncate text-caption-2-regular text-text-secondary">
                  ui.gemmae.dev/templates/{slug}
                </span>
              </div>
            </div>
            <div
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
              style={{ "--template-preview-height": `${height}px` } as React.CSSProperties}
            >
              <div className="flex h-[calc(var(--template-preview-height)*0.8)] justify-center [container-type:inline-size]">
                <div
                  style={{ width: CANVAS_WIDTH[bp] }}
                  className="relative h-[var(--template-preview-height)] shrink-0 origin-top scale-[0.8] transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
                >
                  <div className="size-full">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
