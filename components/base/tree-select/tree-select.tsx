"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { Key, KeyboardEvent, ReactNode, Ref } from "react";
import { Button as AriaButton, Popover as AriaPopover } from "react-aria-components";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
import { Input } from "@/components/base/input/input";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Label } from "@/components/base/input/label";
import { MENU_ITEM_ACTIVE, MENU_POPOVER_SURFACE } from "@/components/base/dropdown/menu-styles";
import { useDismissOnOutsidePress, useTriggerToggle } from "@/utils/use-dismiss-on-outside-press";
import { cx } from "@/utils/cx";

export interface TreeSelectOption {
  value: string;
  label: string;
  children?: TreeSelectOption[];
  isDisabled?: boolean;
}

export interface TreeSelectProps {
  label?: ReactNode;
  placeholder?: string;
  options: TreeSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], checked: TreeSelectOption[]) => void;
  selectionMode?: "single" | "multiple";
  cascadeRule?: "all" | "none";
  showRuleNote?: boolean;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

const TRIGGER_CLASSES = [
  "flex w-full cursor-pointer items-center justify-between rounded-2lg",
  "border border-border-button-default bg-background-primary-default shadow-xs",
  "text-text-primary",
  "transition-[background-color,border-color,box-shadow,padding,font-size] duration-200 ease",
  "hover:bg-background-primary-hover hover:border-border-button-hover",
  "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
  "disabled:cursor-not-allowed disabled:bg-background-primary-disabled disabled:text-text-tertiary disabled:shadow-none",
  "gap-1.5 px-2.5 py-2 text-body-medium",
];

interface FlatNode {
  option: TreeSelectOption;
  level: number;
  parent: FlatNode | null;
  descendants: FlatNode[];
  hasChildren: boolean;
}

function collectNodes(options: TreeSelectOption[], level: number, parent: FlatNode | null, map: Map<string, FlatNode>) {
  for (const option of options) {
    const node: FlatNode = { option, level, parent, descendants: [], hasChildren: Boolean(option.children?.length) };
    map.set(option.value, node);
    if (option.children?.length) {
      collectNodes(option.children, level + 1, node, map);
      for (const child of option.children) {
        const childNode = map.get(child.value);
        if (childNode) {
          node.descendants.push(childNode);
          node.descendants.push(...childNode.descendants);
        }
      }
    }
  }
}

