"use client";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { homeString } from "./home-locale";
import {
  LOCALES,
  type SiteLocale,
} from "@/components/application/docs/site-locales";

const VARIANTS = [
  "for Agentic Interface",
  "for Finance Interface",
  "for Healthcare Interface",
  "for HR Management Interface",
  "for Rental Interface",
  "for Marketing Interface",
];

const WORDS = [
  "Agentic",
  "Finance",
  "Healthcare",
  "HR Management",
  "Rental",
  "Marketing"
];

const charVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 8,
    color: "var(--color-accent-500)",
    filter: "contrast(190%)",
    maskImage: "radial-gradient(circle, #000 0%, transparent 0%)",
    maskSize: `${6 + (i % 3)}px ${6 + 2 * (i % 3)}px`,
    maskPosition: `${(5 * i) % 11}px ${(7 * i) % 13}px`
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    color: "var(--color-text-primary)",
    filter: "contrast(100%)",
    maskImage: "radial-gradient(circle, #000 100%, transparent 100%)",
    maskSize: `${6 + (i % 3)}px ${6 + 2 * (i % 3)}px`,
    maskPosition: `${(3 * i + 4) % 13}px ${(11 * i + 2) % 17}px`,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
      color: { duration: 0.001, delay: 0.0836 }
    }
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -6,
    color: "var(--color-accent-500)",
    filter: "contrast(190%)",
    maskImage: "radial-gradient(circle, #000 0%, transparent 0%)",
    maskSize: `${6 + (i % 3)}px ${6 + 2 * (i % 3)}px`,
    maskPosition: `${(13 * i + 1) % 17}px ${(5 * i + 6) % 11}px`,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1],
      color: { duration: 0.001, delay: 0.072 }
    }
  })
};

const dotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.35 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.35,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] }
  }
};

