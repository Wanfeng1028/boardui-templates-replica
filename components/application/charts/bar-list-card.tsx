"use client";

import { useState } from "react";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

import { ChartCardShell } from "./card-shell";

/**
 * Bar List Card (replica).
 *
 * Analytics breakdown list: ranked rows with a proportion bar behind each
 * row, a tab list of sources, a metrics caption, and a show-more pill that
 * expands the list from 5 to 10 rows.
 */

type Tab = "all" | "search" | "social" | "email" | "referral";

const ROWS: { name: string; value: number; tab: Exclude<Tab, "all">; caption: string }[] = [
  { name: "Google Search", value: 48200, tab: "search", caption: "Organic + paid search" },
  { name: "Direct", value: 31400, tab: "referral", caption: "Typed URL / bookmark" },
  { name: "Instagram", value: 24600, tab: "social", caption: "Feed + stories" },
  { name: "Newsletter", value: 18900, tab: "email", caption: "Weekly digest" },
  { name: "X / Twitter", value: 15300, tab: "social", caption: "Posts + replies" },
  { name: "Product Hunt", value: 12800, tab: "referral", caption: "Launch day + evergreen" },
  { name: "Bing Search", value: 9400, tab: "search", caption: "Organic search" },
  { name: "LinkedIn", value: 8100, tab: "social", caption: "Company page" },
  { name: "Onboarding email", value: 6700, tab: "email", caption: "Drip sequence" },
  { name: "Partner blog", value: 4200, tab: "referral", caption: "Guest posts" },
];

export function BarListCard({ className }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("all");
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const rows = ROWS.filter((r) => tab === "all" || r.tab === tab);
  const shown = expanded ? rows : rows.slice(0, 5);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const total = rows.reduce((s, r) => s + r.value, 0);

  return (
    <ChartCardShell
      title="Traffic sources"
      subtitle="Where sessions come from — ranked, with share bars"
      className={className}
      actions={
        <SegmentedControl
          aria-label="Source group"
          selectedKeys={new Set([tab])}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0];
            if (next === "all" || next === "search" || next === "social" || next === "email" || next === "referral") setTab(next);
          }}
        >
          <SegmentedControlItem id="all">All</SegmentedControlItem>
          <SegmentedControlItem id="search">Search</SegmentedControlItem>
          <SegmentedControlItem id="social">Social</SegmentedControlItem>
          <SegmentedControlItem id="email">Email</SegmentedControlItem>
          <SegmentedControlItem id="referral">Referral</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      <p className="text-body-2-medium text-text-tertiary tabular-nums">
        {total.toLocaleString("en-US")} sessions · {rows.length} sources · top source {Math.round((rows[0]?.value / total) * 100) || 0}% of traffic
      </p>
      <ol className="flex flex-col" onMouseLeave={() => setHover(null)}>
        {shown.map((row, i) => {
          const pct = Math.round((row.value / max) * 100);
          const share = Math.round((row.value / total) * 1000) / 10;
          const dimmed = hover !== null && hover !== i;
          return (
            <li key={row.name}>
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className="relative block w-full overflow-hidden rounded-xl px-2 py-2 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                aria-label={`${row.name}: ${row.value.toLocaleString("en-US")} sessions, ${share}%`}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-0 rounded-r-xl transition-[width,opacity] duration-500"
                  style={{ width: `${pct}%`, background: "var(--color-chart-4)", opacity: dimmed ? 0.08 : 0.16 }}
                />
                <span className="relative flex items-baseline gap-3">
                  <span className="w-5 shrink-0 text-body-2-medium text-text-tertiary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-medium text-text-primary">{row.name}</span>
                    <span className="block truncate text-body-2-regular text-text-tertiary">{row.caption}</span>
                  </span>
                  <span className="shrink-0 text-body-medium text-text-primary tabular-nums">
                    {row.value.toLocaleString("en-US")}
                    <span className="ms-1.5 text-body-2-medium text-text-tertiary tabular-nums">{share}%</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {rows.length > 5 ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-border-button-default px-3.5 py-1.5 text-body-2-medium text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            {expanded ? "Show less" : `Show ${rows.length - 5} more`}
          </button>
        </div>
      ) : null}
    </ChartCardShell>
  );
}
