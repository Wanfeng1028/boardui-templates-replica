"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiTimeLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { ComboBox, ComboBoxItem, ComboBoxSection } from "@/components/base/combobox/combobox";
import { DirectionProvider } from "@/components/foundations/direction/direction";

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

const INSTALL_CMD = "npx boardui@latest add combobox";

const PEOPLE = [
  { id: "leo", name: "Leo Park" },
  { id: "mia", name: "Mia Chen" },
  { id: "noah", name: "Noah Kim" },
];

const TIMEZONES = [
  {
    title: "Americas",
    zones: [
      { id: "ny", label: "New York", offset: "GMT-4" },
      { id: "sf", label: "San Francisco", offset: "GMT-7" },
    ],
  },
  {
    title: "Europe",
    zones: [
      { id: "lon", label: "London", offset: "GMT+1" },
      { id: "ber", label: "Berlin", offset: "GMT+2" },
    ],
  },
];

const LABELS = ["Bug", "Feature", "Docs"];

const SECTIONS_CODE = `<ComboBox label="Timezone" placeholder="Search cities" leadingIcon={RiTimeLine} menuTrigger="focus">
  {timezones.map((group) => (
    <ComboBoxSection key={group.title} id={group.title} title={group.title}>
      {group.zones.map((zone) => (
        <ComboBoxItem key={zone.id} id={zone.id} textValue={zone.label}>
          <span className="flex-1 truncate">{zone.label}</span>
          <span className="text-body-2-regular text-text-tertiary">{zone.offset}</span>
        </ComboBoxItem>
      ))}
    </ComboBoxSection>
  ))}
</ComboBox>`;

const CUSTOM_CODE = `const [value, setValue] = useState("");

<ComboBox
  label="Label"
  placeholder="Pick or type a label"
  allowsCustomValue
  inputValue={value}
  onInputChange={setValue}
  hint="Press Enter to keep a label that is not in the list."
>
  {labels.map((label) => (
    <ComboBoxItem key={label} id={label}>{label}</ComboBoxItem>
  ))}
</ComboBox>`;

const CONTROLLED_CODE = `const [selected, setSelected] = useState<Key | null>("leo");

<ComboBox
  label="Reviewer"
  placeholder="Search people"
  defaultItems={people}
  selectedKey={selected}
  onSelectionChange={setSelected}
>
  {(person) => (
    <ComboBoxItem id={person.id} textValue={person.name}>{person.name}</ComboBoxItem>
  )}
</ComboBox>`;

const STATES_CODE = `<ComboBox label="Small" size="small" placeholder="Search" defaultItems={people}>…</ComboBox>
<ComboBox label="Invalid" isInvalid hint="Pick someone on the team." defaultItems={people}>…</ComboBox>
<ComboBox label="Disabled" isDisabled defaultItems={people}>…</ComboBox>

// Shown when nothing matches
<ComboBox emptyMessage="No one by that name" …>…</ComboBox>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <ComboBox label="الدولة" placeholder="ابحث عن دولة" defaultItems={countries} emptyMessage="لا توجد نتائج">
    {(country) => (
      <ComboBoxItem id={country.id} textValue={country.name}>{country.name}</ComboBoxItem>
    )}
  </ComboBox>
</DirectionProvider>`;

