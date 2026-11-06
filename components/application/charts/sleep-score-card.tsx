"use client";

import { useState } from "react";

import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Sleep Score Card (replica).
 *
 * Segmented score ring: four sub-scores share one ring. Hovering a segment
 * focuses it — the centre number becomes that sub-score and its metric row
 * highlights; hovering away restores the overall score.
 */

const SEGMENTS = [
  { key: "duration", label: "Duration", score: 88, detail: "7h 42m · 10:48 PM – 6:30 AM", color: "var(--color-chart-4)" },
  { key: "quality", label: "Quality", score: 82, detail: "Deep 1h 24m · REM 1h 38m", color: "var(--color-chart-1)" },
  { key: "recovery", label: "Recovery", score: 76, detail: "HRV 62 ms · resting HR 54 bpm", color: "var(--color-chart-2)" },
  { key: "consistency", label: "Consistency", score: 91, detail: "Bedtime within 18 min of usual", color: "var(--color-chart-3)" },
] as const;

type SegmentKey = (typeof SEGMENTS)[number]["key"];

const R = 84;
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP = 3; // degrees of gap between segments

export function SleepScoreCard({ className }: { className?: string }) {
  const [hover, setHover] = useState<SegmentKey | null>(null);

  const overall = Math.round(SEGMENTS.reduce((s, g) => s + g.score, 0) / SEGMENTS.length);
  const focused = hover ? SEGMENTS.find((s) => s.key === hover) : null;

  let acc = 0;
  const arcs = SEGMENTS.map((s) => {
    const share = s.score / 100 / SEGMENTS.length;
    const start = acc;
    acc += share;
    return { ...s, start, share };
  });

  return (
    <ChartCardShell
      title="Sleep score"
      subtitle="Last night — hover a segment to inspect a sub-score"
      className={className}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="relative size-48 shrink-0">
          <svg viewBox="0 0 200 200" className="size-full -rotate-90" role="img" aria-label={`Sleep score ${overall} out of 100`}>
            <circle cx={100} cy={100} r={R} fill="none" stroke="var(--color-chart-track)" strokeWidth={14} />
            {arcs.map((a) => {
              const len = a.share * CIRCUMFERENCE;
              const gapLen = (GAP / 360) * CIRCUMFERENCE;
              const dash = Math.max(len - gapLen, 0);
              const offset = -a.start * CIRCUMFERENCE + gapLen / 2;
              const dimmed = hover !== null && hover !== a.key;
              return (
                <circle
                  key={a.key}
                  cx={100}
                  cy={100}
                  r={R}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={hover === a.key ? 18 : 14}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  opacity={dimmed ? 0.3 : 1}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHover(a.key)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-title-1-medium text-text-primary tabular-nums">{focused ? focused.score : overall}</p>
            <p className="text-caption-1-semibold text-text-tertiary">{focused ? focused.label.toUpperCase() : "SLEEP SCORE"}</p>
          </div>
        </div>
        <ul className="w-full min-w-0 flex-1" onMouseLeave={() => setHover(null)}>
          {SEGMENTS.map((s) => {
            const active = hover === s.key;
            const dimmed = hover !== null && !active;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onMouseEnter={() => setHover(s.key)}
                  onFocus={() => setHover(s.key)}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    dimmed && "opacity-45",
                    active && "bg-background-tertiary-default",
                  )}
                  aria-label={`${s.label}: ${s.score} out of 100. ${s.detail}`}
                >
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-body-medium text-text-primary">{s.label}</span>
                    <span className="block truncate text-body-2-regular text-text-tertiary">{s.detail}</span>
                  </span>
                  <span className="shrink-0 text-title-3-semibold text-text-primary tabular-nums">{s.score}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartCardShell>
  );
}
