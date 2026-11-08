"use client";

import { useState } from "react";

import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Activity Rings Card (replica).
 *
 * Apple Watch-style concentric goal rings (Move / Exercise / Stand) with
 * stat tiles underneath. Hovering a ring or a tile highlights that ring and
 * dims the others; the centre shows the hovered ring's progress.
 */

const RINGS = [
  { key: "move", label: "Move", value: 640, goal: 800, unit: "kcal", color: "var(--color-chart-3)", r: 84 },
  { key: "exercise", label: "Exercise", value: 28, goal: 30, unit: "min", color: "var(--color-chart-2)", r: 64 },
  { key: "stand", label: "Stand", value: 11, goal: 12, unit: "hr", color: "var(--color-chart-4)", r: 44 },
] as const;

type RingKey = (typeof RINGS)[number]["key"];

export function ActivityRingsCard({ className }: { className?: string }) {
  const [hover, setHover] = useState<RingKey | null>(null);

  const focused = hover ? RINGS.find((r) => r.key === hover) : null;

  return (
    <ChartCardShell
      title="Activity"
      subtitle="Today's rings — Move, Exercise, Stand"
      className={className}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="relative size-48 shrink-0">
          <svg viewBox="0 0 200 200" className="size-full -rotate-90" role="img" aria-label="Activity rings">
            <circle cx={100} cy={100} r={84} fill="none" stroke="var(--color-chart-track)" strokeWidth={13} />
            <circle cx={100} cy={100} r={64} fill="none" stroke="var(--color-chart-track)" strokeWidth={13} />
            <circle cx={100} cy={100} r={44} fill="none" stroke="var(--color-chart-track)" strokeWidth={13} />
            {RINGS.map((ring) => {
              const c = 2 * Math.PI * ring.r;
              const frac = Math.min(ring.value / ring.goal, 1);
              const dimmed = hover !== null && hover !== ring.key;
              return (
                <circle
                  key={ring.key}
                  cx={100}
                  cy={100}
                  r={ring.r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={hover === ring.key ? 16 : 13}
                  strokeLinecap="round"
                  strokeDasharray={`${frac * c} ${c}`}
                  opacity={dimmed ? 0.3 : 1}
                  className="cursor-pointer transition-[stroke-dasharray,opacity] duration-300"
                  onMouseEnter={() => setHover(ring.key)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-title-2-medium text-text-primary tabular-nums">
              {focused ? `${Math.round((focused.value / focused.goal) * 100)}%` : "2 of 3"}
            </p>
            <p className="text-caption-1-semibold text-text-tertiary">
              {focused ? focused.label.toUpperCase() : "CLOSED"}
            </p>
          </div>
        </div>
        <ul className="w-full min-w-0 flex-1" onMouseLeave={() => setHover(null)}>
          {RINGS.map((ring) => {
            const pct = Math.round((ring.value / ring.goal) * 100);
            const active = hover === ring.key;
            const dimmed = hover !== null && !active;
            return (
              <li key={ring.key}>
                <button
                  type="button"
                  onMouseEnter={() => setHover(ring.key)}
                  onFocus={() => setHover(ring.key)}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    dimmed && "opacity-45",
                    active && "bg-background-tertiary-default",
                  )}
                  aria-label={`${ring.label}: ${ring.value} of ${ring.goal} ${ring.unit}, ${pct} percent`}
                >
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: ring.color }} aria-hidden />
                  <span className="min-w-0 flex-1 text-body-medium text-text-primary">{ring.label}</span>
                  <span className="shrink-0 text-body-medium text-text-primary tabular-nums">
                    {ring.value}
                    <span className="text-text-tertiary">/{ring.goal} {ring.unit}</span>
                  </span>
                  <span className="w-10 shrink-0 text-end text-body-2-medium text-text-tertiary tabular-nums">{pct}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        Move is 160 kcal short of its goal; Exercise and Stand are nearly closed.
      </p>
    </ChartCardShell>
  );
}
