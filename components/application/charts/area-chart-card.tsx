"use client";

import { useId, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Area Chart Card (replica).
 *
 * Multi-series area chart with Stacked / Overlapping / 100% variants, a
 * gradient fill per series, a period switch, and stat tiles — hovering a
 * tile highlights its series and dims the others.
 */

type Variant = "stacked" | "overlap" | "percent";
type Period = "6m" | "12m";

const FULL = [
  { label: "Jan", web: 42, mobile: 28, api: 12 },
  { label: "Feb", web: 45, mobile: 31, api: 14 },
  { label: "Mar", web: 51, mobile: 29, api: 16 },
  { label: "Apr", web: 48, mobile: 35, api: 15 },
  { label: "May", web: 56, mobile: 38, api: 19 },
  { label: "Jun", web: 61, mobile: 41, api: 21 },
  { label: "Jul", web: 58, mobile: 44, api: 23 },
  { label: "Aug", web: 66, mobile: 47, api: 25 },
  { label: "Sep", web: 71, mobile: 52, api: 27 },
  { label: "Oct", web: 68, mobile: 49, api: 26 },
  { label: "Nov", web: 74, mobile: 55, api: 30 },
  { label: "Dec", web: 79, mobile: 58, api: 32 },
];

const SERIES = [
  { key: "web", label: "Web", color: "var(--color-chart-4)", dot: "bg-chart-4-active" },
  { key: "mobile", label: "Mobile", color: "var(--color-chart-1)", dot: "bg-chart-1-active" },
  { key: "api", label: "API", color: "var(--color-chart-3)", dot: "bg-chart-3-active" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

export function AreaChartCard({ className }: { className?: string }) {
  const [variant, setVariant] = useState<Variant>("stacked");
  const [period, setPeriod] = useState<Period>("12m");
  const [hoverSeries, setHoverSeries] = useState<SeriesKey | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = useId();

  const data = period === "6m" ? FULL.slice(6) : FULL;
  const totals = SERIES.map((s) => ({
    ...s,
    total: data.reduce((sum, d) => sum + d[s.key], 0),
  }));
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;
  const yMax = Math.max(...data.map((d) => d.web + d.mobile + d.api));

  return (
    <ChartCardShell
      title="Requests by surface"
      subtitle="Web, mobile and API traffic — stacked, overlapping or 100%"
      className={className}
      actions={
        <>
          <SegmentedControl
            aria-label="Period"
            selectedKeys={new Set([period])}
            onSelectionChange={(keys) => {
              const next = [...(keys as Set<string>)][0];
              if (next === "6m" || next === "12m") setPeriod(next);
            }}
          >
            <SegmentedControlItem id="6m">6M</SegmentedControlItem>
            <SegmentedControlItem id="12m">12M</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl
            aria-label="Area variant"
            selectedKeys={new Set([variant])}
            onSelectionChange={(keys) => {
              const next = [...(keys as Set<string>)][0];
              if (next === "stacked" || next === "overlap" || next === "percent") setVariant(next);
            }}
          >
            <SegmentedControlItem id="stacked">Stacked</SegmentedControlItem>
            <SegmentedControlItem id="overlap">Overlap</SegmentedControlItem>
            <SegmentedControlItem id="percent">100%</SegmentedControlItem>
          </SegmentedControl>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {totals.map((s) => (
          <button
            key={s.key}
            type="button"
            onMouseEnter={() => setHoverSeries(s.key)}
            onMouseLeave={() => setHoverSeries(null)}
            onFocus={() => setHoverSeries(s.key)}
            onBlur={() => setHoverSeries(null)}
            className={cx(
              "rounded-xl border border-border-button-default px-3 py-2 text-start outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              hoverSeries !== null && hoverSeries !== s.key ? "opacity-45" : "opacity-100",
            )}
            aria-label={`${s.label}: ${s.total}k requests in period`}
          >
            <span className="flex items-center gap-1.5 text-body-2-medium text-text-secondary">
              <span className={cx("size-2 rounded-full", s.dot)} aria-hidden />
              {s.label}
            </span>
            <span className="mt-0.5 block text-title-3-semibold text-text-primary tabular-nums">{s.total}k</span>
          </button>
        ))}
      </div>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 6, bottom: 0, left: 0 }}
            stackOffset={variant === "percent" ? "expand" : "none"}
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`${gradientId}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <YAxis
              width={40}
              domain={variant === "percent" ? [0, 1] : [0, variant === "stacked" ? yMax * 1.1 : 100]}
              tickCount={4}
              tickFormatter={(v: number) => (variant === "percent" ? `${Math.round(v * 100)}%` : `${Math.round(v)}k`)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} interval="preserveStartEnd" tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
            <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            {SERIES.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stackId={variant === "overlap" ? undefined : "total"}
                stroke={s.color}
                strokeWidth={2}
                strokeOpacity={hoverSeries === null || hoverSeries === s.key ? 1 : 0.25}
                fill={`url(#${gradientId}-${s.key})`}
                fillOpacity={hoverSeries === null || hoverSeries === s.key ? 1 : 0.15}
                dot={false}
                activeDot={false}
                isAnimationActive
                animationDuration={450}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        {point
          ? `${point.label}: Web ${point.web}k · Mobile ${point.mobile}k · API ${point.api}k.`
          : "Hover the chart to read a month, or a stat tile to highlight a series."}
      </p>
    </ChartCardShell>
  );
}
