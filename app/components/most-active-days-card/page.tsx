"use client";

import { RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { MostActiveDaysCard } from "@/components/application/charts/most-active-days-card";
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

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

/**
 * Most Active Days Card — docs page replica.
 * Source: boardui.com/components/most-active-days-card. Pro component.
 * The original page has no example sections beyond the description.
 */
export default function MostActiveDaysCardPage() {
  return (
    <AppShell title="Most Active Days" actions={null} columnClassName="max-w-[964px]">
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
            A continuously scrolling vertical month calendar where every day renders a mini
            activity ring — with a floating month pill that walks along as you scroll, and day
            selection that can drive the Activity Rings card.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Most Active Days Card is part of BoardUI Pro.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Live preview">
          <Demo>
            <div className="w-full max-w-[420px]">
              <MostActiveDaysCard />
            </div>
          </Demo>
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
