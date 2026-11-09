"use client";

import { useState } from "react";
import {
  RiArrowRightLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiComputerLine,
  RiDeviceLine,
  RiSmartphoneLine,
} from "@remixicon/react";
import Link from "next/link";

import { ButtonLink } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import {
  DISCORD_URL,
  FEATURE_ICONS,
  MCP_CURSOR_LINK,
  MCP_VSCODE_LINK,
  TIERS,
} from "./home-data";
import { homeString, localizeHomeData, type HomeData } from "./home-locale";
import type { SiteLocale } from "@/components/application/docs/site-language-config";
import { ProLogoMark } from "./pro-logo-mark";
import { TestimonialsSection } from "./testimonials";
import { cx } from "@/utils/cx";

function SectionHeading({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-title-1-medium text-text-primary">{title}</h2>
      {blurb ? <p className="max-w-2xl text-body-regular text-text-secondary">{blurb}</p> : null}
    </div>
  );
}

function ViewLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
    >
      {label}
      <RiArrowRightLine
        className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}

function ShowcaseSection({ locale, showcase }: { locale: SiteLocale; showcase: HomeData["showcase"] }) {
  return (
    <section className="flex flex-col gap-6" aria-label={homeString("Components", locale)}>
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Install command chip, as on the original (its component name
            rotates — button-group, file-upload, … — this is the first). */}
        <code className="rounded-md bg-background-secondary-default px-3 py-1.5 text-body-regular text-text-primary">
          npm boardui@latest add button-group
        </code>
        <h2 className="max-w-2xl text-title-1-medium text-text-primary">
          {homeString("Install tons of interactive dashboard components", locale)}
        </h2>
        <p className="max-w-2xl text-body-regular text-text-secondary">
          {homeString(
            "Agentic components, buttons, checkboxes, calendar or a meeting scheduler, all you need is here.",
            locale,
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/installation" variant="primary" size="medium">
            {homeString("Install for free", locale)}
          </ButtonLink>
          <ButtonLink href="/components" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
            {homeString("Browse all components", locale)}
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showcase.map((item) => (
          <article
            key={item.name}
            className="flex flex-col gap-1.5 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
          >
            <h3 className="text-body-medium text-text-primary">{item.name}</h3>
            <p className="flex-1 text-body-regular text-text-secondary">{item.blurb}</p>
            <ViewLink href={item.href} label={homeString("View {0}", locale).replace("{0}", item.name)} />
          </article>
        ))}
      </div>
    </section>
  );
}

function MultiAgentSection({ locale }: { locale: SiteLocale }) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
      <h2 className="text-title-1-medium text-text-primary">
        {homeString("Build your multi-agent interface in seconds.", locale)}
      </h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        {homeString(
          "Start with group chats, customizable agents, and smooth interactions already built. Connect your agents and make it your own.",
          locale,
        )}
      </p>
      <ButtonLink
        href="/templates/multi-agent-chat"
        variant="primary"
        size="medium"
        trailingIcon={RiArrowRightLine}
      >
        {homeString("Explore the template", locale)}
      </ButtonLink>
    </section>
  );
}

function LoaderAndTemplatesSection({ locale }: { locale: SiteLocale }) {
  return (
    <section
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      aria-label={homeString("Composer loader and templates", locale)}
    >
      <article className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
        <h2 className="text-title-2-medium text-text-primary">
          {homeString("A loading state worth staring at", locale)}
        </h2>
        <p className="text-body-regular text-text-secondary">
          {homeString(
            "Composer Loader wraps your chat input in an orbiting light while the agent works, glass controls included. Pick a color.",
            locale,
          )}
        </p>
        <ViewLink href="/components/composer-loader" label={homeString("Get the component", locale)} />
        <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
          {homeString("Included with Pro", locale)}
        </p>
      </article>
      <article className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
        <h2 className="text-title-2-medium text-text-primary">
          {homeString("Ready to go templates with BoardUI across domains", locale)}
        </h2>
        <p className="text-body-regular text-text-secondary">
          {homeString(
            "Looking for an agentic chat, a marketing dashboard, or a healthcare interface? It's already here.",
            locale,
          )}
        </p>
        <ButtonLink href="/templates" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
          {homeString("Browse all templates", locale)}
        </ButtonLink>
        <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
          {homeString("Included with Pro", locale)}
        </p>
      </article>
    </section>
  );
}

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "w-full",
  tablet: "mx-auto w-full max-w-[768px]",
  mobile: "mx-auto w-full max-w-[390px]",
};

