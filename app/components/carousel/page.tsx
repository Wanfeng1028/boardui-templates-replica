"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Carousel, CarouselItem } from "@/components/base/carousel/carousel";

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

const INSTALL_CMD = "npx boardui@latest add carousel";

const WIDTHS_CODE = `{/* One card per slide is the default: items fill the track */}
<CarouselItem>…</CarouselItem>

{/* Override to show a peek of the next card, or to mix widths */}
<CarouselItem className="w-[85%]">…</CarouselItem>
<CarouselItem className="w-[220px]">…</CarouselItem>`;

const CONTROLS_CODE = `{/* Snap each card to the middle of the track */}
<Carousel aria-label="Gallery" align="center" gap={24}>…</Carousel>

{/* Bare track: no arrows, no dots, swipe only */}
<Carousel aria-label="Logos" showArrows={false} showDots={false}>…</Carousel>`;

const SLIDES = [
  { src: "/carousel/kitchen.webp", alt: "Kitchen" },
  { src: "/carousel/space-squid.webp", alt: "Space squid" },
  { src: "/carousel/sunrise.webp", alt: "Sunrise" },
];

/** Carousel detail page, mirroring boardui.com/components/carousel. */
export default function CarouselPage() {
  return (
    <AppShell title="Carousel" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A gallery you slide through, one card at a time. Built on native scrolling with CSS scroll-snap, so
            touch swipe, trackpad gestures and keyboard scrolling all work on their own; the arrows and the position
            indicator are the only parts that need JavaScript.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this carousel using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="Card widths">
          <p className="text-body-regular text-text-secondary">
            Each item fills the track by default, so exactly one card is in view per slide. Width lives on
            CarouselItem rather than on the track, so overriding it gives a peek of the next card or a run of mixed
            widths. Positions are read back from the DOM rather than calculated from a fixed card width, so nothing
            needs telling when those widths change.
          </p>
          <Demo>
            <Carousel aria-label="Gallery">
              {SLIDES.map((slide) => (
                <CarouselItem key={slide.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.src} alt={slide.alt} className="h-[180px] w-full rounded-2lg object-cover" />
                </CarouselItem>
              ))}
            </Carousel>
          </Demo>
          <CodeBlock code={WIDTHS_CODE} />
        </Section>

        <Section title="Alignment and controls">
          <p className="text-body-regular text-text-secondary">
            align=&quot;center&quot; rests each card in the middle of the track instead of the left edge, which suits a
            gallery with one hero card in view. showArrows and showDots strip the chrome back to a bare swipeable
            track, and gap sets the spacing in pixels.
          </p>
          <Demo>
            <Carousel aria-label="Gallery centered" align="center" gap={24}>
              {SLIDES.map((slide) => (
                <CarouselItem key={slide.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.src} alt={slide.alt} className="h-[180px] w-full rounded-2lg object-cover" />
                </CarouselItem>
              ))}
            </Carousel>
          </Demo>
          <CodeBlock code={CONTROLS_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            The region announces itself as a carousel and takes its name from aria-label, which is required. Each
            card is labelled with its position, so a screen reader reads “3 of 7” without you numbering anything.
            The track is focusable, so the arrow keys scroll it, and the prev/next buttons disable at the ends
            rather than silently doing nothing. Sliding respects prefers-reduced-motion, jumping instead of
            animating.
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
