"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Questionnaire (Pro replica) — Plan-mode question card.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * One question per step, checkbox or numbered rows, free-text "Other" row,
 * step pills, Previous / Next, card height slides per question.
 */

type Option = { label: string; hint?: string };
type Question = {
  title: string;
  kind: "multi" | "single";
  options: Option[];
  other?: boolean;
};

const QUESTIONS: Question[] = [
  {
    title: "What should the agent build first?",
    kind: "single",
    options: [
      { label: "Landing page", hint: "Hero, pricing, signup" },
      { label: "Dashboard", hint: "KPIs, charts, tables" },
      { label: "Chat experience", hint: "Composer, threads, history" },
    ],
    other: true,
  },
  {
    title: "Which integrations do you need?",
    kind: "multi",
    options: [
      { label: "GitHub", hint: "Repos and pull requests" },
      { label: "Slack", hint: "Notifications and threads" },
      { label: "Google Drive", hint: "Docs and files" },
    ],
    other: true,
  },
  {
    title: "How should it look?",
    kind: "single",
    options: [
      { label: "Light and airy", hint: "Soft neutrals, big type" },
      { label: "Dark and dense", hint: "Pro console feel" },
      { label: "Match our brand", hint: "Upload a style guide" },
    ],
  },
];

export function Questionnaire({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<number, string[]>>({});
  const [otherText, setOtherText] = useState<Record<number, string>>({});
  const [showOther, setShowOther] = useState<Record<number, boolean>>({});
  const q = QUESTIONS[step];
  const last = step === QUESTIONS.length - 1;

  const toggle = (label: string) => {
    setPicked((m) => {
      const cur = m[step] ?? [];
      if (q.kind === "single") return { ...m, [step]: [label] };
      return { ...m, [step]: cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label] };
    });
  };

  const answered = (picked[step] ?? []).length > 0 || (otherText[step] ?? "").trim().length > 0;

  return (
    <div className={cx("flex w-full flex-col gap-4 rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <div className="flex w-full flex-wrap items-center gap-1.5" aria-label={`Step ${step + 1} of ${QUESTIONS.length}`}>
        {QUESTIONS.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setStep(i)}
            className={cx(
              "flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-caption-1-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              i === step
                ? "bg-accent-500 text-white"
                : i < step
                  ? "bg-chart-3/15 text-chart-3"
                  : "bg-background-tertiary-default text-text-secondary",
            )}
          >
            {i < step ? <RiCheckLine className="size-3.5" /> : <span className="tabular-nums">{i + 1}</span>}
            <span className="hidden sm:inline">Step {i + 1}</span>
          </button>
        ))}
        <span className="ms-auto text-caption-1-regular text-text-tertiary">
          Question {step + 1} of {QUESTIONS.length}
        </span>
      </div>

      <div key={step} className="flex w-full flex-col gap-3">
        <p className="text-title-3-semibold text-text-primary">{q.title}</p>
        <div className="flex w-full flex-col gap-2">
          {q.options.map((opt, i) => {
            const active = (picked[step] ?? []).includes(opt.label);
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => toggle(opt.label)}
                aria-pressed={active}
                className={cx(
                  "flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  active
                    ? "border-accent-500 bg-accent-50"
                    : "border-border-button-default bg-background-primary-default hover:border-border-button-hover",
                )}
              >
                <span
                  className={cx(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-caption-1-semibold tabular-nums",
                    active ? "border-accent-500 bg-accent-500 text-white" : "border-border-button-default text-text-secondary",
                  )}
                >
                  {q.kind === "multi" ? (active ? <RiCheckLine className="size-3.5" /> : null) : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-medium text-text-primary">{opt.label}</span>
                  {opt.hint && <span className="block truncate text-body-2-regular text-text-secondary">{opt.hint}</span>}
                </span>
              </button>
            );
          })}
          {q.other && (
            <div className="flex w-full flex-col gap-2 rounded-2xl border border-border-button-default bg-background-primary-default px-3.5 py-3">
              <button
                type="button"
                onClick={() => setShowOther((m) => ({ ...m, [step]: !m[step] }))}
                aria-expanded={!!showOther[step]}
                className="flex w-full cursor-pointer items-center gap-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring rounded-lg"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border-button-default text-caption-1-semibold text-text-secondary">+</span>
                <span className="text-body-medium text-text-primary">Other</span>
                <span className="ms-auto text-caption-1-regular text-text-tertiary">Free text</span>
              </button>
              {showOther[step] && (
                <input
                  value={otherText[step] ?? ""}
                  onChange={(e) => setOtherText((m) => ({ ...m, [step]: e.target.value }))}
                  placeholder="Describe it in your own words…"
                  className="w-full rounded-xl border border-border-button-default bg-background-secondary-default px-3 py-2 text-body-regular text-text-primary placeholder:text-text-placeholder outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2 border-t border-separator-border pt-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-background-tertiary-default px-3.5 py-2 text-body-2-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RiArrowLeftLine className="size-4" /> Previous
        </button>
        {last ? (
          <button
            type="button"
            disabled={!answered}
            onClick={() => window.alert("Plan drafted from your answers (demo).")}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-body-2-medium text-white outline-none hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
          >
            Draft plan <RiCheckLine className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!answered}
            onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-body-2-medium text-white outline-none hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <RiArrowRightLine className="size-4" />
          </button>
        )}
      </div>
      {!answered && (
        <p className="text-caption-1-regular text-text-tertiary">Pick an option (or write an “Other”) to continue.</p>
      )}
    </div>
  );
}
