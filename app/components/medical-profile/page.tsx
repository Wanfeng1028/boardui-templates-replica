"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
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
 * Medical Profile — docs page replica.
 * Source: boardui.com/components/medical-profile. Pro template.
 * The original page shows the full template screen; this page summarises
 * what is on it and links to the live template on this site.
 */
export default function MedicalProfilePage() {
  return (
    <DocsLayout variant="library" title="Medical Profile">
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
            Patient overview with health charts.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Medical Profile is part of BoardUI Pro.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Live template">
          <p className="text-body-regular text-text-secondary">
            The full template is live on this site — open it to explore the patient overview,
            health charts and patients table.
          </p>
          <TemplateCard
            href="/templates/medical-profile"
            title="Open the Medical Profile template"
            description="Patient overview, steps and sleep score, most active days, activity rings, and the 540-patient table."
          />
        </Section>

        <Section title="What’s inside">
          <p className="text-body-regular text-text-secondary">
            Patient overview — Mertcan Esmergül, date of birth 28 July 1997, Male, Blood Type A
            rh+, GP Doctor Mattheus Clarkson.
          </p>
          <p className="text-body-regular text-text-secondary">
            Health charts — Steps 31,600 total for 29 Jun – 5 Jul, Sleep score 98 (Excellent,
            duration 7h 50m, bedtime 20m earlier, interruptions 5m wake up), Most active days
            32,459 total steps, and activity for July 10, 2026: Move 816 kcal, Exercise 1h 41m,
            Running 5.2 km.
          </p>
          <p className="text-body-regular text-text-secondary">
            Patients table — 540 patients with admission, status, condition and actions, and 12
            important alerts this week.
          </p>
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </DocsLayout>
  );
}
