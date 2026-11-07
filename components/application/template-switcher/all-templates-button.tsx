"use client";

import { RiLayoutGridLine } from "@remixicon/react";

import { ButtonLink } from "@/components/base/buttons/button";

/**
 * The one obvious way out of any template page: a text button (never
 * icon-only) linking to the templates index at /templates.
 *
 * Used in the TemplateShell header, the local shells of the chat/image/HR
 * templates, and the multi-agent chat header. The sidebar carries the same
 * destination as its first row ("全部模板" in DASHBOARD_NAV), so the label
 * is identical everywhere a visitor can look for it.
 */
export function AllTemplatesButton({
  size = "medium",
  className,
}: {
  size?: "medium" | "small";
  className?: string;
}) {
  return (
    <ButtonLink
      href="/templates"
      variant="secondary"
      size={size}
      leadingIcon={RiLayoutGridLine}
      className={className}
    >
      全部模板
    </ButtonLink>
  );
}
