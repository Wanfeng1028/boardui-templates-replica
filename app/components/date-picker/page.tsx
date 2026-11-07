"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { FileCodeBlock, InstallStep, InstallTabs } from "@/components/application/docs/install-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { FREE_COMPONENT_PREVIEWS } from "@/components/application/docs/component-previews-free";
import { DateRangePicker } from "@/components/base/date-picker/date-range-picker";

const PREVIEW_CODE = `import { DateRangePicker} from "@/components/base/date-picker/date-range-picker";

export function Example() {
  return <DateRangePicker aria-label="Trip dates" />;
}`;

/** Detail page for date-picker - content mirrors boardui.com/components/date-picker. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const CODE_1_CODE = "// Computed with @internationalized/date, re-derived each time the popover opens:\nToday, Yesterday, Last week, This month, Last month, This year, Last year, All time\n\n// Clicking a preset sets the *pending* range (Apply still commits it):\n<button onClick={() => setPendingValue(preset.range)}>{preset.label}</button>";
const CODE_2_CODE = "const [value, setValue] = useState<DateRangeValue | null>(null);\n\n<DateRangePicker aria-label=\"Report period\" value={value} onChange={setValue} />";
const CODE_2B_CODE = "<DateRangePicker\n  aria-label=\"Report period\"\n  defaultValue={{ start: someStart, end: someEnd }}\n  onChange={(value) => console.log(value)}\n/>";
const CODE_3_CODE = "<DateRangePicker aria-label=\"Report period\" isDisabled />";
const CODE_4_CODE = "import { DatePicker } from \"@/components/base/date-picker/date-picker\";\n\nexport function Example() {\n  return <DatePicker aria-label=\"Meeting date\" />;\n}";
const CODE_4_CODE2 = "const [value, setValue] = useState<CalendarDate | null>(null);\n\n<DatePicker aria-label=\"Due date\" value={value} onChange={setValue} />";
const SHARED_TSX_CODE = `// components/base/date-picker/shared.tsx
"use client";

import { useEffect, useState, useContext } from "react";
import {
  Button as RACButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarStateContext,
  RangeCalendarStateContext,
} from "react-aria-components";
import type { CalendarCellRenderProps } from "react-aria-components";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { cx } from "@/utils/cx";

/**
 * Shared building blocks for the base/date-picker family - \`DateRangePicker\`
 * (dual-month, node 3871:5738) and \`DatePicker\` (single-month, node
 * 3879:6708) are the same visual system (month panel, day cell, editable
 * date chip) around two different react-aria-components roots
 * (\`RangeCalendar\` vs \`Calendar\`). Keeping the pieces here means a Figma
 * fidelity fix only has to happen once.
 */

/** Exact paths from Figma's month-nav chevrons (node 3869:5461 / 3869:5528) - a
 *  16×16 glyph, 2px round-capped stroke, mirrored around x=8. */
