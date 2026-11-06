"use client";

import { useState } from "react";
import { RiCheckLine, RiLoader4Line, RiRefreshLine } from "@remixicon/react";
import { LogRow, WorkingRow, useLogMotion, useRevealTicker } from "@/components/application/agent-log/agent-log";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * Task List (Pro replica) — streaming agent task log.
 * Built only from free BoardUI components (Agent Log ticker + tree guide)
 * plus mock data. Not the official Pro source.
 * Tasks reveal one at a time with a soft height / blur / shimmer running
 * title while work is in progress.
 */

const TASKS = [
  "Read the project brief and list open questions",
  "Search the docs for the composer API",
  "Draft the plan and estimate each step",
  "Build the first prototype screen",
  "Run the checks and fix what failed",
  "Summarise the result for review",
];

function TaskListLog({ runKey }: { runKey: number }) {
  const reduce = useLogMotion();
  const revealed = useRevealTicker({ total: TASKS.length, run: true, stepInterval: 900 });
  const done = revealed >= TASKS.length;
  return (
    <ul className="flex w-full flex-col">
      {TASKS.slice(0, revealed).map((task, i) => {
        const isCurrent = i === revealed - 1 && !done;
        return (
          <LogRow key={`${runKey}-${i}`} first={i === 0} last={i === TASKS.length - 1 && done} reduce={reduce}>
            <div className="flex items-center gap-2 py-1.5">
              <span
                className={cx(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isCurrent
                    ? "border-chart-2 text-chart-2"
                    : "border-border-button-default bg-background-primary-default text-foreground-icon-tertiary",
                )}
              >
                {isCurrent ? (
                  <RiLoader4Line className="size-3.5 animate-spin" />
                ) : (
                  <RiCheckLine className="size-3.5" />
                )}
              </span>
              <p className={cx("text-body-medium", isCurrent ? "agent-progress-loading-text text-text-primary" : "text-text-primary")}>
                {task}
              </p>
              <span className="ms-auto shrink-0 text-caption-1-regular text-text-tertiary">
                {isCurrent ? "Running" : "Done"}
              </span>
            </div>
          </LogRow>
        );
      })}
      {!done && <WorkingRow label="Working on the next task…" reduce={reduce} />}
      {done && (
        <li className="ps-4 pt-1">
          <p className="text-body-2-regular text-text-secondary">All {TASKS.length} tasks complete.</p>
        </li>
      )}
    </ul>
  );
}

export function TaskList({ className }: { className?: string }) {
  const [runKey, setRunKey] = useState(0);
  return (
    <div className={cx("flex w-full flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <p className="text-title-3-semibold text-text-primary">Task list</p>
        <Button variant="secondary" size="small" leadingIcon={RiRefreshLine} onClick={() => setRunKey((k) => k + 1)}>
          Replay
        </Button>
      </div>
      <TaskListLog key={runKey} runKey={runKey} />
    </div>
  );
}
