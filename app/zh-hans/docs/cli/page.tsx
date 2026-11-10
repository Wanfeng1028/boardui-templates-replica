"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
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
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">选项</th>
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">描述</th>
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
    <LocaleHtml locale="zh-hans">
      <DocsLayout variant="docs" locale="zh-hans" title="CLI">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              的 <code className="font-mono text-caption-1-medium text-text-primary">boardui</code> CLI 将组件源文件直接复制到您的项目中 - 没有运行时包，代码是您的。它可以传递地解析每个组件的内部依赖项（实用程序、图标、其他组件），并使用包管理器安装任何缺少的 npm 包。
            </p>
            <Command cmd="npx boardui@latest add button select date-picker" />
          </div>

          <Section title="初始化">
            <p className="text-body-regular text-text-secondary">
              在现有 Next.js 项目中设置 BoardUI：安装运行时依赖项 ({" "}
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>,
              Tailwind v4)，写道 <code className="font-mono text-caption-1-medium text-text-primary">样式/主题.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">样式/typography.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">样式/globals.css</code>, 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">实用程序/cx.ts</code>，然后打印需要添加到根布局中的代码行：样式表导入和 Inter 字体。
            </p>
            <p className="text-body-regular text-text-secondary">
              如果项目已经在编译 Tailwind v4（例如 create-next-app 16.4 及更高版本通过{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/turbopack</code>
              编译），init 不会改动 PostCSS。否则它会安装{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/postcss</code> 并打印{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">postcss.config.mjs</code>{" "}
              中需要的那一行。传入 <code className="font-mono text-caption-1-medium text-text-primary">--postcss</code> 可在任何情况下都设置 PostCSS。
            </p>
            <Command cmd="npx boardui@latest init" />
            <OptionTable rows={INIT_OPTIONS} />
          </Section>

          <Section title="添加">
            <p className="text-body-regular text-text-secondary">
              添加一个或多个组件。默认情况下，文件与此站点保持相同的结构（{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">components/application/…</code>
              ），导入使用 <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
              别名，并且现有文件将被跳过，除非您通过{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>。对于交互式选择器，在不带参数的情况下运行它。
            </p>
            <Command cmd="npx boardui@latest add            # interactive picker" />
            <Command cmd="npx boardui@latest add table pagination" />
            <Command cmd="npx boardui@latest add --all" />
            <OptionTable rows={ADD_OPTIONS} />
          </Section>

          <Section title="CI、脚本和编码智能体">
            <p className="text-body-regular text-text-secondary">
              <code className="font-mono text-caption-1-medium text-text-primary">init</code> 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">add</code> 在安装包或改动已有文件之前会先询问。在没有终端可以回答的环境中（例如 CI、脚本或编码智能体），它们会以退出码 1 停止，而不是自行猜测。传入{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> 即可接受默认设置：安装依赖并保留已有文件。添加{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> 可替换已有文件；不使用选择器时，请直接写出组件名称或传入{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--all</code> 。
            </p>
            <Command cmd="npx boardui@latest init --yes" />
            <Command cmd="npx boardui@latest add button select --yes" />
          </Section>

          <Section title="自定义路径和单一存储库">
            <p className="text-body-regular text-text-secondary">
              添加一个可选的 <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>{" "}
              目的地包裹旁边 <code className="font-mono text-caption-1-medium text-text-primary">package.json</code>{" "}
              配置文件的去向以及它们使用的导入别名。两者都{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">初始化</code> 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">添加</code> 阅读它，包括
              Pro 组件。没有它，现有的根和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">源代码/</code> 布局的行为与以前一样。
            </p>
            <p className="text-body-regular text-text-secondary">
              配置配对 <code className="font-mono text-caption-1-medium text-text-primary">paths</code>{" "}
              和 <code className="font-mono text-caption-1-medium text-text-primary">aliases</code> 组件、实用程序、挂钩、样式或库的条目。在目标包中运行 CLI，以便 npm
              依赖项也安装在那里。配置的映射不能与{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--path</code> 或{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--dir</code> ;这些标志
              仍然可用于未配置的项目。更改配置不会迁移以前安装的文件。
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                配置共享 UI 包和使用应用程序
              </LinkButton>
            </div>
          </Section>

          <Section title="清单">
            <p className="text-body-regular text-text-secondary">
              打印按类型分组的每个可用组件 - 基本组件、应用程序块和基础。
            </p>
            <Command cmd="npx boardui@latest list" />
          </Section>

          <Section title="技能">
            <p className="text-body-regular text-text-secondary">
              安装 BoardUI智能体技巧 (<code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              加上目录、主题和模式参考），因此 Claude Code 和 Codex 等 AI 助手在每次会话时都会加载
              BoardUI 知识。默认为项目的{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>;
              重新运行 <code className="font-mono text-caption-1-medium text-text-primary">--force</code> 更新。
            </p>
            <Command cmd="npx boardui@latest skill" />
            <OptionTable rows={SKILL_OPTIONS} />
            <div>
              <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
                BoardUI智能体技巧
              </LinkButton>
            </div>
          </Section>

          <Section title="更新组件">
            <p className="text-body-regular text-text-secondary">
              安装的组件是副本 - 您可以编辑，永远不会默默地触摸。要从注册表中提取组件的最新版本，请重新运行{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">添加</code> 与{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> .
            </p>
            <Command cmd="npx boardui@latest add button --overwrite" />
          </Section>

          <Section title="匿名遥测">
            <p className="text-body-regular text-text-secondary">
              成功后 <code className="font-mono text-caption-1-medium text-text-primary">初始化</code> ，CLI 发送一个匿名事件，其中包含其版本、您的包管理器以及是否{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--pro</code> 被使用了。成功后{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">添加</code> ，它发送您明确请求的组件名称，但不发送它们自动解析的依赖项。成功后{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">技能</code> 安装时，它会发送技能的放置位置（项目、全局或智能体目录），而不是路径本身。操作系统的用户配置目录中的随机 ID 可以让我们区分重复运行。
              BoardUI 不会发送项目路径、源代码、依赖项名称、电子邮件地址、其他命令参数或遥测数据{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">清单</code> .
            </p>
            <p className="text-body-regular text-text-secondary">
              通过设置禁用遥测{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
              或 <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> .
            </p>
            <p className="text-body-regular text-text-secondary">
              事件保留为生命周期计数器和匿名每日存储桶，用于每日、每周和每月趋势报告。每日存储桶不会自动过期。
            </p>
          </Section>

          <Section title="shadcn兼容性">
            <p className="text-body-regular text-text-secondary">
              注册表使用 shadcn 项架构，因此如果您愿意，每个组件也会使用 shadcn CLI 进行安装：
            </p>
            <CodeBlock code="npx shadcn@latest add https://www.boardui.com/r/button.json" />
          </Section>

          <Link
            href="/docs/introduction"
            className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <RiArrowLeftLine className="size-4" aria-hidden />
            回到介绍
          </Link>
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
