"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  RiAddFill,
  RiArrowLeftLine,
  RiBankCardLine,
  RiBankLine,
  RiBox3Line,
  RiCheckLine,
  RiEqualizer3Line,
  RiFileCopyLine,
  RiFolder6Line,
  RiGroupLine,
  RiLogoutBoxRLine,
  RiMessage2Line,
  RiNotification3Line,
  RiSchoolLine,
  RiShieldUserLine,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { RadioDot } from "@/components/base/radio/radio";
import { ChevronDownSmall, ChevronUpDownSmall } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";

/** Detail page for dropdown - content mirrors boardui.com/components/dropdown. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const CODE_0_CODE = "{/* Radio-group rows: selected state on the row + a radio glyph at the end */}\nconst [model, setModel] = useState(\"Fable 5\");\n\n<Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>\n  <DropdownTrigger className=\"...pill trigger with the current model + chevron...\">\n    {model}\n    <ChevronDownSmall className={cx(\"size-4\", isOpen && \"rotate-180\")} />\n  </DropdownTrigger>\n\n  <DropdownPopover aria-label=\"Models\" placement=\"bottom start\">\n    <DropdownGroup label=\"Models\">\n      <div role=\"radiogroup\" aria-label=\"Model\" className=\"flex w-full flex-col gap-1\">\n        {MODELS.map((name) => (\n          <DropdownItem\n            key={name}\n            selected={name === model}\n            onSelect={() => {\n              setModel(name);\n              setIsOpen(false);\n            }}\n            className=\"justify-between gap-2.5\"\n          >\n            <span className=\"truncate text-body-medium text-text-primary\">{name}</span>\n            <RadioDot selected={name === model} />\n          </DropdownItem>\n        ))}\n      </div>\n    </DropdownGroup>\n  </DropdownPopover>\n</Dropdown>";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

const MODELS = ["Fable 5", "Claude Sonnet 4.5", "Gemini 2.5 Flash"];

/** The AI chat composer's model menu: rows act as a radio group - selected keeps the current row highlighted and a radio glyph sits at the row's end via justify-between. */
function ModelPickerDemo() {
  const [model, setModel] = useState("Fable 5");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger className="flex items-center gap-2 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-medium text-text-primary shadow-xs transition-colors hover:bg-background-primary-hover">
        {model}
        <ChevronDownSmall className={cx("size-4 shrink-0 text-text-secondary transition-transform duration-200", isOpen && "rotate-180")} />
      </DropdownTrigger>
      <DropdownPopover aria-label="Models" placement="bottom start">
        <DropdownGroup label="Models">
          <div role="radiogroup" aria-label="Model" className="flex w-full flex-col gap-1">
            {MODELS.map((name) => (
              <DropdownItem
                key={name}
                selected={name === model}
                onSelect={() => {
                  setModel(name);
                  setIsOpen(false);
                }}
                className="justify-between gap-2.5"
              >
                <span className="truncate text-body-medium text-text-primary">{name}</span>
                <RadioDot selected={name === model} />
              </DropdownItem>
            ))}
          </div>
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

interface TeamMenuRow {
  icon: IconComponent;
  label: string;
  badge?: string;
}

const TEAM_GROUPS: { label?: string; items: TeamMenuRow[] }[] = [
  {
    items: [
      { icon: RiBankLine, label: "View team profile" },
      { icon: RiFolder6Line, label: "Folders" },
      { icon: RiMessage2Line, label: "Messages", badge: "94" },
      { icon: RiGroupLine, label: "People" },
    ],
  },
  {
    label: "Company",
    items: [
      { icon: RiBankCardLine, label: "Billing" },
      { icon: RiSchoolLine, label: "Company details" },
      { icon: RiBox3Line, label: "Integrations" },
    ],
  },
  {
    label: "Personal",
    items: [
      { icon: RiNotification3Line, label: "Notifications" },
      { icon: RiShieldUserLine, label: "Account details" },
      { icon: RiLogoutBoxRLine, label: "Sign out" },
    ],
  },
];

function TeamMenuItem({ icon: Icon, label, badge, onSelect }: TeamMenuRow & { onSelect: () => void }) {
  return (
    <DropdownItem onSelect={onSelect}>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <Icon className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <span className="truncate text-body-medium text-text-primary">{label}</span>
      </span>
      {badge ? (
        <Badge color="neutral" className="bg-team-menu-count-background text-team-menu-count-foreground">
          {badge}
        </Badge>
      ) : null}
    </DropdownItem>
  );
}

/** The sidebar's team card menu: a header and footer live alongside DropdownGroups as plain siblings, rows carry trailing badges, and DropdownDivider bleeds through the panel padding between sections. */
function TeamMenuDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger
        aria-label="Board team"
        className="flex w-full max-w-[320px] items-center justify-between gap-2 rounded-xl bg-background-tertiary-default py-2 pe-4 ps-2.5"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Avatar size="md" color="blue" src="/brand/boardui_logo_circle.webp" alt="Board team" />
          <span className="flex min-w-0 flex-col items-start justify-center">
            <span className="text-body-medium whitespace-nowrap text-text-primary">Board team</span>
            <span className="text-body-regular whitespace-nowrap text-text-secondary">hi@boardui.com</span>
          </span>
        </span>
        <ChevronDownSmall
          className={cx("size-4 shrink-0 text-text-secondary transition-transform duration-200", isOpen && "rotate-180")}
        />
      </DropdownTrigger>
      <DropdownPopover aria-label="Board team menu" placement="bottom start" className="w-[265px]" dialogClassName="gap-[7px]">
        <div className="flex items-center gap-2 px-2 pt-1">
          <Avatar size="md" color="blue" src="/brand/boardui_logo_circle.webp" alt="Board team" />
          <div className="flex min-w-0 flex-col items-start justify-center">
            <span className="text-body-medium whitespace-nowrap text-text-primary">Board team</span>
            <span className="text-body-regular whitespace-nowrap text-text-secondary">hi@boardui.com</span>
          </div>
        </div>
        {TEAM_GROUPS.map((group, index) => (
          <div key={group.label ?? "workspace"}>
            {index > 0 ? <DropdownDivider /> : null}
            <DropdownGroup label={group.label}>
              {group.items.map((item) => (
                <TeamMenuItem key={item.label} {...item} onSelect={close} />
              ))}
            </DropdownGroup>
          </div>
        ))}
        <div className="flex w-full items-center justify-between px-2 pt-1 pb-2">
          <span className="text-body-2-medium whitespace-nowrap text-text-tertiary">BoardUI</span>
          <span className="inline-flex items-center justify-center rounded-sm bg-background-tertiary-default px-1 py-px text-body-2-medium whitespace-nowrap text-text-tertiary">
            v1.0.1
          </span>
        </div>
      </DropdownPopover>
    </Dropdown>
  );
}

