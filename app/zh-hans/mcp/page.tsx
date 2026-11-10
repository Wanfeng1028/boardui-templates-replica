"use client";

import { useState } from "react";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
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
      {copied ? "已复制" : "复制"}
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
          {copied ? "已复制" : "复制命令"}
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
  "“ 在此项目中设置 BoardUI 并添加按钮、选择器和日期选择器。 ”",
  "“ 我买了 BoardUI Pro。这是我的许可证密钥：XXXX。激活它并安装AI聊天模板。 ”",
  "“ 使用 BoardUI 的身份验证卡和社交按钮构建登录页面。 ”",
  "“ 在此 BoardUI 项目中启用阿拉伯语和希伯来语的 RTL，包括 Pro 块和模板。 ”",
  "“ BoardUI 按钮需要什么属性？显示图标变体。 ”",
  "“ 添加 BoardUI 的数据表并将其连接到我的 /api/orders 端点。 ”",
  "“ 向我展示 BoardUI 的主题变量，然后重新设计主按钮以匹配我的品牌。 ”",
  "“ 使用 BoardUI 统计卡、面积图和条形列表构建收入仪表盘。 ”",
];

const CLIENTS = ["Claude Code", "Cursor", "VS Code", "Codex", "其他客户"] as const;

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
    <LocaleHtml locale="zh-hans">
      <DocsLayout variant="library" hidePrevNext title="MCP 服务器" locale="zh-hans">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              BoardUI 附带了 MCP 服务器，因此 AI 智能体可以为您完成安装。 Claude Code、Cursor、VS Code、Codex 和任何 MCP
              客户端都可以浏览注册表、读取组件源代码和实际使用示例、设置新项目并将组件文件直接写入其中。没有终端往返，您只需描述您想要构建的内容。
            </p>
            <p className="text-body-regular text-text-secondary">
              服务器通过 stdio 在本地运行{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">npx</code> ，没有托管任何内容。免费组件零配置工作；一旦您的智能体激活您的许可证密钥，BoardUI
              Pro 就会在同一聊天中解锁。
            </p>
            <p className="text-body-regular text-text-secondary">
              以下适用于每个客户端的一条规则：MCP 工具在会话开始时绑定。如果您在会话中注册服务器，请重新启动客户端或打开新的聊天，否则它将显示为已连接且没有可用工具。
            </p>
          </div>

          <Section title="设置">
            <p className="text-body-regular text-text-secondary">
              选择你的客户。光标和 VS Code 一键安装； Claude Code 和 Codex 采用同一个命令。
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
                  项目目录中的一条命令。添加{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--scope user</code> 为每个项目启用它，然后重新启动
                  Claude Code（或打开一个新会话）以便工具绑定。
                </p>
                <Command cmd="claude mcp add boardui -- npx -y boardui@latest mcp" />
              </>
            ) : client === "Cursor" ? (
              <>
                <p className="text-body-regular text-text-secondary">
                一键安装，或自行将服务器添加到{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.cursor/mcp.json</code>{" "}
                中，然后在 Settings, Tools &amp; MCP 下启用它。
              </p>
                <div>
                  <ButtonLink href={CURSOR_INSTALL_URL}>添加到光标</ButtonLink>
                </div>
                <FileBlock file=".cursor/mcp.json" code={MCP_STDIO_CODE} />
              </>
            ) : client === "VS Code" ? (
              <>
                <p className="text-body-regular text-text-secondary">
                一键安装，或将服务器添加到{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.vscode/mcp.json</code>{" "}
                中，然后点击其旁边的 Start。
              </p>
                <div>
                  <ButtonLink href={VSCODE_INSTALL_URL}>添加到 VS 代码</ButtonLink>
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

          <Section title="Monorepos 和自定义别名">
            <p className="text-body-regular text-text-secondary">
              本地MCP服务器读取相同的可选{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> 作为
              CLI。将其放在目的地包裹旁边{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> 并将该包的绝对路径传递为{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> 到{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code> ,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_components</code> , 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code> 。文件和
              npm 依赖项使用配置的导入别名安装到该包中。
            </p>
            <p className="text-body-regular text-text-secondary">
              一样通过{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> 到{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">get_component</code> 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">get_usage_examples</code> 用于匹配源和示例。如果没有它，这些读取工具将返回原始注册表导入。包导出和每个应用程序的样式仍然需要设置。
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                设置共享 UI 包
              </LinkButton>
            </div>
          </Section>

          <Section title="尝试询问你的智能体人">
            <p className="text-body-regular text-text-secondary">
              连接后，请用简单的语言与您的智能体交谈。一些入门者：
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

          <Section title="工具">
            <p className="text-body-regular text-text-secondary">服务器向您的智能体公开的内容：</p>
            <div className="overflow-x-auto rounded-xl border border-border-button-default">
              <table className="w-full border-collapse text-start">
                <thead>
                  <tr className="border-b border-separator-border bg-background-secondary-default">
                    <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">工具</th>
                    <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">它的作用</th>
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

<Section title="永远在线的设计规则">
          <p className="text-body-regular text-text-secondary">
            MCP 工具是按需提供的：智能体只有在想要询问时才会看到您的主题，而从不询问的模型会发明自己的间距、颜色和类型。所以{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code> 和{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>{" "}
            还安装设计基础作为始终在线的指令文件，智能体加载每个会话：{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AGENTS.md</code> 中一个围栏段，以及{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.cursor/rules/boardui.mdc</code>{" "}
            处的 Cursor 规则。它们固定语义颜色变量、复合类型比例、间距和半径约定、深色模式以及{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx()</code>，然后重新运行刷新该部分，而不触及文件的其余部分。
          </p>
          <p className="text-body-regular text-text-secondary">
            在此之前初始化您的项目？要求你的智能体运行{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>。
          </p>
          <p className="text-body-regular text-text-secondary">
            想要更深入的始终加载的知识，以及完整的目录、主题和页面模式吗？安装 BoardUI智能体技巧
            与 MCP 一起（{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>，或{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui skill</code>）。
          </p>
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              BoardUI智能体技巧
            </LinkButton>
          </div>
        </Section>

        <Section title="基于 MCP 的 BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            Pro 组件和模板出现在{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">list_components</code>{" "}
            对于每个用户。如果没有许可证，您的智能体将获得描述、公共使用示例和购买说明，而不是源。购买 Pro
            后，将购买电子邮件中的许可证密钥粘贴到聊天中；智能体激活它{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">activate_license</code>（一个席位，随时释放{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">deactivate_license</code>），
            从那时起，专业版项目的安装与免费项目完全相同。每次 Pro 下载时都会在服务器端验证密钥。
          </p>
          <p className="text-body-regular text-text-secondary">
            已经登录{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui login</code>？ MCP
            服务器使用相同的存储许可证，无需重做。
          </p>
        </Section>

        <Section title="匿名遥测">
          <p className="text-body-regular text-text-secondary">
            成功安装会报告与 CLI 相同的匿名事件（组件名称、包管理器、版本），标记为 MCP 驱动。没有项目路径、提示或源代码。禁用与{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            或 <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> 在服务器环境中。
          </p>
        </Section>

        <Section title="使用shadcn的MCP代替">
          <p className="text-body-regular text-text-secondary">
            BoardUI 注册表使用 shadcn 架构，因此如果您的智能体已经运行 shadcn MCP 服务器，您可以通过它访问
            BoardUI：将命名空间添加到{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components.json</code> 并要求{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@boardui/button</code>。
            上面的 BoardUI 服务器仍然是更丰富的路径，包含使用示例、项目设置和 Pro 许可。
          </p>
          <FileBlock file="components.json" code={SHADCN_MCP_CODE} />
        </Section>

        <Section title="在引擎盖下">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest mcp</code>{" "}
            启动 CLI 使用的相同引擎，通过 stdio 讲 MCP。它从 boardui.com 获取公共注册表，传递性地解析组件依赖关系，并使用默认布局或您的{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>{" "}
            映射。您还可以手动运行它来检查设置：
          </p>
          <PkgCommand npm="npx boardui@latest mcp" pnpm="pnpm dlx boardui@latest mcp" yarn="yarn dlx boardui@latest mcp" />
        </Section>

        <PrevNext
          locale="zh-hans"
          prev={{ href: "/installation", label: "安装", sub: "框架设置指南", enLabel: "Installation" }}
          next={{ href: "/skill", label: "智能体技能", sub: "为您的智能体人提供的知识", enLabel: "Agent Skills" }}
        />
      </div>
    </DocsLayout>
  </LocaleHtml>
  );
}
