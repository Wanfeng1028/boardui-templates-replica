"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode, Ref } from "react";
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
} from "react-aria-components";
import {
  MENU_ITEM,
  MENU_ITEM_ACTIVE,
  MENU_ITEMS_CONTAINER,
  MENU_POPOVER_SURFACE,
} from "@/components/base/dropdown/menu-styles";
import { Label } from "@/components/base/input/label";
import { ChevronDownSmall } from "@/components/foundations/icons/chevrons";
import { RiArrowRightSLine } from "@remixicon/react";
import { cx } from "@/utils/cx";
import { useDismissOnOutsidePress, useTriggerToggle } from "@/utils/use-dismiss-on-outside-press";

/**
 * Figma source: Board UI → dashboard 1 dropdown triggers (same trigger
 * recipe as the Select family: bg color/white, 1px border/button/default,
 * shadow/xs, px 10 py 8, radius/2lg, Body 1/Medium, 16px chevron).
 *
 * A cascading picker: pressing an option with children opens the next
 * column to its right (province → city → district). Pressing a leaf
 * commits the whole path, calls `onChange` with the array of values and
 * the array of option objects, and closes the popover. The trigger shows
 * the full path joined by `separator` (e.g. "广东省 / 深圳市 / 南山区").
 *
 * For multi-branch selection use Tree Select instead. When options are
 * numerous and searchable, prefer a searchable picker.
 */

export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  isDisabled?: boolean;
}

