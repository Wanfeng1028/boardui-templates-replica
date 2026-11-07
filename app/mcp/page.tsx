"use client";

import { useState } from "react";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { ButtonLink } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

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


function FileBlock({ file, code }: { file: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-caption-1-medium text-text-secondary">{file}</p>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

function Command({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).then(done).catch(done);
    } else {
      done();
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-0 rounded-2xl bg-background-secondary-default p-1">
        <div className="flex items-center justify-between">
          <span className="rounded-md px-2.5 py-1 text-body-medium text-text-primary">terminal</span>
          <div className="pe-1">
            <button
              type="button"
              aria-label="Copy"
              onClick={copy}
              className="flex size-7 cursor-pointer items-center justify-center rounded-2lg transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
                {copied ? (
                  <RiCheckLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                ) : (
                  <RiFileCopyLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                )}
              </span>
            </button>
          </div>
        </div>
        <div className="p-1">
          <div className="overflow-auto rounded-xl bg-docs-code-background px-5 py-3 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05),0px_6px_10px_0px_rgba(0,0,0,0.02)]">
            <code className="block font-mono text-[14px] leading-5 whitespace-pre text-text-secondary">{cmd}</code>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3.5 py-1.5 text-body-medium text-text-primary transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-4" aria-hidden /> : <RiFileCopyLine className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy command"}
        </button>
      </div>
    </div>
  );
}

const TOOLS: [string, string][] = [
  ["get_started", "Overview of BoardUI, the typical flow, RTL setup, and the Pro licensing rules."],
  ["list_components", "Every installable item with exact names, free and Pro, grouped by type."],
  ["get_component", "Description, dependencies, usage example, and full source for one item."],
  ["get_usage_examples", "Working code snippets from the item's docs page, Pro items included."],
  ["install_components", "Writes component source into the project and installs missing npm deps."],
  ["init_boardui", "One-time setup: Tailwind v4, runtime deps, theme and global styles, utils."],
  ["install_rules", "Writes the always-on design rules into AGENTS.md and .cursor/rules/."],
  ["get_skill", "Explains the agent skill: live SKILL.md, bundled files, install options per client."],
  ["install_skill", "Installs the BoardUI agent skill (catalog, theming, patterns) into .claude/skills/."],
  ["get_theme", "The theme tokens, type scale, global stylesheet, and RTL setup guidance."],
  ["activate_license", "Activates a BoardUI Pro license key on the machine and stores it."],
  ["license_status", "Whether a Pro license is active, with the key shown masked."],
  ["deactivate_license", "Releases the machine's Pro seat and removes the stored key."],
];

const EXAMPLE_PROMPTS = [
  "Set up BoardUI in this project and add the button, select, and date picker.",
  "I bought BoardUI Pro. Here's my license key: XXXX. Activate it and install the AI chat template.",
  "Build a sign-in page with BoardUI's auth card and social buttons.",
  "Enable RTL for Arabic and Hebrew in this BoardUI project, including Pro blocks and templates.",
  "What props does the BoardUI button take? Show me the icon variants.",
  "Add BoardUI's data table and wire it to my /api/orders endpoint.",
  "Show me BoardUI's theme tokens, then restyle the primary button to match my brand.",
  "Build a revenue dashboard with BoardUI stat cards, an area chart, and a bar list.",
];

const CLIENTS = ["Claude Code", "Cursor", "VS Code", "Codex", "Other clients"] as const;

const SHADCN_MCP_CODE = `{
  "registries": {
    "@boardui": "https://www.boardui.com/r/{name}.json"
  }
}`;


const MCP_STDIO_CODE = `{
  "mcpServers": {
    "boardui": {
      "command": "npx",
      "args": ["-y", "boardui@latest", "mcp"]
    }
  }
}`;

const VSCODE_MCP_CODE = `{
  "servers": {
    "boardui": {
      "command": "npx",
      "args": ["-y", "boardui@latest", "mcp"]
    }
  }
}`;

