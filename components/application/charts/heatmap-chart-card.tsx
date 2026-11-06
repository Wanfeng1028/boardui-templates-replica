"use client";

import { useState } from "react";

import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Heatmap Chart Card (replica).
 *
 * Row x column matrix heatmap (channels x months) with a theme-following
 * colour scale, a hover-linked headline, and a Less -> More legend.
 * Values are deterministic mock data.
 */

const ROWS = ["Organic", "Paid", "Social", "Email", "Referral"];
const COLS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function cellValue(row: number, col: number) {
  const seed = (row * 31 + col * 17 + 7) % 13;
  const wave = Math.sin((col + row * 2) / 2.4) * 0.5 + 0.5;
  return Math.min(100, Math.round(wave * 82) + seed * 2);
}

function levelOf(value: number) {
  if (value < 20) return 0;
  if (value < 40) return 1;
  if (value < 60) return 2;
  if (value < 80) return 3;
  return 4;
}

const LEVEL_BG = [
  "bg-background-tertiary-default",
  "bg-chart-4 opacity-30",
  "bg-chart-4 opacity-55",
  "bg-chart-4 opacity-80",
  "bg-chart-4",
];

export function HeatmapChartCard({ className }: { className?: string }) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

  const hovered = hover ? { row: ROWS[hover.row], col: COLS[hover.col], value: cellValue(hover.row, hover.col) } : null;
  const peak = ROWS.flatMap((row, r) => COLS.map((_col, c) => ({ row, col: c, value: cellValue(r, c) }))).reduce(
    (a, b) => (b.value > a.value ? b : a),
  );

  return (
    <ChartCardShell
      title="Channel intensity"
      subtitle="Sessions by channel and month — hover a cell to read it"
      className={className}
    >
      <div>
        <p className="text-body-medium text-text-secondary">{hovered ? `${hovered.row} · ${hovered.col}` : "Peak cell"}</p>
        <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
          {hovered ? `${hovered.value}` : `${peak.value}`}
        </p>
        <p className="text-body-2-medium text-text-tertiary">
          {hovered ? `intensity score (0–100) for ${hovered.row} in ${hovered.col}` : `${peak.row} in ${COLS[peak.col]} is the hottest cell`}
        </p>
      </div>
      <div className="overflow-x-auto pb-1" onMouseLeave={() => setHover(null)}>
        <div className="min-w-[560px]">
          <div className="mb-1 grid grid-cols-[84px_repeat(12,minmax(0,1fr))] gap-1">
            <span />
            {COLS.map((c) => (
              <span key={c} className="text-center text-caption-1-semibold text-text-tertiary">{c}</span>
            ))}
          </div>
          {ROWS.map((row, r) => (
            <div key={row} className="mb-1 grid grid-cols-[84px_repeat(12,minmax(0,1fr))] items-center gap-1">
              <span className="truncate text-body-2-medium text-text-secondary">{row}</span>
              {COLS.map((col, c) => {
                const value = cellValue(r, c);
                const level = levelOf(value);
                const isHover = hover?.row === r && hover?.col === c;
                return (
                  <button
                    key={col}
                    type="button"
                    aria-label={`${row}, ${col}: intensity ${value}`}
                    onMouseEnter={() => setHover({ row: r, col: c })}
                    onFocus={() => setHover({ row: r, col: c })}
                    className={cx(
                      "aspect-square w-full rounded-md outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      LEVEL_BG[level],
                      isHover && "scale-110 ring-2 ring-text-primary",
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 text-body-2-medium text-text-tertiary">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} aria-hidden className={cx("size-2.5 rounded-[3px]", LEVEL_BG[level])} />
        ))}
        <span>More</span>
      </div>
    </ChartCardShell>
  );
}