export function ChevronLeft16({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M9 4L5.70711 7.29289C5.31658 7.68342 5.31658 8.31658 5.70711 8.70711L9 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRight16({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M7 4L10.2929 7.29289C10.6834 7.68342 10.6834 8.31658 10.2929 8.70711L7 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function formatTriggerDate(date: CalendarDate) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    date.toDate(getLocalTimeZone()),
  );
}

export function formatChipDate(date: CalendarDate) {
  return \`\${String(date.day).padStart(2, "0")}/\${String(date.month).padStart(2, "0")}/\${date.year}\`;
}

/** Parses the chip's own "DD/MM/YYYY" format back into a CalendarDate, or
 *  null if the text isn't a valid date (out-of-range day/month is rejected
 *  up front; CalendarDate itself constrains impossible day-in-month combos
 *  like Feb 30). */
export function parseChipDate(text: string): CalendarDate | null {
  const match = /^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/.exec(text.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return new CalendarDate(year, month, day);
}

export function DayCell(props: CalendarCellRenderProps & { isRange: boolean }) {
  const { date, formattedDate, isSelected, isSelectionStart, isSelectionEnd, isHovered, isFocusVisible, isDisabled, isOutsideMonth, isRange } = props;

  if (isOutsideMonth) {
    return <div className="size-8" />;
  }

  const dayOfWeek = date.toDate(getLocalTimeZone()).getDay(); // 0 = Sun ... 6 = Sat

  // A plain (non-range) Calendar never sets isSelectionStart/isSelectionEnd -
  // those are range-only concepts, so they stay false even for the one
  // selected day. Without isRange, that day would fall through to the
  // "middle of a range" backdrop path instead of rendering as its own pill.
  const isSingleDay = isRange ? isSelectionStart && isSelectionEnd : isSelected;
  const isEdge = isRange ? isSelectionStart || isSelectionEnd : isSelected;

  // Cells sit 12px apart (Figma's row/column gap). A selected range should
  // still read as one continuous band, so the background bridges that gap by
  // extending half of it (6px) toward each selected neighbor - never past
  // the first/last column of a row, where there's no neighbor to bridge to.
  // Only meaningful for a RangeCalendar; a plain Calendar never bridges.
  const extendLeft = isRange && isSelected && !isSelectionStart && dayOfWeek !== 0;
  const extendRight = isRange && isSelected && !isSelectionEnd && dayOfWeek !== 6;

  // The blue backgrounds fade in/out on opacity instead of popping instantly.
  // Both layers always render (geometry computed regardless of selection) so
  // toggling opacity is a plain CSS transition, not a mount/unmount - that
  // keeps ~70 cells worth of range changes cheap and reliably animated.
  // border-radius rides the same transition as opacity: the rounding classes
  // still flip instantly on deselect (the shape a cell "should" have has no
  // in-between state), but transitioning the property means it eases toward
  // square in sync with the fade instead of snapping to square immediately
  // while the color is still visible.
  return (
    <div className="relative size-8">
      <span
        aria-hidden
        className={cx(
          "absolute inset-y-0 bg-date-range-background transition-[opacity,border-radius] duration-100 ease-out",
          isSelectionStart ? "left-1/2" : extendLeft ? "-left-1.5" : "left-0",
          isSelectionEnd ? "right-1/2" : extendRight ? "-right-1.5" : "right-0",
          !isSelectionStart && dayOfWeek === 0 && "rounded-l-lg",
          !isSelectionEnd && dayOfWeek === 6 && "rounded-r-lg",
          isSelected && !isSingleDay ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cx(
          "relative flex size-8 items-center justify-center rounded-lg outline-none",
          !isSelected && isHovered && "bg-background-secondary-hover",
          "transition-colors duration-100 ease-out",
          isFocusVisible && "ring-2 ring-inset ring-border-focus-ring",
        )}
      >
        <span
          aria-hidden
          className={cx(
            "absolute inset-0 bg-date-range-edge-background transition-[opacity,border-radius] duration-100 ease-out",
            isSingleDay && "rounded-lg",
            isSelectionStart && !isSingleDay && "rounded-l-lg",
            isSelectionEnd && !isSingleDay && "rounded-r-lg",
            isEdge ? "opacity-100" : "opacity-0",
          )}
        />
        <span className={cx("relative text-body-medium text-text-primary", isDisabled && "text-text-tertiary")}>
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

export function MonthPanel({ offset, showPrev, showNext }: { offset: number; showPrev?: boolean; showNext?: boolean }) {
  // Works inside either a RangeCalendar (DateRangePicker) or a plain Calendar
  // (DatePicker) - exactly one of these contexts is non-null depending on
  // which root rendered it, and both expose the same \`visibleRange\` shape.
  const rangeState = useContext(RangeCalendarStateContext);
  const singleState = useContext(CalendarStateContext);
  const state = rangeState ?? singleState;
  const isRange = rangeState != null;
  const panelDate = state ? state.visibleRange.start.add({ months: offset }) : null;
  const title = panelDate
    ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(panelDate.toDate(getLocalTimeZone()))
    : "";

  return (
    <div className="w-[326px] shrink-0 rounded-2xl bg-background-primary-default p-[15px] shadow-xs">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          {showPrev ? (
            <RACButton
              slot="previous"
              className="flex size-4 cursor-pointer items-center justify-center rounded-[3px] text-text-secondary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover"
            >
              <ChevronLeft16 />
            </RACButton>
          ) : (
            <span className="size-4" aria-hidden />
          )}
          <span className="flex-1 text-center text-body-medium text-text-primary">{title}</span>
          {showNext ? (
            <RACButton
              slot="next"
              className="flex size-4 cursor-pointer items-center justify-center rounded-[3px] text-text-secondary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover"
            >
              <ChevronRight16 />
            </RACButton>
          ) : (
            <span className="size-4" aria-hidden />
          )}
        </div>
        <CalendarGrid
          offset={{ months: offset }}
          weekdayStyle="short"
          className="-m-3 self-start border-separate outline-none"
          style={{ borderSpacing: "12px 12px" }}
        >
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="size-6 pb-0 text-center text-body-medium text-text-secondary">
                {day.slice(0, 2)}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell date={date} className="p-0 outline-none">
                {(cellProps) => <DayCell {...cellProps} isRange={isRange} />}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </div>
  );
}

/** One editable "DD/MM/YYYY" chip. Keeps its own draft text while typing so
 *  the field doesn't reformat on every keystroke; commits on blur/Enter,
 *  reverting to the last valid value if the text doesn't parse. */
export function DateChipInput({
  date,
  label,
  onCommit,
}: {
  date: CalendarDate;
  label: string;
  onCommit: (date: CalendarDate) => void;
}) {
  const formatted = formatChipDate(date);
  const [text, setText] = useState(formatted);

  useEffect(() => {
    setText(formatted);
  }, [formatted]);

  const commit = () => {
    const parsed = parseChipDate(text);
    if (parsed) {
      onCommit(parsed);
    } else {
      setText(formatted);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") setText(formatted);
      }}
      aria-label={label}
      className="w-[104px] rounded-2lg border border-border-button-default bg-background-primary-default px-2 py-2 text-body-medium text-text-primary shadow-xs outline-none transition-colors duration-100 ease-out focus-visible:border-border-button-active"
    />
  );
}

/** Shared trigger-button chrome for both pickers (Figma's "Primary" button -
 *  calendar icon + formatted-value text, white surface, radius/2lg). */
export const triggerButtonClassName = cx(
  "inline-flex cursor-pointer items-center gap-0.5 rounded-2lg border border-border-button-default bg-background-primary-default p-2 shadow-xs outline-none",
  "transition-[background-color,border-color,box-shadow] duration-150 ease",
  "hover:bg-background-primary-hover hover:border-border-button-hover",
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
  "disabled:cursor-not-allowed disabled:bg-background-primary-disabled disabled:text-text-tertiary disabled:shadow-none",
);

/** Shared popover chrome (Figma's rounded/3xl, background/secondary/default
 *  "Calendar component" surface) for both pickers. */
export const popoverClassName = cx(
  "origin-top rounded-3xl bg-background-secondary-default shadow-dropdown",
  "transition duration-150 ease-out",
  "data-[entering]:opacity-0 data-[entering]:scale-95 data-[entering]:blur-[2px]",
  "data-[exiting]:opacity-0 data-[exiting]:scale-95 data-[exiting]:blur-[2px]",
);`;

export default function DatePickerPage() {
  return (
    <DocsLayout variant="library" hidePrevNext title="Date Picker">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Free</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/date-picker</span>
        </div>
        <p className="text-body-regular text-text-secondary">A dual-month date range picker built on React Aria's RangeCalendar. A quick-select sidebar (Today, Last week, This month, etc.), two adjacent months, and a footer with an editable date range and Cancel/Apply - the calendar only commits a new range once Apply is pressed. A single-date variant (below) shares the same month panel, day-cell rendering, and editable chip.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Preview</h2>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
            <DateRangePicker aria-label="Trip dates" />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
            {PREVIEW_CODE}
          </pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">You can add these date pickers using our CLI or manually. Both DateRangePicker and DatePicker import their shared chrome (chevrons, day cell, month panel, editable date chip, trigger/popover surfaces) from shared.tsx, so add that file first.</p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically.{" "}
            <a className="text-accent-500 hover:underline" href="/installation#dark-mode">
              Set up theme switching
            </a>
            .
          </p>
          <InstallTabs
            cli={
              <>
                <p className="text-headline-medium text-text-secondary">The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
                <PkgCommand
                  npm="npx boardui@latest add date-range-picker"
                  pnpm="pnpm dlx boardui@latest add date-range-picker"
                  yarn="yarn dlx boardui@latest add date-range-picker"
                />
                <p className="text-body-regular text-text-secondary">
                  Using a shared UI package or custom import aliases?{" "}
                  <a className="text-accent-500 hover:underline" href="/installation#monorepos">
                    Configure your installation paths
                  </a>{" "}
                  before running the CLI. Copy-paste examples use the default imports.
                </p>
              </>
            }
            manual={
              <>
                <InstallStep index={1} title="Install the following dependencies">
                  <PkgCommand
                    npm="npm install react-aria-components @internationalized/date"
                    pnpm="pnpm add react-aria-components @internationalized/date"
                    yarn="yarn add react-aria-components @internationalized/date"
                  />
                </InstallStep>
                <InstallStep index={2} title={<>Create a <code className="font-mono text-[13px] text-text-primary">shared.tsx</code> file and paste the following into it.</>}>
                  <FileCodeBlock file="shared.tsx" code={SHARED_TSX_CODE} />
                </InstallStep>
                <InstallStep index={3} title="Update the import paths to match your project setup.">
                  <p className="text-body-regular text-text-secondary">
                    Using a shared UI package or custom import aliases?{" "}
                    <a className="text-accent-500 hover:underline" href="/installation#monorepos">
                      Configure your installation paths
                    </a>{" "}
                    before running the CLI. Copy-paste examples use the default imports.
                  </p>
                </InstallStep>
              </>
            }
          />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Meeting scheduler</h2>
          <p className="text-body-regular text-text-secondary">A Calendly/Cal.com-style booking panel — Figma node 3881:7618. Host card and meeting summary on the left, a single-month calendar in the middle (the same MonthPanel from shared.tsx), and a timezone / hour-format / time-slot sidebar on the right. Not a popover — a disclosure: the "Schedule a meeting" trigger toggles the whole panel open/closed, with the time-slot list scrolling within a fixed height instead of growing the panel.</p>
          <div className="relative h-[451px] overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4 xl:h-[223px]">
              {(() => { const Preview = FREE_COMPONENT_PREVIEWS["/components/date-picker"]; return Preview ? <Preview /> : null; })()}
            </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Quick select</h2>
          <p className="text-body-regular text-text-secondary">The sidebar presets are computed from @internationalized/date each time the popover opens (so "Today" stays today). Selecting one updates the pending range and highlights the two months to match — it still requires Apply to commit, same as dragging a range directly on the calendar.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_1_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Controlled & uncontrolled value</h2>
          <p className="text-body-regular text-text-secondary">Pass value + onChange for a controlled range, or defaultValue for uncontrolled. Either way, the popover keeps its own pending draft internally - onChange only fires when the user presses Apply; Cancel discards the draft and reverts to the last committed value. The start/end chips in the footer are editable inputs (DD/MM/YYYY) that update the same pending draft.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_2_CODE}</code></pre>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_2B_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Disabled</h2>
          <p className="text-body-regular text-text-secondary">isDisabled dims the trigger button and blocks opening the popover.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_3_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Single date</h2>
          <p className="text-body-regular text-text-secondary">DatePicker is the non-range sibling — Figma node 3879:6708. Same trigger, popover, month panel, day-cell rendering, and editable date chip as DateRangePicker (see shared.tsx below), built on a plain react-aria Calendar instead of RangeCalendar. There's only one month, so — unlike the dual view, where the two inner chevrons are inert spacers — both nav chevrons are fully functional. The Figma frame has no quick-select sidebar.</p>
          <p className="text-body-regular text-text-secondary">Same pending-vs-committed value pattern as the range picker, just with a single CalendarDate instead of a &#123; start, end &#125; pair.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_4_CODE}</code></pre>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_4_CODE2}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">shared.tsx</h2>
          <p className="text-body-regular text-text-secondary">Both DateRangePicker and DatePicker import their shared chrome (chevrons, day cell, month panel, editable date chip, trigger/popover surfaces) from shared.tsx — source as published on the original page (components/base/date-picker/shared.tsx). Note: this embedded copy is the version the original page published when captured; the file installed in this repo (<code>components/base/date-picker/shared.tsx</code>) is the newer free-repo version, which adds <code>useLocale</code> and week helpers (<code>startOfWeek</code> / <code>endOfWeek</code> / <code>isSameDay</code>). The demos on this page run on the installed file.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-regular leading-6 text-text-primary"><code>{SHARED_TSX_CODE}</code></pre>
        </section>
        <PrevNext
          prev={{ href: "/components/date-calendar", label: "Date Calendar" }}
          next={{ href: "/components/divider", label: "Divider", sub: "Section separators" }}
        />
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/date-picker（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对；尾部 shared.tsx 源码全文为原版 file viewer 转储）
