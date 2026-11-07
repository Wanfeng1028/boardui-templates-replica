"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiCheckLine,
  RiLayoutGridLine,
  RiSparklingLine,
} from "@remixicon/react";

import { ButtonLink } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

/**
 * Pricing — replica of boardui.com/pricing (content captured 2026-11-06).
 * The original page shows no prices next to the tiers (only the
 * "€49 launch discount" badge on Lifetime Access), so no prices are
 * invented here: tiers are shown with their feature lists only.
 * BoardUI-internal links point at this site's routes; Discord / GitHub
 * references are plain text, not external links. The original FAQ
 * questions were not present in the captured page text, so the FAQ
 * section keeps only the captured intro copy instead of invented Q&As.
 */

const TECH_BADGES = [
  "React v19.2",
  "Tailwind CSS v4",
  "React Aria v1.17",
  "TanStack Table v8.21",
];

const SHOWCASE = [
  { name: "Composer attachments", blurb: "File tiles landing one by one above the prompt, each with its upload ring." },
  { name: "Web search", blurb: "The searches an agent ran and the sources it opened, streaming in." },
  { name: "Agent limits", blurb: "Context window usage with a token breakdown and plan limits." },
  { name: "Data table", blurb: "Filter, sort and paginate complex data in a responsive table." },
  { name: "Playful widgets", blurb: "Health widgets with live charts, activity rings and alerts." },
  { name: "Sidebar", blurb: "Navigation with search, badges and account controls." },
  { name: "Contributor profile", blurb: "Contributor activity, token stats and streak insights at a glance." },
  { name: "Agent progress", blurb: "Live multi-step progress and completion states." },
  { name: "Composer loader", blurb: "An iridescent light orbiting the composer while the agent works." },
  { name: "Agent thinking", blurb: "Thinking, searching and writing indicators for a working agent." },
  { name: "Image generation loader", blurb: "Image generation with an animated countdown and reveal." },
  { name: "Calendar", blurb: "Month calendar with events and scheduling controls." },
  { name: "Auth card", blurb: "Sign in, sign up and verification with provider buttons." },
  { name: "Meeting schedule", blurb: "Booking flow for dates, times, language and meeting details." },
  { name: "Charts", blurb: "Bar, line and stacked charts with live data." },
  { name: "File upload", blurb: "Drag-and-drop uploads with validation and progress states." },
];

const CHARTS = [
  { name: "Funnel chart", blurb: "Tapered stages with conversion pills, curved or sharp, and stat tiles under every column." },
  { name: "Earnings chart", blurb: "Rounded bars over a track with a period switcher, count-up headline and hover outline." },
  { name: "Radar chart", blurb: "Filled polygon on the chart tokens - the count-up headline follows the axis you hover, and a stat tile per axis sits below." },
  { name: "Radar comparison", blurb: "Outline-only series over the same grid with a live legend for side-by-side reads." },
  { name: "Sankey chart", blurb: "Flows tinted by their source with share labels on the sinks and hover isolation." },
  { name: "Stage bars", blurb: "The funnel as pill rows with name, value and share, plus a grid of stat tiles." },
  { name: "Radial chart", blurb: "Concentric rings over the chart track with each name set along its own arc - hover a ring and the rest fall back while the headline and its tile follow." },
  { name: "Speedometer", blurb: "Half gauge of stacked segments with the primary share in the centre and tiles below." },
  { name: "Area chart", blurb: "Stacked series with gradient fills - hover a month and the headline, legend and tiles follow." },
  { name: "Combo chart", blurb: "Bars on one axis, a cased line on the other - volume and rate read together on one canvas." },
];

type Tier = {
  name: string;
  badge?: string;
  blurb: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: string[];
};

const SHARED_FEATURES = [
  "Use it in unlimited projects",
  "Keep the code forever",
  "Installation via CLI",
  "MCP support for AI agents",
  "Design tokens based on Tailwind CSS",
  "Dark mode variables",
  "Discord access",
  "3,000+ icon library",
];

