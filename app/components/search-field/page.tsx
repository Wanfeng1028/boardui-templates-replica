"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { SearchField } from "@/components/base/search-field/search-field";

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

const INSTALL_CMD = "npx boardui@latest add search-field";

const SHAPES_CODE = `<SearchField label="Pill" placeholder="Search" />
<SearchField label="Rounded" shape="rounded" placeholder="Search" />
<SearchField label="Pill, small" size="small" placeholder="Search" />
<SearchField label="Rounded, small" size="small" shape="rounded" placeholder="Search" />`;

const LOADING_CODE = `const [query, setQuery] = useState("");
const { data, isFetching } = useArticles(query);

<SearchField
  label="Help center"
  placeholder="Search articles"
  value={query}
  onChange={setQuery}
  isLoading={isFetching}
/>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <SearchField label="البحث في الفريق" placeholder="ابحث بالاسم أو الدور" clearLabel="مسح البحث" />
</DirectionProvider>`;

/** Search Field detail page, mirroring boardui.com/components/search-field. */
export default function SearchFieldPage() {
  const [query, setQuery] = useState("");
  return (
    <DocsLayout variant="library" title="Search Field">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Let people narrow a list, a table, or a help center as they type, and clear it in one keystroke.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the search field using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Shapes and sizes">
          <p className="text-body-regular text-text-secondary">
            It is a pill by default, like the search in BoardUI&apos;s tables. Set shape=&quot;rounded&quot; to
            match Input in a form, and size=&quot;small&quot; for toolbars. The clear button fades in once there
            is text.
          </p>
          <Demo>
            <div className="grid gap-4 sm:grid-cols-2">
              <SearchField label="Pill" placeholder="Search" />
              <SearchField label="Rounded" shape="rounded" placeholder="Search" />
              <SearchField label="Pill, small" size="small" placeholder="Search" />
              <SearchField label="Rounded, small" size="small" shape="rounded" placeholder="Search" />
            </div>
          </Demo>
          <CodeBlock code={SHAPES_CODE} />
        </Section>

        <Section title="Loading">
          <p className="text-body-regular text-text-secondary">
            While results are on their way, isLoading turns the search icon into Spinner&apos;s orbiting light,
            and turns it back when they land.
          </p>
          <Demo>
            <SearchField
              label="Help center"
              placeholder="Search articles"
              value={query}
              onChange={setQuery}
              isLoading={query.length > 0}
              hint='Try "team" or "plan".'
            />
          </Demo>
          <CodeBlock code={LOADING_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the icon and the clear button swap sides. Translate the clear button&apos;s
            name with clearLabel.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <SearchField label="البحث في الفريق" placeholder="ابحث بالاسم أو الدور" clearLabel="مسح البحث" />
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Escape clears the text and Enter calls onSubmit. The clear button stays out of the tab order, since
            Escape does its job from the keyboard. Give the field a label or an aria-label; without either, the
            placeholder names it.
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
    </DocsLayout>
  );
}
