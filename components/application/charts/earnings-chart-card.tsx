"use client";

import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Chip } from "@/components/base/badges/chip";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { useCountUp } from "@/hooks/use-count-up";

import { ChartCardShell, ChartHeadline } from "./card-shell";

/**
 * Earnings Chart Card (replica).
 *
 * Bar chart card with a Week / Month / Year period switch, a count-up
 * headline that follows the hovered bar, and a hover outline: the hovered
 * bar takes the active fill while the rest dim.
 */

type Period = "week" | "month" | "year";

const DATA: Record<Period, { label: string; value: number }[]> = {
  week: [
    { label: "Mon", value: 1840 },
    { label: "Tue", value: 2310 },
    { label: "Wed", value: 1980 },
    { label: "Thu", value: 2760 },
    { label: "Fri", value: 3240 },
    { label: "Sat", value: 4120 },
    { label: "Sun", value: 3580 },
  ],
  month: [
    { label: "Jan", value: 9840 },
    { label: "Feb", value: 10120 },
    { label: "Mar", value: 11380 },
    { label: "Apr", value: 10960 },
    { label: "May", value: 12210 },
    { label: "Jun", value: 12740 },
    { label: "Jul", value: 13980 },
    { label: "Aug", value: 13120 },
    { label: "Sep", value: 14210 },
    { label: "Oct", value: 14690 },
    { label: "Nov", value: 14360 },
    { label: "Dec", value: 14700 },
  ],
  year: [
    { label: "2022", value: 86400 },
    { label: "2023", value: 112300 },
    { label: "2024", value: 148900 },
    { label: "2025", value: 183200 },
    { label: "2026", value: 214600 },
  ],
};

const PERIOD_LABEL: Record<Period, string> = { week: "This week", month: "This year", year: "All time" };

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
const fmtK = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

export function EarningsChartCard({ className }: { className?: string }) {
  const [period, setPeriod] = useState<Period>("month");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = DATA[period];
  const total = data.reduce((s, d) => s + d.value, 0);
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;
  const headline = point ? point.value : total;
  const display = useCountUp(headline);
  const prevTotal = period === "month" ? 138400 : period === "week" ? 16200 : 148900;
  const delta = Math.round(((headline - (point ? prevTotal / data.length : prevTotal)) / (point ? prevTotal / data.length : prevTotal)) * 1000) / 10;
  const yMax = Math.max(...data.map((d) => d.value));

  return (
    <ChartCardShell
      title="Earnings"
      subtitle="Revenue per period — hover a bar to inspect it"
      className={className}
      actions={
        <SegmentedControl
          aria-label="Period"
          selectedKeys={new Set([period])}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0];
            if (next === "week" || next === "month" || next === "year") setPeriod(next);
          }}
        >
          <SegmentedControlItem id="week">Week</SegmentedControlItem>
          <SegmentedControlItem id="month">Month</SegmentedControlItem>
          <SegmentedControlItem id="year">Year</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      <ChartHeadline
        label={point ? point.label : PERIOD_LABEL[period]}
        value={fmt(display)}
        sub={point ? `of ${fmt(total)} total` : `${fmt(prevTotal)} previous period`}
        right={<Chip variant="bold" color={delta >= 0 ? "lime" : "rose"}>{`${delta >= 0 ? "+" : ""}${delta}%`}</Chip>}
      />
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="30%"
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <YAxis
              width={44}
              domain={[0, yMax * 1.15]}
              tickCount={4}
              tickFormatter={fmtK}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveStartEnd"
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <Tooltip content={() => null} cursor={{ fill: "var(--color-chart-track)", opacity: 0.5 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={450}>
              {data.map((d, i) => (
                <Cell
                  key={d.label}
                  fill={activeIndex === null || activeIndex === i ? "var(--color-chart-1-active)" : "var(--color-chart-1)"}
                  fillOpacity={activeIndex === null || activeIndex === i ? 1 : 0.45}
                  stroke={activeIndex === i ? "var(--color-chart-1-active)" : "transparent"}
                  strokeWidth={activeIndex === i ? 1.5 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCardShell>
  );
}
