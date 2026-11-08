"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { RiLinkedinBoxFill, RiTwitterXFill } from "@remixicon/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIALS } from "./home-data";
import { cx } from "@/utils/cx";

/**
 * Customer testimonials, as on boardui.com: the "Already used by startups
 * and developers" pill over a rotating quote — avatar, name, role and
 * company, a link to the source (LinkedIn profile, or the X post), and
 * dots to jump between the five voices. Quotes are verbatim from the
 * original (home-data.ts); only Pedro Olivares's is in the SSR HTML,
 * the other four ship in the same JS chunk as the carousel.
 *
 * Rotation matches the original: advance after max(6.5s, 240ms per word),
 * paused while hovered, and off entirely under prefers-reduced-motion.
 * The pill here is a plain chip — the original's is a liquid-glass chip,
 * which this repo has no shared component for.
 */
export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const item = TESTIMONIALS[active];

  useEffect(() => {
    if (paused || reduceMotion || TESTIMONIALS.length < 2) return;
    const words = item.quote.split(/\s+/).length;
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % TESTIMONIALS.length),
      Math.max(6500, 240 * words),
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, reduceMotion, item]);

  return (
    <section
      aria-label="What customers say"
      className="mt-10 flex w-full flex-col items-center sm:mt-11"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="mb-3 rounded-full bg-background-secondary-default px-3 py-1 text-body-2-medium whitespace-nowrap text-text-secondary">
        Already used by startups and developers
      </span>
      <div className="relative flex w-full max-w-[620px] items-start justify-center overflow-hidden px-6 [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={item.handle}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <figcaption className="grid grid-cols-[28px_auto] gap-x-2.5 gap-y-1">
              <span className="col-span-2 flex items-center justify-center gap-2.5">
                {/* Plain <img>, like the Avatar component's own photo
                    rendering: this is a static export with no image
                    optimizer server, so next/image URLs would 404. */}
                <img
                  src={item.avatar}
                  alt=""
                  width={28}
                  height={28}
                  loading="lazy"
                  decoding="async"
                  className="size-7 shrink-0 rounded-full object-cover"
                />
                <span className="flex flex-col gap-0.5 text-left">
                  <span className="text-body-medium text-text-primary">{item.name}</span>
                  <span className="flex items-center gap-1 text-caption-1-medium text-text-tertiary">
                    {item.role}{" "}
                    <a
                      href={item.company.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-500 transition-colors duration-150 ease hover:text-accent-600"
                    >
                      {item.company.label}
                    </a>
                  </span>
                </span>
              </span>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="col-start-2 flex items-center justify-self-start gap-1 text-caption-1-medium text-text-tertiary transition-colors duration-150 ease hover:text-text-secondary"
              >
                {item.platform === "linkedin" ? (
                  <>
                    <RiLinkedinBoxFill className="size-3 shrink-0" aria-hidden />
                    LinkedIn
                  </>
                ) : (
                  <>
                    <RiTwitterXFill className="size-3 shrink-0" aria-hidden />
                    @{item.handle}
                  </>
                )}
              </a>
            </figcaption>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-headline-medium text-pretty text-text-secondary transition-colors duration-150 ease hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:outline-none"
            >
              <blockquote>{item.quote}</blockquote>
            </a>
          </motion.figure>
        </AnimatePresence>
      </div>
      {TESTIMONIALS.length > 1 ? (
        <div className="mt-2 flex items-center gap-1.5">
          {TESTIMONIALS.map((entry, i) => (
            <button
              key={entry.handle}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show what ${entry.name} said`}
              aria-current={i === active}
              className="group flex h-4 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:outline-none"
            >
              <span
                className={cx(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out",
                  i === active
                    ? "w-4 bg-foreground-icon-secondary"
                    : "w-1.5 bg-foreground-icon-tertiary group-hover:bg-foreground-icon-secondary",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
