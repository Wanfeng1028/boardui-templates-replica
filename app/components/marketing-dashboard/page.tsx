"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function TemplateCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className={cx(
        "group flex items-center justify-between gap-4 rounded-3xl border border-border-button-default",
        "bg-background-primary-default p-6 hover:border-border-button-hover",
      )}
    >
      <span className="flex flex-col gap-1">
        <span className="text-title-3-semibold text-text-primary">{title}</span>
        <span className="text-body-regular text-text-secondary">{description}</span>
      </span>
      <RiArrowRightLine className="size-5 shrink-0 text-foreground-icon-secondary transition-transform group-hover:translate-x-1" />
    </a>
  );
}

/**
 * Marketing Dashboard — docs page replica.
 * Source: boardui.com/components/marketing-dashboard. Pro template.
 * The original page shows the full template screen; this page summarises
 * what is on it and links to the live template on this site.
 */
export default function MarketingDashboardPage() {
  return (
    <AppShell title="Marketing Dashboard" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span
            className={cx(
              "w-fit rounded-full border border-border-button-default px-2.5 py-0.5",
              "text-caption-1-semibold text-text-secondary",
            )}
          >
            Pro
          </span>
          <p className="text-body-regular text-text-secondary">
            Acquisition funnel, spend charts, and campaigns table.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Marketing Dashboard is part of BoardUI Pro.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Live template">
          <p className="text-body-regular text-text-secondary">
            The full template is live on this site — open it to explore the KPIs, funnel, spend
            charts and campaigns table.
          </p>
          <TemplateCard
            href="/templates/marketing"
            title="Open the Marketing Dashboard template"
            description="Ad spend, impressions, conversions and cost per click, the acquisition funnel, spend by channel, sessions, and the 80-campaign table."
          />
        </Section>

        <Section title="What’s inside">
          <p className="text-body-regular text-text-secondary">
            KPI cards — Ad spend $24,380 (+8.4%), Impressions 1.94M (+12.6%), Conversions 1,286
            (+5.2%), Cost per click $1.24 (−3.1%).
          </p>
          <p className="text-body-regular text-text-secondary">
            Acquisition funnel — 96.4K visits, 38.6K sign-ups, 14.1K trials, 5.2K customers.
            Spend by channel — Paid search $11,400, Paid social $7,620, Email $3,180, Affiliates
            $2,680. Sessions — Google Ads 39%, Meta 25%, X Ads 14%, LinkedIn 8%, Email 7%.
          </p>
          <p className="text-body-regular text-text-secondary">
            Ad spend chart — $217.7K total, ROAS 3.6x, 134,400 visitors (Organic 74,500, Paid
            38,500, Social 21,400). Campaigns table — 80 campaigns with delivery, objective and
            actions, from the founder story video to the case study promo.
          </p>
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </AppShell>
  );
}
