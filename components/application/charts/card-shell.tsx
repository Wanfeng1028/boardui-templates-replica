"use client";

import type { ReactNode } from "react";

import { cx } from "@/utils/cx";

/**
 * Shared shell for the 17 Pro chart cards (replica).
 *
 * Every card is a rounded panel on the secondary surface with a title row
 * (title + subtitle on the left, controls on the right) and a body. Cards
 * are built only from free BoardUI components + Recharts / SVG + mock data.
 */

export function ChartCardShell({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: {
  /** Card title, shown in the header. */
  title: string;
  /** One-line description under the title. */
  subtitle?: string;
  /** Header controls (period switch, variant switch, ...). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cx(
        "flex min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-body-2-regular text-text-secondary">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className={cx("min-w-0", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Headline row used by cards whose headline follows the hovered point. */
export function ChartHeadline({
  label,
  value,
  sub,
  right,
}: {
  label: string;
  value: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-body-medium text-text-secondary">{label}</p>
        <p className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
          {value}
        </p>
        {sub ? <p className="text-body-2-medium text-text-tertiary tabular-nums">{sub}</p> : null}
      </div>
      {right ? <div className="flex shrink-0 items-center gap-2 pb-1">{right}</div> : null}
    </div>
  );
}
