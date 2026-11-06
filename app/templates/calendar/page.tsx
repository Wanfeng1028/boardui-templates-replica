"use client";

import { RiAddFill, RiCalendarLine } from "@remixicon/react";
import { useMemo, useState } from "react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * Calendar template replica (month view).
 * Official: boardui.com/templates/calendar — August 2026 month grid,
 * weekday headers, events pinned to dates (Coffee, Payday, Brunch, Stand-up).
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

type CalEvent = { time: string; label: string; tone: "blue" | "purple" | "emerald" | "orange" };

const EVENTS: Record<number, CalEvent[]> = {
  3: [{ time: "10:00", label: "Design review", tone: "blue" }],
  5: [{ time: "14:00", label: "Sprint planning", tone: "purple" }],
  7: [{ time: "16:00", label: "Demo day", tone: "emerald" }],
  12: [{ time: "11:00", label: "1:1 with Mertcan", tone: "blue" }],
  14: [{ time: "18:00", label: "Release", tone: "orange" }],
  19: [{ time: "13:00", label: "Workshop", tone: "purple" }],
  21: [{ time: "15:00", label: "Retro", tone: "emerald" }],
  26: [{ time: "09:30", label: "Coffee", tone: "blue" }],
  28: [{ time: "09:30", label: "Coffee", tone: "blue" }],
  30: [{ time: "All day", label: "Payday", tone: "emerald" }],
  31: [
    { time: "11:00", label: "Brunch", tone: "orange" },
    { time: "11:30", label: "Stand-up", tone: "purple" },
  ],
};

const TONE_BG: Record<CalEvent["tone"], string> = {
  blue: "bg-chart-2-active/15 text-chart-2-active",
  purple: "bg-purple-500/15 text-purple-500",
  emerald: "bg-emerald-500/15 text-emerald-600",
  orange: "bg-orange-500/15 text-orange-500",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Build the 6x7 grid for August 2026 (Aug 1 is a Saturday). */
function buildGrid(): { day: number; inMonth: boolean }[] {
  const cells: { day: number; inMonth: boolean }[] = [];
  // Week 1: Jul 26 (Sun) .. Aug 1 (Sat)
  for (let d = 26; d <= 31; d++) cells.push({ day: d, inMonth: false });
  for (let d = 1; d <= 31; d++) cells.push({ day: d, inMonth: true });
  // Week 6: Sep 1 .. Sep 5
  for (let d = 1; d <= 5; d++) cells.push({ day: d, inMonth: false });
  return cells;
}

export default function CalendarTemplatePage() {
  const [selected, setSelected] = useState(31);
  const cells = useMemo(buildGrid, []);
  const selectedEvents = EVENTS[selected] ?? [];

  return (
    <TemplateShell
      title="Calendar"
      heading="August 2026"
      icon={RiCalendarLine}
      selected="calendar"
      actions={
        <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
          New event
        </Button>
      }
    >
      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-semibold text-text-primary">Aug</p>
          <p className="text-body-2-medium text-text-secondary">August 2026 · replica data</p>
        </div>
        <div className="grid w-full grid-cols-7 gap-1.5">
          {WEEKDAYS.map((day) => (
            <p key={day} className="py-1 text-center text-body-2-medium text-text-tertiary">
              {day}
            </p>
          ))}
          {cells.map((cell, index) => {
            const events = cell.inMonth ? (EVENTS[cell.day] ?? []) : [];
            const isSelected = cell.inMonth && cell.day === selected;
            return (
              <button
                key={index}
                type="button"
                onClick={() => cell.inMonth && setSelected(cell.day)}
                className={cx(
                  "flex min-h-[88px] cursor-pointer flex-col items-start gap-1 rounded-xl p-2 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  !cell.inMonth && "opacity-40",
                  isSelected
                    ? "bg-accent-500 text-white"
                    : "bg-background-inner-default hover:bg-background-tertiary-default",
                )}
              >
                <span
                  className={cx(
                    "text-body-medium tabular-nums",
                    isSelected ? "text-white" : "text-text-primary",
                  )}
                >
                  {cell.day}
                </span>
                {events.slice(0, 2).map((event) => (
                  <span
                    key={event.label + event.time}
                    className={cx(
                      "w-full truncate rounded-md px-1.5 py-0.5 text-caption-1-regular",
                      isSelected ? "bg-white/20 text-white" : TONE_BG[event.tone],
                    )}
                  >
                    {event.time} · {event.label}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <p className="text-title-3-semibold text-text-primary">
          August {selected}, 2026
        </p>
        {selectedEvents.length === 0 ? (
          <p className="text-body-regular text-text-secondary">No events on this day.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedEvents.map((event) => (
              <div
                key={event.label + event.time}
                className="flex w-full items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className={cx("size-2 rounded-full", TONE_BG[event.tone].split(" ")[0])} aria-hidden />
                  <p className="text-body-medium text-text-primary">{event.label}</p>
                </div>
                <span className="text-body-2-medium text-text-secondary tabular-nums">{event.time}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </TemplateShell>
  );
}
