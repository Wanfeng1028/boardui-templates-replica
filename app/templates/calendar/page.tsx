"use client";

import {
  RiAddFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiInboxLine,
} from "@remixicon/react";
import { useMemo, useRef, useState } from "react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * Calendar template replica — 1:1 functional rebuild.
 * Source: boardui.com/templates/calendar server-rendered HTML (Aug 2026).
 * Every event, time and chip colour below is copied from that page:
 * month grid (Aug 1 2026 = Saturday), 23 event chips across Jul 28–Sep 4,
 * chip classes bg-calendar-event-{tone}-background + title/time tokens,
 * month switcher (320px, "Aug" on mobile / "August 2026" on desktop),
 * cell min-heights 72/94/105/128/164px by breakpoint.
 * Built only from free BoardUI components + mock data. Not the Pro source.
 */

type Tone = "lime" | "pink" | "purple" | "blue" | "emerald";

type CalEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string | null; // null = all-day chip (Payday, Holidays)
  tone: Tone;
};

const SEED: CalEvent[] = [
  { id: "e01", date: "2026-07-28", title: "Coffee", time: "09:30", tone: "lime" },
  { id: "e02", date: "2026-07-30", title: "Payday", time: null, tone: "lime" },
  { id: "e03", date: "2026-08-01", title: "Brunch", time: "11:00", tone: "lime" },
  { id: "e04", date: "2026-08-02", title: "Stand-up", time: "11:30", tone: "pink" },
  { id: "e05", date: "2026-08-02", title: "1:1 sync", time: "16:30", tone: "lime" },
  { id: "e06", date: "2026-08-05", title: "Gym", time: "07:00", tone: "pink" },
  { id: "e07", date: "2026-08-08", title: "Game night", time: "19:00", tone: "purple" },
  { id: "e08", date: "2026-08-11", title: "Holidays", time: null, tone: "emerald" },
  { id: "e09", date: "2026-08-11", title: "Birthday night at Bacalar’s", time: "20:30", tone: "purple" },
  { id: "e10", date: "2026-08-14", title: "Retro", time: "15:00", tone: "blue" },
  { id: "e11", date: "2026-08-17", title: "Planning", time: "10:00", tone: "blue" },
  { id: "e12", date: "2026-08-17", title: "Haircut", time: "16:00", tone: "emerald" },
  { id: "e13", date: "2026-08-20", title: "Stand-up", time: "11:30", tone: "pink" },
  { id: "e14", date: "2026-08-20", title: "Team lunch", time: "13:00", tone: "purple" },
  { id: "e15", date: "2026-08-20", title: "Portfolio review", time: "14:30", tone: "blue" },
  { id: "e16", date: "2026-08-20", title: "1:1 sync", time: "16:30", tone: "lime" },
  { id: "e17", date: "2026-08-24", title: "Dinner with friends", time: "19:15", tone: "purple" },
  { id: "e18", date: "2026-08-27", title: "Yoga", time: "07:30", tone: "pink" },
  { id: "e19", date: "2026-08-29", title: "Brunch", time: "11:00", tone: "lime" },
  { id: "e20", date: "2026-08-31", title: "Payday", time: null, tone: "lime" },
  { id: "e21", date: "2026-09-01", title: "Kickoff", time: "09:00", tone: "blue" },
  { id: "e22", date: "2026-09-02", title: "Standup", time: "09:00", tone: "pink" },
  { id: "e23", date: "2026-09-04", title: "Dentist", time: "10:30", tone: "emerald" },
];

const TONES: Tone[] = ["lime", "pink", "purple", "blue", "emerald"];
const TONE_DOT: Record<Tone, string> = {
  lime: "bg-lime-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function keyOf(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m: m - 1, d };
}

function prettyDate(key: string) {
  const { y, m, d } = parseKey(key);
  const dt = new Date(y, m, d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

/** 42 cells (6x7) for a month, starting on the Sunday of the first week. */
function buildCells(y: number, m: number) {
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { key: keyOf(dt.getFullYear(), dt.getMonth(), dt.getDate()), day: dt.getDate(), inMonth: dt.getMonth() === m };
  });
}

const NAV_CHEVRON =
  "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] text-foreground-icon-primary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring";

