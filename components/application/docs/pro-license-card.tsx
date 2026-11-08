"use client";

import { useState } from "react";
import Link from "next/link";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

type PackageManager = "npm" | "pnpm" | "yarn";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn"];

function commandFor(pm: PackageManager, args: string) {
  if (pm === "npm") return `npx boardui@latest ${args}`;
  if (pm === "pnpm") return `pnpm dlx boardui@latest ${args}`;
  return `yarn dlx boardui@latest ${args}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
          return;
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      aria-label="Copy command"
    >
      {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
    </button>
  );
}

function PmCommand({ args }: { args: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const cmd = commandFor(pm, args);
  return (
    <div className="flex w-full flex-col gap-0 rounded-2xl bg-background-secondary-default p-1 dark:bg-background-tertiary-default">
      <div className="flex items-center justify-between">
        <SegmentedControl
          aria-label="Package manager"
          selectedKeys={[pm]}
          onSelectionChange={(keys) => {
            const [key] = keys;
            if (key === "npm" || key === "pnpm" || key === "yarn") setPm(key);
          }}
        >
          {PACKAGE_MANAGERS.map((name) => (
            <SegmentedControlItem key={name} id={name}>
              {name}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <CopyButton text={cmd} />
      </div>
      <code className="overflow-x-auto px-3 py-2 font-mono text-body-2-regular text-text-primary">{cmd}</code>
    </div>
  );
}

function Step({
  n,
  title,
  description,
  children,
}: {
  n: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-background-primary-default p-4 dark:border dark:border-separator-border dark:bg-background-secondary-default sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 translate-y-[5px] items-center justify-center rounded-xl bg-background-secondary-default text-caption-1-semibold text-text-tertiary dark:bg-background-tertiary-default">
          {n}
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="text-body-medium text-text-primary">{title}</p>
          <p className="mt-0.5 text-body-regular text-text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * The Pro license card from boardui.com component/template pages:
 * PRO ACCESS badge, "…is a Pro component/template.", two CLI steps
 * (activate license, install) with npm/pnpm/yarn tabs, and the Get Pro row.
 * The Pro logos are the original /brand/boardui_pro(_dark).png assets.
 */
export function ProLicenseCard({
  name,
  kind,
  installSlug,
}: {
  name: string;
  kind: "component" | "template";
  installSlug: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default">
        <span className="absolute top-5 end-5 rounded-full border border-border-button-default bg-background-secondary-default px-2 py-0.5 text-[10px] leading-4 font-semibold tracking-wide text-text-secondary uppercase sm:top-6 sm:end-6">
          Pro access
        </span>
        <div className="relative min-w-0 space-y-2 p-5 pt-7 sm:p-6 sm:pe-24 sm:pt-7">
          <img
            src="/brand/boardui_pro.png"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="theme-logo-light size-12 shrink-0 object-contain"
          />
          <img
            src="/brand/boardui_pro_dark.png"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="theme-logo-dark size-12 shrink-0 object-contain"
          />
          <h3 className="text-title-3-medium text-text-primary">
            {name} is a Pro {kind}.
          </h3>
          <p className="max-w-2xl text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this {kind} and all of its source files. Activate your license
            once, then install it directly into your project with the CLI.
          </p>
        </div>
        <div className="flex flex-col gap-1 border-t border-separator-border bg-background-secondary-default p-1 dark:bg-background-primary-default">
          <Step
            n="01"
            title="Activate your license"
            description="Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine."
          >
            <PmCommand args="login YOUR_LICENSE_KEY" />
          </Step>
          <Step
            n="02"
            title={`Install the ${kind}`}
            description="The CLI copies the source and resolves every BoardUI and npm dependency for you."
          >
            <PmCommand args={`add ${installSlug}`} />
          </Step>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-body-medium text-text-primary">This {kind} is included in BoardUI Pro</p>
              <p className="text-body-regular text-text-secondary">
                Get BoardUI Pro now and install it end away.
              </p>
            </div>
            <Link
              href="/pricing"
              className={cx(
                "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-0.5 overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default p-2 text-body-medium whitespace-nowrap text-text-primary shadow-xs outline-none transition-colors",
                "hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              <img
                src="/brand/boardui_pro.png"
                alt=""
                width={20}
                height={20}
                loading="lazy"
                decoding="async"
                className="theme-logo-light size-5 shrink-0 object-contain"
              />
              <img
                src="/brand/boardui_pro_dark.png"
                alt=""
                width={20}
                height={20}
                loading="lazy"
                decoding="async"
                className="theme-logo-dark size-5 shrink-0 object-contain"
              />
              <span className="inline-flex items-center justify-center px-1 shrink-0">Get Pro</span>
            </Link>
          </div>
        </div>
      </div>
      <p className="text-body-regular text-text-secondary">
        Using a shared UI package or custom import aliases?{" "}
        <Link href="/installation#monorepos" className="text-accent-500 hover:underline">
          Configure your installation paths
        </Link>{" "}
        before running the CLI. Copy-paste examples use the default imports.
      </p>
    </div>
  );
}
