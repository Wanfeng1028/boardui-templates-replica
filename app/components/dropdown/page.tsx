"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { FREE_COMPONENT_PREVIEWS } from "@/components/application/docs/component-previews-free";

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
              {(() => { const Preview = FREE_COMPONENT_PREVIEWS["/components/dropdown"]; return Preview ? <Preview /> : null; })()}
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </DocsLayout>
  );
}