function TemplatesSection({
  locale,
  templateCards,
}: {
  locale: SiteLocale;
  templateCards: HomeData["templateCards"];
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [active, setActive] = useState(0);
  const selected = templateCards[active];
  return (
    <section className="flex flex-col gap-6" aria-label={homeString("Templates", locale)}>
      <SectionHeading
        title={homeString("Ready to go templates with BoardUI across domains", locale)}
        blurb={homeString(
          "Looking for an agentic chat, a marketing dashboard, or a healthcare interface? It's already here.",
          locale,
        )}
      />
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label={homeString("Preview device", locale)}
          className="flex items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default p-1"
        >
          {(
            [
              { id: "desktop", label: homeString("Desktop", locale), Icon: RiComputerLine },
              { id: "tablet", label: homeString("Tablet", locale), Icon: RiDeviceLine },
              { id: "mobile", label: homeString("Mobile", locale), Icon: RiSmartphoneLine },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={device === id}
              onClick={() => setDevice(id)}
              className={cx(
                "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-body-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                device === id
                  ? "bg-background-secondary-default text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <ButtonLink href="/templates" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
          {homeString("Browse all templates", locale)}
        </ButtonLink>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <ul className="grid shrink-0 grid-cols-2 gap-2 self-start sm:grid-cols-4 lg:w-64 lg:grid-cols-1">
          {templateCards.map((card, i) => (
            <li key={card.name}>
              <button
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={cx(
                  "w-full cursor-pointer rounded-2lg px-3 py-2 text-start text-body-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  i === active
                    ? "bg-background-secondary-default text-text-primary"
                    : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
                )}
              >
                {card.name}
              </button>
            </li>
          ))}
        </ul>
        <div className={cx("min-w-0 flex-1 overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default transition-[max-width] duration-300", DEVICE_WIDTHS[device])}>
          <iframe
            key={selected.src}
            src={selected.src}
            title={`${selected.name} ${homeString("template preview", locale)}`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none h-[480px] w-full border-0"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href={selected.href} variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
          {homeString("Live preview", locale)}
        </ButtonLink>
        <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
          {homeString("Included with Pro", locale)}
        </p>
      </div>
    </section>
  );
}

function ChartsSection({ locale, charts }: { locale: SiteLocale; charts: HomeData["charts"] }) {
  return (
    <section className="flex flex-col gap-6" aria-label={homeString("Charts", locale)}>
      <SectionHeading
        title={homeString("Charts that make your data worth reading", locale)}
        blurb={homeString(
          "Radar, radial, funnel, Sankey and more - live Recharts cards with period switchers, hover focus and stat tiles, all on the same tokens.",
          locale,
        )}
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/#pricing" variant="primary" size="medium">
          {homeString("Get every chart with Pro", locale)}
        </ButtonLink>
        <ButtonLink href="/components" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
          {homeString("Browse all charts", locale)}
        </ButtonLink>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {charts.map((chart) => (
          <article
            key={chart.name}
            className="flex flex-col gap-1.5 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
          >
            <h3 className="text-body-medium text-text-primary">{chart.name}</h3>
            <p className="flex-1 text-body-regular text-text-secondary">{chart.blurb}</p>
            <ViewLink href={chart.href} label={homeString("View {0}", locale).replace("{0}", chart.name)} />
          </article>
        ))}
      </div>
    </section>
  );
}

function PricingSection({ locale, tiers }: { locale: SiteLocale; tiers: HomeData["tiers"] }) {
  return (
    <section
      id="pricing"
      className="flex scroll-mt-14 flex-col gap-6"
      aria-label={homeString("Pricing", locale)}
    >
      <SectionHeading
        title={homeString("Buy once. Build forever.", locale)}
        blurb={homeString(
          "Keep the code forever and use it in unlimited projects. Choose Pro updates for one year or forever. No subscription or auto-renewal.",
          locale,
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, tierIndex) => {
          const TitleIcon = TIERS[tierIndex].titleIcon;
          return (
            <article
              key={tier.name}
              className={cx(
                "flex flex-col gap-4 rounded-3xl border p-5",
                tier.featured
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-border-button-default bg-background-primary-default",
              )}
            >
              <div className="flex flex-col gap-1.5">
                <TitleIcon className="mb-1.5 size-6 text-foreground-icon-primary" aria-hidden />
                <h3 className="text-title-3-semibold text-text-primary">{tier.name}</h3>
                {tier.badge ? (
                  <p className="w-fit rounded-full bg-accent-500 px-2.5 py-0.5 text-caption-1-semibold text-white">
                    {tier.badge}
                  </p>
                ) : null}
                <p className="text-body-regular text-text-secondary">{tier.blurb}</p>
              </div>
              {/* Price row, as on the original: struck-through launch price,
                  current price, and the two qualifier lines beside it. */}
              <div className="flex items-center gap-3">
                <span
                  dir="ltr"
                  className="flex shrink-0 items-baseline gap-1.5 whitespace-nowrap text-text-primary"
                >
                  {tier.priceWas ? (
                    <span className="text-[24px] font-medium opacity-30 line-through">{tier.priceWas}</span>
                  ) : null}
                  <span className="text-[36px] font-semibold">{tier.price}</span>
                </span>
                <span className="flex min-w-0 flex-col text-[14px] leading-[20px] font-medium text-text-primary">
                  <span className="opacity-60">{tier.priceNote}</span>
                  <span className="opacity-35">{tier.priceSubnote}</span>
                </span>
              </div>
              <ul className="flex flex-1 flex-col gap-2">
                {tier.features.map((feature, featureIndex) => {
                  const englishFeature = TIERS[tierIndex].features[featureIndex];
                  const FeatureIcon = FEATURE_ICONS[englishFeature];
                  return (
                    <li key={feature} className="flex items-start gap-2 text-body-regular text-text-secondary">
                      {FeatureIcon === "pro-mark" ? (
                        <ProLogoMark scale={22 / 56} animated={false} className="mt-0.5" />
                      ) : FeatureIcon ? (
                        <FeatureIcon className="mt-0.5 size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
                      ) : (
                        <RiCheckLine className="mt-0.5 size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
                      )}
                      {englishFeature === "Discord access" ? (
                        <span>
                          {feature}{" "}
                          <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-text-tertiary underline"
                          >
                            {homeString("Join now", locale)}
                          </a>
                        </span>
                      ) : (
                        <span>{feature}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ButtonLink
                href={tier.href}
                variant={tier.featured ? "primary" : "secondary"}
                size="medium"
                leadingIcon={TIERS[tierIndex].ctaIcon}
              >
                {tier.cta}
              </ButtonLink>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function McpSection({ locale }: { locale: SiteLocale }) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
      <h2 className="text-title-1-medium text-text-primary">
        {homeString("Install BoardUI with your agent through MCP", locale)}
      </h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        {homeString(
          "BoardUI speaks MCP. Connect your agent once and it browses all 103 components with real usage examples, sets up your project, and writes the source files in. Pro unlocks in the same chat with your license key.",
          locale,
        )}
      </p>
      <blockquote className="rounded-2xl bg-background-primary-default px-4 py-3 text-body-medium text-text-primary">
        &ldquo;
        {homeString(
          "Set up BoardUI and build a revenue dashboard with stat cards and an area chart.",
          locale,
        )}
        &rdquo;
      </blockquote>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={MCP_CURSOR_LINK} variant="primary" size="medium">
          {homeString("Add to Cursor", locale)}
        </ButtonLink>
        <ButtonLink href={MCP_VSCODE_LINK} variant="secondary" size="medium">
          {homeString("Add to VS Code", locale)}
        </ButtonLink>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label={homeString("Also supported", locale)}>
        {["Claude Code", "Codex"].map((name) => (
          <li
            key={name}
            className="rounded-full bg-background-primary-default px-3 py-1 text-caption-1-medium text-text-secondary"
          >
            {name}
          </li>
        ))}
      </ul>
      <Link href="/mcp" className="text-body-medium text-text-secondary underline hover:text-text-primary">
        {homeString("Full setup guide and example prompts", locale)}
      </Link>
    </section>
  );
}

function GithubSection({ locale }: { locale: SiteLocale }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-1-medium text-text-primary">
        {homeString("The free tier lives on GitHub", locale)}
      </h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        {homeString(
          "Every free component, the chat starter included, is one public repo under the MIT license. Clone it, deploy it with your own model key, and star it if it saves you an afternoon.",
          locale,
        )}
      </p>
    </section>
  );
}

function FaqSection({ locale, faqItems }: { locale: SiteLocale; faqItems: HomeData["faqItems"] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-1-medium text-text-primary">
        {homeString("Frequently asked questions", locale)}
      </h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        {homeString(
          "Everything about licensing, installing and building with BoardUI. Anything else, ask us on Discord.",
          locale,
        )}
      </p>
      <div className="flex flex-col divide-y divide-separator-border rounded-3xl border border-border-button-default bg-background-primary-default px-5">
        {faqItems.map((item, i) => {
          const expanded = open === i;
          return (
            <div key={item.question}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`home-faq-panel-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="text-body-medium text-text-primary">{item.question}</span>
                <RiArrowDownSLine
                  className={cx(
                    "size-5 shrink-0 text-foreground-icon-secondary transition-transform duration-200",
                    expanded ? "rotate-180" : "",
                  )}
                  aria-hidden
                />
              </button>
              {expanded ? (
                <div id={`home-faq-panel-${i}`} className="pb-5">
                  <p className="text-body-regular text-text-secondary">{item.answer}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="text-body-medium text-text-primary">
        {homeString("Still have a question? We answer in the open, usually the same day.", locale)}
      </p>
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noreferrer"
        className="w-fit text-body-regular text-text-secondary underline hover:text-text-primary"
      >
        {homeString("Ask on Discord", locale)}
      </a>

    </section>
  );
}

function SubscribeForm({ locale }: { locale: SiteLocale }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  // This replica has no newsletter backend (the original's 49 JS chunks
  // contain no subscribe endpoint either — only /api/geo), so the form
  // never claims a signup happened: the post-submit note says so plainly.
  return done ? (
    <p className="text-body-medium text-text-primary">
      {homeString("Demo form — no newsletter backend here, so nothing was subscribed.", locale)}
    </p>
  ) : (
    <form
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim()) setDone(true);
      }}
    >
      <Input
        type="email"
        isRequired
        value={email}
        onChange={(value) => setEmail(value)}
        placeholder="you@example.com"
        aria-label={homeString("Email address", locale)}
        className="min-w-0 flex-1"
      />
      <button
        type="submit"
        className="h-11 shrink-0 cursor-pointer rounded-full bg-accent-500 px-5 text-body-medium text-white transition-colors hover:bg-accent-600"
      >
        {homeString("Subscribe", locale)}
      </button>
    </form>
  );
}

function NewsletterSection({ locale }: { locale: SiteLocale }) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
      <h2 className="text-title-1-medium text-text-primary">
        {homeString("Get new components in your inbox", locale)}
      </h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        {homeString(
          "One short email when a component, block or template ships. No digests, no drip sequences, and you can leave any time.",
          locale,
        )}
      </p>
      <SubscribeForm locale={locale} />
      <Link href="/blog" className="text-body-medium text-text-secondary underline hover:text-text-primary">
        {homeString("See all five", locale)}
      </Link>
    </section>
  );
}

function FinalCtaSection({ locale }: { locale: SiteLocale }) {
  return (
    <section className="flex flex-col items-start gap-3">
      <h2 className="text-title-1-medium text-text-primary">
        {homeString("Start building agentic interfaces with BoardUI", locale)}
      </h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        {homeString(
          "Five agent blocks, a full AI chat template, and the dashboard furniture around them. Install what you need with one command and own the code.",
          locale,
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/components" variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
          {homeString("Browse components", locale)}
        </ButtonLink>
        <ButtonLink href="/templates/ai-chat" variant="secondary" size="medium">
          {homeString("See the AI Chat template", locale)}
        </ButtonLink>
      </div>
    </section>
  );
}

export function HomeSections({
  locale = "en",
  data = localizeHomeData("en"),
}: {
  locale?: SiteLocale;
  data?: HomeData;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1276px] flex-col gap-20 px-3 py-16 sm:px-6">
      <ShowcaseSection locale={locale} showcase={data.showcase} />
      <MultiAgentSection locale={locale} />
      <LoaderAndTemplatesSection locale={locale} />
      <TemplatesSection locale={locale} templateCards={data.templateCards} />
      <ChartsSection locale={locale} charts={data.charts} />
      <PricingSection locale={locale} tiers={data.tiers} />
      <TestimonialsSection />
      <McpSection locale={locale} />
      <GithubSection locale={locale} />
      <FaqSection locale={locale} faqItems={data.faqItems} />
      <NewsletterSection locale={locale} />
      <FinalCtaSection locale={locale} />
    </div>
  );
}
