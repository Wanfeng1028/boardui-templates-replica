"use client";

import { useMemo, useState } from "react";

import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

import { ChartCardShell, ChartHeadline } from "./card-shell";

/**
 * Contributions Card (replica).
 *
 * GitHub-style contribution heatmap grid (26 weeks x 7 days). The accent
 * color is switchable; hovering a cell swaps the headline for that day's
 * contribution count and date. Counts are deterministic mock data.
 */

const ACCENTS = [
  { id: "teal", label: "Teal", bar: "bg-chart-1", dot: "bg-chart-1-active" },
  { id: "lime", label: "Lime", bar: "bg-chart-2", dot: "bg-chart-2-active" },
  { id: "pink", label: "Pink", bar: "bg-chart-3", dot: "bg-chart-3-active" },
  { id: "sky", label: "Sky", bar: "bg-chart-4", dot: "bg-chart-4-active" },
  { id: "purple", label: "Purple", bar: "bg-chart-5", dot: "bg-chart-5-active" },
] as const;

type AccentId = (typeof ACCENTS)[number]["id"];

/** Deterministic pseudo-random count for a cell, 0..9. */
function cellCount(week: number, day: number) {
  const seed = (week * 7 + day * 13 + 5) % 17;
  const wave = Math.sin((week + day) / 3.2) * 0.5 + 0.5;
  if (seed < 4) return 0;
  return Math.min(9, Math.round(wave * 8) + (seed % 3));
}

function levelOf(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

const LEVEL_OPACITY = ["", "opacity-25", "opacity-50", "opacity-75", "opacity-100"];

const WEEKS = 26;
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Grid starts on a Sunday 25 weeks ago; label a cell with its date. */
function cellDate(week: number, day: number) {
  const start = new Date(2026, 4, 3); // a Sunday
  const d = new Date(start);
  d.setDate(start.getDate() + week * 7 + day);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ContributionsCard({ className }: { className?: string }) {
  const [accent, setAccent] = useState<AccentId>("teal");
  const [hover, setHover] = useState<{ week: number; day: number } | null>(null);

  const cells = useMemo(
    () =>
      Array.from({ length: WEEKS }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => ({ week: w, day: d, count: cellCount(w, d) })),
      ),
    [],
  );
  const total = cells.flat().reduce((s, c) => s + c.count, 0);
  const display = useCountUp(total);
  const accentDef = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];
  const hovered = hover ? cells[hover.week][hover.day] : null;

  return (
    <ChartCardShell
      title="Contributions"
      subtitle="26 weeks of activity — pick an accent, hover a day"
      className={className}
      actions={
        <div className="flex items-center gap-1.5" role="group" aria-label="Accent color">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-label={`${a.label} accent`}
              aria-pressed={accent === a.id}
              onClick={() => setAccent(a.id)}
              className={cx(
                "size-6 rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                a.dot,
                accent === a.id ? "scale-110 ring-2 ring-border-focus-ring ring-offset-2 ring-offset-background-secondary-default" : "opacity-60 hover:opacity-100",
              )}
            />
          ))}
        </div>
      }
    >
      <ChartHeadline
        label={hovered ? `${cellDate(hovered.week, hovered.day)} · ${DAY_NAMES[hovered.day]}` : "Total contributions"}
        value={hovered ? `${hovered.count} contribution${hovered.count === 1 ? "" : "s"}` : `${display.toLocaleString("en-US")} contributions`}
        sub={hovered ? `${total.toLocaleString("en-US")} in the last 26 weeks` : "Last 26 weeks · May – Oct 2026"}
      />
      <div
        className="grid w-full grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto pb-1"
        style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
        onMouseLeave={() => setHover(null)}
      >
        {cells.flat().map((cell) => {
          const level = levelOf(cell.count);
          const isHover = hover?.week === cell.week && hover?.day === cell.day;
          return (
            <button
              key={`${cell.week}-${cell.day}`}
              type="button"
              aria-label={`${cellDate(cell.week, cell.day)}: ${cell.count} contributions`}
              onMouseEnter={() => setHover({ week: cell.week, day: cell.day })}
              onFocus={() => setHover({ week: cell.week, day: cell.day })}
              className={cx(
                "aspect-square min-w-2.5 rounded-[3px] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                level === 0 ? "bg-background-tertiary-default" : cx(accentDef.bar, LEVEL_OPACITY[level]),
                isHover && "scale-125 ring-1 ring-text-primary",
              )}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-1.5 text-body-2-medium text-text-tertiary">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            aria-hidden
            className={cx(
              "size-2.5 rounded-[3px]",
              level === 0 ? "bg-background-tertiary-default" : cx(accentDef.bar, LEVEL_OPACITY[level]),
            )}
          />
        ))}
        <span>More</span>
      </div>
    </ChartCardShell>
  );
}