function DitherText({
  text,
  visibleCount,
  shimmer = false
}: {
  text: string;
  visibleCount: number;
  shimmer?: boolean;
}) {
  const chars = useMemo(() => Array.from(text), [text]);
  const visible = chars.slice(0, visibleCount);
  const measureRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [dots, setDots] = useState<
    { left: number; characterIndex: number }[]
  >([]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.offsetWidth;
      const spacing = window.matchMedia("(min-width: 64rem)").matches ? 13 : 10;
      const next: { left: number; characterIndex: number }[] = [];

      for (let x = spacing / 2; x < width; x += spacing) {
        let characterIndex = 0;
        const elRect = el.getBoundingClientRect();

        for (let i = 0; i < charRefs.current.length; i += 1) {
          const charEl = charRefs.current[i];
          if (!charEl) continue;
          const rect = charEl.getBoundingClientRect();
          const left = rect.left - elRect.left;
          const right = left + rect.width;
          if (x >= left && x < right) {
            characterIndex = i;
            break;
          }
        }

        const ch = chars[characterIndex];
        if (ch === " " || (ch && /[gjpqy]/.test(ch))) {
          continue;
        }

        next.push({ left: x, characterIndex });
      }

      setDots(next);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [chars]);

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span
        ref={measureRef}
        aria-hidden
        className="invisible inline-flex whitespace-pre"
      >
        {chars.map((char, i) => (
          <span
            key={`${text}-measure-${i}`}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 z-10 inline-flex">
        <AnimatePresence initial={false}>
          {visible.map((char, i) => (
            <motion.span
              key={`${text}-${i}`}
              custom={i}
              className="landing-hero-dither-character inline-block"
              variants={charVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
      {shimmer && visibleCount === chars.length ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 z-20 inline-flex hero-rotating-shimmer"
          initial={{ backgroundPosition: "200% 0%" }}
          animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
          transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
          style={{
            color: "transparent",
            backgroundImage:
              "linear-gradient(110deg, var(--color-text-primary) 34%, var(--color-text-tertiary) 48%, var(--color-text-primary) 62%)",
            backgroundSize: "250% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            willChange: "background-position"
          }}
        >
          {chars.map((char, i) => (
            <span key={`${text}-shimmer-${i}`} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </motion.span>
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      >
        {dots.map((dot, i) => (
          <span
            key={`${text}-dot-slot-${i}`}
            className="absolute bottom-[2px] size-[5px] -translate-x-1/2 sm:size-[7px]"
            style={{ left: `${dot.left}px` }}
          >
            <AnimatePresence initial={false}>
              {dot.characterIndex < visibleCount ? (
                <motion.span
                  key={`${text}-dot-${i}`}
                  className="absolute inset-0 rounded-full bg-black/15"
                  variants={dotVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              ) : null}
            </AnimatePresence>
          </span>
        ))}
      </span>
    </span>
  );
}

export function HeroRotatingHeadline({
  locale,
  mobile = false,
  tablet = false,
  active = true
}: {
  locale: SiteLocale;
  mobile?: boolean;
  tablet?: boolean;
  active?: boolean;
}) {
  const isEnglish = locale === "en";
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"hold" | "exit" | "enter">("hold");
  const firstHoldRef = useRef(true);

  let word: string;
  let label = "";
  let length: number;

  if (isEnglish) {
    const rawWord = WORDS[index];
    word = rawWord;
    if (mobile) {
      if (rawWord === "HR Management") word = "HR Systems";
      if (rawWord === "Marketing") word = "Marketing UI";
    }
    label = "Interface";
    if (
      mobile &&
      (rawWord === "HR Management" ||
        rawWord === "Healthcare" ||
        rawWord === "Marketing")
    ) {
      label = "";
    } else if (tablet && rawWord === "HR Management") {
      label = "";
    }
    length = word.length + (label ? 1 + label.length : 0);
  } else {
    word = homeString(VARIANTS[index], locale);
    label = "";
    length = Array.from(word).length;
  }

  const [visibleCount, setVisibleCount] = useState(length);

  useEffect(() => {
    if (!active) return;

    let e: number;
    if (phase === "hold") {
      e = firstHoldRef.current ? 1000 : 2600;
    } else if (phase === "exit" && visibleCount === 0) {
      e = 240;
    } else if (phase === "enter" && visibleCount === length) {
      e = 300;
    } else {
      e = 45;
    }

    const timer = window.setTimeout(() => {
      if (phase === "hold") {
        firstHoldRef.current = false;
        setPhase("exit");
      } else if (phase === "exit" && visibleCount === 0) {
        setIndex((index + 1) % 6);
        setPhase("enter");
      } else if (phase === "enter" && visibleCount === length) {
        setPhase("hold");
      } else {
        setVisibleCount((c) => c + (phase === "enter" ? 1 : -1));
      }
    }, e);

    return () => {
      clearTimeout(timer);
    };
  }, [active, phase, length, visibleCount]);

  if (!isEnglish) {
    return (
      <span
        className="grid w-full text-accent-500"
        dir={LOCALES[locale].direction}
        data-site-locale-skip
      >
        <span
          aria-hidden
          className="invisible col-start-1 row-start-1"
        >
          {word}
        </span>
        <span
          aria-hidden
          className="col-start-1 row-start-1"
        >
          {Array.from(word).slice(0, visibleCount).join("")}
        </span>
        <span className="sr-only" aria-live="polite">
          {word}
        </span>
      </span>
    );
  }

  const S = Math.min(visibleCount, word.length);
  const L = label ? Math.max(0, visibleCount - word.length - 1) : 0;

  return (
    <span className="contents">
      <span className="sr-only" aria-live="polite">
        {word + (label ? " " + label : "")}
      </span>
      <DitherText text={word} visibleCount={S} shimmer={phase === "hold"} />
      {label ? (
        <>
          {" "}
          <DitherText text={label} visibleCount={L} />
        </>
      ) : null}
    </span>
  );
}