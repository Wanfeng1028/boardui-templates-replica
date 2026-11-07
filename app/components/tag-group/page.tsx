"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBookOpenLine,
  RiBugLine,
  RiCheckLine,
  RiFileCopyLine,
  RiSparklingLine,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { Tag, TagGroup } from "@/components/base/tag-group/tag-group";

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

const INSTALL_CMD = "npx boardui@latest add tag-group";

const REMOVABLE_CODE = `const [skills, setSkills] = useState([
  { id: "react", name: "React" },
  { id: "typescript", name: "TypeScript" },
]);

<TagGroup
  label="Skills"
  items={skills}
  onRemove={(keys) => setSkills(skills.filter((skill) => !keys.has(skill.id)))}
  emptyState="No skills yet."
>
  {(skill) => <Tag>{skill.name}</Tag>}
</TagGroup>`;

const COLORS_CODE = `<TagGroup label="Labels">
  <Tag id="bug" color="rose" icon={RiBugLine}>Bug</Tag>
  <Tag id="feature" color="lime" icon={RiSparklingLine}>Feature</Tag>
  <Tag id="docs" color="cyan" icon={RiBookOpenLine}>Docs</Tag>
</TagGroup>

<TagGroup label="Small" size="small" selectionMode="single" defaultSelectedKeys={["week"]} disallowEmptySelection>
  <Tag id="day">Today</Tag>
  <Tag id="week">This week</Tag>
  <Tag id="month">This month</Tag>
</TagGroup>`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <TagGroup label="المهارات" items={skills} onRemove={remove}>
    {(skill) => <Tag>{skill.name}</Tag>}
  </TagGroup>
</DirectionProvider>`;

/** Tag Group detail page, mirroring boardui.com/components/tag-group. */
export default function TagGroupPage() {
  const [skills, setSkills] = useState([
    { id: "react", name: "React" },
    { id: "typescript", name: "TypeScript" },
    { id: "figma", name: "Figma" },
    { id: "sql", name: "SQL" },
  ]);
  const [rtlSkills, setRtlSkills] = useState([
    { id: "search", name: "البحث" },
    { id: "writing", name: "الكتابة" },
    { id: "design", name: "التصميم" },
  ]);
  return (
    <DocsLayout variant="library" title="Tag Group">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Show a set of topics, skills, or labels that people can filter by, pick from, or prune.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the tag group using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="Removable tags">
          <p className="text-body-regular text-text-secondary">
            Pass onRemove and each tag gets a small remove button; Backspace or Delete removes the focused tag
            too. With items, the group renders tags from your data, and emptyState fills the space once the last
            one goes.
          </p>
          <Demo>
            <TagGroup
              label="Skills"
              items={skills}
              onRemove={(keys) => setSkills(skills.filter((skill) => !keys.has(skill.id)))}
              emptyState="No skills yet."
            >
              {(skill) => <Tag>{skill.name}</Tag>}
            </TagGroup>
          </Demo>
          <CodeBlock code={REMOVABLE_CODE} />
        </Section>

        <Section title="Colors and sizes">
          <p className="text-body-regular text-text-secondary">
            Tags take Chip&apos;s colour pairs through color and an optional icon. size=&quot;small&quot; makes
            them 24px tall, and selectionMode=&quot;single&quot; turns the group into a choice of one.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <TagGroup label="Labels">
                <Tag id="bug" color="rose" icon={RiBugLine}>
                  Bug
                </Tag>
                <Tag id="feature" color="lime" icon={RiSparklingLine}>
                  Feature
                </Tag>
                <Tag id="docs" color="cyan" icon={RiBookOpenLine}>
                  Docs
                </Tag>
                <Tag id="question" color="blue">
                  Question
                </Tag>
              </TagGroup>
              <TagGroup
                label="Small"
                size="small"
                selectionMode="single"
                defaultSelectedKeys={["week"]}
                disallowEmptySelection
              >
                <Tag id="day">Today</Tag>
                <Tag id="week">This week</Tag>
                <Tag id="month">This month</Tag>
                <Tag id="year">This year</Tag>
              </TagGroup>
            </div>
          </Demo>
          <CodeBlock code={COLORS_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, tags flow from the right, the remove buttons sit at their left ends, and the
            arrow keys follow the reading direction.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <TagGroup
                label="المهارات"
                items={rtlSkills}
                onRemove={(keys) => setRtlSkills(rtlSkills.filter((skill) => !keys.has(skill.id)))}
              >
                {(skill) => <Tag>{skill.name}</Tag>}
              </TagGroup>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Keyboard and accessibility">
          <p className="text-body-regular text-text-secondary">
            The group is one tab stop. Arrow keys move between tags, Space and Enter toggle a selectable tag, and
            Backspace or Delete removes a removable one, moving focus to its neighbour.
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
