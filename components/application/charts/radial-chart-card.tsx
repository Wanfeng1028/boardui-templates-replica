"use client";

import { useState } from "react";
import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Radial Chart Card (replica).
 *
 * Radial bar card with five variants: plain concentric rings, rings with
 * labels, rings over a grid, a single-value gauge, and a stacked half
 * gauge. Hovering a legend row highlights its ring.
 */

type Variant = "rings" | "labels" | "grid" | "gauge" | "half";

const RINGS = [
  { name: "Product", value: 82, fill: "var(--color-chart-4)" },
  { name: "Design", value: 64, fill: "var(--color-chart-1)" },
  { name: "Marketing", value: 47, fill: "var(--color-chart-3)" },
  { name: "Support", value: 31, fill: "var(--color-chart-8)" },
];

const VARIANT_COPY: Record<Variant, string> = {
  rings: "Four teams, one radial scale",
  labels: "Rings with value labels",
  grid: "Rings over a polar grid",
  gauge: "Single-value gauge — overall completion",
  half: "Stacked half gauge — capacity used",
};

export function RadialChartCard({ className }: { className?: string }) {
  const [variant, setVariant] = useState<Variant>("rings");
  const [hover, setHover] = useState<string | null>(null);

  const isGauge = variant === "gauge" || variant === "half";
  const data = isGauge
    ? [{ name: "Overall", value: 76, fill: "var(--color-chart-4)" }]
    : RINGS;
  const overall = Math.round(RINGS.reduce((s, r) => s + r.value, 0) / RINGS.length);

  return (
    <ChartCardShell
      title="Team capacity"
      subtitle={VARIANT_COPY[variant]}
      className={className}
      actions={
        <SegmentedControl
          aria-label="Radial variant"
          selectedKeys={new Set([variant])}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0];
            if (next === "rings" || next === "labels" || next === "grid" || next === "gauge" || next === "half") setVariant(next);
          }}
        >
          <SegmentedControlItem id="rings">Rings</SegmentedControlItem>
          <SegmentedControlItem id="labels">Labels</SegmentedControlItem>
          <SegmentedControlItem id="grid">Grid</SegmentedControlItem>
          <SegmentedControlItem id="gauge">Gauge</SegmentedControlItem>
          <SegmentedControlItem id="half">Half</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      <div className="relative h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            cx="50%"
            cy={variant === "half" ? "78%" : "50%"}
            innerRadius={variant === "gauge" ? "72%" : "42%"}
            outerRadius={variant === "half" ? "130%" : "100%"}
            startAngle={variant === "half" ? 180 : 90}
            endAngle={variant === "half" ? 0 : -270}
          >
            {variant === "grid" ? <PolarGrid stroke="var(--color-separator-border)" /> : null}
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <Tooltip content={() => null} />
            <RadialBar
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
              background={{ fill: "var(--color-chart-track)" }}
              isAnimationActive
              animationDuration={450}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-title-1-medium text-text-primary tabular-nums">
            {hover && !isGauge
              ? `${RINGS.find((r) => r.name === hover)?.value}%`
              : `${isGauge ? data[0].value : overall}%`}
          </p>
          <p className="text-caption-1-semibold text-text-tertiary">
            {hover && !isGauge ? hover.toUpperCase() : isGauge ? "OVERALL" : "AVERAGE"}
          </p>
        </div>
      </div>

      {!isGauge ? (
        <ul className="grid grid-cols-2 gap-2">
          {RINGS.map((r) => (
            <li key={r.name}>
              <button
                type="button"
                onMouseEnter={() => setHover(r.name)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(r.name)}
                onBlur={() => setHover(null)}
                className={cx(
                  "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-start text-body-2-medium outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  hover !== null && hover !== r.name ? "opacity-45" : "opacity-100",
                )}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: r.fill }} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-text-secondary">{r.name}</span>
                {variant === "labels" ? (
                  <span className="text-text-primary tabular-nums">{r.value}%</span>
                ) : (
                  <span className="text-text-tertiary tabular-nums">{r.value}%</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-2-regular text-text-tertiary">
          {variant === "gauge" ? "Overall completion across all four teams." : "76% of capacity is in use — the remaining arc is headroom."}
        </p>
      )}
    </ChartCardShell>
  );
}
