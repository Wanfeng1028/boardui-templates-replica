"use client";

import { useState } from "react";

import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Stage Bars Card (replica).
 *
 * Funnel stages as horizontal rounded pills: each stage shows its name,
 * value and share, and the bar width animates. Mono switches the per-stage
 * hues to a single hue scale.
 */

const STAGES = [
  { name: "Discovery", value: 48200, color: "var(--color-chart-4)" },
  { name: "Trial", value: 21480, color: "var(--color-chart-1)" },
  { name: "Onboarding", value: 12630, color: "var(--color-chart-2)" },
  { name: "Adoption", value: 6840, color: "var(--color-chart-3)" },
  { name: "Advocacy", value: 4210, color: "var(--color-chart-5)" },
];

export function StageBarsCard({ className }: { className?: string }) {
  const [mono, setMono] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const max = STAGES[0].value;

  return (
    <ChartCardShell
      title="Pipeline stages"
      subtitle="Share of the funnel at each stage — widths animate"
      className={className}
      actions={
        <button
          type="button"
          aria-pressed={mono}
          onClick={() => setMono((v) => !v)}
          className={cx(
            "rounded-full border px-3 py-1.5 text-body-2-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            mono
              ? "border-border-button-default bg-background-tertiary-default text-text-primary"
              : "border-border-button-default text-text-secondary hover:bg-background-tertiary-default",
          )}
        >
          Mono
        </button>
      }
    >
      <ul className="flex flex-col gap-3" onMouseLeave={() => setHover(null)}>
        {STAGES.map((stage, i) => {
          const pct = Math.round((stage.value / max) * 100);
          const dimmed = hover !== null && hover !== i;
          return (
            <li key={stage.name}>
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className="block w-full rounded-xl text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                aria-label={`${stage.name}: ${stage.value.toLocaleString("en-US")}, ${pct}%`}
              >
                <span className="mb-1 flex items-baseline justify-between gap-2 text-body-2-medium">
                  <span className={cx("text-text-secondary", dimmed && "opacity-45")}>{stage.name}</span>
                  <span className="text-text-primary tabular-nums">
                    {stage.value.toLocaleString("en-US")}
                    <span className="ms-1.5 text-text-tertiary tabular-nums">{pct}%</span>
                  </span>
                </span>
                <span className="block h-3 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                  <span
                    className="block h-full rounded-full transition-[width,background-color,opacity] duration-500"
                    style={{
                      width: `${pct}%`,
                      background: stage.color,
                      opacity: mono ? 1 - i * 0.16 : dimmed ? 0.35 : 1,
                    }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-body-2-regular text-text-tertiary">
        {hover !== null
          ? `${STAGES[hover].name} keeps ${Math.round((STAGES[hover].value / max) * 100)}% of the top of the funnel.`
          : `${STAGES[STAGES.length - 1].value.toLocaleString("en-US")} advocates from ${max.toLocaleString("en-US")} discoveries.`}
      </p>
    </ChartCardShell>
  );
}
