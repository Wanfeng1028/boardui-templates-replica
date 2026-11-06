"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import {
  RiAddFill,
  RiCloseLine,
  RiDashboardLine,
  RiFilter3Fill,
  RiMenuLine,
} from "@remixicon/react";
import type { ComponentType } from "react";
import { useState, type ReactNode } from "react";

import {
  DASHBOARD_NAV,
  DashboardSidebar,
} from "@/components/application/dashboard/dashboard-sidebar";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

/**
 * Replica shell for the 10 BoardUI Pro templates.
 *
 * Mirrors the official template pages' frame: the Pro dashboard navigation
 * (Home / Project board / Marketing / Calendar / Finance / Medical Report /
 * AI Chat / AI Image Generation / Profile), a breadcrumb trail (Board team /
 * Mertcan / page), a page heading, and header actions. Content sits in a
 * 1300px column on the page background, same as the official templates.
 *
 * This is a replica built only from free BoardUI components. It is not the
 * official Pro template source.
 */
export function TemplateShell({
  title,
  heading = title,
  icon: Icon = RiDashboardLine,
  selected,
  actions,
  children,
  className,
  columnClassName,
}: {
  /** The page's name, shown as the current breadcrumb item. */
  title: string;
  /** The heading over the content. Defaults to the title. */
  heading?: string;
  /** Icon on the current breadcrumb item. */
  icon?: IconComponent;
  /** Which nav item shows the selected (filled blue) state. */
  selected: string;
  /** Header actions on the right; the Pro dashboard's set by default, `null` for none. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Overrides the 1300px content column. */
  columnClassName?: string;
}) {
  const localize = useTemplateCopy();
  const [navOpen, setNavOpen] = useState(false);

  return localize((
    <div
      className={cx(
        "relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3",
        className,
      )}
    >
      <DashboardSidebar items={DASHBOARD_NAV} selected={selected} className="hidden lg:flex" />

      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/40"
          />
          <div className="relative flex h-full p-3">
            <DashboardSidebar
              mobile
              items={DASHBOARD_NAV}
              selected={selected}
              onClose={() => setNavOpen(false)}
              className="flex"
            />
          </div>
        </div>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3">
        <div className={cx("flex w-full max-w-[1300px] flex-col gap-2.5", columnClassName)}>
          <header className="flex w-full flex-col gap-2">
            <Breadcrumb>
              <BreadcrumbItem href="#">
                <Avatar size="xs" color="blue" initials="B" />
                Board team
              </BreadcrumbItem>
              <BreadcrumbItem href="#">
                <Avatar size="xs" color="neutral" initials="M" />
                Mertcan
              </BreadcrumbItem>
              <BreadcrumbItem current icon={Icon}>
                {title}
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex w-full flex-wrap items-end justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <IconButton
                  icon={navOpen ? RiCloseLine : RiMenuLine}
                  size="medium"
                  aria-label="Open navigation"
                  onClick={() => setNavOpen((open) => !open)}
                  className="lg:hidden"
                />
                <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">
                  {heading}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                {actions !== undefined ? actions : (
                  <>
                    <NotificationBell />
                    <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill}>
                      Filters
                    </Button>
                    <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
                      Create ticket
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>
          <div className="flex w-full flex-col gap-4 pb-4">{children}</div>
        </div>
      </main>
    </div>
  ));
}
