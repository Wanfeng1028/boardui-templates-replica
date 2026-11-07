"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

/** Introduction docs page, mirroring boardui.com/docs/introduction. */
export default function IntroductionPage() {
  return (
    <AppShell title="Introduction" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-caption-1-semibold text-text-tertiary">Docs · Get started</p>
        </div>

        <Section title="What is BoardUI?">
          <p className="text-body-regular text-text-secondary">
            BoardUI is an open-source collection of React components built with Tailwind CSS and designed in
            Figma. Components are translated directly from a master Figma file via the Figma MCP server, so
            design and code stay in lockstep.
          </p>
          <p className="text-body-regular text-text-secondary">
            Skip the design phase. Just copy, paste, and build.
          </p>
        </Section>

        <Section title="Tech stack">
          <ul className="flex flex-col gap-1.5">
            {[
              "React 19",
              "Next.js 16 (App Router) — for the showcase site",
              "Tailwind CSS v4 (CSS-first config via @theme)",
              "TypeScript",
              "React Aria Components — accessibility primitives, added per-component as needed",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-body-regular text-text-secondary">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-foreground-icon-tertiary" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Free vs. Pro">
          <ul className="flex flex-col gap-1.5">
            <li className="flex items-start gap-2 text-body-regular text-text-secondary">
              <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-foreground-icon-tertiary" />
              <span>
                <span className="text-body-medium text-text-primary">Free</span>
                {" — base components (Button, Input, Checkbox, Badge, Avatar, etc.). Permissive license. Open-source."}
              </span>
            </li>
            <li className="flex items-start gap-2 text-body-regular text-text-secondary">
              <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-foreground-icon-tertiary" />
              <span>
                <span className="text-body-medium text-text-primary">Pro</span>
                {" — composed blocks, page templates, complex patterns (data tables, command menus, charts, dashboards). One-time license fee."}
              </span>
            </li>
          </ul>
        </Section>

        <Section title="Source, not dependency">
          <p className="text-body-regular text-text-secondary">
            BoardUI is not a runtime library. When you add a component, its source gets copied into your
            project — no npm install, no vendor lock-in. You own the code; modify it however you like.
          </p>
        </Section>

        <Section title="How BoardUI compares">
          <p className="text-body-regular text-text-secondary">
            We built the same settings dialog with BoardUI and nine other libraries, from shadcn/ui to
            PrimeReact, and tested each one.
          </p>
          <p className="text-body-regular text-text-secondary">
            Read our comparison of the 10 best React design systems
          </p>
        </Section>

        <Section title="Next steps">
          <p className="text-body-regular text-text-secondary">
            Head over to the installation guide to set up a project, or browse the components gallery.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              Installation guide
            </LinkButton>
            <LinkButton href="/components" trailingIcon={RiArrowRightSLine}>
              Components gallery
            </LinkButton>
          </div>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
