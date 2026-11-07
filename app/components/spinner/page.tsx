"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Spinner, SpinnerGlyph } from "@/components/base/spinner/spinner";
import { cx } from "@/utils/cx";

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

function ButtonSpinner({ className }: { className?: string }) {
  return <SpinnerGlyph size="sm" className={cx(className, "text-current")} />;
}

const INSTALL_CMD = "npx boardui@latest add spinner";

const COLOR_CODE = `<Spinner size="lg" />                                // accent
<Spinner size="lg" className="text-text-secondary" />  // muted
<Spinner size="lg" className="text-white" />           // on a primary surface
<Spinner size="lg" track={false} />                    // the light alone`;

const BUTTONS_CODE = `import { Button } from "@/components/base/buttons/button";
import { SpinnerGlyph } from "@/components/base/spinner/spinner";

// Button's icon slot passes a size class; the glyph keeps its own box.
function ButtonSpinner({ className }: { className?: string }) {
  return <SpinnerGlyph size="sm" className={cx(className, "text-current")} />;
}

// Busy, not disabled: the button keeps its colour, so the light stays legible.
<Button leadingIcon={pending ? ButtonSpinner : undefined} aria-busy={pending} onClick={() => !pending && publish()}>
  {pending ? "Publishing" : "Publish changes"}
</Button>`;

/** Spinner detail page, mirroring boardui.com/components/spinner. */
export default function SpinnerPage() {
  const [pending, setPending] = useState(false);
  return (
    <AppShell title="Spinner" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Show that work is under way with an orbiting light, sized for icons, buttons, and empty states.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the spinner using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            The light is drawn the way Composer Loader draws its band: the same arc at three scales, a crisp line
            with a rounded head, a tight glow, and a wide bloom. Five sizes from 12 to 32 pixels: xs, sm, md (the
            default), lg, and xl. A faint track completes the circle.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <Spinner size="xs" /> xs
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <Spinner size="sm" /> sm
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <Spinner size="md" /> md
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <Spinner size="lg" /> lg
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <Spinner size="xl" /> xl
              </span>
            </div>
          </Demo>
        </Section>

        <Section title="Colour">
          <p className="text-body-regular text-text-secondary">
            Every layer is drawn in the current text colour, accent by default. Set a text colour with className,
            and turn the track off with track set to false.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <Spinner size="lg" />
              <Spinner size="lg" className="text-text-secondary" />
              <span className="flex items-center justify-center rounded-xl bg-background-tertiary-default p-3">
                <Spinner size="lg" className="text-white" />
              </span>
              <Spinner size="lg" track={false} />
            </div>
          </Demo>
          <CodeBlock code={COLOR_CODE} />
        </Section>

        <Section title="In buttons">
          <p className="text-body-regular text-text-secondary">
            SpinnerGlyph is the bare light, for icon slots. Pass it as a Button&apos;s leading icon while a
            request is pending, and mark the button with aria-busy rather than disabling it, so it keeps its
            colour.
          </p>
          <Demo>
            <Button
              leadingIcon={pending ? ButtonSpinner : undefined}
              aria-busy={pending}
              onClick={() => {
                if (pending) return;
                setPending(true);
                window.setTimeout(() => setPending(false), 2000);
              }}
            >
              {pending ? "Publishing" : "Publish changes"}
            </Button>
          </Demo>
          <CodeBlock code={BUTTONS_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            A Spinner is announced as an indeterminate progress bar named Loading. Rename it with aria-label, or
            hide it with aria-hidden where the surrounding control already says it is busy. Reduced motion slows
            the orbit instead of stopping it, because the movement is what says the work is still going.
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
