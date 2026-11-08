"use client";

import { useState } from "react";
import {
  RiArrowUpLine,
  RiCheckLine,
  RiFolderLine,
  RiGitBranchLine,
  RiMicLine,
  RiAddLine,
  RiShieldCheckLine,
  RiSparklingLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import { Select, SelectItem } from "@/components/base/select/select";

/**
 * Composer Panel (Pro replica) — two-row AI chat composer.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * Top row: prompt. Bottom row: add / permissions / model / mic / send.
 * Status chips: branch, project folder, context meter.
 */

const MODELS = ["GPT-5", "Claude Sonnet 4.5", "Gemini 2.5 Flash"];
const PERMISSIONS = ["Ask first", "Auto-approve edits", "Read-only"];

export function ComposerPanel({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [permission, setPermission] = useState(PERMISSIONS[0]);
  const [sent, setSent] = useState<string[]>([]);
  const [branch] = useState("main");
  const [contextPct, setContextPct] = useState(48);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    setSent((s) => [...s, text]);
    setValue("");
    setContextPct((p) => Math.min(96, p + 3));
  };

  return (
    <div className={cx("flex w-full flex-col gap-2.5", className)}>
      {sent.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {sent.map((m, i) => (
            <div key={i} className="ms-auto max-w-[85%] rounded-3xl rounded-br-md bg-accent-500 px-4 py-2.5 text-body-regular text-white">
              {m}
            </div>
          ))}
        </div>
      )}

      <div className="flex w-full flex-col rounded-3xl border border-border-button-default bg-background-secondary-default p-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          rows={2}
          placeholder="Describe what to build…"
          aria-label="Prompt"
          className="w-full resize-none bg-transparent px-1 py-1 text-body-regular text-text-primary placeholder:text-text-placeholder outline-none"
        />
        <div className="flex w-full flex-wrap items-center gap-1.5 border-t border-separator-border pt-2.5">
          <button
            type="button"
            aria-label="Add"
            onClick={() => window.alert("Add menu (demo): file, image, or link.")}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiAddLine className="size-4" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background-tertiary-default px-2 py-1">
            <RiShieldCheckLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            <Select
              size="sm"
              aria-label="Permissions"
              selectedKey={permission}
              onSelectionChange={(key) => {
                if (typeof key === "string") setPermission(key);
              }}
              className="w-auto"
              triggerClassName="border-0 bg-transparent px-1 py-0 text-caption-1-medium text-text-secondary shadow-none hover:bg-transparent hover:border-transparent"
            >
              {PERMISSIONS.map((p) => (
                <SelectItem key={p} id={p} textValue={p}>{p}</SelectItem>
              ))}
            </Select>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background-tertiary-default px-2 py-1">
            <RiSparklingLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            <Select
              size="sm"
              aria-label="Model"
              selectedKey={model}
              onSelectionChange={(key) => {
                if (typeof key === "string") setModel(key);
              }}
              className="w-auto"
              triggerClassName="border-0 bg-transparent px-1 py-0 text-caption-1-medium text-text-secondary shadow-none hover:bg-transparent hover:border-transparent"
            >
              {MODELS.map((m) => (
                <SelectItem key={m} id={m} textValue={m}>{m}</SelectItem>
              ))}
            </Select>
          </span>
          <div className="ms-auto flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Voice input"
              onClick={() => window.alert("Voice input (demo — not wired to a microphone).")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiMicLine className="size-4" />
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!value.trim()}
              aria-label="Send"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white outline-none hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RiArrowUpLine className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-1.5 px-1">
        <span className="inline-flex items-center gap-1 rounded-full border border-border-button-default bg-background-secondary-default px-2.5 py-1 text-caption-1-medium text-text-secondary">
          <RiGitBranchLine className="size-3.5 text-foreground-icon-tertiary" /> {branch}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border-button-default bg-background-secondary-default px-2.5 py-1 text-caption-1-medium text-text-secondary">
          <RiFolderLine className="size-3.5 text-foreground-icon-tertiary" /> boardui-templates-replica
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border-button-default bg-background-secondary-default px-2.5 py-1 text-caption-1-medium text-text-secondary">
          Context
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-background-tertiary-default" aria-hidden>
            <span className="block h-full rounded-full bg-chart-2" style={{ width: `${contextPct}%` }} />
          </span>
          <span className="tabular-nums">{contextPct}%</span>
        </span>
        <span className="ms-auto inline-flex items-center gap-1 text-caption-1-regular text-text-tertiary">
          <RiCheckLine className="size-3.5" /> {sent.length} prompt{sent.length === 1 ? "" : "s"} sent
        </span>
      </div>
    </div>
  );
}
