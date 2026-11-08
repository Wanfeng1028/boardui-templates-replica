"use client";

import { useState } from "react";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Funnel Chart Card (replica).
 *
 * Horizontal funnel: each stage is a trapezoid bar whose width shrinks
 * down the funnel. Curve / Sharp switches the stage edges between rounded
 * and angular, Mono switches the multi-hue scale to a single hue, and a
 * conversion pill sits centred between stages. Each stage's value and name
 * sit in a footer under its bar.
 *
 * Note: Recharts' Funnel lays out vertically only, so the horizontal
 * trapezoid funnel is drawn as SVG-free DOM (clip-path trapezoids) with
 * CSS width transitions; the rest of the page's charts use Recharts.
 */

const STAGES = [
  { name: "Visited", value: 48200, color: "var(--color-chart-4)" },
  { name: "Signed up", value: 21480, color: "var(--color-chart-1)" },
  { name: "Activated", value: 12630, color: "var(--color-chart-2)" },
  { name: "Subscribed", value: 6840, color: "var(--color-chart-3)" },
  { name: "Retained", value: 4210, color: "var(--color-chart-5)" },
];

const MONO_COLORS = [
  "var(--color-chart-4)",
  "var(--color-chart-4)",
  "var(--color-chart-4)",
  "var(--color-chart-4)",
  "var(--color-chart-4)",
];

export function FunnelChartCard({ className }: { className?: string }) {
  const [curved, setCurved] = useState(true);
  const [mono, setMono] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const max = STAGES[0].value;
  const overall = Math.round((STAGES[STAGES.length - 1].value / max) * 1000) / 10;

  return (
    <ChartCardShell
      title="Acquisition funnel"
      subtitle={`Visited to retained — ${overall}% overall conversion`}
      className={className}
      actions={
        <>
          <SegmentedControl
            aria-label="Edge style"
            selectedKeys={new Set([curved ? "curve" : "sharp"])}
            onSelectionChange={(keys) => {
              const next = [...(keys as Set<string>)][0];
              if (next === "curve" || next === "sharp") setCurved(next === "curve");
            }}
          >
            <SegmentedControlItem id="curve">Curve</SegmentedControlItem>
            <SegmentedControlItem id="sharp">Sharp</SegmentedControlItem>
          </SegmentedControl>
          <button
            type="button"
            aria-pressed={mono}
            onClick={() => setMono((v) => !v)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-body-2-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              mono
                ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                : "border-border-button-default text-text-secondary hover:bg-background-tertiary-default",
            )}
          >
            Mono
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-1">
        {STAGES.map((stage, i) => {
          const pct = Math.round((stage.value / max) * 100);
          const conversion = i > 0 ? Math.round((stage.value / STAGES[i - 1].value) * 100) : null;
          const widthPct = 34 + (pct / 100) * 66;
          const dimmed = hover !== null && hover !== i;
          return (
            <div key={stage.name}>
              {conversion !== null ? (
                <div className="flex justify-center py-0.5">
                  <span className="rounded-full bg-background-tertiary-default px-2 py-0.5 text-caption-1-semibold text-text-secondary tabular-nums">
                    {conversion}% convert
                  </span>
                </div>
              ) : null}
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring rounded-xl"
                aria-label={`${stage.name}: ${stage.value.toLocaleString("en-US")} visitors, ${pct}% of top`}
              >
                <div className="flex justify-center">
                  <div
                    className={cx("flex h-11 items-center justify-center text-body-medium text-white transition-[width,opacity] duration-500", dimmed && "opacity-40")}
                    style={{
                      width: `${widthPct}%`,
                      background: mono ? MONO_COLORS[i] : stage.color,
                      opacity: dimmed ? 0.4 : mono ? 1 - i * 0.16 : 1,
                      clipPath: curved
                        ? "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 14px 100%)"
                        : "polygon(0 0, 100% 0, calc(100% - 22px) 100%, 22px 100%)",
                      borderRadius: curved ? 12 : 0,
                    }}
                  >
                    <span className="tabular-nums">{stage.value.toLocaleString("en-US")}</span>
                  </div>
                </div>
                <p className="mt-1 text-center text-body-2-medium text-text-secondary">
                  {stage.name} · {pct}%
                </p>
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        {hover !== null
          ? `${STAGES[hover].name}: ${STAGES[hover].value.toLocaleString("en-US")} people — ${Math.round((STAGES[hover].value / max) * 100)}% of all visitors.`
          : "Hover a stage to inspect it."}
      </p>
    </ChartCardShell>
  );
}
