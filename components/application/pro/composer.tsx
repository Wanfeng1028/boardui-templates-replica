"use client";

import { useRef, useState } from "react";
import {
  RiArrowUpLine,
  RiAttachment2,
  RiCheckLine,
  RiImageLine,
  RiMicLine,
  RiSparklingLine,
  RiStopFill,
} from "@remixicon/react";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { cx } from "@/utils/cx";

/**
 * Composer (Pro replica) — full AI chat composer.
 * Built only from free BoardUI components (Composer Loader for the
 * liquid-glass loading state) plus mock data. Not the official Pro source.
 * Attachment + model menus, voice + send controls, status bar.
 */

const MODELS = [
  { id: "gpt-5", label: "GPT-5", hint: "Flagship · best reasoning" },
  { id: "claude-sonnet", label: "Claude Sonnet 4.5", hint: "Balanced · long context" },
  { id: "gemini-flash", label: "Gemini 2.5 Flash", hint: "Fast · cheap" },
];

const ATTACH_OPTIONS = ["Upload file", "Paste image", "Link a doc"];

export function Composer({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [status, setStatus] = useState("Ready — pick a model, type a prompt, send.");
  const timer = useRef<number | null>(null);

  const send = () => {
    const text = value.trim();
    if (!text || busy) return;
    setSent((s) => [...s, text]);
    setValue("");
    setBusy(true);
    setStatus(`Thinking with ${model.label}…`);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setStatus(`Done — ${model.label} answered in 1.8s (demo reply, no model called).`);
    }, 2200);
  };

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setBusy(false);
    setStatus("Stopped by you.");
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
          {busy && (
            <div className="flex items-center gap-2 rounded-3xl rounded-bl-md bg-background-secondary-default px-4 py-2.5 text-body-regular text-text-secondary">
              <RiSparklingLine className="size-4 animate-pulse text-foreground-icon-secondary" />
              <span className="agent-progress-loading-text">Writing the reply…</span>
            </div>
          )}
        </div>
      )}

      <ComposerLoader active={busy}>
        <div className="flex w-full flex-col rounded-[28px] bg-transparent px-3 py-2.5 shadow-none">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            rows={2}
            placeholder="Ask anything…"
            aria-label="Message"
            className="w-full resize-none bg-transparent px-1 py-1 text-body-regular text-text-primary placeholder:text-text-placeholder outline-none"
          />
          <div className="flex w-full flex-wrap items-center gap-1.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => { setAttachOpen((o) => !o); setModelOpen(false); }}
                aria-expanded={attachOpen}
                aria-label="Attach"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiAttachment2 className="size-4" />
              </button>
              {attachOpen && (
                <div className="absolute bottom-11 start-0 z-20 w-44 overflow-hidden rounded-2xl border border-border-button-default bg-background-secondary-default p-1 shadow-lg">
                  {ATTACH_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setAttachOpen(false); setStatus(`Attached: ${opt} (demo — no file uploaded).`); }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-start text-body-2-medium text-text-primary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    >
                      <RiImageLine className="size-4 text-foreground-icon-tertiary" /> {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => { setModelOpen((o) => !o); setAttachOpen(false); }}
                aria-expanded={modelOpen}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-background-tertiary-default px-3 text-body-2-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiSparklingLine className="size-4 text-foreground-icon-tertiary" />
                {model.label}
              </button>
              {modelOpen && (
                <div className="absolute bottom-11 start-0 z-20 w-64 overflow-hidden rounded-2xl border border-border-button-default bg-background-secondary-default p-1 shadow-lg">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setModel(m); setModelOpen(false); setStatus(`Model switched to ${m.label}.`); }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-start outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-body-2-medium text-text-primary">{m.label}</span>
                        <span className="block text-caption-1-regular text-text-tertiary">{m.hint}</span>
                      </span>
                      {model.id === m.id && <RiCheckLine className="size-4 shrink-0 text-accent-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ms-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRecording((r) => !r)}
                aria-pressed={recording}
                aria-label={recording ? "Stop voice input" : "Voice input"}
                className={cx(
                  "flex size-9 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  recording ? "bg-chart-5/15 text-chart-5" : "bg-background-tertiary-default text-foreground-icon-secondary hover:text-text-primary",
                )}
              >
                <RiMicLine className={cx("size-4", recording && "animate-pulse")} />
              </button>
              {busy ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop generating"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-primary-default text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiStopFill className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={send}
                  disabled={!value.trim()}
                  aria-label="Send"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white outline-none hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RiArrowUpLine className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </ComposerLoader>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-caption-1-regular text-text-tertiary">{status}</p>
        <p className="text-caption-1-regular text-text-tertiary tabular-nums">
          {sent.length} sent · {model.label}
        </p>
      </div>
      {recording && (
        <p className="flex items-center gap-2 px-1 text-caption-1-medium text-chart-5">
          <span className="flex gap-0.5" aria-hidden>
            <span className="h-3 w-0.5 animate-pulse rounded bg-current" />
            <span className="h-4 w-0.5 animate-pulse rounded bg-current" />
            <span className="h-2 w-0.5 animate-pulse rounded bg-current" />
          </span>
          Listening… tap the mic again to stop (demo).
        </p>
      )}
    </div>
  );
}