const TIERS: Tier[] = [
  {
    name: "Starter",
    blurb: "The fundamentals of BoardUI, free. Perfect for indie developers.",
    cta: "Get started",
    href: "/components",
    features: [
      "Free user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Free component updates",
      ...SHARED_FEATURES.slice(3, 6),
      "Fundamental components",
      "Basic blocks and templates",
      ...SHARED_FEATURES.slice(6),
    ],
  },
  {
    name: "1 Year of Updates",
    blurb: "Every BoardUI Pro component, block, token and template.",
    cta: "Get Pro",
    href: "/pro-components",
    features: [
      "Single-user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Pro updates for 1 year",
      ...SHARED_FEATURES.slice(3, 6),
      "Every Pro component",
      "Every Pro block & template",
      ...SHARED_FEATURES.slice(6),
    ],
  },
  {
    name: "Lifetime Access",
    badge: "€49 launch discount",
    blurb: "Every BoardUI Pro component, block, token and template.",
    cta: "Get Pro",
    href: "/pro-components",
    featured: true,
    features: [
      "Single-user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Pro updates forever",
      ...SHARED_FEATURES.slice(3, 6),
      "Every Pro component",
      "Every Pro block & template",
      ...SHARED_FEATURES.slice(6),
    ],
  },
  {
    name: "Unlimited for Startups",
    blurb: "Everything in Pro, licensed for up to 5 developers.",
    cta: "Get Pro",
    href: "/pro-components",
    features: [
      "5-user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Pro updates forever",
      ...SHARED_FEATURES.slice(3, 6),
      "Every Pro component",
      "Every Pro block & template",
      ...SHARED_FEATURES.slice(6),
    ],
  },
];

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return done ? (
    <p className="text-body-medium text-text-primary">You&apos;re on the list.</p>
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
        className="h-11 shrink-0 rounded-full bg-accent-500 px-5 text-body-medium text-white transition-colors hover:bg-accent-600"
      >
        Subscribe
      </button>
    </form>
  );
}

