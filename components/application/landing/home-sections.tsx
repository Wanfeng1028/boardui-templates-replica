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
  CHARTS,
  DISCORD_URL,
  FAQ_ITEMS,
  FEATURE_ICONS,
  MCP_CURSOR_LINK,
  MCP_VSCODE_LINK,
  SHOWCASE,
  TEMPLATE_CARDS,
  TIERS,
} from "./home-data";
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

function ShowcaseSection() {
  return (
    <section className="flex flex-col gap-6" aria-label="Components">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Install command chip, as on the original (its component name
            rotates — button-group, file-upload, … — this is the first). */}
        <code className="rounded-md bg-background-secondary-default px-3 py-1.5 text-body-regular text-text-primary">
          npm boardui@latest add button-group
        </code>
        <h2 className="max-w-2xl text-title-1-medium text-text-primary">
          Install tons of interactive dashboard components
        </h2>
        <p className="max-w-2xl text-body-regular text-text-secondary">
          Agentic components, buttons, checkboxes, calendar or a meeting scheduler, all you need is here.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/installation" variant="primary" size="medium">
            Install for free
          </ButtonLink>
          <ButtonLink href="/components" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
            Browse all components
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHOWCASE.map((item) => (
          <article
            key={item.name}
            className="flex flex-col gap-1.5 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
          >
            <h3 className="text-body-medium text-text-primary">{item.name}</h3>
            <p className="flex-1 text-body-regular text-text-secondary">{item.blurb}</p>
            <ViewLink href={item.href} label={`View ${item.name}`} />
          </article>
        ))}
      </div>
    </section>
  );
}

function MultiAgentSection() {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
      <h2 className="text-title-1-medium text-text-primary">Build your multi-agent interface in seconds.</h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        Start with group chats, customizable agents, and smooth interactions already built. Connect your agents
        and make it your own.
      </p>
      <ButtonLink
        href="/templates/multi-agent-chat"
        variant="primary"
        size="medium"
        trailingIcon={RiArrowRightLine}
      >
        Explore the template
      </ButtonLink>
    </section>
  );
}

function LoaderAndTemplatesSection() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Composer loader and templates">
      <article className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
        <h2 className="text-title-2-medium text-text-primary">A loading state worth staring at</h2>
        <p className="text-body-regular text-text-secondary">
          Composer Loader wraps your chat input in an orbiting light while the agent works, glass controls
          included. Pick a color.
        </p>
        <ViewLink href="/components/composer-loader" label="Get the component" />
        <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
          Included with Pro
        </p>
      </article>
      <article className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
        <h2 className="text-title-2-medium text-text-primary">
          Ready to go templates with BoardUI across domains
        </h2>
        <p className="text-body-regular text-text-secondary">
          Looking for an agentic chat, a marketing dashboard, or a healthcare interface? It&apos;s already here.
        </p>
        <ButtonLink href="/templates" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
          Browse all templates
        </ButtonLink>
        <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
          Included with Pro
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

