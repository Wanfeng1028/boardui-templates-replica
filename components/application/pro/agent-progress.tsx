"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiArrowDownSLine, RiLoader4Line } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Agent Progress (Pro replica) — collapsible multi-step AI task progress.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * Steps move pending -> active -> done on a timer; the whole card folds.
 */

type StepState = "pending" | "active" | "done";
type Step = { label: string; detail: string };

const STEPS: Step[] = [
  { label: "Understand the request", detail: "Parsed the prompt and picked the plan." },
  { label: "Search the web", detail: "3 queries · 6 sources opened." },
  { label: "Draft the answer", detail: "Writing with citations attached." },
  { label: "Verify the result", detail: "Checking facts against the sources." },
];

function stepState(index: number, current: number): StepState {
  if (index < current) return "done";
  if (index === current) return "active";
  return "pending";
}

export function AgentProgress({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (current >= STEPS.length) return;
    const id = window.setTimeout(() => setCurrent((c) => c + 1), current === 0 ? 600 : 1600);
    return () => window.clearTimeout(id);
  }, [current]);

  const done = current >= STEPS.length;
  const doneCount = Math.min(current, STEPS.length);

  return (
    <div className={cx("flex w-full flex-col rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-2.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring rounded-xl"
      >
        <span
          className={cx(
            "flex size-6 shrink-0 items-center justify-center rounded-full",
            done ? "bg-chart-3/15 text-chart-3" : "bg-chart-2/15 text-chart-2",
          )}
        >
          {done ? <RiCheckLine className="size-4" /> : <RiLoader4Line className="size-4 animate-spin" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-medium text-text-primary">
            {done ? "Research complete" : STEPS[Math.min(current, STEPS.length - 1)].label}
          </span>
          <span className="block text-caption-1-regular text-text-tertiary tabular-nums">
            {doneCount} of {STEPS.length} steps done
          </span>
        </span>
        <span className="shrink-0 text-caption-1-medium text-text-secondary tabular-nums">
          {Math.round((doneCount / STEPS.length) * 100)}%
        </span>
        <RiArrowDownSLine className={cx("size-4 shrink-0 text-foreground-icon-tertiary transition-transform", open && "rotate-180")} />
      </button>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background-tertiary-default" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={STEPS.length}>
        <div
          className="h-full rounded-full bg-chart-2 transition-all duration-500"
          style={{ width: `${(doneCount / STEPS.length) * 100}%` }}
        />
      </div>

      {open && (
        <ul className="mt-3 flex w-full flex-col">
          {STEPS.map((step, i) => {
            const state = stepState(i, current);
            return (
              <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className={cx("absolute top-6 bottom-0 start-[11px] w-px", state === "done" ? "bg-chart-3" : "bg-border-separator-border")}
                  />
                )}
                <span
                  className={cx(
                    "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border",
                    state === "done" && "border-chart-3 bg-chart-3/15 text-chart-3",
                    state === "active" && "border-chart-2 bg-chart-2/15 text-chart-2",
                    state === "pending" && "border-border-button-default bg-background-primary-default text-foreground-icon-tertiary",
                  )}
                >
                  {state === "done" ? (
                    <RiCheckLine className="size-3.5" />
                  ) : state === "active" ? (
                    <RiLoader4Line className="size-3.5 animate-spin" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className={cx("text-body-medium", state === "pending" ? "text-text-tertiary" : "text-text-primary")}>{step.label}</p>
                  {state !== "pending" && (
                    <p className="text-body-2-regular text-text-secondary">{step.detail}</p>
                  )}
                </div>
                <span className="shrink-0 pt-1 text-caption-1-regular text-text-tertiary">
                  {state === "done" ? "Done" : state === "active" ? "Active" : "Pending"}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {done && (
        <button
          type="button"
          onClick={() => setCurrent(0)}
          className="mt-3 cursor-pointer self-start rounded-full bg-background-tertiary-default px-3 py-1.5 text-caption-1-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          Run again
        </button>
      )}
    </div>
  );
}
