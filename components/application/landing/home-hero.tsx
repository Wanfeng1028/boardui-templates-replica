"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  RiArrowRightLine,
  RiAsterisk,
  RiBankLine,
  RiCalendarLine,
  RiChatAiLine,
  RiDashboardLine,
  RiImageAiLine,
  RiKanbanView2,
  RiMegaphoneLine,
  RiUserSmileLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import Link from "next/link";

import { ButtonLink } from "@/components/base/buttons/button";
import { HeroRays } from "@/components/application/landing/hero-rays/hero-rays";
import { HERO_RAYS_DEFAULTS } from "@/components/application/landing/hero-rays/hero-rays-config";
import { useThemeMode } from "@/components/application/theme/theme-toggle";
import { HeroRotatingHeadline } from "./hero-rotating-headline";
import { TECH_BADGES } from "./home-data";
import { homeString, localizeHomeData, type HomeData } from "./home-locale";
import { chromeString } from "@/components/application/docs/locale-chrome";
import type { SiteLocale } from "@/components/application/docs/site-language-config";
import { cx } from "@/utils/cx";

const TAB_ICONS: Record<string, RemixiconComponentType> = {
  "/templates/dashboard": RiDashboardLine,
  "/templates/project-board": RiKanbanView2,
  "/templates/marketing": RiMegaphoneLine,
  "/templates/calendar": RiCalendarLine,
  "/templates/finance": RiBankLine,
  "/templates/medical-profile": RiAsterisk,
  "/templates/ai-chat": RiChatAiLine,
  "/templates/ai-image-generation": RiImageAiLine,
  "/templates/ai-profile": RiUserSmileLine,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Home hero, as on boardui.com: ray field behind a centred headline,
 * "New BoardUI Pro is out" badge to #pricing, "Get Pro" /
 * "Start for free" CTAs, version badges, and a live template preview
 * below with the original's sidebar-rail tabs (Home, Project board, …).
 * The preview is an iframe of this site's own template routes — the
 * original embeds its live dashboard the same way — with pointer events
 * off so it never traps page scroll; the active tab's "Open template"
 * link goes to the live page.
 */
export function HomeHero({
  locale = "en",
  data = localizeHomeData("en"),
}: {
  locale?: SiteLocale;
  data?: HomeData;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const theme = useThemeMode();
  const rays = useMemo(
    () =>
      theme === "dark"
        ? {
            ...HERO_RAYS_DEFAULTS,
            background: HERO_RAYS_DEFAULTS.backgroundDark,
            grain: HERO_RAYS_DEFAULTS.grainDark,
          }
        : HERO_RAYS_DEFAULTS,
    [theme],
  );

  const heroPreviewTabs = data.heroPreviewTabs;
  const tab = heroPreviewTabs[active];

  return (
    <section aria-label={homeString("BoardUI introduction", locale)} className="relative overflow-clip">
      <div
        aria-hidden
        style={{ "--hero-shader-height": "1060px" } as CSSProperties}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden select-none sm:h-[620px] lg:h-[var(--hero-shader-height)]"
      >
        <HeroRays config={rays} paused={reduceMotion} priority className="absolute inset-0 size-full" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-start px-6 pt-12 text-start sm:items-center sm:pt-16 sm:text-center">
        <Link
          href="#pricing"
          className="flex items-center gap-2 rounded-full border border-border-button-default bg-background-secondary-default py-1 ps-1 pe-3 text-caption-1-semibold text-text-primary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <span className="rounded-full bg-accent-500 px-1.5 py-px text-caption-1-semibold text-white">{homeString("NEW", locale)}</span>
          {homeString("BoardUI Pro is out", locale)}
        </Link>
        <h1 className="mt-5 text-[32px] leading-[38px] font-medium tracking-[-0.02em] text-text-primary sm:text-[48px] sm:leading-[56px]">
          <span className="block">{homeString("React Design System", locale)}</span>
          {locale === "en" ? (
            <span className="flex w-full justify-start sm:justify-center">
              <span className="flex max-w-full items-baseline justify-start sm:inline-flex sm:justify-center">
                <span className="shrink-0">for&nbsp;</span>
                <span className="flex min-w-0 flex-1 flex-wrap gap-x-[0.25em] sm:inline-flex sm:flex-none sm:flex-nowrap">
                  <span className="contents sm:hidden">
                    <HeroRotatingHeadline locale={locale} mobile active={!reduceMotion} />
                  </span>
                  <span className="contents hidden sm:contents">
                    <HeroRotatingHeadline locale={locale} active={!reduceMotion} />
                  </span>
                </span>
              </span>
            </span>
          ) : (
            <HeroRotatingHeadline locale={locale} active={!reduceMotion} />
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-body-regular text-pretty text-text-secondary">
          {homeString(
            "BoardUI is a React design system with 103 unique components, including 19 data charts, plus 10 Pro templates and 400+ design tokens, designed in Figma.",
            locale,
          )}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-start gap-3 sm:justify-center">
          <ButtonLink href="#pricing" variant="primary" size="medium">
            {chromeString("Get Pro", locale)}
          </ButtonLink>
          <ButtonLink href="/installation" variant="secondary" size="medium">
            {homeString("Start for free", locale)}
          </ButtonLink>
        </div>
        <ul
          className="mt-6 flex flex-wrap items-center justify-start gap-2 sm:justify-center"
          aria-label={homeString("Supported versions", locale)}
        >
          {TECH_BADGES.map((badge) => (
            <li
              key={badge}
              className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary"
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mx-auto mt-10 w-full max-w-[1276px] px-3 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default">
          <div
            role="tablist"
            aria-label={homeString("Template previews", locale)}
            className="flex gap-1 overflow-x-auto border-b border-separator-border p-2"
          >
            {heroPreviewTabs.map((item, i) => {
              const Icon = TAB_ICONS[item.href] ?? RiDashboardLine;
              const selected = i === active;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={cx(
                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-2lg px-3 py-2 text-body-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    selected
                      ? "bg-background-secondary-default text-text-primary"
                      : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="relative h-[480px] bg-background-secondary-default sm:h-[560px]">
            <iframe
              key={tab.src}
              src={tab.src}
              title={`${tab.label} template preview`}
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none size-full border-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-separator-border px-4 py-3">
            <p className="text-body-regular text-text-secondary">
              {tab.label} {homeString("template — live preview", locale)}
            </p>
            <span className="flex flex-wrap items-center gap-3">
              <Link
                href={tab.href}
                className="group inline-flex items-center gap-1 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {homeString("Open template", locale)}
                <RiArrowRightLine className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <ButtonLink href="/templates" variant="secondary" size="small" leadingIcon={RiDashboardLine}>
                {homeString("Browse all templates", locale)}
              </ButtonLink>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
