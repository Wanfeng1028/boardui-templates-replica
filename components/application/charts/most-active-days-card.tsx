"use client";

import { useMemo, useState } from "react";

import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Most Active Days Card (replica).
 *
 * Continuous vertical month calendar: every day gets a mini activity ring
 * whose fill follows that day's activity. Hovering a day shows its numbers
 * in the headline; the most active day is marked.
 */

const YEAR = 2026;
const MONTH = 7; // August (0-based)
const MONTH_NAME = "August 2026";
const DAYS_IN_MONTH = 31;
const FIRST_WEEKDAY = new Date(YEAR, MONTH, 1).getDay(); // 6 = Saturday

/** Deterministic activity 0..100 for a day of the month. */
function activityOf(day: number) {
  const wave = Math.sin(day / 4.6) * 0.5 + 0.5;
  const seed = (day * 37 + 11) % 23;
  return Math.min(100, Math.round(wave * 78) + seed);
}

function MiniRing({ value, size = 34, active }: { value: number; size?: number; active?: boolean }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const frac = value / 100;
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" className="-rotate-90" aria-hidden>
      <circle cx={17} cy={17} r={r} fill="none" stroke="var(--color-chart-track)" strokeWidth={3.5} />
      <circle
        cx={17}
        cy={17}
        r={r}
        fill="none"
        stroke={value >= 80 ? "var(--color-chart-1)" : value >= 50 ? "var(--color-chart-4)" : "var(--color-chart-8)"}
        strokeWidth={active ? 5 : 3.5}
        strokeLinecap="round"
        strokeDasharray={`${frac * c} ${c}`}
      />
    </svg>
  );
}

export function MostActiveDaysCard({ className }: { className?: string }) {
  const [hover, setHover] = useState<number | null>(null);

  const days = useMemo(() => Array.from({ length: DAYS_IN_MONTH }, (_, i) => ({ day: i + 1, value: activityOf(i + 1) })), []);
  const best = days.reduce((a, b) => (b.value > a.value ? b : a));
  const avg = Math.round(days.reduce((s, d) => s + d.value, 0) / days.length);
  const hovered = hover !== null ? days[hover - 1] : null;

  // Weeks: leading blanks for the first weekday, then 7-day rows.
  const cells: (number | null)[] = [...Array<null>(FIRST_WEEKDAY).fill(null), ...days.map((d) => d.day)];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <ChartCardShell
      title="Most active days"
      subtitle={`${MONTH_NAME} — every day is a mini activity ring`}
      className={className}
    >
      <div>
        <p className="text-body-medium text-text-secondary">
          {hovered ? `Aug ${hovered.day}, 2026` : `Most active: Aug ${best.day}`}
        </p>
        <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
          {hovered ? `${hovered.value} / 100` : `${best.value} / 100`}
        </p>
        <p className="text-body-2-medium text-text-tertiary">
          {hovered
            ? `${hovered.value >= 80 ? "High activity day" : hovered.value >= 50 ? "Moderate activity day" : "Light activity day"} · month average ${avg}`
            : `Aug ${best.day} tops the month · month average ${avg}`}
        </p>
      </div>
      <div onMouseLeave={() => setHover(null)}>
        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-caption-1-semibold text-text-tertiary">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (day === null) return <span key={`blank-${di}`} />;
              const value = activityOf(day);
              const isBest = day === best.day;
              const isHover = hover === day;
              return (
                <button
                  key={day}
                  type="button"
                  onMouseEnter={() => setHover(day)}
                  onFocus={() => setHover(day)}
                  aria-label={`August ${day}: activity ${value} out of 100${isBest ? ", most active day" : ""}`}
                  className={cx(
                    "relative flex flex-col items-center rounded-xl py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    isHover ? "bg-background-tertiary-default" : "hover:bg-background-tertiary-default",
                  )}
                >
                  <MiniRing value={value} active={isHover || isBest} />
                  <span className="mt-0.5 text-caption-1-semibold text-text-secondary tabular-nums">{day}</span>
                  {isBest ? <span className="absolute top-0.5 right-1 size-1.5 rounded-full bg-chart-1-active" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-body-2-medium text-text-tertiary">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-1" aria-hidden />High (80+)</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-4" aria-hidden />Moderate (50–79)</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-8" aria-hidden />Light (&lt;50)</span>
      </div>
    </ChartCardShell>
  );
}
