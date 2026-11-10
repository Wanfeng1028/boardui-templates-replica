"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { chromeString, formatBirthDate, type SiteLocale } from "@/components/application/docs/locale-chrome";

import { RiAddLine, RiAsterisk, RiDropLine, RiMenLine, RiStethoscopeLine } from "@remixicon/react";
import type { ComponentType } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → medical profile dashboard → Frame 125 (node
 * 3950:5657). Patient photo, name, and a stack of label/value rows.
 *
 * Vertical rhythm from Figma's absolute positions: avatar top 24, name top
 * 105 (avatar bottom 90 → 15px gap), details top 146 (name bottom 131 →
 * 15px gap again) — hence the odd-looking `gap-[15px]`, replicated rather
 * than rounded to a spacing step.
 */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

type Detail = { icon: IconComponent; label: string; value: string };

function details(locale: SiteLocale): Detail[] {
  return [
    { icon: RiAsterisk, label: chromeString("Date of Birth", locale), value: formatBirthDate(locale) },
    { icon: RiMenLine, label: chromeString("Gender", locale), value: chromeString("Male", locale) },
    { icon: RiDropLine, label: chromeString("Blood Type", locale), value: "A rh+" },
    { icon: RiStethoscopeLine, label: chromeString("GP Doctor", locale), value: chromeString("Mattheus Clarkson", locale) },
  ];
}

export function PatientInfoCard({
  className,
  onAddPhoto,
  photoSrc,
  locale = "en",
}: {
  className?: string;
  /** Called when the "Add profile photo" button is pressed. */
  onAddPhoto?: () => void;
  /** Photo URL shown in the avatar when set (falls back to initials). */
  photoSrc?: string;
  /** Locale for the card copy; defaults to English (the medical template). */
  locale?: SiteLocale;
} = {}) {
  const localize = useTemplateCopy();
  return localize((
    <section
      className={cx(
        "flex h-[330px] w-full min-w-0 flex-col items-center gap-[15px] rounded-[20px] bg-background-secondary-default px-2.5 pt-6 pb-2.5",
        className,
      )}
    >
      <div className="relative">
        <Avatar size="lg" initials="M" src={photoSrc} className="size-[66px] text-[24.75px]" />
        <Button
          variant="secondary"
          size="xs"
          iconOnly
          leadingIcon={RiAddLine}
          aria-label={chromeString("Add profile photo", locale)}
          onClick={onAddPhoto}
          className="absolute -top-0.5 -end-0.5 rounded-full"
        />
      </div>
      <p className="text-title-2-medium whitespace-nowrap text-text-primary">{chromeString("Mertcan Esmergül", locale)}</p>
      <div className="flex w-full flex-1 flex-col gap-2.5">
        {details(locale).map((detail) => (
          <div
            key={detail.label}
            className="flex w-full items-center justify-between rounded-2lg bg-background-inner-default px-2.5 py-2"
          >
            <div className="flex items-center gap-1.5">
              <detail.icon className="size-4 shrink-0 text-text-secondary" aria-hidden />
              <span className="text-body-regular whitespace-nowrap text-text-secondary">
                {detail.label}
              </span>
            </div>
            <span className="text-body-medium whitespace-nowrap text-text-primary">{detail.value}</span>
          </div>
        ))}
      </div>
    </section>
  ));
}
