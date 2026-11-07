"use client";

import { useState } from "react";
import Link from "next/link";
import { parseColor } from "react-aria-components";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { ColorPicker, ColorWell } from "@/components/base/color-picker/color-picker";
import { DirectionProvider } from "@/components/foundations/direction/direction";

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

const INSTALL_CMD = "npx boardui@latest add color-picker";

const PRESETS = ["#6366f1", "#22c55e", "#f97316", "#eab308", "#ec4899"];

const WELL_CODE = `import { ColorWell } from "@/components/base/color-picker/color-picker";

<ColorWell aria-label="Bug color" value={color} onChange={setColor} swatches={presets} wellClassName="size-6" />`;

const ALPHA_CODE = `const [color, setColor] = useState(parseColor("rgba(99, 102, 241, 0.6)"));

<ColorPicker value={color} onChange={setColor} showAlpha />`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <ColorPicker defaultValue="#22c55e" />
  <ColorWell aria-label="لون العلامة" defaultValue="#f97316" />
</DirectionProvider>`;

/** Color Picker detail page, mirroring boardui.com/components/color-picker. */
export default function ColorPickerPage() {
  const [color, setColor] = useState(() => parseColor("#6366f1"));
  const [translucent, setTranslucent] = useState(() => parseColor("rgba(99, 102, 241, 0.6)"));

  return (
    <AppShell title="Color Picker" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Let people choose a brand color, a label color, or a chart series by eye, by hex, or from your presets.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this color picker component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Editor">
          <p className="text-body-regular text-text-secondary">
            Saturation field, hue and opacity rails, hex field and presets, inline or behind a swatch popover.
          </p>
          <Demo>
            <div className="flex flex-wrap items-start gap-6">
              <ColorPicker value={color} onChange={setColor} swatches={PRESETS} />
              <div className="flex flex-col gap-1 text-body-regular text-text-secondary">
                <span className="text-body-medium text-text-primary">Brand color</span>
                <span>hex {color.toString("hex")}</span>
                <span>rgb {color.toString("rgb")}</span>
                <span>hsl {color.toString("hsl")}</span>
              </div>
            </div>
          </Demo>
        </Section>

        <Section title="Color well">
          <p className="text-body-regular text-text-secondary">
            Where space is tight, ColorWell shows the color as a round swatch and opens the same editor in a
            popover. Size the swatch with wellClassName.
          </p>
          <Demo>
            <div className="flex items-center gap-3">
              <ColorWell aria-label="Bug color" value={color} onChange={setColor} swatches={PRESETS} wellClassName="size-6" />
              <span className="text-body-regular text-text-secondary">Bug color — {color.toString("hex")}</span>
            </div>
          </Demo>
          <CodeBlock code={WELL_CODE} />
        </Section>

        <Section title="Opacity">
          <p className="text-body-regular text-text-secondary">
            showAlpha adds an opacity rail over a checkerboard, so a translucent color reads as translucent. Read
            the value back with color.getChannelValue(&quot;alpha&quot;), or as CSS with color.toString(&quot;css&quot;).
          </p>
          <Demo>
            <div className="flex flex-wrap items-start gap-6">
              <ColorPicker value={translucent} onChange={setTranslucent} showAlpha />
              <div className="flex flex-col gap-1 text-body-regular text-text-secondary">
                <span>css {translucent.toString("css")}</span>
                <span>{"Alpha " + Math.round(translucent.getChannelValue("alpha") * 100) + "%"}</span>
              </div>
            </div>
          </Demo>
          <CodeBlock code={ALPHA_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the rails run from the right and the swatch moves to the right of the hex
            field, which stays left to right.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="flex flex-wrap items-start gap-6">
                <ColorPicker defaultValue="#22c55e" />
                <ColorWell aria-label="لون العلامة" defaultValue="#f97316" />
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Tab moves through the field, the hue rail, the opacity rail, the hex field, and the presets. Arrow keys
            nudge saturation and brightness in the field and the hue on the rail, and Shift with an arrow takes a
            bigger step. The hex field takes any CSS color and commits on Enter or when it loses focus. Each control
            is announced with its channel and value.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
