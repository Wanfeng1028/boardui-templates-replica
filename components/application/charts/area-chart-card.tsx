"use client";

import { useId, useState } from "react";
import { RiArrowDownSLine, RiCalendarLine, RiCheckLine } from "@remixicon/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Chip } from "@/components/base/badges/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Area Chart Card (Pro replica) — rebuilt from the original page's client
 * chunk (boardui.com/components/area-chart-card, 2a_q-5jutxozw.js):
 * stacked / overlap / percent variants, curved / sharp shapes, a count-up
 * headline that swaps to the hovered category's total, three built-in demo
 * periods (This year / Last 6 months / Last year), legend or stat tiles.
 */

export type AreaChartRow = { label: string; [key: string]: number | string };

export type AreaChartSeriesDef = {
  key: string;
  label: string;
  color?: string;
  activeColor?: string;
};

export type AreaChartRange = {
  id: string;
  label: string;
  data?: AreaChartRow[];
  series?: AreaChartSeriesDef[];
  headline?: number;
  delta?: number;
};

export type AreaChartCardProps = {
  variant?: "stacked" | "overlap" | "percent";
  shape?: "curved" | "sharp";
  title?: string;
  data?: AreaChartRow[];
  series?: AreaChartSeriesDef[];
  headline?: number;
  delta?: number;
  range?: string;
  ranges?: AreaChartRange[];
  defaultRange?: string;
  onRangeChange?: (id: string) => void;
  format?: (value: number) => string;
  tiles?: boolean;
  className?: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const buildRows = (organic: number[], referral: number[], paid: number[]): AreaChartRow[] =>
  organic.map((value, i) => ({
    label: MONTHS[i],
    organic: value,
    referral: referral[i],
    paid: paid[i],
  }));

const DEMO_SERIES: AreaChartSeriesDef[] = [
  { key: "organic", label: "Organic" },
  { key: "referral", label: "Referral" },
  { key: "paid", label: "Paid" },
];

const DEMO_DATA = buildRows(
  [2400, 2800, 3200, 3000, 3600, 4200, 4600, 4400, 5100, 5600, 5400, 6200],
  [1200, 1400, 1300, 1700, 1900, 1800, 2200, 2500, 2400, 2900, 3200, 3400],
  [800, 700, 1100, 900, 1300, 1500, 1400, 1800, 2000, 1900, 2300, 2600],
);

const DEMO_RANGES: AreaChartRange[] = [
  { id: "year", label: "This year", data: DEMO_DATA, delta: 0.082 },
  {
    id: "h2",
    label: "Last 6 months",
    data: buildRows(
      [4600, 4400, 5100, 5600, 5400, 6200],
      [2200, 2500, 2400, 2900, 3200, 3400],
      [1400, 1800, 2000, 1900, 2300, 2600],
    ).map((row, i) => ({ ...row, label: MONTHS[i + 6] })),
    delta: 0.114,
  },
  {
    id: "prev",
    label: "Last year",
    data: buildRows(
      [1900, 2100, 2000, 2400, 2600, 2500, 3100, 3000, 3400, 3800, 3600, 4100],
      [900, 1100, 1000, 1300, 1200, 1500, 1600, 1800, 1700, 2100, 2300, 2200],
      [600, 500, 800, 700, 900, 1100, 1000, 1200, 1400, 1300, 1600, 1800],
    ),
    delta: -0.036,
  },
];

const TONE_ORDER = [2, 6, 5, 3, 8, 7, 4, 1];

const formatNumber = (value: number) => value.toLocaleString("en-US");

/** Axis formatter: 2400 -> "2.4K", 6200 -> "6.2K", 800 -> "800". */
const formatK = (value: number) =>
  value >= 1000 ? `${Math.round(value / 100) / 10}K`.replace(".0K", "K") : String(Math.round(value));

function describeDelta(delta: number): { label: string; color: "lime" | "rose" | "neutral" } {
  const pct = Math.round(1000 * Math.abs(delta)) / 10;
  if (pct === 0) return { label: "0.0%", color: "neutral" };
  return { label: `${delta > 0 ? "+" : "-"}${pct}%`, color: delta > 0 ? "lime" : "rose" };
}

function resolveTone(index: number, color?: string, activeColor?: string) {
  if (color) return { color, activeColor: activeColor ?? `color-mix(in srgb, ${color} 82%, black)` };
  const n = TONE_ORDER[index % TONE_ORDER.length];
  return { color: `var(--color-chart-${n})`, activeColor: `var(--color-chart-${n}-active)` };
}

function useChartRange(
  ranges: AreaChartRange[] | undefined,
  defaultRange: string | undefined,
  onRangeChange: ((id: string) => void) | undefined,
) {
  const [selectedId, setSelectedId] = useState<string | undefined>(defaultRange);
  const selected = ranges?.find((range) => range.id === selectedId) ?? ranges?.[0];
  return {
    selected,
    selectedId: selected?.id,
    select: (id: string) => {
      setSelectedId(id);
      onRangeChange?.(id);
    },
  };
}

const PILL_CLASS =
  "flex h-8 shrink-0 items-center gap-1.5 rounded-2lg border border-border-button-default bg-background-primary-default pe-2.5 ps-2 shadow-xs";

function RangePill({ label }: { label: string }) {
  return (
    <div className={PILL_CLASS}>
      <RiCalendarLine className="size-4 shrink-0 text-text-secondary" aria-hidden />
      <span className="text-body-medium whitespace-nowrap text-text-primary">{label}</span>
    </div>
  );
}

function RangeDropdown({
  ranges,
  value,
  onChange,
}: {
  ranges: AreaChartRange[];
  value: string | undefined;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = ranges.find((range) => range.id === value) ?? ranges[0];
  return (
    <Dropdown isOpen={open} onOpenChange={setOpen}>
      <DropdownTrigger
        aria-label="Change period"
        className={cx(PILL_CLASS, "pe-1.5 transition-colors duration-150 ease-out hover:bg-background-primary-hover")}
      >
        <RiCalendarLine className="size-4 shrink-0 text-text-secondary" aria-hidden />
        <span className="text-body-medium whitespace-nowrap text-text-primary">{current?.label}</span>
        <RiArrowDownSLine
          className={cx(
            "size-4 shrink-0 text-text-secondary transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </DropdownTrigger>
      <DropdownPopover aria-label="Period" placement="bottom end" className="w-[188px] p-2" dialogClassName="gap-1">
        {ranges.map((range) => {
          const selected = range.id === current?.id;
          return (
            <DropdownItem
              key={range.id}
              selected={selected}
              className="px-2 py-1.5"
              onSelect={() => {
                onChange(range.id);
                setOpen(false);
              }}
            >
              <span className="flex-1 text-body-medium">{range.label}</span>
              {selected && <RiCheckLine className="size-4 shrink-0 text-text-secondary" aria-hidden />}
            </DropdownItem>
          );
        })}
      </DropdownPopover>
    </Dropdown>
  );
}

function ChartHeader({
  label,
  value,
  format,
  delta,
  hovering,
  range,
  ranges,
  rangeId,
  onRangeChange,
}: {
  label: string;
  value: number;
  format: (value: number) => string;
  delta?: { label: string; color: "lime" | "rose" | "neutral" };
  hovering: boolean;
  range?: string;
  ranges?: AreaChartRange[];
  rangeId?: string;
  onRangeChange: (id: string) => void;
}) {
  const display = useCountUp(value);
  return (
    <div className="flex w-full items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="w-full truncate text-body-medium text-text-secondary">{label}</p>
        <div className="flex w-full items-center gap-2">
          <p className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
            {format(display)}
          </p>
          {delta && (
            <Chip variant="bold" color={delta.color} className={hovering ? "invisible" : undefined}>
              {delta.label}
            </Chip>
          )}
        </div>
      </div>
      {ranges && ranges.length > 0 ? (
        <RangeDropdown ranges={ranges} value={rangeId} onChange={onRangeChange} />
      ) : range ? (
        <RangePill label={range} />
      ) : null}
    </div>
  );
}

type LegendItem = { label: string; color: string; value?: string };

function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <div className={cx("flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: item.color }} />
          <span className="text-body-regular whitespace-nowrap text-text-secondary">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

type TileItem = { label: string; color: string; activeColor: string; value: string };

function ChartStatTiles({ items, className }: { items: TileItem[]; className?: string }) {
  const remainder = items.length % 3;
  const odd = items.length % 2 === 1;
  const spanFor = (index: number) => {
    const lastRow = remainder > 0 && index >= items.length - remainder;
    return lastRow ? 6 / remainder : 2;
  };
  return (
    <div className={cx("-mx-2 -mb-1 grid grid-cols-2 gap-2 sm:grid-cols-6", className)}>
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={cx(
            "flex min-w-0 flex-col items-start gap-px rounded-2lg bg-background-inner-default px-2.5 py-2",
            odd && index === items.length - 1 ? "col-span-2" : "col-span-1",
            spanFor(index) === 2 ? "sm:col-span-2" : spanFor(index) === 3 ? "sm:col-span-3" : "sm:col-span-6",
          )}
        >
          <div className="flex min-w-0 max-w-full items-center gap-1.5">
            <span
              className="size-3 shrink-0 rounded-[4px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-body-regular text-text-secondary">{item.label}</span>
          </div>
          <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AreaChartCard({
  variant = "stacked",
  shape = "curved",
  title = "Visitors",
  data,
  series,
  headline,
  delta,
  range,
  ranges,
  defaultRange,
  onRangeChange,
  format = formatNumber,
  tiles = false,
  className,
}: AreaChartCardProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = useId();

  const hasExplicitSource = ranges !== undefined || range !== undefined || data !== undefined;
  const resolvedRanges = ranges ?? (hasExplicitSource ? undefined : DEMO_RANGES);
  const { selected, selectedId, select } = useChartRange(resolvedRanges, defaultRange, onRangeChange);

  const rows = selected?.data ?? data ?? DEMO_DATA;
  const resolvedSeries = selected?.series ?? series ?? DEMO_SERIES;
  const resolvedHeadline = selected?.headline ?? headline;
  const resolvedDelta = selected?.delta ?? delta;
  const tones = resolvedSeries.map((s, i) => resolveTone(i, s.color, s.activeColor));

  const valueAt = (key: string, index: number) => Number(rows[index]?.[key] ?? 0);
  const totalOf = (key: string) => rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);
  const hovering = activeIndex !== null && activeIndex < rows.length;
  const grandTotal = resolvedSeries.reduce((sum, s) => sum + totalOf(s.key), 0);
  const restingHeadline =
    resolvedHeadline ?? (variant === "overlap" ? totalOf(resolvedSeries[0].key) : grandTotal);
  const hoverTotal = hovering
    ? variant === "overlap"
      ? valueAt(resolvedSeries[0].key, activeIndex)
      : resolvedSeries.reduce((sum, s) => sum + valueAt(s.key, activeIndex), 0)
    : 0;
  const displayValue = hovering ? hoverTotal : restingHeadline;
  const label = hovering ? String(rows[activeIndex].label) : title;

  const percent = variant === "percent";
  const curve = shape === "sharp" ? "linear" : "monotone";
  const stackId = variant === "overlap" ? undefined : "total";

  const legendItems: LegendItem[] = resolvedSeries.map((s, i) => ({
    label: s.label,
    color: tones[i].color,
    value: format(hovering ? valueAt(s.key, activeIndex) : totalOf(s.key)),
  }));
  const tileItems: TileItem[] = resolvedSeries.map((s, i) => ({
    label: s.label,
    color: tones[i].color,
    activeColor: tones[i].activeColor,
    value: format(hovering ? valueAt(s.key, activeIndex) : totalOf(s.key)),
  }));

  return (
    <section
      className={cx(
        "flex h-[329px] w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        tiles && "h-auto",
        className,
      )}
    >
      <ChartHeader
        label={label}
        value={displayValue}
        format={format}
        delta={resolvedDelta !== undefined ? describeDelta(resolvedDelta) : undefined}
        hovering={hovering}
        range={range}
        ranges={resolvedRanges}
        rangeId={selectedId}
        onRangeChange={(id) => {
          setActiveIndex(null);
          select(id);
        }}
      />
      <div className={cx("min-h-0 w-full flex-1", tiles && "h-[196px] flex-none")}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={rows}
            stackOffset={percent ? "expand" : "none"}
            margin={{ top: 4, right: 6, bottom: 0, left: 0 }}
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isInteger(index)) setActiveIndex(index);
              else setActiveIndex(null);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              {resolvedSeries.map((s, i) => (
                <linearGradient key={s.key} id={`${gradientId}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tones[i].color} stopOpacity={variant === "overlap" ? 0.4 : 0.55} />
                  <stop offset="100%" stopColor={tones[i].color} stopOpacity={0.04} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-chart-track)" strokeDasharray="4 4" />
            <YAxis
              width={44}
              domain={percent ? [0, 1] : undefined}
              ticks={percent ? [0, 0.25, 0.5, 0.75, 1] : undefined}
              tickCount={4}
              tickFormatter={percent ? (v: number) => `${Math.round(100 * v)}%` : formatK}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval="preserveStartEnd"
              tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }}
            />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            {resolvedSeries.map((s, i) => (
              <Area
                key={s.key}
                type={curve}
                dataKey={s.key}
                name={s.label}
                stackId={stackId}
                stroke={tones[i].activeColor}
                strokeWidth={2}
                fill={`url(#${gradientId}-${i})`}
                isAnimationActive
                animationDuration={450}
                activeDot={{
                  r: 4,
                  fill: tones[i].activeColor,
                  stroke: "var(--color-background-secondary-default)",
                  strokeWidth: 2,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!tiles && <ChartLegend items={legendItems} className="pb-1" />}
      {tiles && <ChartStatTiles items={tileItems} />}
    </section>
  );
}