/** Combobox detail page, mirroring boardui.com/components/combobox. */
export default function ComboboxPage() {
  const [customValue, setCustomValue] = useState("");
  const [selected, setSelected] = useState<Key | null>("leo");

  return (
    <DocsLayout variant="library" title="Combobox">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Type to filter a list and pick from it: assignees, timezones, countries, or labels of your own.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this combobox component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
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
            The field is Input&apos;s own, with the same surface and focus ring, and a toggle at its end. The list
            opens under the whole field at its width, uses the Select menu surface, and marks the chosen row with a
            check. Pass defaultItems with a render function, or write ComboBoxItem rows by hand.
          </p>
          <p className="text-body-regular text-text-secondary">
            Every row needs a textValue when its content is more than plain text: it is what the filter matches and
            what the field shows once the row is chosen.
          </p>
          <Demo>
            <div className="max-w-sm">
              <ComboBox label="Assignee" placeholder="Search people" defaultItems={PEOPLE}>
                {(person) => (
                  <ComboBoxItem id={person.id} textValue={person.name}>
                    {person.name}
                  </ComboBoxItem>
                )}
              </ComboBox>
            </div>
          </Demo>
        </Section>

        <Section title="Sections">
          <p className="text-body-regular text-text-secondary">
            Group rows with ComboBoxSection. Set menuTrigger=&quot;focus&quot; to open the full list when the field
            is focused, before anything is typed. Long lists scroll under a soft blur at their top edge.
          </p>
          <Demo>
            <div className="max-w-sm">
              <ComboBox label="Timezone" placeholder="Search cities" leadingIcon={RiTimeLine} menuTrigger="focus">
                {TIMEZONES.map((group) => (
                  <ComboBoxSection key={group.title} id={group.title} title={group.title}>
                    {group.zones.map((zone) => (
                      <ComboBoxItem key={zone.id} id={zone.id} textValue={zone.label}>
                        <span className="flex-1 truncate">{zone.label}</span>
                        <span className="text-body-2-regular text-text-tertiary">{zone.offset}</span>
                      </ComboBoxItem>
                    ))}
                  </ComboBoxSection>
                ))}
              </ComboBox>
            </div>
          </Demo>
          <CodeBlock code={SECTIONS_CODE} />
        </Section>

        <Section title="Custom values">
          <p className="text-body-regular text-text-secondary">
            With allowsCustomValue the field works as an autocomplete: suggestions help, but any text can be kept.
            Read it with inputValue and onInputChange.
          </p>
          <Demo>
            <div className="max-w-sm">
              <ComboBox
                label="Label"
                placeholder="Pick or type a label"
                allowsCustomValue
                inputValue={customValue}
                onInputChange={setCustomValue}
                hint="Press Enter to keep a label that is not in the list."
              >
                {LABELS.map((label) => (
                  <ComboBoxItem key={label} id={label}>
                    {label}
                  </ComboBoxItem>
                ))}
              </ComboBox>
            </div>
          </Demo>
          <CodeBlock code={CUSTOM_CODE} />
        </Section>

        <Section title="Controlled">
          <p className="text-body-regular text-text-secondary">
            Keep the choice in your own state with selectedKey and onSelectionChange. It is null until a row is
            picked.
          </p>
          <Demo>
            <div className="flex max-w-sm flex-col gap-3">
              <ComboBox
                label="Reviewer"
                placeholder="Search people"
                defaultItems={PEOPLE}
                selectedKey={selected}
                onSelectionChange={setSelected}
              >
                {(person) => (
                  <ComboBoxItem id={person.id} textValue={person.name}>
                    {person.name}
                  </ComboBoxItem>
                )}
              </ComboBox>
              <p className="text-body-regular text-text-secondary">
                Reviewer: {selected ? PEOPLE.find((p) => p.id === selected)?.name ?? selected : "None"}
              </p>
            </div>
          </Demo>
          <CodeBlock code={CONTROLLED_CODE} />
        </Section>

        <Section title="Sizes and states">
          <p className="text-body-regular text-text-secondary">
            size=&quot;small&quot; matches the compact Input. Invalid and disabled fields take Input&apos;s
            colours, and emptyMessage replaces the message shown when nothing matches.
          </p>
          <Demo>
            <div className="flex max-w-sm flex-col gap-4">
              <ComboBox label="Small" size="small" placeholder="Search" defaultItems={PEOPLE}>
                {(person) => (
                  <ComboBoxItem id={person.id} textValue={person.name}>
                    {person.name}
                  </ComboBoxItem>
                )}
              </ComboBox>
              <ComboBox label="Invalid" isInvalid hint="Pick someone on the team." defaultItems={PEOPLE}>
                {(person) => (
                  <ComboBoxItem id={person.id} textValue={person.name}>
                    {person.name}
                  </ComboBoxItem>
                )}
              </ComboBox>
              <ComboBox label="Disabled" isDisabled defaultItems={PEOPLE}>
                {(person) => (
                  <ComboBoxItem id={person.id} textValue={person.name}>
                    {person.name}
                  </ComboBoxItem>
                )}
              </ComboBox>
            </div>
          </Demo>
          <CodeBlock code={STATES_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Wrap the field in DirectionProvider. The icon and toggle swap sides, the list opens from the right edge,
            and its rows mirror.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="max-w-sm">
                <ComboBox
                  label="الدولة"
                  placeholder="ابحث عن دولة"
                  defaultItems={[
                    { id: "eg", name: "مصر" },
                    { id: "sa", name: "السعودية" },
                  ]}
                  emptyMessage="لا توجد نتائج"
                >
                  {(country) => (
                    <ComboBoxItem id={country.id} textValue={country.name}>
                      {country.name}
                    </ComboBoxItem>
                  )}
                </ComboBox>
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            Typing filters the list. Down and Up open it and move through the rows, Enter picks the highlighted
            row, and Escape closes the list, or clears the text when it is already closed. Focus stays in the field
            the whole time, and screen readers announce the highlighted row and the number of results.
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