const TEAM_CODE = `<Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
  <DropdownTrigger aria-label="Board team" className="...team card styles...">
    <Avatar size="md" color="blue" src="/logo.png" alt="Board team" />
    ...name, email, chevron...
  </DropdownTrigger>

  <DropdownPopover aria-label="Board team menu" className="w-[265px]" dialogClassName="gap-[7px]">
    <div className="flex items-center gap-2 px-2 pt-1">
      <Avatar size="md" color="blue" src="/logo.png" alt="Board team" />
      ...name + email...
    </div>
    <DropdownGroup>
      <DropdownItem onSelect={close}>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <RiMessage2Line className="size-5 text-foreground-icon-secondary" aria-hidden />
          <span className="truncate text-body-medium text-text-primary">Messages</span>
        </span>
        <Badge color="neutral" className="bg-team-menu-count-background text-team-menu-count-foreground">94</Badge>
      </DropdownItem>
    </DropdownGroup>
    <DropdownDivider />
    <DropdownGroup label="Company">
      ...Billing, Company details, Integrations...
    </DropdownGroup>
    <div className="flex w-full items-center justify-between px-2 pt-1 pb-2">
      <span className="text-body-2-medium text-text-tertiary">BoardUI</span>
      <span className="...version chip...">v1.0.1</span>
    </div>
  </DropdownPopover>
</Dropdown>`;

