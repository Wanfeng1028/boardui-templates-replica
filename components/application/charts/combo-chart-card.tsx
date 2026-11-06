"use client";

import { useState } from "react";
import { Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartCardShell, ChartHeadline } from "./card-shell";

/**
 * Combo Chart Card (replica).
 *
 * Bar + line combo on independent left / right axes: signups as bars,
 * conversion as a line. Hovering dims the bars and the active point pulses.
 */

const DATA = [
  { label: "Jan", signups: 1820, conversion: 3.1 },
  { label: "Feb", signups: 2140, conversion: 3.4 },
  { label: "Mar", signups: 1980, conversion: 3.2 },
  { label: "Apr", signups: 2460, conversion: 3.8 },
  { label: "May", signups: 2310, conversion: 3.6 },
  { label: "Jun", signups: 2790, conversion: 4.1 },
  { label: "Jul", signups: 3120, conversion: 4.4 },
  { label: "Aug", signups: 2980, conversion: 4.2 },
  { label: "Sep", signups: 3340, conversion: 4.7 },
  { label: "Oct", signups: 3610, conversion: 4.9 },
  { label: "Nov", signups: 3420, conversion: 4.6 },
  { label: "Dec", signups: 3890, conversion: 5.2 },
];

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function PulseDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill="var(--color-chart-3-active)"
        opacity={0.35}
        className="animate-ping"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle cx={cx} cy={cy} r={5} fill="var(--color-chart-3-active)" stroke="var(--color-background-secondary-default)" strokeWidth={2} />
    </g>
  );
}

export function ComboChartCard({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hovering = activeIndex !== null && activeIndex < DATA.length;
  const point = hovering ? DATA[activeIndex] : null;
  const totalSignups = DATA.reduce((s, d) => s + d.signups, 0);

  return (
    <ChartCardShell
      title="Signups & conversion"
      subtitle="Bars on the left axis, conversion line on the right"
      className={className}
    >
      <ChartHeadline
        label={point ? MONTHS_FULL[DATA.indexOf(point)] : "Total signups · 2026"}
        value={point ? `${point.signups.toLocaleString("en-US")} signups` : totalSignups.toLocaleString("en-US")}
        sub={point ? `Conversion ${point.conversion}% that month` : "Average conversion 4.1%"}
      />
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={DATA}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="32%"
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <YAxis
              yAxisId="signups"
              width={40}
              domain={[0, 4400]}
              tickCount={4}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              yAxisId="conversion"
              orientation="right"
              width={36}
              domain={[0, 6]}
              tickCount={4}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} interval="preserveStartEnd" tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
            <Tooltip content={() => null} cursor={{ fill: "var(--color-chart-track)", opacity: 0.4 }} />
            <Bar yAxisId="signups" dataKey="signups" radius={[5, 5, 0, 0]} isAnimationActive animationDuration={450}>
              {DATA.map((d, i) => (
                <Cell
                  key={d.label}
                  fill="var(--color-chart-4)"
                  fillOpacity={activeIndex === null || activeIndex === i ? 0.9 : 0.3}
                />
              ))}
            </Bar>
            <Line
              yAxisId="conversion"
              type="monotone"
              dataKey="conversion"
              stroke="var(--color-chart-3-active)"
              strokeWidth={2.5}
              dot={false}
              activeDot={<PulseDot />}
              isAnimationActive
              animationDuration={450}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <dl className="flex items-center gap-4 text-body-2-medium text-text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-4" aria-hidden />
          <dt>Signups (left)</dt>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-3-active" aria-hidden />
          <dt>Conversion % (right)</dt>
        </div>
      </dl>
    </ChartCardShell>
  );
}
