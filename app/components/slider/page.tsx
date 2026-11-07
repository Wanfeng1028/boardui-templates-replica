"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiEqualizerLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { RangeSlider, Slider } from "@/components/base/slider/slider";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        void navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
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

const RANGE_CODE = `<RangeSlider
  label="Price range"
  defaultValue={[200, 800]}
  minValue={0}
  maxValue={1000}
  step={50}
  formatValue={(value) => currency.format(value)}
/>`;

const CONTROLLED_CODE = `const [volume, setVolume] = useState(40);
const [priceRange, setPriceRange] = useState([200, 800]);

<Slider value={volume} onChange={setVolume} />

<RangeSlider
  value={priceRange}
  onChange={setPriceRange}
  onChangeEnd={(range) => saveRange(range)}
/>`;

const STATES_CODE = `<Slider defaultValue={64} />

{/* Hide the exact-value bubble when the surrounding UI shows the value */}
<Slider defaultValue={36} showTooltip={false} />

<RangeSlider defaultValue={[20, 70]} isDisabled />`;

/** Slider detail page: boardui.com/components/slider, in-site. */
export default function SliderPage() {
  const [volume, setVolume] = useState(40);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 800]);
  const [savedRange, setSavedRange] = useState<[number, number] | null>(null);
  return (
    <AppShell title="Slider" icon={RiEqualizerLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A polished range input in BoardUI&apos;s visual language - neutral inset track, blue gradient selection,
          embossed thumbs, and exact-value bubbles. Use Slider for one value or RangeSlider for min/max selection;
          both include accessible hidden inputs, drag behavior, keyboard controls, and RTL support through React
          Aria.
        </p>
        <Demo>
          <div className="w-full max-w-[420px]">
            <Slider defaultValue={64} />
          </div>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the slider component using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add slider</code>
            <CopyButton text="npx boardui@latest add slider" />
          </div>
        </Section>
        <Section title="Min and max range">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">RangeSlider</code> renders two labeled
            thumbs. The selected interval fills between them, each bubble shows its exact value, and the thumbs cannot
            cross. Use <code className="font-mono text-body-2-medium text-text-primary">minValue</code>,{" "}
            <code className="font-mono text-body-2-medium text-text-primary">maxValue</code>, and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">step</code> to define the allowed range.
          </p>
          <Demo>
            <div className="w-full max-w-[420px]">
              <RangeSlider
                label="Price range"
                defaultValue={[200, 800]}
                minValue={0}
                maxValue={1000}
                step={50}
                formatValue={(value) => currency.format(value)}
              />
            </div>
          </Demo>
          <Code code={RANGE_CODE} />
        </Section>
        <Section title="Controlled values">
          <p className="text-body-regular text-text-secondary">
            Use <code className="font-mono text-body-2-medium text-text-primary">value</code> and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onChange</code> for live controlled
            state. <code className="font-mono text-body-2-medium text-text-primary">onChangeEnd</code> fires after
            dragging or keyboard input finishes, which is useful for saving a value without sending an update for
            every movement.
          </p>
          <Demo>
            <div className="flex w-full max-w-[420px] flex-col gap-6">
              <Slider value={volume} onChange={setVolume} />
              <RangeSlider
                value={priceRange}
                onChange={(v) => setPriceRange([v[0], v[1]])}
                onChangeEnd={(range) => setSavedRange([range[0], range[1]])}
              />
              <p className="text-body-2-regular text-text-secondary">
                Volume: {volume} · Range: {currency.format(priceRange[0])} – {currency.format(priceRange[1])}
                {savedRange
                  ? ` · Saved: ${currency.format(savedRange[0])} – ${currency.format(savedRange[1])}`
                  : ""}
              </p>
            </div>
          </Demo>
          <Code code={CONTROLLED_CODE} />
        </Section>
        <Section title="Value bubbles and states">
          <p className="text-body-regular text-text-secondary">
            Exact-value bubbles are visible by default. Format them with{" "}
            <code className="font-mono text-body-2-medium text-text-primary">formatValue</code>, or set{" "}
            <code className="font-mono text-body-2-medium text-text-primary">showTooltip={`{false}`}</code> when the
            value already appears elsewhere. Disabled sliders retain their values and accessible labels while
            preventing input.
          </p>
          <Demo>
            <div className="flex w-full max-w-[420px] flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-text-secondary">Exact value</span>
                <Slider defaultValue={64} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-text-secondary">Without value bubble</span>
                <Slider defaultValue={36} showTooltip={false} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-text-secondary">Disabled range</span>
                <RangeSlider defaultValue={[20, 70]} isDisabled />
              </div>
            </div>
          </Demo>
          <Code code={STATES_CODE} />
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
