"use client";

import { useState } from "react";
import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Scatter Chart Card (replica).
 *
 * Scatter / bubble chart with grouped series, an optional size metric
 * (bubble size by deal value, or uniform dots), hover isolation of a group,
 * and stat tiles per group.
 */

type GroupKey = "startup" | "growth" | "enterprise";

const GROUPS: { key: GroupKey; label: string; color: string; dot: string }[] = [
  { key: "startup", label: "Startup", color: "var(--color-chart-4)", dot: "bg-chart-4" },
  { key: "growth", label: "Growth", color: "var(--color-chart-1)", dot: "bg-chart-1" },
  { key: "enterprise", label: "Enterprise", color: "var(--color-chart-3)", dot: "bg-chart-3" },
];

const POINTS: Record<GroupKey, { x: number; y: number; z: number }[]> = {
  startup: [
    { x: 12, y: 18, z: 120 }, { x: 18, y: 26, z: 180 }, { x: 24, y: 22, z: 150 },
    { x: 30, y: 34, z: 220 }, { x: 38, y: 31, z: 260 }, { x: 44, y: 42, z: 310 },
  ],
  growth: [
    { x: 48, y: 52, z: 420 }, { x: 56, y: 47, z: 380 }, { x: 62, y: 61, z: 540 },
    { x: 70, y: 58, z: 610 }, { x: 78, y: 69, z: 720 }, { x: 84, y: 74, z: 800 },
  ],
  enterprise: [
    { x: 88, y: 82, z: 1200 }, { x: 96, y: 90, z: 1500 }, { x: 104, y: 86, z: 1350 },
    { x: 112, y: 95, z: 1800 }, { x: 120, y: 101, z: 2100 },
  ],
};

export function ScatterChartCard({ className }: { className?: string }) {
  const [sized, setSized] = useState(true);
  const [hoverGroup, setHoverGroup] = useState<GroupKey | null>(null);
  const [active, setActive] = useState<{ group: GroupKey; x: number; y: number; z: number } | null>(null);

  return (
    <ChartCardShell
      title="Deal size vs close rate"
      subtitle="Each dot is a segment — size by deal value, or uniform"
      className={className}
      actions={
        <SegmentedControl
          aria-label="Bubble size"
          selectedKeys={new Set([sized ? "sized" : "uniform"])}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0];
            if (next === "sized" || next === "uniform") setSized(next === "sized");
          }}
        >
          <SegmentedControlItem id="sized">Sized</SegmentedControlItem>
          <SegmentedControlItem id="uniform">Uniform</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {GROUPS.map((g) => {
          const pts = POINTS[g.key];
          const avgY = Math.round(pts.reduce((s, p) => s + p.y, 0) / pts.length);
          const totalZ = pts.reduce((s, p) => s + p.z, 0);
          return (
            <button
              key={g.key}
              type="button"
              onMouseEnter={() => setHoverGroup(g.key)}
              onMouseLeave={() => setHoverGroup(null)}
              onFocus={() => setHoverGroup(g.key)}
              onBlur={() => setHoverGroup(null)}
              className={cx(
                "rounded-xl border border-border-button-default px-3 py-2 text-start outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                hoverGroup !== null && hoverGroup !== g.key ? "opacity-45" : "opacity-100",
              )}
              aria-label={`${g.label}: ${pts.length} segments, average close rate ${avgY} percent`}
            >
              <span className="flex items-center gap-1.5 text-body-2-medium text-text-secondary">
                <span className={cx("size-2 rounded-full", g.dot)} aria-hidden />
                {g.label}
              </span>
              <span className="mt-0.5 block text-title-3-semibold text-text-primary tabular-nums">{avgY}%</span>
              <span className="block text-body-2-regular text-text-tertiary tabular-nums">${totalZ}k pipeline</span>
            </button>
          );
        })}
      </div>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Spend"
              unit="k"
              domain={[0, 130]}
              tickCount={6}
              tickFormatter={(v: number) => `$${v}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Close rate"
              unit="%"
              domain={[0, 110]}
              tickCount={5}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <ZAxis type="number" dataKey="z" range={sized ? [60, 420] : [90, 90]} name="Deal value" />
            <Tooltip
              cursor={{ strokeDasharray: "4 4" }}
              content={({ active: isActive, payload }) => {
                if (!isActive || !payload?.length) return null;
                const p = payload[0]?.payload as { x?: number; y?: number; z?: number } | undefined;
                return (
                  <div className="rounded-xl border border-border-button-default bg-background-secondary-default px-3 py-2 text-body-2-medium text-text-primary shadow-lg">
                    Spend ${p?.x}k · Close {p?.y}% · Value ${p?.z}k
                  </div>
                );
              }}
            />
            {GROUPS.map((g) => (
              <Scatter
                key={g.key}
                name={g.label}
                data={POINTS[g.key]}
                fill={g.color}
                fillOpacity={hoverGroup === null || hoverGroup === g.key ? 0.85 : 0.15}
                onMouseEnter={() => setHoverGroup(g.key)}
                onMouseLeave={() => setHoverGroup(null)}
                onClick={(data) => {
                  const p = data as unknown as { payload?: { x: number; y: number; z: number } };
                  if (p.payload) setActive({ group: g.key, ...p.payload });
                }}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        {active
          ? `${GROUPS.find((g) => g.key === active.group)?.label} segment: $${active.x}k spend, ${active.y}% close rate, $${active.z}k deal value — click a dot to pin it here.`
          : "Hover a tile or a group to isolate it; click a dot to pin its numbers here."}
      </p>
    </ChartCardShell>
  );
}