const ACCOUNT_USERS: { initials: string; color: "neutral" | "lime" | "pink"; name: string }[] = [
  { initials: "M", color: "neutral", name: "Mertcan Esmergul" },
  { initials: "S", color: "lime", name: "Steven Raule" },
  { initials: "L", color: "pink", name: "Lauren Proso" },
];

/** The sidebar's account switcher: rows render avatars instead of icons, and the panel closes with a pair of secondary buttons - row content is free-form, so anything goes inside a DropdownItem. */
function AccountMenuDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger aria-label="Mertcan Esmergul" className="flex items-center gap-2 rounded-full">
        <Avatar size="md" color="neutral" initials="M" />
        <span className="flex items-center gap-0.5">
          <span className="text-body-medium whitespace-nowrap text-text-primary">Mertcan Esmergul</span>
          <ChevronUpDownSmall className="size-4 shrink-0 text-foreground-icon-tertiary" />
        </span>
      </DropdownTrigger>
      <DropdownPopover aria-label="Account menu" placement="bottom start" className="w-[265px]">
        <DropdownGroup label="Users with access">
          {ACCOUNT_USERS.map((user) => (
            <DropdownItem key={user.name} onSelect={close} className="px-2 py-1.5">
              <Avatar size="xs" color={user.color} initials={user.initials} />
              <span className="truncate text-body-medium text-text-primary">{user.name}</span>
            </DropdownItem>
          ))}
        </DropdownGroup>
        <DropdownDivider className="my-3.5" />
        <div className="flex items-center gap-3 px-2 pb-2">
          <Button variant="secondary" size="small" leadingIcon={RiAddFill} className="flex-1" onClick={close}>
            Add user
          </Button>
          <Button variant="secondary" size="small" leadingIcon={RiEqualizer3Line} className="flex-1" onClick={close}>
            Manage
          </Button>
        </div>
      </DropdownPopover>
    </Dropdown>
  );
}

const ACCOUNT_CODE = `<DropdownPopover aria-label="Account menu" className="w-[265px]">
  <DropdownGroup label="Users with access">
    {users.map((user) => (
      <DropdownItem key={user.name} onSelect={close} className="px-2 py-1.5">
        <Avatar size="xs" color={user.color} initials={user.initials} />
        <span className="truncate text-body-medium text-text-primary">{user.name}</span>
      </DropdownItem>
    ))}
  </DropdownGroup>
  <DropdownDivider className="my-3.5" />
  <div className="flex items-center gap-3 px-2 pb-2">
    <Button variant="secondary" size="small" leadingIcon={RiAddFill} className="flex-1">
      Add user
    </Button>
    <Button variant="secondary" size="small" leadingIcon={RiEqualizer3Line} className="flex-1">
      Manage
    </Button>
  </div>
</DropdownPopover>`;

export default function DropdownPage() {
  return (
    <DocsLayout variant="library" title="Dropdown">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Free</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/dropdown</span>
        </div>
        <p className="text-body-regular text-text-secondary">A composable popover menu built on React Aria - where Select picks a value into its trigger, Dropdown is a free-form panel of grouped action rows with the BoardUI surface (radius 16, dropdown shadow) and the 150ms scale + blur appear animation. The same recipe behind the dashboard sidebar's team and account menus and the AI chat composer's add menu.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">You can add this dropdown component using our CLI or manually. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add dropdown</code>
            <CopyButton text={"npx boardui@latest add dropdown"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Model picker</h2>
          <p className="text-body-regular text-text-secondary">The AI chat composer's model menu: rows act as a radio group - selected keeps the current row highlighted and a radio glyph sits at the row's end via justify-between.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
            <ModelPickerDemo />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Team menu</h2>
          <p className="text-body-regular text-text-secondary">The sidebar's team card menu: a header and footer live alongside DropdownGroups as plain siblings, rows carry trailing badges, and DropdownDivider bleeds through the panel padding between sections.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
            <TeamMenuDemo />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{TEAM_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Account menu</h2>
          <p className="text-body-regular text-text-secondary">The sidebar's account switcher: rows render avatars instead of icons, and the panel closes with a pair of secondary buttons - row content is free-form, so anything goes inside a DropdownItem.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
            <AccountMenuDemo />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{ACCOUNT_CODE}</code></pre>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </DocsLayout>
  );
}
