"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { FREE_COMPONENT_PREVIEWS } from "@/components/application/docs/component-previews-free";

/** Detail page for divider - content mirrors boardui.com/components/divider. */

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

const CODE_0_CODE = "<Divider>Single line</Divider>\n<Divider variant=\"double\">Double line</Divider>\n<Divider variant=\"fill\">Background fill</Divider>";
const CODE_1_CODE = "<Divider align=\"start\">Start</Divider>\n<Divider align=\"center\">Center</Divider>\n<Divider align=\"end\">End</Divider>";
const CODE_2_CODE = "import { RiAddLine, RiArrowDownLine, RiArrowUpLine } from \"@remixicon/react\";\nimport { Avatar } from \"@/components/base/avatar/avatar\";\nimport { Chip } from \"@/components/base/badges/chip\";\nimport { Button } from \"@/components/base/buttons/button\";\nimport { ButtonGroup, ButtonGroupItem } from \"@/components/base/buttons/button-group\";\n\n{/* Icon */}\n<Divider>\n  <RiAddLine className=\"size-5 text-foreground-icon-secondary\" aria-hidden />\n</Divider>\n\n{/* Chip */}\n<Divider>\n  <Chip color=\"neutral\">NEW</Chip>\n</Divider>\n\n{/* Button */}\n<Divider>\n  <Button variant=\"secondary\" size=\"small\">Button</Button>\n</Divider>\n\n{/* Button group */}\n<Divider>\n  <ButtonGroup size=\"small\" aria-label=\"Move item\">\n    <ButtonGroupItem size=\"small\" aria-label=\"Move down\">\n      <RiArrowDownLine className=\"size-5\" aria-hidden />\n    </ButtonGroupItem>\n    <ButtonGroupItem size=\"small\" aria-label=\"Add between\">\n      <RiAddLine className=\"size-5\" aria-hidden />\n    </ButtonGroupItem>\n    <ButtonGroupItem size=\"small\" aria-label=\"Move up\">\n      <RiArrowUpLine className=\"size-5\" aria-hidden />\n    </ButtonGroupItem>\n  </ButtonGroup>\n</Divider>\n\n{/* Avatar group */}\n<Divider>\n  <div className=\"flex items-center\">\n    <Avatar size=\"md\" src=\"/avatars/aspen-lubin.webp\" alt=\"Aspen Lubin\" className=\"ring-2 ring-background-primary-default\" />\n    <Avatar size=\"md\" src=\"/avatars/john-clarkson.webp\" alt=\"John Clarkson\" className=\"-ml-2 ring-2 ring-background-primary-default\" />\n    <span className=\"-ml-2 inline-flex size-8 items-center justify-center rounded-full bg-neutral-900 text-caption-1-semibold text-white ring-2 ring-background-primary-default dark:bg-neutral-700\">\n      +7\n    </span>\n  </div>\n</Divider>\n\n{/* Any of the above also works on the filled surface */}\n<Divider variant=\"fill\">\n  <ButtonGroup size=\"small\" aria-label=\"Activity filter\">\n    <ButtonGroupItem size=\"small\" selected>All</ButtonGroupItem>\n    <ButtonGroupItem size=\"small\">Unread</ButtonGroupItem>\n    <ButtonGroupItem size=\"small\">Archived</ButtonGroupItem>\n  </ButtonGroup>\n</Divider>";
const CODE_3_CODE = "<Divider aria-label=\"Section break\" />\n<Divider variant=\"double\" aria-label=\"Section break\" />\n<Divider variant=\"fill\" aria-label=\"Section break\" />";

export default function DividerPage() {
  return (
    <AppShell title="Divider" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Free</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/divider</span>
        </div>
        <p className="text-body-regular text-text-secondary">A composable horizontal separator for organizing dense application interfaces. Use a single hairline, framed double line, or soft filled strip, then place text, buttons, or compact controls anywhere along it.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">You can add the divider component using our CLI or manually. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add divider</code>
            <CopyButton text={"npx boardui@latest add divider"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Variants</h2>
          <p className="text-body-regular text-text-secondary">Choose single, double, or fill. Every treatment uses BoardUI semantic border and surface tokens, so it follows the active theme automatically.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              {(() => { const Preview = FREE_COMPONENT_PREVIEWS["/components/divider"]; return Preview ? <Preview /> : null; })()}
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Alignment</h2>
          <p className="text-body-regular text-text-secondary">The align prop positions content at the start, center, or end. Single-line dividers keep the hairline on the open side.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_1_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Icons, chips, buttons and avatars</h2>
          <p className="text-body-regular text-text-secondary">Children are not restricted to text. An icon, a chip, a button, a button group, or a stack of avatars all sit in the same slot, and the line closes around whatever width they take. No extra props are involved: the content is composed as children, so anything compact belongs here.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_2_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Without content</h2>
          <p className="text-body-regular text-text-secondary">Omit children for a purely structural separator. In this form the component exposes the native separator role and horizontal orientation to assistive technology.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_3_CODE}</code></pre>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}
