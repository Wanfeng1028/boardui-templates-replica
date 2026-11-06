"use client";

import { useMemo, useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine, RiCloseLine, RiInboxLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Calendar (Pro replica) — month view.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * Event chips, detail popover, month switching, inbox list.
 */

type Tone = "blue" | "purple" | "emerald" | "orange";
type CalEvent = { day: number; time: string; label: string; tone: Tone; where?: string };

const MONTH_EVENTS: Record<string, CalEvent[]> = {
  "2026-7": [
    { day: 3, time: "10:00", label: "Design review", tone: "blue", where: "Studio" },
    { day: 5, time: "14:00", label: "Sprint planning", tone: "purple" },
    { day: 12, time: "11:00", label: "1:1 with Mertcan", tone: "blue" },
    { day: 19, time: "13:00", label: "Workshop", tone: "purple", where: "Room 3" },
    { day: 26, time: "09:30", label: "Coffee", tone: "blue" },
    { day: 30, time: "All day", label: "Payday", tone: "emerald" },
    { day: 31, time: "11:00", label: "Brunch", tone: "orange" },
    { day: 31, time: "11:30", label: "Stand-up", tone: "purple" },
  ],
  "2026-8": [
    { day: 3, time: "10:00", label: "Design review", tone: "blue" },
    { day: 5, time: "14:00", label: "Sprint planning", tone: "purple" },
    { day: 7, time: "16:00", label: "Demo day", tone: "emerald" },
    { day: 12, time: "11:00", label: "1:1 with Mertcan", tone: "blue" },
    { day: 14, time: "18:00", label: "Release", tone: "orange" },
    { day: 19, time: "13:00", label: "Workshop", tone: "purple" },
    { day: 21, time: "15:00", label: "Retro", tone: "emerald" },
    { day: 26, time: "09:30", label: "Coffee", tone: "blue" },
    { day: 28, time: "09:30", label: "Coffee", tone: "blue" },
    { day: 30, time: "All day", label: "Payday", tone: "emerald" },
    { day: 31, time: "11:00", label: "Brunch", tone: "orange" },
    { day: 31, time: "11:30", label: "Stand-up", tone: "purple" },
  ],
  "2026-9": [
    { day: 1, time: "09:00", label: "Kickoff", tone: "purple" },
    { day: 8, time: "15:00", label: "Design crit", tone: "blue" },
    { day: 15, time: "10:30", label: "Hiring sync", tone: "orange" },
    { day: 22, time: "17:00", label: "Launch", tone: "emerald" },
    { day: 29, time: "09:30", label: "Coffee", tone: "blue" },
  ],
};

const TONE_CHIP: Record<Tone, string> = {
  blue: "bg-chart-2/15 text-chart-2",
  purple: "bg-chart-1/15 text-chart-1",
  emerald: "bg-chart-3/15 text-chart-3",
  orange: "bg-chart-5/15 text-chart-5",
};
const TONE_DOT: Record<Tone, string> = {
  blue: "bg-chart-2",
  purple: "bg-chart-1",
  emerald: "bg-chart-3",
  orange: "bg-chart-5",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function shortHour(time: string): string {
  if (time === "All day") return "All";
  const [h] = time.split(":");
  return String(parseInt(h, 10));
}
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const startWeekday = first.getDay();
  const cells: { day: number; inMonth: boolean }[] = [];
  for (let d = prevDays - startWeekday + 1; d <= prevDays; d++) cells.push({ day: d, inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
  while (cells.length % 7 !== 0 || cells.length < 35) cells.push({ day: cells.length - (startWeekday + daysInMonth) + 1, inMonth: false });
  return cells.slice(0, 42);
}

export function Calendar({ className }: { className?: string }) {
  const [ym, setYm] = useState({ y: 2026, m: 7 }); // August 2026, like the template demo
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const key = `${ym.y}-${ym.m}`;
  const events = MONTH_EVENTS[key] ?? [];
  const cells = useMemo(() => buildGrid(ym.y, ym.m), [ym]);

  const shift = (delta: number) => {
    setYm(({ y, m }) => {
      const total = y * 12 + m + delta;
      return { y: Math.floor(total / 12), m: total % 12 };
    });
    setSelected(null);
  };

  const eventsFor = (day: number, inMonth: boolean) => (inMonth ? events.filter((e) => e.day === day) : []);

  return (
    <div className={cx("flex w-full flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <p className="text-title-3-semibold text-text-primary">
          {MONTH_NAMES[ym.m]} {ym.y}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setInboxOpen((o) => !o)}
            aria-expanded={inboxOpen}
            className={cx(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-caption-1-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              inboxOpen ? "bg-accent-500 text-white" : "bg-background-tertiary-default text-text-secondary hover:text-text-primary",
            )}
          >
            <RiInboxLine className="size-3.5" /> Inbox ({events.length})
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => shift(-1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiArrowLeftLine className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shift(1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiArrowRightLine className="size-4" />
          </button>
        </div>
      </div>

      {inboxOpen && (
        <div className="flex w-full flex-col gap-1 rounded-2xl bg-background-primary-default p-2">
          {events.length === 0 ? (
            <p className="px-2 py-1 text-body-2-regular text-text-secondary">No events this month.</p>
          ) : (
            events.map((e) => (
              <button
                key={`${e.day}-${e.label}`}
                type="button"
                onClick={() => setSelected(e)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-start outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className={cx("size-2 shrink-0 rounded-full", TONE_DOT[e.tone])} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-body-2-medium text-text-primary">{e.label}</span>
                <span className="shrink-0 text-body-2-regular text-text-secondary tabular-nums">
                  {MONTH_NAMES[ym.m].slice(0, 3)} {e.day} · {e.time}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      <div className="grid w-full grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <p key={d} className="py-1 text-center text-body-2-medium text-text-tertiary">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d.slice(0, 1)}</span>
          </p>
        ))}
        {cells.map((cell, i) => {
          const dayEvents = eventsFor(cell.day, cell.inMonth);
          return (
            <div
              key={i}
              className={cx(
                "flex min-h-[64px] flex-col items-start gap-1 rounded-xl p-1.5 sm:min-h-[84px] sm:p-2",
                cell.inMonth ? "bg-background-primary-default" : "opacity-35",
              )}
            >
              <span className="text-body-2-medium text-text-primary tabular-nums">{cell.day}</span>
              {dayEvents.slice(0, 2).map((e) => (
                <button
                  key={e.label}
                  type="button"
                  onClick={() => setSelected(e)}
                  className={cx(
                    "w-full cursor-pointer truncate rounded-md px-1 py-0.5 text-start text-caption-2-regular outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring sm:px-1.5 sm:text-caption-1-regular",
                    TONE_CHIP[e.tone],
                  )}
                >
                  <span className="sm:hidden">{shortHour(e.time)}</span>
                  <span className="hidden sm:inline">{e.time} · {e.label}</span>
                </button>
              ))}
              {dayEvents.length > 2 && (
                <span className="px-1 text-caption-2-regular text-text-tertiary">+{dayEvents.length - 2} more</span>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Event details" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-sm rounded-3xl bg-background-secondary-default p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cx("size-2.5 rounded-full", TONE_DOT[selected.tone])} aria-hidden />
                <p className="text-title-3-semibold text-text-primary">{selected.label}</p>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelected(null)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiCloseLine className="size-4" />
              </button>
            </div>
            <dl className="mt-3 flex flex-col gap-1.5 text-body-regular">
              <div className="flex gap-2"><dt className="w-16 shrink-0 text-text-tertiary">When</dt><dd className="text-text-primary tabular-nums">{MONTH_NAMES[ym.m]} {selected.day}, {ym.y} · {selected.time}</dd></div>
              {selected.where && <div className="flex gap-2"><dt className="w-16 shrink-0 text-text-tertiary">Where</dt><dd className="text-text-primary">{selected.where}</dd></div>}
              <div className="flex gap-2"><dt className="w-16 shrink-0 text-text-tertiary">Type</dt><dd className="text-text-primary">Calendar event (demo data)</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
