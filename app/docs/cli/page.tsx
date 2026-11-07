"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";

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

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

function Command({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <code className="font-mono text-caption-1-medium text-text-primary">{cmd}</code>
      <CopyButton text={cmd} />
    </div>
  );
}

function OptionTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-button-default">
      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="border-b border-separator-border bg-background-secondary-default">
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">Option</th>
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([option, description]) => (
            <tr key={option} className="border-b border-separator-border last:border-b-0">
              <td className="px-4 py-2.5 font-mono text-caption-1-medium text-text-primary">{option}</td>
              <td className="px-4 py-2.5 text-body-regular text-text-secondary">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const INIT_OPTIONS: [string, string][] = [
  ["-y, --yes", "Skip confirmation prompts"],
  ["-o, --overwrite", "Overwrite existing files"],
  ["-d, --dir <dir>", "Target directory (defaults to the project source root)"],
  ["--pro", "Also install dependencies used by BoardUI Pro components"],
  ["--postcss", "Set up @tailwindcss/postcss even when Tailwind already compiles another way"],
];

const ADD_OPTIONS: [string, string][] = [
  ["-a, --all", "Add every component in the registry"],
  ["-p, --path <path>", "Custom directory to write files into"],
  ["-d, --dir <dir>", "Target directory (defaults to the project source root)"],
  ["-o, --overwrite", "Overwrite existing files"],
  ["-y, --yes", "Skip prompts — keep existing files, install dependencies"],
];

const SKILL_OPTIONS: [string, string][] = [
  ["-g, --global", "Install to ~/.claude/skills/boardui instead of the project"],
  ["-c, --client <client>", "Install to ~/.agents/skills/boardui (codex, gemini)"],
  ["-p, --path <dir>", "Custom directory to install the skill into"],
  ["-f, --force", "Overwrite an existing install (how you update)"],
];

/** CLI docs page, mirroring boardui.com/docs/cli. */
export default function CliPage() {
  return (
    <DocsLayout variant="docs" title="CLI">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            The <code className="font-mono text-caption-1-medium text-text-primary">boardui</code> CLI copies
            component source files straight into your project — no runtime package, the code is yours. It
            resolves each component&apos;s internal dependencies (utils, icons, other components) transitively
            and installs any missing npm packages with your package manager.
          </p>
          <Command cmd="npx boardui@latest add button select date-picker" />
        </div>

        <Section title="init">
          <p className="text-body-regular text-text-secondary">
            Sets up BoardUI in an existing Next.js project: installs the runtime dependencies (
            <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>,
            Tailwind v4), writes <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">styles/typography.css</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">styles/globals.css</code>, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">utils/cx.ts</code>, then prints
            the lines to add to your root layout: the stylesheet import and the Inter font.
          </p>
          <p className="text-body-regular text-text-secondary">
            When the project already compiles Tailwind v4, as create-next-app 16.4 and later do through{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/turbopack</code>,
            init leaves PostCSS alone. Otherwise it installs{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/postcss</code> and
            prints the <code className="font-mono text-caption-1-medium text-text-primary">postcss.config.mjs</code>{" "}
            line. Pass <code className="font-mono text-caption-1-medium text-text-primary">--postcss</code> to
            set PostCSS up either way.
          </p>
          <Command cmd="npx boardui@latest init" />
          <OptionTable rows={INIT_OPTIONS} />
        </Section>

        <Section title="add">
          <p className="text-body-regular text-text-secondary">
            Adds one or more components. By default, files keep the same structure as this site (
            <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components/application/…</code>
            ), imports use the <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            alias, and existing files are skipped unless you pass{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. Run it
            without arguments for an interactive picker.
          </p>
          <Command cmd="npx boardui@latest add            # interactive picker" />
          <Command cmd="npx boardui@latest add table pagination" />
          <Command cmd="npx boardui@latest add --all" />
          <OptionTable rows={ADD_OPTIONS} />
        </Section>

        <Section title="CI, scripts, and coding agents">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">add</code> ask before they
            install packages or touch files that already exist. Without a terminal to answer, as in CI, a
            script, or a coding agent, they stop with exit code 1 instead of guessing. Pass{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> to accept the
            defaults: install the dependencies and keep existing files. Add{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> to replace
            existing files, and name the components or pass{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--all</code> instead of using
            the picker.
          </p>
          <Command cmd="npx boardui@latest init --yes" />
          <Command cmd="npx boardui@latest add button select --yes" />
        </Section>

        <Section title="Custom paths and monorepos">
          <p className="text-body-regular text-text-secondary">
            Add an optional <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>{" "}
            next to the destination package&apos;s{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> to
            configure where files go and which import aliases they use. Both{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">add</code> read it, including
            for Pro components. Without it, the existing root and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">src/</code> layouts behave as
            before.
          </p>
          <p className="text-body-regular text-text-secondary">
            Configure paired <code className="font-mono text-caption-1-medium text-text-primary">paths</code>{" "}
            and <code className="font-mono text-caption-1-medium text-text-primary">aliases</code> entries for
            components, utils, hooks, styles, or lib. Run the CLI inside the destination package so npm
            dependencies install there too. Configured mappings cannot be combined with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> or{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code>; those flags
            remain available for unconfigured projects. Changing the config does not migrate previously
            installed files.
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              Configure a shared UI package and consuming apps
            </LinkButton>
          </div>
        </Section>

        <Section title="list">
          <p className="text-body-regular text-text-secondary">
            Prints every available component grouped by type — base components, application blocks, and
            foundations.
          </p>
          <Command cmd="npx boardui@latest list" />
        </Section>

        <Section title="skill">
          <p className="text-body-regular text-text-secondary">
            Installs the BoardUI agent skill (<code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
            plus catalog, theming, and pattern references) so AI assistants like Claude Code and Codex load
            BoardUI knowledge every session. Defaults to the project&apos;s{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>;
            re-run with <code className="font-mono text-caption-1-medium text-text-primary">--force</code> to
            update.
          </p>
          <Command cmd="npx boardui@latest skill" />
          <OptionTable rows={SKILL_OPTIONS} />
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              BoardUI agent skill
            </LinkButton>
          </div>
        </Section>

        <Section title="Updating components">
          <p className="text-body-regular text-text-secondary">
            Installed components are copies — yours to edit, never touched silently. To pull the latest
            version of a component from the registry, re-run{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">add</code> with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>.
          </p>
          <Command cmd="npx boardui@latest add button --overwrite" />
        </Section>

        <Section title="Anonymous telemetry">
          <p className="text-body-regular text-text-secondary">
            After a successful{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init</code>, the CLI sends an
            anonymous event containing its version, your package manager, and whether{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--pro</code> was used. After
            a successful <code className="font-mono text-caption-1-medium text-text-primary">add</code>, it
            sends the component names you explicitly requested, but not their automatically resolved
            dependencies. After a successful{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">skill</code> install, it
            sends where the skill was placed (project, global, or agents directory), never the path itself. A
            random ID in your operating system&apos;s user config directory lets us distinguish repeat runs.
            BoardUI does not send project paths, source code, dependency names, email addresses, other
            command arguments, or telemetry for{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">list</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            Disable telemetry by setting{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            or <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            Events are retained as lifetime counters and anonymous daily buckets used for daily, weekly, and
            monthly trend reporting. Daily buckets do not expire automatically.
          </p>
        </Section>

        <Section title="shadcn compatibility">
          <p className="text-body-regular text-text-secondary">
            The registry uses the shadcn item schema, so every component also installs with the shadcn CLI if
            you prefer it:
          </p>
          <CodeBlock code="npx shadcn@latest add https://www.boardui.com/r/button.json" />
        </Section>

        <Link
          href="/docs/introduction"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to introduction
        </Link>
      </div>
    </DocsLayout>
  );
}
