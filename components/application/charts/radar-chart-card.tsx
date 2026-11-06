"use client";

import { useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Radar Chart Card (replica).
 *
 * Radar chart with four variants — Filled, Dashed, Lines only, and Center
 * score — plus a multi-series legend. Hovering (or focusing) a legend item
 * swaps the headline for that series' average; clicking a legend item
 * isolates that series.
 */

type Variant = "filled" | "dashed" | "lines" | "score";

const DATA = [
  { subject: "Engagement", current: 86, previous: 64 },
  { subject: "Retention", current: 72, previous: 58 },
  { subject: "Growth", current: 91, previous: 70 },
  { subject: "Satisfaction", current: 78, previous: 66 },
  { subject: "Support", current: 65, previous: 52 },
  { subject: "Revenue", current: 83, previous: 61 },
];

const SERIES = [
  { key: "current", label: "This quarter", color: "var(--color-chart-4-active)", fill: "var(--color-chart-4)", dot: "bg-chart-4-active" },
  { key: "previous", label: "Last quarter", color: "var(--color-chart-3-active)", fill: "var(--color-chart-3)", dot: "bg-chart-3-active" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

const avg = (key: SeriesKey) => Math.round(DATA.reduce((s, d) => s + d[key], 0) / DATA.length);

export function RadarChartCard({ className }: { className?: string }) {
  const [variant, setVariant] = useState<Variant>("filled");
  const [hoverSeries, setHoverSeries] = useState<SeriesKey | null>(null);
  const [isolated, setIsolated] = useState<SeriesKey | null>(null);

  const visible = SERIES.filter((s) => !isolated || s.key === isolated);
  const headlineSeries = hoverSeries ? SERIES.find((s) => s.key === hoverSeries) : null;
  const score = Math.round((avg("current") + avg("previous")) / 2);

  return (
    <ChartCardShell
      title="Engagement radar"
      subtitle="Six dimensions, two quarters — hover the legend to compare"
      className={className}
      actions={
        <SegmentedControl
          aria-label="Radar variant"
          selectedKeys={new Set([variant])}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0];
            if (next === "filled" || next === "dashed" || next === "lines" || next === "score") setVariant(next);
          }}
        >
          <SegmentedControlItem id="filled">Filled</SegmentedControlItem>
          <SegmentedControlItem id="dashed">Dashed</SegmentedControlItem>
          <SegmentedControlItem id="lines">Lines</SegmentedControlItem>
          <SegmentedControlItem id="score">Score</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-body-medium text-text-secondary">
            {headlineSeries ? headlineSeries.label : variant === "score" ? "Overall score" : "Average across dimensions"}
          </p>
          <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
            {headlineSeries ? `${avg(headlineSeries.key)} / 100` : variant === "score" ? `${score} / 100` : `${avg("current")} vs ${avg("previous")}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Series legend">
          {SERIES.map((s) => {
            const active = isolated === s.key;
            const dimmed = isolated !== null && !active;
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={active}
                onClick={() => setIsolated(active ? null : s.key)}
                onMouseEnter={() => setHoverSeries(s.key)}
                onMouseLeave={() => setHoverSeries(null)}
                onFocus={() => setHoverSeries(s.key)}
                onBlur={() => setHoverSeries(null)}
                className={cx(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-body-2-medium outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  active
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default text-text-secondary hover:bg-background-tertiary-default",
                  dimmed && "opacity-45",
                )}
              >
                <span className={cx("size-2 rounded-full", s.dot)} aria-hidden />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={DATA} outerRadius="72%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
            <PolarGrid stroke="var(--color-separator-border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={() => null} />
            {visible.map((s) => (
              <Radar
                key={s.key}
                name={s.label}
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={variant === "dashed" ? "6 4" : undefined}
                fill={s.fill}
                fillOpacity={variant === "filled" ? 0.28 : variant === "score" ? 0.18 : 0}
                dot={false}
                isAnimationActive
                animationDuration={450}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
        {variant === "score" ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-title-1-medium text-text-primary tabular-nums">{score}</p>
            <p className="text-caption-1-semibold text-text-tertiary">OVERALL</p>
          </div>
        ) : null}
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        {isolated ? "Showing one series — click its legend pill again to show both." : "Click a legend pill to isolate that quarter."}
      </p>
    </ChartCardShell>
  );
}
