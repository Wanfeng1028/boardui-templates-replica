"use client";

import { RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { CodeTabs, PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  );
}

/** Agent Skills page, mirroring boardui.com/skill. */
export default function SkillPage() {
  return (
    <DocsLayout variant="library" hidePrevNext title="Agent Skills">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            One command gives your AI assistant full knowledge of BoardUI: every component and template, the
            design rules, theming, patterns, and motion. Claude Code, Codex, and other skill-capable agents
            load it automatically and build with real BoardUI components instead of inventing lookalikes.
          </p>
          <p className="text-body-regular text-text-secondary">
            Skills follow the open <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
            standard: markdown your agent discovers on its own, no server needed. Content is fetched fresh
            from boardui.com on every install.
          </p>
        </div>

        <Section title="Install">
          <p className="text-body-regular text-text-secondary">
            One command, run from your project root. Pick the tab for where it should live: the default writes
            to <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>{" "}
            in the project, so the skill rides your repo and your whole team&apos;s agents pick it up. Global
            and the agents directory cover user-wide installs and clients like Codex or Gemini.
          </p>
          <CodeTabs
            tabs={[
              { value: "Project (default)", code: "npx boardui@latest skill" },
              { value: "Global", code: "npx boardui@latest skill --global" },
              { value: "Codex & Gemini", code: "npx boardui@latest skill --client codex" },
              { value: "Custom path", code: "npx boardui@latest skill --path .agents/skills/boardui" },
            ]}
          />
          <p className="text-body-regular text-text-secondary">
            Already connected to the BoardUI MCP server? Just ask your agent to run{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>, no
            terminal needed.
          </p>
        </Section>

        <Section title="What's inside">
          <p className="text-body-regular text-text-secondary">
            A lean <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code> the
            agent always loads, plus reference files it reads on demand (progressive disclosure, per the skills
            standard):
          </p>
          <SubSection title="SKILL.md">
            <p className="text-body-regular text-text-secondary">
              The core file your agent always loads: the build workflow (detect setup, discover, install,
              compose, verify), a digest of the design rules, guidance on choosing the right component for the
              job, known gotchas, and how Pro licensing works.
            </p>
          </SubSection>
          <SubSection title="references/components.md">
            <p className="text-body-regular text-text-secondary">
              The full catalog, generated from the live registry: every component and template with description,
              install command, and a usage example.
            </p>
          </SubSection>
          <SubSection title="references/theming.md">
            <p className="text-body-regular text-text-secondary">
              Token architecture, the semantic color families, the composite type scale, dark mode mechanics,
              and how to rebrand the accent ramp.
            </p>
          </SubSection>
          <SubSection title="references/patterns.md">
            <p className="text-body-regular text-text-secondary">
              Page anatomy recipes: dashboard, table page, auth, AI chat, and settings, each as an annotated
              skeleton with real imports.
            </p>
          </SubSection>
          <SubSection title="references/motion.md">
            <p className="text-body-regular text-text-secondary">
              The hand-tuned micro-animation language: the duration scale, signature easings, the blur-in
              entrance, press feedback, springs.
            </p>
          </SubSection>
        </Section>

        <Section title="Where it goes per client">
          <p className="text-body-regular text-text-secondary">
            Claude Code discovers skills in the project&apos;s{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/</code> (the
            default install) and in{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">~/.claude/skills/</code> (
            <code className="font-mono text-caption-1-medium text-text-primary">--global</code>). Codex, Gemini
            CLI, and other clients that share the agents convention read{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">~/.agents/skills/</code> (
            <code className="font-mono text-caption-1-medium text-text-primary">--client codex</code>).
            Anything else: <code className="font-mono text-caption-1-medium text-text-primary">--path</code>{" "}
            puts the folder wherever your client looks. Skills load when a session starts, so restart your
            agent or open a fresh chat after installing.
          </p>
        </Section>

        <Section title="Updating">
          <p className="text-body-regular text-text-secondary">
            The skill carries a version stamp in its frontmatter, and the registry rebuilds it on every deploy:
            new components appear in the catalog automatically. Re-run the install with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--force</code> to update in
            place; the command prints installed and fetched versions so you can see what changed.
          </p>
          <PkgCommand
            npm="npx boardui@latest skill --force"
            pnpm="pnpm dlx boardui@latest skill --force"
            yarn="yarn dlx boardui@latest skill --force"
          />
        </Section>

        <Section title="Skill vs MCP">
          <p className="text-body-regular text-text-secondary">
            They complement each other. The skill is knowledge the agent always has: the catalog, the rules,
            the patterns, loaded every session with zero setup. The MCP server is live tooling: full component
            source on demand, installs without a terminal, project init, and Pro license activation in chat.
            Best setup: install both. The skill makes the agent plan with real BoardUI components; MCP lets it
            execute.
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              MCP server
            </LinkButton>
          </div>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            The skill&apos;s catalog covers Pro components and templates too, marked PRO, with public usage
            examples but never source. With a Pro license activated once (
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest login &lt;key&gt;</code>
            , key in your Lemon Squeezy receipt), your agent installs Pro items exactly like free ones. Without
            one, it knows what exists and points you to pricing instead of guessing at a lookalike.
          </p>
          <div>
            <LinkButton href="/pricing" trailingIcon={RiArrowRightSLine}>
              Pricing
            </LinkButton>
          </div>
        </Section>

        <PrevNext
          prev={{ href: "/mcp", label: "MCP Server", sub: "Agents install for you" }}
          next={{ href: "/rtl", label: "RTL Support" }}
        />
      </div>
    </DocsLayout>
  );
}
