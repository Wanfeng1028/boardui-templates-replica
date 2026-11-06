"use client";

import { useId, useState } from "react";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Chip } from "@/components/base/badges/chip";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { useCountUp } from "@/hooks/use-count-up";

import { ChartCardShell, ChartHeadline } from "./card-shell";

/**
 * Line Chart Card (replica).
 *
 * Line / area chart card with a gradient fill, a curve-vs-polyline
 * interpolation switch, and an animated active dot that follows the hovered
 * point while the headline counts up to that point's value.
 */

type Curve = "monotone" | "linear" | "step";

const DATA = [
  { label: "Jan", current: 42, previous: 38 },
  { label: "Feb", current: 47, previous: 40 },
  { label: "Mar", current: 45, previous: 44 },
  { label: "Apr", current: 58, previous: 46 },
  { label: "May", current: 54, previous: 49 },
  { label: "Jun", current: 66, previous: 52 },
  { label: "Jul", current: 71, previous: 55 },
  { label: "Aug", current: 68, previous: 58 },
  { label: "Sep", current: 79, previous: 61 },
  { label: "Oct", current: 84, previous: 63 },
  { label: "Nov", current: 81, previous: 66 },
  { label: "Dec", current: 92, previous: 70 },
];

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ActiveDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="var(--color-chart-4-active)" opacity={0.22} />
      <circle cx={cx} cy={cy} r={5} fill="var(--color-chart-4-active)" stroke="var(--color-background-secondary-default)" strokeWidth={2} />
    </g>
  );
}

export function LineChartCard({ className }: { className?: string }) {
  const [curve, setCurve] = useState<Curve>("monotone");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = useId();

  const hovering = activeIndex !== null && activeIndex < DATA.length;
  const point = hovering ? DATA[activeIndex] : null;
  const headline = point ? point.current : DATA[DATA.length - 1].current;
  const display = useCountUp(headline);
  const comparison = point ? point.previous : DATA[DATA.length - 1].previous;
  const delta = Math.round(((headline - comparison) / comparison) * 1000) / 10;

  return (
    <ChartCardShell
      title="Active users"
      subtitle="Daily actives vs last year — switch the line interpolation"
      className={className}
      actions={
        <SegmentedControl
          aria-label="Interpolation"
          selectedKeys={new Set([curve])}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0];
            if (next === "monotone" || next === "linear" || next === "step") setCurve(next);
          }}
        >
          <SegmentedControlItem id="monotone">Curve</SegmentedControlItem>
          <SegmentedControlItem id="linear">Line</SegmentedControlItem>
          <SegmentedControlItem id="step">Step</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      <ChartHeadline
        label={point ? MONTHS_FULL[DATA.indexOf(point)] : "December · latest"}
        value={`${display.toLocaleString("en-US")}k`}
        sub={`${comparison}k same month last year`}
        right={<Chip variant="bold" color={delta >= 0 ? "lime" : "rose"}>{`${delta >= 0 ? "+" : ""}${delta}%`}</Chip>}
      />
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={DATA}
            margin={{ top: 8, right: 6, bottom: 0, left: 0 }}
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis
              width={36}
              domain={[0, 110]}
              tickCount={5}
              tickFormatter={(v: number) => `${v}k`}
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
            <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Line type={curve} dataKey="previous" stroke="var(--color-chart-neutral)" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} isAnimationActive animationDuration={450} />
            <Area type={curve} dataKey="current" stroke="none" fill={`url(#${gradientId})`} isAnimationActive animationDuration={450} />
            <Line type={curve} dataKey="current" stroke="var(--color-chart-4-active)" strokeWidth={2.5} dot={false} activeDot={<ActiveDot />} isAnimationActive animationDuration={450} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <dl className="flex items-center gap-4 text-body-2-medium text-text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-4-active" aria-hidden />
          <dt>This year</dt>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-neutral" aria-hidden />
          <dt>Last year</dt>
        </div>
      </dl>
    </ChartCardShell>
  );
}