export interface CascaderProps {
  label?: ReactNode;
  placeholder?: string;
  options: CascaderOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], path: CascaderOption[]) => void;
  size?: "sm" | "md";
  separator?: string;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Cascader({
  label,
  placeholder = "请选择",
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  separator = " / ",
  className,
  triggerClassName,
  popoverClassName,
  "aria-label": ariaLabel,
  ref,
}: CascaderProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
  const [columns, setColumns] = useState<CascaderOption[][]>([]);
  const [openPath, setOpenPath] = useState<CascaderOption[]>([]);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolledValue;

  // Resolve the option objects for the current selection.
  const selectedPath = useMemo<CascaderOption[]>(() => {
    const path: CascaderOption[] = [];
    let level = options;
    for (const v of selectedValue) {
      const found = level.find((o) => o.value === v);
      if (!found) break;
      path.push(found);
      level = found.children ?? [];
    }
    return path;
  }, [options, selectedValue]);

  useDismissOnOutsidePress(isOpen, () => setIsOpen(false), [triggerRef, popoverRef]);
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  const open = () => {
    const initialColumns: CascaderOption[][] = [options];
    let level = options;
    for (const option of selectedPath) {
      if (option.children && option.children.length > 0) {
        initialColumns.push(option.children);
        level = option.children;
      } else {
        break;
      }
    }
    setColumns(initialColumns);
    setOpenPath(selectedPath);
    setIsOpen(true);
  };

  const commit = (path: CascaderOption[]) => {
    const nextValue = path.map((o) => o.value);
    if (!isControlled) setUncontrolledValue(nextValue);
    onChange?.(nextValue, path);
    setIsOpen(false);
  };

  const handleOpenChange = (o: boolean) => {
    if (!allowOpenChange(o)) return;
    if (o) open();
    else setIsOpen(false);
  };

  const triggerText =
    selectedPath.length > 0
      ? selectedPath.map((o) => o.label).join(separator)
      : placeholder;

  return (
    <div ref={ref} className={cx("flex flex-col", label ? "gap-1" : undefined, className)}>
      {label ? <Label>{label}</Label> : null}
      <AriaButton
        ref={triggerRef}
        aria-label={label ? undefined : (ariaLabel ?? triggerText)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onPress={() => handleOpenChange(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!isOpen) open();
          }
        }}
        className={cx(
          "flex w-full cursor-pointer items-center justify-between rounded-2lg",
          "border border-border-button-default bg-background-primary-default shadow-xs",
          "text-text-primary",
          "transition-[background-color,border-color,box-shadow,padding,font-size] duration-200 ease",
          "hover:bg-background-primary-hover hover:border-border-button-hover",
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
          "disabled:cursor-not-allowed disabled:bg-background-primary-disabled disabled:text-text-tertiary disabled:shadow-none",
          size === "sm"
            ? "gap-1 px-[7px] py-1 text-body-2-medium"
            : "gap-1.5 px-2.5 py-2 text-body-medium",
          triggerClassName,
        )}
      >
        <span className="flex min-w-0 items-center truncate">
          <span
            className={cx(
              "truncate",
              selectedPath.length === 0 && "text-text-tertiary",
            )}
          >
            {triggerText}
          </span>
        </span>
        <ChevronDownSmall
          className={cx(
            "shrink-0 text-text-secondary transition-transform duration-200 ease",
            size === "sm" ? "size-3.5" : "size-4",
            isOpen && "rotate-180",
          )}
        />
      </AriaButton>
      <AriaPopover
        ref={popoverRef}
        triggerRef={triggerRef}
        isNonModal
        offset={4}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        // Escape closes via onOpenChange (react-aria Popover calls it with false on Escape).
        className={cx(
          MENU_POPOVER_SURFACE,
          "w-auto max-w-[560px] p-2",
          popoverClassName,
        )}
      >
        <div className="flex items-start gap-1">
          {columns.map((level, columnIndex) => {
            const activeOption = openPath[columnIndex];

            return (
              <AriaListBox
                key={columnIndex}
                aria-label={ariaLabel ? `${ariaLabel} level ${columnIndex + 1}` : `level ${columnIndex + 1}`}
                items={level}
                selectionMode="none"
                autoFocus={columnIndex === columns.length - 1}

                className={cx(
                  MENU_ITEMS_CONTAINER,
                  "w-[200px] shrink-0 max-h-[240px] overflow-auto",
                )}
              >
                {(option: CascaderOption) => {
                  const hasChildren = (option.children?.length ?? 0) > 0;
                  const isActive = activeOption?.value === option.value;
                  return (
                    <CascaderRow
                      option={option}
                      hasChildren={hasChildren}
                      isActive={isActive}
                      size={size}
                      onHover={() => {
                        if (hasChildren && !option.isDisabled) {
                          const next = columns.slice(0, columnIndex + 1);
                          next.push(option.children as CascaderOption[]);
                          setColumns(next);
                          setOpenPath((prev) => prev.slice(0, columnIndex).concat(option));
                        } else {
                          setColumns(columns.slice(0, columnIndex + 1));
                        }
                      }}
                      onPress={() => {
                        if (option.isDisabled) return;
                        if (hasChildren) {
                          const next = columns.slice(0, columnIndex + 1);
                          next.push(option.children as CascaderOption[]);
                          setColumns(next);
                          setOpenPath((prev) => prev.slice(0, columnIndex).concat(option));
                        } else {
                          const path = openPath.slice(0, columnIndex).concat(option);
                          commit(path);
                        }
                      }}
                    />
                  );
                }}
              </AriaListBox>
            );
          })}
        </div>
      </AriaPopover>
    </div>
  );
}

interface CascaderRowProps {
  option: CascaderOption;
  hasChildren: boolean;
  isActive: boolean;
  size: "sm" | "md";
  onHover: () => void;
  onPress: () => void;
}

function CascaderRow({ option, hasChildren, isActive, size, onHover, onPress }: CascaderRowProps) {
  return (
    <AriaListBoxItem
      id={option.value}
      isDisabled={option.isDisabled}
      onHoverStart={onHover}
      onHoverEnd={undefined}
      onAction={onPress}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !option.isDisabled) {
          e.preventDefault();
          onPress();
        }
        if (e.key === "ArrowRight" && hasChildren) {
          e.preventDefault();
          e.stopPropagation();
          onHover();
        }
      }}
      className={(state) =>
        cx(
          MENU_ITEM,
          size === "sm" ? "px-2 py-1.5 text-body-2-medium" : "text-body-medium",
          (state.isFocused || isActive) && MENU_ITEM_ACTIVE,
          state.isDisabled && "cursor-not-allowed text-text-disabled",
        )
      }
    >
      <span className="flex min-w-0 flex-1 items-center justify-between gap-1">
        <span className="truncate">{option.label}</span>
        {hasChildren ? (
          <RiArrowRightSLine className="size-4 shrink-0 text-foreground-icon-tertiary" />
        ) : null}
      </span>
    </AriaListBoxItem>
  );
}
