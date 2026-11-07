"use client";

import { useState } from "react";
import { RiExternalLinkLine, RiRefreshLine, RiSearchLine } from "@remixicon/react";
import { LogRow, ShimmerText, WorkingRow, useLogMotion, useRevealTicker } from "@/components/application/agent-log/agent-log";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * Web Search (Pro replica) — streaming research trail.
 * Built only from free BoardUI components (Agent Log ticker + tree guide)
 * plus mock data. Not the official Pro source.
 * Queries appear one at a time; each query reveals its sources. Sources that
 * point at this site (boardui.com) are real links; sources that point at
 * third-party doc sites (ai-sdk.dev, platform.openai.com, perplexity.ai,
 * developer.mozilla.org) are mock results rendered as plain text, not links,
 * so clicking around this site never jumps out to someone else's website.
 */

type Source = { title: string; site: string; url: string };
type QueryStep = { query: string; sources: Source[] };

const STEPS: QueryStep[] = [
  {
    query: "BoardUI design system components",
    sources: [
      { title: "BoardUI — Components", site: "boardui.com", url: "/components" },
      { title: "BoardUI — Getting started", site: "boardui.com", url: "/components" },
    ],
  },
  {
    query: "streaming agent research UI patterns",
    sources: [
      { title: "Vercel AI SDK — Streaming", site: "ai-sdk.dev", url: "https://ai-sdk.dev/docs/ai-sdk-core/streaming" },
      { title: "OpenAI — Streaming responses", site: "platform.openai.com", url: "https://platform.openai.com/docs/guides/streaming-responses" },
    ],
  },
  {
    query: "how to cite sources in AI answers",
    sources: [
      { title: "Perplexity — How citations work", site: "perplexity.ai", url: "https://www.perplexity.ai/hub/blog/how-perplexity-citations-work" },
      { title: "MDN — The Anchor element", site: "developer.mozilla.org", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a" },
    ],
  },
];

function WebSearchLog({ runKey }: { runKey: number }) {
  const reduce = useLogMotion();
  const revealed = useRevealTicker({ total: STEPS.length, run: true });
  const done = revealed >= STEPS.length;

  return (
    <>
      <ul className="flex w-full flex-col">
        {STEPS.slice(0, revealed).map((step, i) => (
          <LogRow key={`${runKey}-${i}`} first={i === 0} last={i === STEPS.length - 1 && done} reduce={reduce}>
            <div className="flex flex-col gap-1.5 py-1">
              <p className="text-body-medium text-text-primary">
                <span className="text-text-tertiary">Searched </span>“{step.query}”
              </p>
              <div className="flex flex-wrap gap-1.5">
                {step.sources.map((s) => {
                  const external = s.url.startsWith("http");
                  const chipClass =
                    "inline-flex max-w-full items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-medium text-text-secondary outline-none";
                  if (external) {
                    // Mock result pointing at a third-party doc site: plain
                    // text, not a link, so this demo never jumps off-site.
                    return (
                      <span
                        key={s.url}
                        title="Demo result — not a link"
                        className={cx(chipClass, "cursor-default")}
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-chart-2" aria-hidden />
                        <span className="truncate">{s.title}</span>
                        <span className="shrink-0 text-text-tertiary">· {s.site}</span>
                      </span>
                    );
                  }
                  return (
                    <a
                      key={s.url}
                      href={s.url}
                      className={cx(
                        chipClass,
                        "transition-colors hover:border-border-button-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      )}
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-chart-2" aria-hidden />
                      <span className="truncate">{s.title}</span>
                      <span className="shrink-0 text-text-tertiary">· {s.site}</span>
                      <RiExternalLinkLine className="size-3 shrink-0 text-foreground-icon-tertiary" />
                    </a>
                  );
                })}
              </div>
            </div>
          </LogRow>
        ))}
        {!done && (
          <WorkingRow label="Searching the web…" reduce={reduce} />
        )}
        {done && (
          <li className="ps-4 pt-1">
            <p className="text-body-2-regular text-text-secondary">
              <ShimmerText>3 queries · 6 sources opened</ShimmerText>
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export function WebSearch({ className }: { className?: string }) {
  const [runKey, setRunKey] = useState(0);
  return (
    <div className={cx("flex w-full flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RiSearchLine className="size-4 text-foreground-icon-secondary" />
          <p className="text-title-3-semibold text-text-primary">Web search</p>
          <span className="rounded-full bg-background-tertiary-default px-2 py-0.5 text-caption-1-medium text-text-secondary">
            Streaming research trail
          </span>
        </div>
        <Button
          variant="secondary"
          size="small"
          leadingIcon={RiRefreshLine}
          onClick={() => setRunKey((k) => k + 1)}
        >
          Replay
        </Button>
      </div>
      <WebSearchLog key={runKey} runKey={runKey} />
    </div>
  );
}