export function TreeSelect({
  label,
  placeholder,
  options,
  value,
  defaultValue,
  onChange,
  selectionMode = "multiple",
  cascadeRule = "all",
  showRuleNote = true,
  className,
  triggerClassName,
  popoverClassName,
  "aria-label": ariaLabel,
  ref,
}: TreeSelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const listboxId = useId();

  useDismissOnOutsidePress(isOpen, () => setIsOpen(false), [triggerRef, popoverRef]);
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  const isControlled = value !== undefined;
  const selected = isControlled ? value : uncontrolledValue;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const flatMap = useMemo(() => {
    const map = new Map<string, FlatNode>();
    collectNodes(options, 1, null, map);
    return map;
  }, [options]);

  const setValue = (next: string[]) => {
    if (!isControlled) setUncontrolledValue(next);
    const checked = next.map((v) => flatMap.get(v)?.option).filter((o): o is TreeSelectOption => Boolean(o));
    onChange?.(next, checked);
  };

  const collectSubtree = (node: FlatNode): string[] => [node.option.value, ...node.descendants.map((d) => d.option.value)];

  const toggleOption = (node: FlatNode) => {
    if (node.option.isDisabled) return;
    if (selectionMode === "single") {
      setValue(cascadeRule === "all" ? collectSubtree(node) : [node.option.value]);
      setIsOpen(false);
      return;
    }
    const affected = cascadeRule === "all" ? collectSubtree(node) : [node.option.value];
    const willCheck = !affected.every((v) => selectedSet.has(v));
    const next = new Set(selectedSet);
    for (const v of affected) {
      if (willCheck) next.add(v);
      else next.delete(v);
    }
    setValue(Array.from(next));
  };

  const isChecked = (node: FlatNode) => {
    if (cascadeRule === "none") return selectedSet.has(node.option.value);
    const all = collectSubtree(node);
    return all.every((v) => selectedSet.has(v));
  };

  const isIndeterminate = (node: FlatNode) => {
    if (cascadeRule === "none" || !node.hasChildren) return false;
    const all = collectSubtree(node);
    const any = all.some((v) => selectedSet.has(v));
    return any && !all.every((v) => selectedSet.has(v));
  };

  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalizedQuery) return null;
    const matched = new Set<string>();
    for (const node of flatMap.values()) {
      if (node.option.label.toLowerCase().includes(normalizedQuery)) {
        matched.add(node.option.value);
        let parent = node.parent;
        while (parent) {
          matched.add(parent.option.value);
          parent = parent.parent;
        }
      }
    }
    return matched;
  }, [normalizedQuery, flatMap]);

  const visibleOptions = useMemo(() => {
    if (!matches) return options;
    const filter = (nodes: TreeSelectOption[]): TreeSelectOption[] =>
      nodes
        .filter((option) => matches.has(option.value))
        .map((option) =>
          option.children?.length ? { ...option, children: filter(option.children) } : option,
        );
    return filter(options);
  }, [matches, options]);

  const hasVisibleResults = visibleOptions.length > 0;

  const effectiveExpanded = useMemo(() => {
    if (matches) return new Set(Array.from(matches).filter((v) => flatMap.get(v)?.hasChildren));
    return expanded;
  }, [matches, expanded, flatMap]);

  const renderRows = (nodes: TreeSelectOption[]): ReactNode =>
    nodes.map((option) => {
      const node = flatMap.get(option.value);
      if (!node) return null;
      const isBranch = Boolean(option.children?.length);
      const isExpanded = effectiveExpanded.has(option.value);
      const checked = isChecked(node);
      const indeterminate = isIndeterminate(node);
      const isDisabled = Boolean(option.isDisabled);
      return (
        <div key={option.value} role="treeitem" aria-level={node.level} aria-selected={checked || indeterminate ? true : undefined} aria-expanded={isBranch ? isExpanded : undefined} aria-disabled={isDisabled || undefined}>
          <div
            className={cx(
              "flex h-9 min-w-0 items-center gap-2 rounded-xl pe-2 outline-none",
              "transition-[background-color,color,box-shadow] duration-150 motion-reduce:transition-none",
              !isDisabled && MENU_ITEM_ACTIVE,
              isDisabled && "cursor-default text-text-placeholder",
            )}
            style={{ paddingInlineStart: `calc(0.5rem + ${(node.level - 1)} * 1.25rem)` }}
          >
            {isBranch ? (
              <AriaButton
                slot={null}
                aria-label={isExpanded ? `收起 ${option.label}` : `展开 ${option.label}`}
                onPress={() => {
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    if (next.has(option.value)) next.delete(option.value);
                    else next.add(option.value);
                    return next;
                  });
                }}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-icon-tertiary outline-none transition-colors hover:text-foreground-icon-primary data-[focus-visible]:ring-2 data-[focus-visible]:ring-border-focus-ring"
              >
                <RiArrowRightSLine aria-hidden className={cx("size-4 opacity-50 transition-transform duration-150 motion-reduce:transition-none", isExpanded && "rotate-90")} />
              </AriaButton>
            ) : (
              <span aria-hidden className="h-5 w-5 shrink-0" />
            )}
            <Checkbox
              isSelected={checked}
              isIndeterminate={indeterminate}
              isDisabled={isDisabled}
              onChange={() => toggleOption(node)}
              className="shrink-0"
            />
            <span className={cx("min-w-0 flex-1 truncate text-body-regular", isDisabled ? "text-text-placeholder" : "text-text-primary")}>
              <bdi>{option.label}</bdi>
            </span>
          </div>
          {isBranch && isExpanded && option.children ? renderRows(option.children) : null}
        </div>
      );
    });

  const triggerText = (() => {
    if (selected.length === 0) return placeholder ?? "";
    if (selectionMode === "single") {
      const first = flatMap.get(selected[0])?.option.label;
      return first ?? placeholder ?? "";
    }
    return `已选 ${selected.length} 项`;
  })();

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" && !isOpen) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div ref={ref} className={cx("group flex flex-col", label ? "gap-1" : undefined, className)}>
      {label ? <Label>{label}</Label> : null}
      <AriaButton
        ref={triggerRef}
        slot={null}
        aria-label={label ? undefined : ariaLabel ?? "树选择"}
        aria-haspopup="tree"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onPress={() => setIsOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        className={cx(TRIGGER_CLASSES, triggerClassName)}
      >
        <span className={cx("min-w-0 flex-1 truncate text-start", selected.length === 0 && "text-text-tertiary")}>{triggerText}</span>
        <RiArrowDownSLine aria-hidden className={cx("size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-150 motion-reduce:transition-none", isOpen && "rotate-180")} />
      </AriaButton>
      <AriaPopover
        ref={popoverRef}
        isNonModal
        offset={4}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={(o) => allowOpenChange(o) && setIsOpen(o)}
        className={(state) =>
          cx(
            MENU_POPOVER_SURFACE,
            "flex max-h-80 flex-col overflow-hidden p-2",
            typeof state === "object" && state !== null && "entering:transition entering:duration-150",
            popoverClassName,
          )
        }
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Input
            value={query}
            onChange={setQuery}
            placeholder="搜索"
            aria-label="搜索"
            className="mb-1"
          />
          <div id={listboxId} role="tree" aria-label={ariaLabel ?? "树选择"} className="flex flex-col gap-0.5">
            {hasVisibleResults ? (
              renderRows(visibleOptions)
            ) : (
              <div className="px-2 py-6 text-center text-body-regular text-text-tertiary">无匹配结果</div>
            )}
          </div>
        </div>
        {showRuleNote ? (
          <div className={cx("shrink-0 border-t border-border-button-default px-2 pb-1 pt-2 text-caption-1-regular text-text-tertiary")}>
            {cascadeRule === "all" ? "勾选部门会同时选中其下全部小组" : "仅勾选当前项，不影响下级"}
          </div>
        ) : null}
      </AriaPopover>
    </div>
  );
}
