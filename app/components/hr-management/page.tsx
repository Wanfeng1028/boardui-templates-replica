"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { ProLicenseCard } from "@/components/application/docs/pro-license-card";
import { TemplatePreview } from "@/components/application/docs/template-preview";
import { LinkButton } from "@/components/base/buttons/link-button";
import HrManagementTemplatePage from "@/app/templates/hr-management/page";

const HR_PREVIEW_CODE = `import { HrShell } from "@/components/application/hr/hr-shell";

export default function HrPage() {
  // Full screen: headcount KPIs, recent hires, the hiring
  // pipeline, the engagement score radar, hires vs. attrition,
  // team breakdowns, and the employees data table.
  return <HrShell />;
}`;

/** Detail page for hr-management - content mirrors boardui.com/components/hr-management. */

export default function HrManagementPage() {
  return (
    <AppShell title="HR Management" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/hr-management</span>
        </div>
        <p className="text-body-regular text-text-secondary">A complete HR screen - headcount KPI cards, the recent hires grid, the hiring pipeline as stage bars, an engagement score radar, hires vs. attrition on twin axes, tabbed team breakdowns, and an employees data table. Fully responsive, down to a slide-in drawer on mobile.</p>
        <TemplatePreview title="HR management" slug="hr-management" previewCode={HR_PREVIEW_CODE}>
          <HrManagementTemplatePage />
        </TemplatePreview>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-headline-medium text-text-secondary">HR Management is a BoardUI Pro template, sold separately.</p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this template follows BoardUI semantic tokens automatically.{" "}
            <a className="text-accent-500 hover:underline" href="/installation#dark-mode">
              Set up theme switching
            </a>
            .
          </p>
          <ProLicenseCard name="HR Management" kind="template" installSlug="template-hr" />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">What&apos;s included</h2>
          <p className="text-body-regular text-text-secondary">The template ships as a complete source package: the responsive app shell, headcount KPI stat cards, the recent hires grid, the hiring pipeline stage bars, the engagement score radar, the hires vs. attrition combo chart, the tabbed team breakdown list, the employees data table (search, filters, sorting, pagination), and every base component and data file they depend on.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">{`// Full screen: headcount KPI cards, recent hires grid,
// hiring pipeline stage bars, engagement score radar,
// hires vs. attrition combo chart, tabbed team breakdowns,
// and the employees data table (search, filters,
// sorting, pagination).`}</pre>
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-5">
              <p className="text-body-regular text-text-secondary">The full template lives on this site - open it to explore the complete screen.</p>
              <LinkButton href="/templates/hr-management" trailingIcon={RiArrowRightSLine}>Open the HR Management template</LinkButton>
            </div>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/hr-management（2026-11-07，curl 抓取原版 SSR HTML 核对）
