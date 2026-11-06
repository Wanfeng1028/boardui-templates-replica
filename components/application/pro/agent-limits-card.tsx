"use client";

import { useState } from "react";
import { RiArrowDownSLine, RiRefreshLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Agent Limits Card (Pro replica) — context-window usage.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * Usage bar, expandable token breakdown, collapsible groups,
 * plan cap and reset time.
 */

type Group = { name: string; tokens: number; color: string };

const GROUPS: Group[] = [
  { name: "Conversation", tokens: 48210, color: "bg-chart-1" },
  { name: "Retrieved context", tokens: 31840, color: "bg-chart-2" },
  { name: "Tool results", tokens: 12480, color: "bg-chart-3" },
  { name: "System prompt", tokens: 2970, color: "bg-chart-4" },
];

const TOTAL = GROUPS.reduce((s, g) => s + g.tokens, 0);
const LIMIT = 200000;

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export function AgentLimitsCard({ className }: { className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Conversation: true });
  const pct = Math.round((TOTAL / LIMIT) * 100);

  return (
    <div className={cx("flex w-full flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <div className="flex w-full items-center justify-between gap-2">
        <p className="text-title-3-semibold text-text-primary">Context usage</p>
        <span className="rounded-full bg-background-tertiary-default px-2 py-0.5 text-caption-1-medium text-text-secondary">Pro plan</span>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-headline-medium text-text-primary tabular-nums">
            {fmt(TOTAL)} <span className="text-body-2-regular text-text-tertiary">/ {fmt(LIMIT)} tokens</span>
          </p>
          <p className="text-body-2-medium text-text-secondary tabular-nums">{pct}% used</p>
        </div>
        <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-background-tertiary-default" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          {GROUPS.map((g) => (
            <div
              key={g.name}
              className={cx("h-full first:rounded-s-full last:rounded-e-full", g.color)}
              style={{ width: `${(g.tokens / LIMIT) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {GROUPS.map((g) => (
            <span key={g.name} className="inline-flex items-center gap-1.5 text-caption-1-regular text-text-secondary">
              <span className={cx("size-2 rounded-full", g.color)} aria-hidden />
              {g.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 border-t border-separator-border pt-3">
        <p className="inline-flex items-center gap-1.5 text-body-2-regular text-text-secondary">
          <RiRefreshLine className="size-3.5 text-foreground-icon-tertiary" />
          Resets in 4h 12m · daily cap {fmt(LIMIT)}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-background-tertiary-default px-3 py-1.5 text-caption-1-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {expanded ? "Hide details" : "Token details"}
          <RiArrowDownSLine className={cx("size-3.5 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {expanded && (
        <div className="flex w-full flex-col gap-1">
          {GROUPS.map((g) => {
            const open = !!openGroups[g.name];
            const share = Math.round((g.tokens / TOTAL) * 100);
            return (
              <div key={g.name} className="overflow-hidden rounded-xl bg-background-primary-default">
                <button
                  type="button"
                  onClick={() => setOpenGroups((m) => ({ ...m, [g.name]: !m[g.name] }))}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <span className={cx("size-2 shrink-0 rounded-full", g.color)} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-body-2-medium text-text-primary">{g.name}</span>
                  <span className="shrink-0 text-body-2-regular text-text-secondary tabular-nums">{fmt(g.tokens)} · {share}%</span>
                  <RiArrowDownSLine className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <div className="border-t border-separator-border px-3 py-2">
                    <p className="text-body-2-regular text-text-secondary">
                      {g.name} holds {fmt(g.tokens)} tokens ({share}% of current context).
                      {g.name === "Conversation" ? " 12 messages in this thread." : ""}
                      {g.name === "Retrieved context" ? " 6 documents attached." : ""}
                      {g.name === "Tool results" ? " 9 tool calls this session." : ""}
                      {g.name === "System prompt" ? " Fixed instructions for this agent." : ""}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          <p className="px-1 pt-1 text-caption-1-regular text-text-tertiary">
            Usage is a demo estimate. When the bar passes 90%, older messages are compacted first.
          </p>
        </div>
      )}
    </div>
  );
}
