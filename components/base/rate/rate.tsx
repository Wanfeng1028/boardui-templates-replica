"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode, Ref } from "react";
import { RiStarFill, RiStarLine } from "@remixicon/react";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → Rate (vibe-hub.org/rate).
 *
 * A rating control letting users pick an ordered value, commonly five stars.
 * Shows a readable value ("4 分" / "3.5 分") next to the stars.
 *
 * Full stars use RiStarFill with text-accent-500, empty stars use
 * RiStarLine with text-foreground-icon-tertiary. Half stars are rendered by
 * clipping a full star to its left half over an empty star.
 *
 * Radiogroup semantics: each star is a radio button with roving tabindex and
 * arrow-key stepping.
 */

export interface RateProps {
  label?: ReactNode;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  count?: number;
  allowHalf?: boolean;
  showValue?: boolean;
  size?: "sm" | "md";
  isDisabled?: boolean;
  "aria-label"?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const starSizes = {
  sm: "size-4",
  md: "size-5",
} as const;

function formatValue(value: number): string {
  if (value <= 0) return "未评分";
  const hasHalf = value % 1 !== 0;
  return hasHalf ? `${value.toFixed(1)} 分` : `${Math.floor(value)} 分`;
}

function clamp(value: number, count: number): number {
  return Math.min(count, Math.max(0, value));
}

export function Rate({
  label,
  value,
  defaultValue = 0,
  onChange,
  count = 5,
  allowHalf = false,
  showValue = true,
  size = "md",
  isDisabled = false,
  "aria-label": ariaLabel,
  className,
  ref,
}: RateProps) {
  const [uncontrolled, setUncontrolled] = useState(() =>
    clamp(defaultValue, count),
  );
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const committed = value !== undefined ? clamp(value, count) : uncontrolled;
  const display = hoverValue !== null ? hoverValue : committed;
  const step = allowHalf ? 0.5 : 1;

  const commit = (next: number) => {
    const clamped = clamp(next, count);
    if (value === undefined) setUncontrolled(clamped);
    onChange?.(clamped);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = committed + step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = committed - step;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count;
        break;
      default:
        return;
    }
    event.preventDefault();
    commit(next);
  };

  const rovingIndex = (() => {
    if (committed <= 0) return 0;
    const star = Math.min(count, Math.ceil(committed - 0.001));
    return star - 1;
  })();
  const focusIndex = rovingIndex === -1 ? 0 : rovingIndex;

  const resolveValueFromPointer = (
    event: MouseEvent<HTMLButtonElement>,
    index: number,
  ): number => {
    if (!allowHalf) return index + 1;
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX < rect.left + rect.width / 2
      ? index + 0.5
      : index + 1;
  };

  return (
    <div ref={ref} className={cx("inline-flex flex-col gap-2", className)}>
      {label ? <Label>{label}</Label> : null}
      <div
        role="radiogroup"
        aria-label={label === undefined || label === null ? ariaLabel : undefined}
        aria-disabled={isDisabled || undefined}
        className={cx(
          "flex items-center gap-1",
          isDisabled && "pointer-events-none opacity-50",
        )}
        onMouseLeave={() => setHoverValue(null)}
      >
        {Array.from({ length: count }, (_, index) => {
          const fillRatio = Math.min(1, Math.max(0, display - index));
          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={
                committed === index + 1 ||
                (allowHalf && committed === index + 0.5)
              }
              aria-label={`${index + 1} 分`}
              disabled={isDisabled}
              tabIndex={index === focusIndex ? 0 : -1}
              onKeyDown={handleKeyDown}
              onMouseMove={(event) => {
                if (isDisabled) return;
                setHoverValue(resolveValueFromPointer(event, index));
              }}
              onClick={(event) => {
                if (isDisabled) return;
                commit(resolveValueFromPointer(event, index));
              }}
              className={cx(
                "relative inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring rounded-md",
                isDisabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
            >
              <span className="relative inline-flex">
                <RiStarLine
                  className={cx(
                    starSizes[size],
                    "text-foreground-icon-tertiary",
                  )}
                />
                {fillRatio > 0 && (
                  <span
                    className={cx(
                      "absolute inset-y-0 left-0 overflow-hidden",
                      fillRatio >= 1 ? "w-full" : "w-1/2",
                    )}
                  >
                    <RiStarFill
                      className={cx(
                        starSizes[size],
                        "text-accent-500",
                      )}
                    />
                  </span>
                )}
              </span>
            </button>
          );
        })}
        {showValue && (
          <span className="ml-2 text-body-medium text-text-secondary">
            {formatValue(display)}
          </span>
        )}
      </div>
    </div>
  );
}