function SectionHeading({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-title-1-medium text-text-primary">{title}</h2>
      {blurb ? <p className="max-w-2xl text-body-regular text-text-secondary">{blurb}</p> : null}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background-full">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-separator-border bg-background-primary-default px-4">
        <Link href="/" className="flex items-center gap-2 text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <RiLayoutGridLine className="size-5 text-foreground-icon-primary" aria-hidden />
          BoardUI
        </Link>
        <nav className="flex items-center gap-1 text-body-regular text-text-secondary" aria-label="Site">
          <Link href="/components" className="rounded-full px-3 py-1.5 outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Components</Link>
          <Link href="/templates" className="rounded-full px-3 py-1.5 outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Templates</Link>
          <Link href="/pro-components" className="rounded-full px-3 py-1.5 outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Pro components</Link>
          <Link href="/pricing" aria-current="page" className="rounded-full px-3 py-1.5 text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">Pricing</Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-4 py-16">
        {/* Hero */}
        <section className="flex flex-col items-start gap-5">
          <p className="flex items-center gap-1.5 rounded-full border border-border-button-default bg-background-secondary-default px-3 py-1 text-caption-1-semibold text-text-primary">
            <RiSparklingLine className="size-4 text-foreground-icon-primary" aria-hidden />
            New BoardUI Pro is out
          </p>
          <h1 className="max-w-3xl text-title-1-medium text-text-primary">React Design System for Dashboards</h1>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            BoardUI is a React design system with 103 unique components, including 19 data charts,
            plus 10 Pro templates and 400+ design tokens, designed in Figma.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Supported versions">
            {TECH_BADGES.map((badge) => (
              <li key={badge} className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
                {badge}
              </li>
            ))}
          </ul>
          <code className="rounded-md bg-background-secondary-default px-3 py-1.5 text-body-regular text-text-primary">npm boardui@latest add</code>
        </section>

        {/* Component showcase */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            title="Install tons of interactive dashboard components"
            blurb="Agentic components, buttons, checkboxes, calendar or a meeting scheduler, all you need is here."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SHOWCASE.map((item) => (
              <article key={item.name} className="flex flex-col gap-1.5 rounded-3xl border border-border-button-default bg-background-primary-default p-4">
                <h3 className="text-body-medium text-text-primary">{item.name}</h3>
                <p className="text-body-regular text-text-secondary">{item.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Multi-agent template */}
        <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
          <h2 className="text-title-1-medium text-text-primary">Build your multi-agent interface in seconds.</h2>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            Start with group chats, customizable agents, and smooth interactions already built.
            Connect your agents and make it your own.
          </p>
          <ButtonLink href="/templates/multi-agent-chat" variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
            Explore the template
          </ButtonLink>
        </section>

        {/* Composer loader + templates */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
            <h2 className="text-title-2-medium text-text-primary">A loading state worth staring at</h2>
            <p className="text-body-regular text-text-secondary">
              Composer Loader wraps your chat input in an orbiting light while the agent works,
              glass controls included. Pick a color.
            </p>
            <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">Included with Pro</p>
          </article>
          <article className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
            <h2 className="text-title-2-medium text-text-primary">Ready to go templates with BoardUI across domains</h2>
            <p className="text-body-regular text-text-secondary">
              Looking for an agentic chat, a marketing dashboard, or a healthcare interface?
              It&apos;s already here.
            </p>
            <ButtonLink href="/templates" variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
              Browse all templates
            </ButtonLink>
            <p className="rounded-full bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">Included with Pro</p>
          </article>
        </section>

        {/* Charts */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            title="Charts that make your data worth reading"
            blurb="Radar, radial, funnel, Sankey and more - live Recharts cards with period switchers, hover focus and stat tiles, all on the same tokens."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CHARTS.map((chart) => (
              <article key={chart.name} className="flex flex-col gap-1.5 rounded-3xl border border-border-button-default bg-background-primary-default p-4">
                <h3 className="text-body-medium text-text-primary">{chart.name}</h3>
                <p className="text-body-regular text-text-secondary">{chart.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing tiers */}
        <section id="plans" className="flex flex-col gap-6">
          <SectionHeading
            title="Buy once. Build forever."
            blurb="Keep the code forever and use it in unlimited projects. Choose Pro updates for one year or forever. No subscription or auto-renewal."
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col gap-4 rounded-3xl border p-5 ${tier.featured ? "border-accent-500 bg-background-secondary-default" : "border-border-button-default bg-background-primary-default"}`}
              >
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-title-3-semibold text-text-primary">{tier.name}</h3>
                  {tier.badge ? (
                    <p className="w-fit rounded-full bg-accent-500 px-2.5 py-0.5 text-caption-1-semibold text-white">{tier.badge}</p>
                  ) : null}
                  <p className="text-body-regular text-text-secondary">{tier.blurb}</p>
                </div>
                <ul className="flex flex-1 flex-col gap-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-body-regular text-text-secondary">
                      <RiCheckLine className="mt-0.5 size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
                      {feature === "Discord access" ? (
                        <span>Discord access <span className="text-text-tertiary">(Join now)</span></span>
                      ) : (
                        <span>{feature}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={tier.href} variant={tier.featured ? "primary" : "secondary"} size="medium">
                  {tier.cta}
                </ButtonLink>
              </article>
            ))}
          </div>
          <p className="text-body-regular text-text-tertiary">Already used by startups and developers</p>
        </section>

        {/* MCP */}
        <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
          <h2 className="text-title-1-medium text-text-primary">Install BoardUI with your agent through MCP</h2>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            BoardUI speaks MCP. Connect your agent once and it browses all 103 components with real
            usage examples, sets up your project, and writes the source files in. Pro unlocks in
            the same chat with your license key.
          </p>
          <blockquote className="rounded-2xl bg-background-primary-default px-4 py-3 text-body-medium text-text-primary">
            &ldquo;Set up BoardUI and build a revenue dashboard with stat cards and an area chart.&rdquo;
          </blockquote>
          <p className="text-body-regular text-text-secondary">Full setup guide and example prompts</p>
        </section>

        {/* Free tier */}
        <section className="flex flex-col gap-3">
          <h2 className="text-title-1-medium text-text-primary">The free tier lives on GitHub</h2>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            Every free component, the chat starter included, is one public repo under the MIT
            license. Clone it, deploy it with your own model key, and star it if it saves you an
            afternoon.
          </p>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-3">
          <h2 className="text-title-1-medium text-text-primary">Frequently asked questions</h2>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            Everything about licensing, installing and building with BoardUI. Anything else, ask us
            on Discord.
          </p>
          <p className="text-body-medium text-text-primary">Still have a question? We answer in the open, usually the same day.</p>
          <p className="text-body-regular text-text-secondary">Ask on Discord</p>
        </section>

        {/* Subscribe */}
        <section className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
          <h2 className="text-title-1-medium text-text-primary">Get new components in your inbox</h2>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            One short email when a component, block or template ships. No digests, no drip
            sequences, and you can leave any time.
          </p>
          <SubscribeForm />
        </section>

        {/* Final CTA */}
        <section className="flex flex-col items-start gap-3">
          <h2 className="text-title-1-medium text-text-primary">Start building agentic interfaces with BoardUI</h2>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            Five agent blocks, a full AI chat template, and the dashboard furniture around them.
            Install what you need with one command and own the code.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/templates" variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
              Browse all templates
            </ButtonLink>
            <ButtonLink href="/components" variant="secondary" size="medium">
              Explore components
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-separator-border px-4 py-6">
        <p className="mx-auto max-w-5xl text-body-regular text-text-tertiary">
          Replica of boardui.com/pricing for reference — not the official BoardUI site.
        </p>
      </footer>
    </div>
  );
}
