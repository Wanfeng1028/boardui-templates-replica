"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RiAddLine, RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiSearchLine, RiSettings3Line, RiUserAddLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { CommandPalette, CommandPaletteItem, CommandPaletteSection } from "@/components/base/command-palette/command-palette";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const INSTALL_CMD = "npx boardui@latest add command-palette";

const CUSTOMERS = [
  { id: "acme", name: "Acme Corp", city: "Berlin" },
  { id: "globex", name: "Globex", city: "Oslo" },
  { id: "initech", name: "Initech", city: "Austin" },
];

const CUSTOM_FILTER_CODE = `const [query, setQuery] = useState("");
const results = useMemo(() => rank(customers, query), [query]);

<CommandPalette
  isOpen={open}
  onOpenChange={setOpen}
  shortcut={false}
  aria-label="Find a customer"
  placeholder="Search customers…"
  inputValue={query}
  onInputChange={setQuery}
  filter={null} // the children are already filtered
  emptyState="No customers match."
>
  {results.map((customer) => (
    <CommandPaletteItem key={customer.id} id={customer.id} textValue={customer.name} description={customer.city}>
      {customer.name}
    </CommandPaletteItem>
  ))}
</CommandPalette>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <CommandPalette
    isOpen={open}
    onOpenChange={setOpen}
    aria-label="لوحة الأوامر"
    placeholder="اكتب أمرًا أو ابحث…"
    emptyState="لا توجد نتائج"
    footer={<span>استخدم الأسهم للتنقل وEnter للتنفيذ</span>}
  >
    …
  </CommandPalette>
</DirectionProvider>`;

/** Command Palette detail page, mirroring boardui.com/components/command-palette. */
export default function CommandPalettePage() {
  const [open, setOpen] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => CUSTOMERS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  return (
    <AppShell title="Command Palette" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Put every page and action one keystroke away: open it with ⌘K, type a few letters, press Enter.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this command palette component using our CLI or manually. The CLI copies the component
            source (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            It is the component search this site opens from Quick Search: a search row over a scrolling list and a
            footer of keyboard hints, in a panel that lifts in from a soft blur.
          </p>
          <p className="text-body-regular text-text-secondary">
            Group commands with CommandPaletteSection and write each as a CommandPaletteItem with an optional icon,
            description, and keyboard shortcut. onAction receives the id of the command that ran, after the palette
            closes.
          </p>
          <p className="text-body-regular text-text-secondary">
            ⌘K or Ctrl+K opens and closes it from anywhere on the page. Change the letter with shortcut=&quot;j&quot;,
            or turn it off with shortcut={false}.
          </p>
          <Demo>
            <div className="flex flex-col items-start gap-3">
              <Button variant="secondary" leadingIcon={RiSearchLine} onClick={() => setOpen(true)}>
                Search or run a command
              </Button>
              <p className="text-body-regular text-text-secondary">
                {lastRun ? "Ran: " + lastRun : "Nothing run yet."}
              </p>
              <CommandPalette
                isOpen={open}
                onOpenChange={setOpen}
                shortcut={false}
                aria-label="Commands"
                onAction={(key) => setLastRun(String(key))}
              >
                <CommandPaletteSection title="Actions">
                  <CommandPaletteItem id="new-project" icon={RiAddLine} description="Create a blank project" shortcut="⌘N">
                    New project
                  </CommandPaletteItem>
                  <CommandPaletteItem id="invite" icon={RiUserAddLine} description="Add someone to the workspace" shortcut="⌘I">
                    Invite teammate
                  </CommandPaletteItem>
                </CommandPaletteSection>
                <CommandPaletteSection title="Pages">
                  <CommandPaletteItem id="settings" icon={RiSettings3Line} description="Workspace settings">
                    Settings
                  </CommandPaletteItem>
                  <CommandPaletteItem id="search" icon={RiSearchLine} description="Search everything" shortcut="⌘K">
                    Search
                  </CommandPaletteItem>
                </CommandPaletteSection>
              </CommandPalette>
            </div>
          </Demo>
        </Section>

        <Section title="Your own search">
          <p className="text-body-regular text-text-secondary">
            Items filter by their text with a contains match that ignores case and accents. To rank results
            yourself, or fetch them, control the query with inputValue and onInputChange, set filter={null}, and
            render only the matches.
          </p>
          <Demo>
            <div className="flex flex-col items-start gap-3">
              <Button variant="secondary" leadingIcon={RiSearchLine} onClick={() => setSearchOpen(true)}>
                Find a customer
              </Button>
              <CommandPalette
                isOpen={searchOpen}
                onOpenChange={setSearchOpen}
                shortcut={false}
                aria-label="Find a customer"
                placeholder="Search customers…"
                inputValue={query}
                onInputChange={setQuery}
                filter={null}
                emptyState="No customers match."
              >
                {results.map((customer) => (
                  <CommandPaletteItem
                    key={customer.id}
                    id={customer.id}
                    textValue={customer.name}
                    description={customer.city}
                  >
                    {customer.name}
                  </CommandPaletteItem>
                ))}
              </CommandPalette>
            </div>
          </Demo>
          <CodeBlock code={CUSTOM_FILTER_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the palette carries the direction into its portal. Translate the placeholder,
            empty state, and footer with the rest of your copy.
          </p>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Focus stays in the search field while Up and Down move the highlight through the list, and Enter runs the
            highlighted command. Escape clears the query first, then closes the palette, and focus returns to where
            it was. Screen readers hear the highlighted command as it changes.
          </p>
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
