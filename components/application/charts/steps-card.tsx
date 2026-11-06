"use client";

import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

import { ChartCardShell, ChartHeadline } from "./card-shell";

/**
 * Steps Card (replica).
 *
 * Weekly step bars with a week switcher (previous / next week), a count-up
 * headline for the week total, and a hover outline on the active bar.
 */

const WEEKS: { label: string; days: { label: string; value: number }[] }[] = [
  {
    label: "Oct 20 – 26",
    days: [
      { label: "Mon", value: 8420 },
      { label: "Tue", value: 10380 },
      { label: "Wed", value: 9120 },
      { label: "Thu", value: 11840 },
      { label: "Fri", value: 12610 },
      { label: "Sat", value: 15420 },
      { label: "Sun", value: 9870 },
    ],
  },
  {
    label: "Oct 27 – Nov 2",
    days: [
      { label: "Mon", value: 9210 },
      { label: "Tue", value: 11040 },
      { label: "Wed", value: 8940 },
      { label: "Thu", value: 13210 },
      { label: "Fri", value: 11980 },
      { label: "Sat", value: 16830 },
      { label: "Sun", value: 10460 },
    ],
  },
  {
    label: "Nov 3 – 9",
    days: [
      { label: "Mon", value: 7840 },
      { label: "Tue", value: 9620 },
      { label: "Wed", value: 10530 },
      { label: "Thu", value: 12890 },
      { label: "Fri", value: 14120 },
      { label: "Sat", value: 17240 },
      { label: "Sun", value: 11310 },
    ],
  },
];

const GOAL = 10000;

export function StepsCard({ className }: { className?: string }) {
  const [weekIndex, setWeekIndex] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const week = WEEKS[weekIndex];
  const total = week.days.reduce((s, d) => s + d.value, 0);
  const hovering = activeIndex !== null && activeIndex < week.days.length;
  const point = hovering ? week.days[activeIndex] : null;
  const display = useCountUp(point ? point.value : total);
  const avg = Math.round(total / 7);
  const goalDays = week.days.filter((d) => d.value >= GOAL).length;

  return (
    <ChartCardShell
      title="Steps"
      subtitle="Daily steps against a 10,000-step goal"
      className={className}
      actions={
        <div className="flex items-center gap-1" role="group" aria-label="Switch week">
          <button
            type="button"
            aria-label="Previous week"
            disabled={weekIndex === 0}
            onClick={() => { setWeekIndex((i) => Math.max(0, i - 1)); setActiveIndex(null); }}
            className="flex size-8 items-center justify-center rounded-full border border-border-button-default text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-40"
          >
            <RiArrowLeftSLine className="size-4" aria-hidden />
          </button>
          <span className="min-w-24 px-1 text-center text-body-2-medium text-text-secondary tabular-nums">{week.label}</span>
          <button
            type="button"
            aria-label="Next week"
            disabled={weekIndex === WEEKS.length - 1}
            onClick={() => { setWeekIndex((i) => Math.min(WEEKS.length - 1, i + 1)); setActiveIndex(null); }}
            className="flex size-8 items-center justify-center rounded-full border border-border-button-default text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-40"
          >
            <RiArrowRightSLine className="size-4" aria-hidden />
          </button>
        </div>
      }
    >
      <ChartHeadline
        label={point ? `${point.label} · ${week.label}` : `Week total · ${week.label}`}
        value={display.toLocaleString("en-US")}
        sub={point ? `${point.value >= GOAL ? "Goal reached" : `${(GOAL - point.value).toLocaleString("en-US")} short of goal`} · avg ${avg.toLocaleString("en-US")}/day` : `${avg.toLocaleString("en-US")} avg / day · goal reached ${goalDays} of 7 days`}
      />
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={week.days}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="30%"
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <YAxis
              width={40}
              domain={[0, 20000]}
              tickCount={4}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
            <Tooltip content={() => null} cursor={{ fill: "var(--color-chart-track)", opacity: 0.5 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={450}>
              {week.days.map((d, i) => (
                <Cell
                  key={d.label}
                  fill={d.value >= GOAL ? "var(--color-chart-1-active)" : "var(--color-chart-1)"}
                  fillOpacity={activeIndex === null || activeIndex === i ? 1 : 0.45}
                  stroke={activeIndex === i ? "var(--color-chart-1-active)" : "transparent"}
                  strokeWidth={activeIndex === i ? 1.5 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className={cx("text-body-2-regular", "text-text-tertiary")}>
        Teal bars hit the 10,000-step goal; lighter bars fell short.
      </p>
    </ChartCardShell>
  );
}