export default function CalendarTemplatePage() {
  const [events, setEvents] = useState<CalEvent[]>(SEED);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7); // August 2026, as in the original
  const [selectedKey, setSelectedKey] = useState("2026-08-02");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [detail, setDetail] = useState<CalEvent | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("2026-08-02");
  const [formTime, setFormTime] = useState("10:00");
  const [formAllDay, setFormAllDay] = useState(false);
  const [formTone, setFormTone] = useState<Tone>("blue");
  const idRef = useRef(100);

  const cells = useMemo(() => buildCells(year, month), [year, month]);
  const byDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.time ?? "00:00").localeCompare(b.time ?? "00:00"));
    }
    return map;
  }, [events]);

  const monthLabel = `${MONTHS[month]} ${year}`;
  const selectedEvents = byDate.get(selectedKey) ?? [];
  const inboxItems = useMemo(() => {
    const from = new Date(year, month, 1).getTime();
    return events
      .filter((e) => new Date(`${e.date}T00:00:00`).getTime() >= from)
      .sort((a, b) => `${a.date}${a.time ?? ""}`.localeCompare(`${b.date}${b.time ?? ""}`))
      .slice(0, 5);
  }, [events, year, month]);

  const shiftMonth = (delta: number) => {
    const dt = new Date(year, month + delta, 1);
    setYear(dt.getFullYear());
    setMonth(dt.getMonth());
    setPickerOpen(false);
  };

  const addEvent = () => {
    const title = formTitle.trim();
    if (!title) return;
    const ev: CalEvent = {
      id: `u${idRef.current++}`,
      date: formDate,
      title,
      time: formAllDay ? null : formTime,
      tone: formTone,
    };
    setEvents((prev) => [...prev, ev]);
    const { y, m } = parseKey(formDate);
    setYear(y);
    setMonth(m);
    setSelectedKey(formDate);
    setNewOpen(false);
    setFormTitle("");
    setDetail(ev);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDetail(null);
  };

  return (
    <TemplateShell
      title="Calendar"
      heading={monthLabel}
      icon={RiCalendarLine}
      selected="calendar"
      actions={
        <>
          <div className="relative">
            <IconButton
              icon={RiInboxLine}
              size="medium"
              aria-label="Inbox"
              aria-expanded={inboxOpen}
              onClick={() => {
                setInboxOpen((v) => !v);
                setPickerOpen(false);
              }}
            />
            {inboxOpen && (
              <div className="absolute end-0 top-11 z-30 w-[300px] rounded-2xl border border-border-button-default bg-background-primary-default p-2 shadow-dropdown">
                <p className="px-2 pb-1 pt-1 text-title-3-semibold text-text-primary">Inbox</p>
                <p className="px-2 pb-2 text-body-2-regular text-text-tertiary">
                  Upcoming events from {MONTHS[month]} {year}
                </p>
                {inboxItems.length === 0 ? (
                  <p className="px-2 py-3 text-body-regular text-text-secondary">No upcoming events.</p>
                ) : (
                  inboxItems.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setDetail(e);
                        setInboxOpen(false);
                        setSelectedKey(e.date);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-start outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    >
                      <span className={cx("size-2 shrink-0 rounded-full", TONE_DOT[e.tone])} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body-medium text-text-primary">{e.title}</span>
                        <span className="block text-body-2-regular text-text-tertiary">
                          {prettyDate(e.date).replace(/, \d{4}$/, "")}
                          {e.time ? ` · ${e.time}` : " · All day"}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="medium"
            leadingIcon={RiAddFill}
            onClick={() => {
              setFormDate(selectedKey);
              setNewOpen(true);
            }}
          >
            New event
          </Button>
        </>
      }
    >
      {/* Month switcher — original: 320px wide, chevrons + centred label */}
      <div className="flex w-full items-center justify-between gap-2">
        <div
          className="relative h-9 min-w-0 flex-1 sm:w-[320px] sm:flex-none"
          style={{ ["--month-switcher-width" as string]: "320px" }}
        >
          <div className="absolute top-0 end-0 start-0 z-10 flex w-full flex-col overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default shadow-dropdown transition-[width] duration-300 ease-in-out sm:end-auto sm:w-[320px]">
            <div className="flex w-full shrink-0 items-center justify-between p-2">
              <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)} className={NAV_CHEVRON}>
                <RiArrowLeftSLine className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-expanded={pickerOpen}
                onClick={() => setPickerOpen((v) => !v)}
                className="flex-1 cursor-pointer truncate text-center text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="sm:hidden">{MONTHS[month].slice(0, 3)}</span>
                <span className="hidden sm:inline">{monthLabel}</span>
              </button>
              <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)} className={NAV_CHEVRON}>
                <RiArrowRightSLine className="size-4" aria-hidden />
              </button>
            </div>
            {pickerOpen && (
              <div className="grid grid-cols-3 gap-1 border-t border-separator-border p-2">
                {MONTHS.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setMonth(i);
                      setPickerOpen(false);
                    }}
                    className={cx(
                      "cursor-pointer rounded-lg px-2 py-1.5 text-body-2-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      i === month
                        ? "bg-accent-500 text-white"
                        : "text-text-secondary hover:bg-background-tertiary-default",
                    )}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
                <div className="col-span-3 flex items-center justify-between border-t border-separator-border pt-2">
                  <button type="button" aria-label="Previous year" onClick={() => setYear((y) => y - 1)} className={NAV_CHEVRON}>
                    <RiArrowLeftSLine className="size-4" aria-hidden />
                  </button>
                  <span className="text-body-medium text-text-primary tabular-nums">{year}</span>
                  <button type="button" aria-label="Next year" onClick={() => setYear((y) => y + 1)} className={NAV_CHEVRON}>
                    <RiArrowRightSLine className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setYear(2026);
            setMonth(7);
            setSelectedKey("2026-08-02");
          }}
          className="shrink-0 cursor-pointer rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-2-medium text-text-secondary outline-none transition-colors hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          Today · Aug 2026
        </button>
      </div>

      {/* Month grid — original classes: 7 cols, 6 rows, mobile hairline
          borders + gap-0, sm:gap-2 rounded cards, tertiary bg on sm+ */}
      <section className="flex w-full flex-col overflow-hidden rounded-2xl bg-background-secondary-default sm:rounded-3xl">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-center border-e border-separator-border-strong bg-background-secondary-default px-0.5 py-1 text-center text-[11px] leading-4 text-text-secondary last:border-e-0 sm:rounded-xl sm:border-0 sm:px-2.5 sm:py-[5px] sm:text-body-2-regular"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-[repeat(6,minmax(0,1fr))] gap-0 sm:flex-none sm:grid-rows-[repeat(6,minmax(0,auto))] sm:gap-2 sm:p-2">
          {cells.map((cell) => {
            const dayEvents = byDate.get(cell.key) ?? []; // original shows Jul 28/30 + Sep 1/2/4 chips too
            const isSelected = cell.key === selectedKey;
            const shown = dayEvents.slice(0, 2);
            const extra = dayEvents.length - shown.length;
            return (
              <div
                key={cell.key}
                className="relative h-full border-e border-b border-separator-border-strong last:border-b-0 nth-[7n]:border-e-0 nth-[n+36]:border-b-0 sm:border-0"
              >
                <button
                  type="button"
                  onClick={() => setSelectedKey(cell.key)}
                  aria-label={`${prettyDate(cell.key)}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}`}
                  className={cx(
                    "relative flex h-full min-h-[72px] w-full flex-col overflow-hidden text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring sm:min-h-[94px] sm:rounded-xl lg:min-h-[105px] xl:min-h-[128px] 2xl:min-h-[164px]",
                    cell.inMonth ? "bg-background-secondary-default sm:bg-background-tertiary-default" : "bg-background-secondary-default opacity-60 sm:bg-background-tertiary-default",
                    isSelected && "ring-2 ring-inset ring-accent-500",
                  )}
                >
                  <span
                    className={cx(
                      "pt-1.5 ps-1.5 text-[11px] leading-4 font-medium sm:pt-2 sm:ps-2.5 sm:text-body-2-medium",
                      cell.inMonth ? "text-text-primary" : "text-text-secondary",
                    )}
                  >
                    {cell.day}
                  </span>
                  <span className="mt-auto flex w-full flex-col gap-0.5 px-1 pb-1 sm:gap-[5px] sm:px-2 sm:pb-2">
                    {shown.map((e) => (
                      <span
                        key={e.id}
                        role="button"
                        tabIndex={0}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setDetail(e);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            ev.stopPropagation();
                            setDetail(e);
                          }
                        }}
                        className={cx(
                          "flex min-w-0 cursor-pointer items-center justify-between gap-0.5 rounded-sm px-1 py-0.5 outline-none transition-[filter] duration-150 ease hover:brightness-95 focus-visible:ring-2 focus-visible:ring-border-focus-ring sm:gap-1 sm:rounded-md sm:px-1.5",
                          `bg-calendar-event-${e.tone}-background`,
                        )}
                      >
                        <span className={cx("truncate text-[10px] leading-3 sm:text-body-2-medium", `text-calendar-event-${e.tone}-title`)}>
                          {e.title}
                        </span>
                        {e.time && (
                          <span className={cx("hidden shrink-0 opacity-70 sm:inline sm:text-caption-1-medium", `text-calendar-event-${e.tone}-time`)}>
                            {e.time}
                          </span>
                        )}
                      </span>
                    ))}
                    {extra > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedKey(cell.key);
                          const first = dayEvents[0];
                          if (first) setDetail(first);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter") {
                            ev.stopPropagation();
                            const first = dayEvents[0];
                            if (first) setDetail(first);
                          }
                        }}
                        className="cursor-pointer px-1 text-start text-[10px] leading-3 font-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring sm:text-body-2-medium"
                      >
                        + {extra} more
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected day — events of the selected date, click opens the detail */}
      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-title-3-semibold text-text-primary">{prettyDate(selectedKey)}</p>
          <span className="text-body-2-medium text-text-tertiary">
            {selectedEvents.length} event{selectedEvents.length === 1 ? "" : "s"}
          </span>
        </div>
        {selectedEvents.length === 0 ? (
          <p className="text-body-regular text-text-secondary">No events on this day.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedEvents.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setDetail(e)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5 text-start outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={cx("size-2 shrink-0 rounded-full", TONE_DOT[e.tone])} aria-hidden />
                  <span className="truncate text-body-medium text-text-primary">{e.title}</span>
                </span>
                <span className="shrink-0 text-body-2-medium text-text-secondary tabular-nums">
                  {e.time ?? "All day"}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Event detail dialog */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="Event details">
          <button type="button" aria-label="Close event details" onClick={() => setDetail(null)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative w-full max-w-[420px] rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-dropdown">
            <div className="flex items-start justify-between gap-2">
              <span className={cx("mt-1 size-3 shrink-0 rounded-full", TONE_DOT[detail.tone])} aria-hidden />
              <button type="button" aria-label="Close" onClick={() => setDetail(null)} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <RiCloseLine className="size-5" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-title-2-medium text-text-primary">{detail.title}</p>
            <p className="mt-1 text-body-regular text-text-secondary">{prettyDate(detail.date)}</p>
            <p className="mt-0.5 text-body-regular text-text-secondary tabular-nums">
              {detail.time ? `${detail.time} – 1 hour` : "All day"}
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" size="medium" leadingIcon={RiDeleteBinLine} onClick={() => deleteEvent(detail.id)}>
                Delete event
              </Button>
              <Button variant="primary" size="medium" onClick={() => setDetail(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New event dialog */}
      {newOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="New event">
          <button type="button" aria-label="Close new event" onClick={() => setNewOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative w-full max-w-[420px] rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-dropdown">
            <div className="flex items-start justify-between gap-2">
              <p className="text-title-2-medium text-text-primary">New event</p>
              <button type="button" aria-label="Close" onClick={() => setNewOpen(false)} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <RiCloseLine className="size-5" aria-hidden />
              </button>
            </div>
            <label className="mt-4 block">
              <span className="text-body-medium text-text-primary">Title</span>
              <input
                autoFocus
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addEvent();
                }}
                placeholder="Event title"
                aria-label="Event title"
                className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <div className="mt-3 flex gap-2">
              <label className="flex-1">
                <span className="text-body-medium text-text-primary">Date</span>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  aria-label="Event date"
                  className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
              </label>
              <label className="w-[130px]">
                <span className="text-body-medium text-text-primary">Time</span>
                <input
                  type="time"
                  value={formTime}
                  disabled={formAllDay}
                  onChange={(e) => setFormTime(e.target.value)}
                  aria-label="Event time"
                  className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-50"
                />
              </label>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-body-medium text-text-primary">
              <input type="checkbox" checked={formAllDay} onChange={(e) => setFormAllDay(e.target.checked)} className="size-4 accent-current" />
              All day
            </label>
            <p className="mt-4 text-body-medium text-text-primary">Colour</p>
            <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Event colour">
              {TONES.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  role="radio"
                  aria-checked={formTone === tone}
                  aria-label={`${tone} event`}
                  onClick={() => setFormTone(tone)}
                  className={cx(
                    "size-8 cursor-pointer rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    TONE_DOT[tone],
                    formTone === tone && "scale-110 ring-2 ring-offset-2 ring-border-focus-ring",
                  )}
                />
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="medium" onClick={() => setNewOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={addEvent}>
                Add event
              </Button>
            </div>
          </div>
        </div>
      )}
    </TemplateShell>
  );
}
