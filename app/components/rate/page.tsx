"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Rate } from "@/components/base/rate/rate";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const RATE_CODE = `{/* Five stars, half steps allowed, starts at 4 */}
<Rate count={5} allowHalf defaultValue={4} aria-label="商品评分" />`;

const HALF_CODE = `{/* allowHalf lets users click the left half of a star for x.5 values */}
<Rate count={5} allowHalf defaultValue={3.5} aria-label="允许半分" />
{/* Without allowHalf, every click lands on a whole star */}
<Rate count={5} defaultValue={4} aria-label="不允许半分" />`;

const READONLY_CODE = `{/* isDisabled + showValue renders a static, readable rating */}
<Rate count={5} isDisabled defaultValue={4.5} aria-label="商品评分" />`;

/** Rate detail page: boardui.com/components/rate, in-site. */
export default function RatePage() {
  const [rating, setRating] = useState(4);
  const ratingValueText = rating % 1 === 0 ? String(Math.floor(rating)) : rating.toFixed(1);
  const ratingText = rating > 0 ? `你的评分：${ratingValueText} 分` : "你的评分：未评分";
  return (
    <DocsLayout variant="library" title="Rate">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          评分控件让用户在有顺序的等级中选择评价分值。商品评价常用五颗星表示满意程度，并应同时显示
          &ldquo;4 分&rdquo;等可读文字。星数与是否允许半分必须与实际评价规则一致。
        </p>
        <Demo>
          <div className="flex flex-col items-center gap-3">
            <Rate
              count={5}
              allowHalf
              defaultValue={4}
              onChange={setRating}
              aria-label="商品评分"
            />
            <span className="text-body-medium text-text-secondary">
              {ratingText}
            </span>
          </div>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this rate component using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add rate</code>
            <CopyButton text="npx boardui@latest add rate" />
          </div>
        </Section>
        <Section title="Half stars">
          <p className="text-body-regular text-text-secondary">
            Pass <code className="font-mono text-body-2-medium text-text-primary">allowHalf</code> to let users
            click the left half of a star and select x.5 values. Whether half stars are allowed must match the
            actual rating rules.
          </p>
          <Demo>
            <div className="flex flex-col items-center gap-4">
              <Rate count={5} allowHalf defaultValue={3.5} aria-label="允许半分" />
              <Rate count={5} defaultValue={4} aria-label="不允许半分" />
            </div>
          </Demo>
          <Code code={HALF_CODE} />
        </Section>
        <Section title="Read-only display">
          <p className="text-body-regular text-text-secondary">
            When you only need to show a rating rather than collect one, pass{" "}
            <code className="font-mono text-body-2-medium text-text-primary">isDisabled</code> together with{" "}
            <code className="font-mono text-body-2-medium text-text-primary">showValue</code> so the stars stay
            static and the readable value is always visible.
          </p>
          <Demo>
            <Rate count={5} isDisabled defaultValue={4.5} aria-label="商品评分" />
          </Demo>
          <Code code={READONLY_CODE} />
        </Section>
        <Section title="Keyboard navigation">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">Tab</code> moves focus to the
            radiogroup, the left and right arrows step the value by one increment (half a star when{" "}
            <code className="font-mono text-body-2-medium text-text-primary">allowHalf</code> is on),{" "}
            <code className="font-mono text-body-2-medium text-text-primary">Home</code> resets it to 0, and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">End</code> jumps to the full count.
          </p>
          <Code code={RATE_CODE} />
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