// One-click install deep links (standard Cursor / VS Code MCP install URL
// schemes; the configs above are the verbatim server configs).
const CURSOR_INSTALL_URL =
  "cursor://anysphere.cursor-deeplink/mcp/install?name=boardui&config=" +
  encodeURIComponent(
    JSON.stringify({ mcpServers: { boardui: { command: "npx", args: ["-y", "boardui@latest", "mcp"] } } }),
  );
const VSCODE_INSTALL_URL =
  "vscode:mcp/install?" +
  encodeURIComponent(
    JSON.stringify({ servers: { boardui: { command: "npx", args: ["-y", "boardui@latest", "mcp"] } } }),
  );

/** MCP server page, mirroring boardui.com/mcp. */
export default function McpPage() {
  const [client, setClient] = useState<(typeof CLIENTS)[number]>("Claude Code");
  return (
    <AppShell title="MCP Server" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUI ships an MCP server, so AI agents can do the installing for you. Claude Code, Cursor, VS
            Code, Codex, and any MCP client can browse the registry, read component source and real usage
            examples, set up a fresh project, and write component files straight into it. No terminal
            round-trips, you just describe what you want built.
          </p>
          <p className="text-body-regular text-text-secondary">
            The server runs locally over stdio via{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx</code>, nothing is hosted.
            Free components work with zero configuration; BoardUI Pro unlocks in the same chat once your agent
            activates your license key.
          </p>
          <p className="text-body-regular text-text-secondary">
            One rule for every client below: MCP tools bind when a session starts. If you register the server
            mid-session, restart the client or open a fresh chat, or it will show as connected with no tools
            available.
          </p>
        </div>

        <Section title="Setup">
          <p className="text-body-regular text-text-secondary">
            Pick your client. Cursor and VS Code install with one click; Claude Code and Codex take one
            command.
          </p>
          <div className="flex flex-wrap gap-2">
            {CLIENTS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setClient(name)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                  client === name
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          {client === "Claude Code" || client === "Codex" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                One command in your project directory. Add{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">--scope user</code> to
                enable it for every project, and restart Claude Code (or open a new session) afterwards so the
                tools bind.
              </p>
              <Command cmd="claude mcp add boardui -- npx -y boardui@latest mcp" />
            </>
          ) : client === "Cursor" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                Install with one click, or add the server to{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.cursor/mcp.json</code>{" "}
                yourself, then enable it under Settings, Tools &amp; MCP.
              </p>
              <div>
                <ButtonLink href={CURSOR_INSTALL_URL}>Add to Cursor</ButtonLink>
              </div>
              <FileBlock file=".cursor/mcp.json" code={MCP_STDIO_CODE} />
            </>
          ) : client === "VS Code" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                Install with one click, or add the server to{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.vscode/mcp.json</code>{" "}
                and press Start next to it.
              </p>
              <div>
                <ButtonLink href={VSCODE_INSTALL_URL}>Add to VS Code</ButtonLink>
              </div>
              <FileBlock file=".vscode/mcp.json" code={VSCODE_MCP_CODE} />
            </>
          ) : (
            <>
              <p className="text-body-regular text-text-secondary">
                Windsurf, Zed, Cline, and every other MCP client take the same stdio server. Point them at
                this config wherever they keep MCP servers:
              </p>
              <FileBlock file="mcp.json" code={MCP_STDIO_CODE} />
            </>
          )}
        </Section>

        <Section title="Monorepos and custom aliases">
          <p className="text-body-regular text-text-secondary">
            The local MCP server reads the same optional{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> as the
            CLI. Put it next to the destination package&apos;s{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> and pass
            that package&apos;s absolute path as{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> to{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_components</code>, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>. Files and
            npm dependencies install into that package, with the configured import aliases.
          </p>
          <p className="text-body-regular text-text-secondary">
            Pass the same{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> to{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">get_component</code> and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">get_usage_examples</code> for
            matching source and examples. Without it, these read tools return the original registry imports.
            Package exports and each app&apos;s styles still need setup.
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              Set up a shared UI package
            </LinkButton>
          </div>
        </Section>

        <Section title="Try asking your agent">
          <p className="text-body-regular text-text-secondary">
            Once connected, talk to your agent in plain language. A few starters:
          </p>
          <ul className="flex flex-col gap-1.5">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <li key={prompt} className="flex items-start gap-2 text-body-regular text-text-secondary">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-foreground-icon-tertiary" />
                {prompt}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Tools">
          <p className="text-body-regular text-text-secondary">What the server exposes to your agent:</p>
          <div className="overflow-x-auto rounded-xl border border-border-button-default">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-separator-border bg-background-secondary-default">
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">Tool</th>
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">What it does</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map(([tool, description]) => (
                  <tr key={tool} className="border-b border-separator-border last:border-b-0">
                    <td className="px-4 py-2.5 font-mono text-caption-1-medium text-text-primary">{tool}</td>
                    <td className="px-4 py-2.5 text-body-regular text-text-secondary">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Always-on design rules">
          <p className="text-body-regular text-text-secondary">
            MCP tools are on demand: an agent only sees your theme when it thinks to ask, and a model that
            never asks invents its own spacing, colors, and type. So{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code> (and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>) also
            installs the design foundations as always-on instruction files that agents load every session: a
            fenced section in <code className="font-mono text-caption-1-medium text-text-primary">AGENTS.md</code>{" "}
            and a Cursor rule at{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.cursor/rules/boardui.mdc</code>
            . They pin the semantic color tokens, the composite type scale, spacing and radius conventions,
            dark mode, and <code className="font-mono text-caption-1-medium text-text-primary">cx()</code>,
            and re-runs refresh the section in place without touching the rest of your file.
          </p>
          <p className="text-body-regular text-text-secondary">
            Initialized your project before this existed? Ask your agent to run{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            Want deeper always-loaded knowledge, with the full catalog, theming, and page patterns? Install
            the BoardUI agent skill alongside MCP (
            <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>, or{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui skill</code>).
          </p>
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              BoardUI agent skill
            </LinkButton>
          </div>
        </Section>

        <Section title="BoardUI Pro over MCP">
          <p className="text-body-regular text-text-secondary">
            Pro components and templates appear in{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">list_components</code> for
            every user. Without a license, your agent gets the description, a public usage example, and
            purchase instructions instead of source. After you buy Pro, paste the license key from your
            purchase email into the chat; the agent activates it with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">activate_license</code> (one
            seat, released any time with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">deactivate_license</code>),
            and from then on Pro items install exactly like free ones. The key is validated server-side on
            every Pro download.
          </p>
          <p className="text-body-regular text-text-secondary">
            Already logged in with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui login</code>? The MCP
            server uses the same stored license, nothing to redo.
          </p>
        </Section>

        <Section title="Anonymous telemetry">
          <p className="text-body-regular text-text-secondary">
            Successful installs report the same anonymous events as the CLI (component names, package manager,
            version), tagged as MCP-driven. No project paths, prompts, or source code. Disable with{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            or <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> in the
            server&apos;s environment.
          </p>
        </Section>

        <Section title="Using shadcn's MCP instead">
          <p className="text-body-regular text-text-secondary">
            The BoardUI registry speaks the shadcn schema, so if your agent already runs the shadcn MCP
            server you can reach BoardUI through it: add the namespace to{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components.json</code> and ask
            for <code className="font-mono text-caption-1-medium text-text-primary">@boardui/button</code>.
            The BoardUI server above remains the richer path, with usage examples, project setup, and Pro
            licensing.
          </p>
          <FileBlock file="components.json" code={SHADCN_MCP_CODE} />
        </Section>

        <Section title="Under the hood">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest mcp</code>{" "}
            starts the same engine the CLI uses, speaking MCP over stdio. It fetches the public registry from
            boardui.com, resolves component dependencies transitively, and writes files using the default
            layout or your <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>{" "}
            mappings. You can also run it manually to check the setup:
          </p>
          <PkgCommand npm="npx boardui@latest mcp" pnpm="pnpm dlx boardui@latest mcp" yarn="yarn dlx boardui@latest mcp" />
        </Section>

        <PrevNext
          prev={{ href: "/installation", label: "Installation", sub: "Framework setup guides" }}
          next={{ href: "/skill", label: "Agent Skills", sub: "Knowledge for your agent" }}
        />
      </div>
    </AppShell>
  );
}