function TemplatesSection() {
  const [device, setDevice] = useState<Device>("desktop");
  const [active, setActive] = useState(0);
  const selected = TEMPLATE_CARDS[active];
  return (
    <section className="flex flex-col gap-6" aria-label="Templates">
      <SectionHeading
        title="Ready to go templates with BoardUI across domains"
        blurb="Looking for an agentic chat, a marketing dashboard, or a healthcare interface? It's already here."
      />
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label="Preview device"
          className="flex items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default p-1"
        >
          {(
            [
              { id: "desktop", label: "Desktop", Icon: RiComputerLine },
              { id: "tablet", label: "Tablet", Icon: RiDeviceLine },
              { id: "mobile", label: "Mobile", Icon: RiSmartphoneLine },
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
          Browse all templates
        </ButtonLink>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <ul className="grid shrink-0 grid-cols-2 gap-2 self-start sm:grid-cols-4 lg:w-64 lg:grid-cols-1">
          {TEMPLATE_CARDS.map((card, i) => (
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
            title={`${selected.name} template preview`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none h-[480px] w-full border-0"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href={selected.href} variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
          Live preview
        </ButtonLink>
        <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
          Included with Pro
        </p>
      </div>
    </section>
  );
}

function ChartsSection() {
  return (
    <section className="flex flex-col gap-6" aria-label="Charts">
      <SectionHeading
        title="Charts that make your data worth reading"
        blurb="Radar, radial, funnel, Sankey and more - live Recharts cards with period switchers, hover focus and stat tiles, all on the same tokens."
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/#pricing" variant="primary" size="medium">
          Get every chart with Pro
        </ButtonLink>
        <ButtonLink href="/components" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
          Browse all charts
        </ButtonLink>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CHARTS.map((chart) => (
          <article
            key={chart.name}
            className="flex flex-col gap-1.5 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
          >
            <h3 className="text-body-medium text-text-primary">{chart.name}</h3>
            <p className="flex-1 text-body-regular text-text-secondary">{chart.blurb}</p>
            <ViewLink href={chart.href} label={`View ${chart.name}`} />
          </article>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="flex scroll-mt-14 flex-col gap-6" aria-label="Pricing">
      <SectionHeading
        title="Buy once. Build forever."
        blurb="Keep the code forever and use it in unlimited projects. Choose Pro updates for one year or forever. No subscription or auto-renewal."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => {
          const TitleIcon = tier.titleIcon;
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
                {tier.features.map((feature) => {
                  const FeatureIcon = FEATURE_ICONS[feature];
                  return (
                    <li key={feature} className="flex items-start gap-2 text-body-regular text-text-secondary">
                      {FeatureIcon === "pro-mark" ? (
                        <ProLogoMark scale={22 / 56} animated={false} className="mt-0.5" />
                      ) : FeatureIcon ? (
                        <FeatureIcon className="mt-0.5 size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
                      ) : (
                        <RiCheckLine className="mt-0.5 size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
                      )}
                      {feature === "Discord access" ? (
                        <span>
                          Discord access{" "}
                          <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-text-tertiary underline"
                          >
                            Join now
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
                leadingIcon={tier.ctaIcon}
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

function McpSection() {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
      <h2 className="text-title-1-medium text-text-primary">Install BoardUI with your agent through MCP</h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        BoardUI speaks MCP. Connect your agent once and it browses all 103 components with real usage examples,
        sets up your project, and writes the source files in. Pro unlocks in the same chat with your license key.
      </p>
      <blockquote className="rounded-2xl bg-background-primary-default px-4 py-3 text-body-medium text-text-primary">
        &ldquo;Set up BoardUI and build a revenue dashboard with stat cards and an area chart.&rdquo;
      </blockquote>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={MCP_CURSOR_LINK} variant="primary" size="medium">
          Add to Cursor
        </ButtonLink>
        <ButtonLink href={MCP_VSCODE_LINK} variant="secondary" size="medium">
          Add to VS Code
        </ButtonLink>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Also supported">
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
        Full setup guide and example prompts
      </Link>
    </section>
  );
}

function GithubSection() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-1-medium text-text-primary">The free tier lives on GitHub</h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        Every free component, the chat starter included, is one public repo under the MIT license. Clone it,
        deploy it with your own model key, and star it if it saves you an afternoon.
      </p>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-1-medium text-text-primary">Frequently asked questions</h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        Everything about licensing, installing and building with BoardUI. Anything else, ask us on Discord.
      </p>
      <div className="flex flex-col divide-y divide-separator-border rounded-3xl border border-border-button-default bg-background-primary-default px-5">
        {FAQ_ITEMS.map((item, i) => {
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
        Still have a question? We answer in the open, usually the same day.
      </p>
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noreferrer"
        className="w-fit text-body-regular text-text-secondary underline hover:text-text-primary"
      >
        Ask on Discord
      </a>
    </section>
  );
}

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  // This replica has no newsletter backend (the original's 49 JS chunks
  // contain no subscribe endpoint either — only /api/geo), so the form
  // never claims a signup happened: the post-submit note says so plainly.
  return done ? (
    <p className="text-body-medium text-text-primary">
      Demo form — no newsletter backend here, so nothing was subscribed.
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
        aria-label="Email address"
        className="min-w-0 flex-1"
      />
      <button
        type="submit"
        className="h-11 shrink-0 cursor-pointer rounded-full bg-accent-500 px-5 text-body-medium text-white transition-colors hover:bg-accent-600"
      >
        Subscribe
      </button>
    </form>
  );
}

function NewsletterSection() {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
      <h2 className="text-title-1-medium text-text-primary">Get new components in your inbox</h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        One short email when a component, block or template ships. No digests, no drip sequences, and you can
        leave any time.
      </p>
      <SubscribeForm />
      <Link href="/blog" className="text-body-medium text-text-secondary underline hover:text-text-primary">
        See all five
      </Link>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="flex flex-col items-start gap-3">
      <h2 className="text-title-1-medium text-text-primary">Start building agentic interfaces with BoardUI</h2>
      <p className="max-w-2xl text-body-regular text-text-secondary">
        Five agent blocks, a full AI chat template, and the dashboard furniture around them. Install what you
        need with one command and own the code.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/components" variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
          Browse components
        </ButtonLink>
        <ButtonLink href="/templates/ai-chat" variant="secondary" size="medium">
          See the AI Chat template
        </ButtonLink>
      </div>
    </section>
  );
}

export function HomeSections() {
  return (
    <div className="mx-auto flex w-full max-w-[1276px] flex-col gap-20 px-3 py-16 sm:px-6">
      <ShowcaseSection />
      <MultiAgentSection />
      <LoaderAndTemplatesSection />
      <TemplatesSection />
      <ChartsSection />
      <PricingSection />
      <TestimonialsSection />
      <McpSection />
      <GithubSection />
      <FaqSection />
      <NewsletterSection />
      <FinalCtaSection />
    </div>
  );
}
