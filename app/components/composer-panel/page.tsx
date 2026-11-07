"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { ComposerPanel } from "@/components/application/pro/composer-panel";

/** Detail page for composer-panel - content mirrors boardui.com/components/composer-panel. */

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

const CODE_0_CODE = "{/* Auto is the default; start on another mode */}\n<ComposerPanel defaultPermission=\"plan\" />\n\n{/* Or own the mode yourself */}\nconst [permission, setPermission] = useState<ComposerPermission>(\"auto\");\n<ComposerPanel permission={permission} onPermissionChange={setPermission} />\n\n{/* The picker on its own; \"Learn more\" is a Link Button, a link with href or a button with onLearnMore */}\n<PermissionMenu value={permission} onChange={setPermission} learnMoreHref=\"/docs/permissions\" />";
const CODE_1_CODE = "{/* Start on a model and effort stop; MODEL_PROVIDERS ships eighteen realistic lineups */}\n<ComposerPanel defaultModel=\"anthropic/fable-5.1\" defaultEffort={3} />\n\n{/* Or own both */}\nconst [model, setModel] = useState(\"openai/gpt-5.6-mini\");\nconst [effort, setEffort] = useState(1); // 0 Low ... 5 Max, see EFFORT_LEVELS\n<ComposerPanel model={model} onModelChange={setModel} effort={effort} onEffortChange={setEffort} />\n\n{/* Your own catalogue, and the picker on its own */}\n<ModelPicker\n  providers={[{ id: \"acme\", name: \"Acme\", logo: \"/logos/acme.svg\", models: [{ id: \"acme/acme-1\", name: \"Acme 1\" }] }]}\n  value={model}\n  onChange={setModel}\n/>";
const CODE_2_CODE = "{/* Branch, project folder and context meter */}\n<ComposerPanel status={<ComposerStatusTab branch=\"release/2.0\" project=\"boardui\" context={82} />} />\n\n{/* No tab at all */}\n<ComposerPanel status={null} />";
const CODE_3_CODE = "const [draft, setDraft] = useState(\"\");\nconst inputRef = useRef<HTMLTextAreaElement>(null);\n\n<ComposerPanel\n  value={draft}\n  onValueChange={setDraft}\n  onSubmit={(message) => send(message)} // Enter sends, Shift+Enter breaks the line\n  disabled={waiting}\n  placeholder=\"Hi, what do you need today?\"\n  inputRef={inputRef}\n/>";

export default function ComposerPanelPage() {
  return (
    <DocsLayout variant="library" title="Composer Panel">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Pro</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/composer-panel</span>
        </div>
        <p className="text-body-regular text-text-secondary">The two-row composer: a radius-24 card with the prompt on top and the controls underneath, the add menu, a permission picker with Auto, Manual, Plan mode and Bypass all, a model picker with a scrollable provider rail and an effort popover on the chosen model, mic and send, plus a status tab with branch, project folder and context meter hanging off the card's top edge. The single-line Composer pill stays as it is; this is the taller layout for agent surfaces.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">Composer Panel is part of BoardUI Pro. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add composer-panel</code>
            <CopyButton text={"npx boardui@latest add composer-panel"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Permissions</h2>
          <p className="text-body-regular text-text-secondary">The picker paints its surface only on hover, press, or while the menu is open, so at rest it reads as a label next to the plus button. The menu lists the four modes with a one-line description each and a Learn more link button in the header (learnMoreHref or onLearnMore). Auto is the default; set defaultPermission to start elsewhere, or pass permission and onPermissionChange to own it. The trigger, the menu and the option list also ship on their own as PermissionMenu and COMPOSER_PERMISSIONS.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              <ComposerPanel />
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Model picker</h2>
          <p className="text-body-regular text-text-secondary">A 341px panel: a scrollable rail of provider marks down the left, and the chosen provider's lineup as radio rows on the right under a Models header with the Quick Search hint. MODEL_PROVIDERS ships eighteen realistic lineups, the eight marks the design carries plus ten more from LobeHub's icon set, from OpenAI and Anthropic to Google, Mistral, xAI and Amazon. Only the selected row carries the effort chip; pressing it opens the effort popover with the same six-stop Faster to Smarter slider the pill composer uses. Quick Search, or /, turns the header into a field that filters every lineup at once, each match tagged with its provider; a pick lands you on that provider's list. Every list scrolls. Pass providers for your own catalogue.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_1_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Status tab</h2>
          <p className="text-body-regular text-text-secondary">The tab is a 34px grey strip inset 28px on each side, rounded at the top only, carrying the branch, the project folder and the 16px context ring. It is the status slot: render ComposerStatusTab with your own values, drop in anything else, or pass null for the bare card.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_2_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Wiring it up</h2>
          <p className="text-body-regular text-text-secondary">The prompt is a textarea that grows a line at a time up to ten lines. Enter sends and Shift+Enter breaks the line; onSubmit receives the text and the field clears itself when uncontrolled. disabled greys out send while a turn is in flight, and inputRef reaches the field for focus.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_3_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Attachments</h2>
          <p className="text-body-regular text-text-secondary">The same card carries a strip of 56px file tiles above the prompt, each drawing the upload ring while its file lands. The tiles, the strip and the sequential upload queue have their own page.</p>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </DocsLayout>
  );
}
