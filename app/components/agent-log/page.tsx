"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import {
  LogRow,
  ShimmerText,
  WorkingRow,
  useLogMotion,
  useRevealTicker,
} from "@/components/application/agent-log/agent-log";
import { LinkButton } from "@/components/base/buttons/link-button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const INSTALL_CMD = "npx boardui@latest add agent-log";

const TICKER_CODE = `const reduce = useLogMotion();
const revealed = useRevealTicker({ total: STEPS.length, run: true, stepInterval: 900 });
const done = revealed >= STEPS.length;`;

const ROWS_CODE = `<ul>
  {STEPS.slice(0, revealed).map((step, i) => (
    <LogRow key={i} first={i === 0} last={i === STEPS.length - 1 && done} reduce={reduce}>
      {step}
    </LogRow>
  ))}
  {!done && <WorkingRow label="Working on the next step…" reduce={reduce} />}
</ul>`;

const STEPS = [
  "Searching the docs for the composer spec",
  "Reading 4 sources, keeping the 2 that match",
  "Drafting the reply from the matching sources",
  "Checking the reply against the style guide",
];

function LogDemo() {
  const reduce = useLogMotion();
  const [runKey, setRunKey] = useState(0);
  const revealed = useRevealTicker({ total: STEPS.length, run: true, stepInterval: 900 });
  const done = revealed >= STEPS.length;
  return (
    <div className="flex flex-col gap-4">
      <ul key={runKey} className="flex flex-col">
        {STEPS.slice(0, revealed).map((step, i) => (
          <LogRow key={`${runKey}-${i}`} first={i === 0} last={i === STEPS.length - 1 && done} reduce={reduce}>
            <p className="py-1 text-body-regular text-text-primary">{step}</p>
          </LogRow>
        ))}
        {!done && <WorkingRow label="Working on the next step…" reduce={reduce} />}
        {done && (
          <li className="ps-4 pt-2">
            <ShimmerText>4 steps · finished in about 4 seconds</ShimmerText>
          </li>
        )}
      </ul>
      <div>
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          className="cursor-pointer rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-semibold text-text-secondary hover:text-text-primary"
        >
          Replay the log
        </button>
      </div>
    </div>
  );
}

/** Agent Log detail page. Source: registry description (no standalone docs page on boardui.com). */
export default function AgentLogPage() {
  return (
    <AppShell title="Agent Log" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Shared streaming-log machinery: the reveal ticker, the blur-in with its soft clipping edge, and the
            curved tree guide that draws itself. Behind Task List and Web Search — both are “a line of work drawing
            itself down the page”: rows arrive one at a time, each blurring in while a curved guide strokes itself
            alongside them. All of that lives here so the two cannot drift apart, and so tuning the motion means
            tuning it once.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            Four steps landing one at a time, paced by the reveal ticker, with the working row trailing until the
            last one lands.
          </p>
          <Demo>
            <LogDemo />
          </Demo>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this log machinery using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="The reveal ticker">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">useRevealTicker</code> paces the
            log, one unit per tick. Timing is one interval rather than a per-unit duration: real agent steps do not
            take equal time, so pass <code className="font-mono text-caption-1-medium text-text-primary">revealed</code> and
            drive it from real events as soon as you have them.{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">delayFor</code> lets a log dwell on
            the units that would genuinely have taken longer instead of marching at a fixed tempo.
          </p>
          <CodeBlock code={TICKER_CODE} />
        </Section>

        <Section title="Rows and the guide">
          <p className="text-body-regular text-text-secondary">
            Each <code className="font-mono text-caption-1-medium text-text-primary">LogRow</code> carries the
            blur-in, the clipping edge that keeps it from being cut as it grows, and the length of guide that
            belongs to it. The row says nothing about what it displays — that is each component&rsquo;s own
            business. <code className="font-mono text-caption-1-medium text-text-primary">WorkingRow</code> is the
            tail indicator while the log is still running, deliberately off the guide: the tree records what the
            agent did, and this is the one line that has not happened yet.
          </p>
          <CodeBlock code={ROWS_CODE} />
        </Section>

        <Section title="Behind Task List and Web Search">
          <p className="text-body-regular text-text-secondary">
            Task List and Web Search both build on this file — the same ticker, the same blur-in, the same
            drawing guide — so a streaming transcript looks the same wherever it appears.{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">useLogMotion</code> reads{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">prefers-reduced-motion</code> once
            for a whole log, and every animation falls back to a static state under it.
          </p>
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </AppShell>
  );
}
