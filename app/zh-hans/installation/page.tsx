"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";
import { VITE_CONFIG_CODE, VITE_TSCONFIG_CODE, VITE_MAIN_CODE, RR_TSCONFIG_CODE, RR_ROOT_CODE, ASTRO_TSCONFIG_CODE, ASTRO_LAYOUT_CODE, ASTRO_USAGE_CODE, LAYOUT_CODE, BOARDUI_JSON_CODE, CONSUMING_GLOBALS_CODE, ADD_COMPONENT_CODE, DARK_LAYOUT_CODE, ACCENT_CODE, THEME_CSS, TYPOGRAPHY_CSS, GLOBALS_CSS, CX_TS } from "@/app/installation/page";

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

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption-1-semibold text-text-secondary">
        {n} — {title}
      </p>
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
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <code className="font-mono text-caption-1-medium text-text-primary">{cmd}</code>
      <CopyButton text={cmd} />
    </div>
  );
}


function PkgCommand({ npm, pnpm, yarn }: { npm: string; pnpm: string; yarn: string }) {
  const [pm, setPm] = useState<"npm" | "pnpm" | "yarn">("npm");
  const cmd = pm === "npm" ? npm : pm === "pnpm" ? pnpm : yarn;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {(["npm", "pnpm", "yarn"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setPm(name)}
            className={cx(
              "rounded-full border px-3 py-1 text-caption-1-semibold transition-colors",
              pm === name
                ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <Command cmd={cmd} />
    </div>
  );
}

const FRAMEWORKS = ["Next.js", "Vite", "React Router", "Astro"] as const;

const FRAMEWORK_LABELS: Record<(typeof FRAMEWORKS)[number], string> = {
  "Next.js": "Next.js",
  Vite: "维特",
  "React Router": "反应路由器",
  Astro: "阿斯特罗",
};
export default function InstallationPage() {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>("Next.js");
  return (
    <LocaleHtml locale="zh-hans">
    <DocsLayout variant="library" title="安装" locale="zh-hans">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUI 可与任何 React 19 + Tailwind CSS v4 设置配合使用。选择下面的框架以获得分步指南，或按照手动步骤复制您自己的基础知识。
          </p>
          <p className="text-body-regular text-text-secondary">
            跳过以下步骤：连接 BoardUI MCP 服务器并让您的智能体安装所有内容。
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              从MCP开始
            </LinkButton>
          </div>
        </div>

        <Section title="快速启动">
          <p className="text-body-regular text-text-secondary">
            使用共享 UI 包或自定义导入别名？遵循 monorepo 和别名设置 在运行第一次安装之前。下面的标准设置不需要配置文件。
          </p>
          <p className="text-body-regular text-text-secondary">
            在任何 React + Tailwind v4 项目中，{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">初始化</code> 安装所需的软件包，编写主题、排版和全局样式以及{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx</code> 实用程序，并打印仍需添加到根布局中的代码行：
          </p>
          <Command cmd="npx boardui@latest init" />
          <p className="text-body-regular text-text-secondary">
            然后添加任何组件 - 内部依赖项和 npm 包会自动解析：
          </p>
          <Command cmd="npx boardui@latest add button select date-picker" />
          <p className="text-body-regular text-text-secondary">
            要在 CI、脚本或编码智能体中运行 CLI？请在两条命令中都加上{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code>。没有终端来回答提示时，CLI 会以退出码 1 停止，而不是自行猜测；{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> 会用默认设置回答这些提示：安装依赖，并保留已有文件。
          </p>
        </Section>

        <Section title="框架指南">
          <p className="text-body-regular text-text-secondary">
            从空文件夹进行完整设置。这些步骤的区别仅在于每个框架如何连接 Tailwind、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/</code> import alias, and the global stylesheet.
          </p>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFramework(name)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                  framework === name
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {FRAMEWORK_LABELS[name]}
              </button>
            ))}
          </div>
          {framework === "Next.js" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="创建一个项目（如果有，请跳过）。">
                <p className="text-body-regular text-text-secondary">
                  create-next-app 默认值 — TypeScript、Tailwind CSS 和{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> 别名 — 匹配 BoardUI 的默认设置。
                </p>
                <Command cmd="npx create-next-app@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # TypeScript: Yes · Tailwind CSS: Yes · import alias: @/* (the defaults)
                </p>
              </Step>
              <Step n={2} title="在项目根目录中运行 init。">
                <p className="text-body-regular text-text-secondary">
                  安装量 <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>、{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>，和{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>，并写到 styles/ 和 utils/。
                </p>
                <Command cmd="npx boardui@latest init" />
              </Step>
              <Step n={3} title="在根布局中导入样式表并加载 Inter。">
                <p className="text-body-regular text-text-secondary">
                  BoardUI 的主题从{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--font-inter</code> 读取字体，因此请用{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">next/font</code> 加载 Inter 来替换 create-next-app 的 Geist 字体，并把它的变量放在{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">&lt;html&gt;</code> 上。否则文本会回退到系统字体。
                </p>
                <CodeBlock code={LAYOUT_CODE} />
              </Step>
              <Step n={4} title="添加组件。">
                <Command cmd="npx boardui@latest add button" />
              </Step>
            </div>
          ) : framework === "Vite" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="创建一个项目（如果有，请跳过）。">
                <Command cmd="npm create vite@latest my-app -- --template react-ts" />
              </Step>
              <Step n={2} title="安装 Tailwind CSS v4 并注册 Vite 插件。">
                <p className="text-body-regular text-text-secondary">
                  该插件会为你处理样式表和{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@theme</code> token：
                </p>
                <Command cmd="npm install tailwindcss @tailwindcss/vite" />
                <FileBlock file="vite.config.ts" code={VITE_CONFIG_CODE} />
              </Step>
              <Step n={3} title="将 @/* 导入别名添加到 tsconfig.json。">
                <FileBlock file="tsconfig.json" code={VITE_TSCONFIG_CODE} />
              </Step>
              <Step n={4} title="运行 init。">
                <p className="text-body-regular text-text-secondary">
                  它会提示你做出几个选择：默认风格、基础颜色，以及是否安装设计规则。如有疑问，接受默认值 —
                  之后可以在{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> 中更改。
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={5} title="在应用入口中导入样式表。">
                <p className="text-body-regular text-text-secondary">
                  init 步骤为你创建了{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/styles/globals.css</code>：
                </p>
                <FileBlock file="main.tsx" code={VITE_MAIN_CODE} />
              </Step>
              <Step n={6} title="添加组件。">
                <p className="text-body-regular text-text-secondary">例如，Button：</p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
              </Step>
            </div>
          ) : framework === "React Router" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="创建一个项目（如果有，请跳过）。">
                <p className="text-body-regular text-text-secondary">
                  React Router v7 是 Remix 的后继者 - 这些步骤适用于两者。
                </p>
                <Command cmd="npx create-react-router@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # 默认模板已内置 Tailwind CSS v4
                </p>
              </Step>
              <Step n={2} title="添加 @/* 导入别名。">
                <p className="text-body-regular text-text-secondary">
                  模板已经使用{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">vite-tsconfig-paths</code>
                  ，因此只需添加一个 tsconfig 条目：
                </p>
                <FileBlock file="tsconfig.json" code={RR_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="运行 init，定位应用程序目录。">
                <PkgCommand
                  npm="npx boardui@latest init --dir app"
                  pnpm="pnpm dlx boardui@latest init --dir app"
                  yarn="yarn dlx boardui@latest init --dir app"
                />
              </Step>
              <Step n={4} title="在根路径中导入样式表。">
                <FileBlock file="app/root.tsx" code={RR_ROOT_CODE} />
              </Step>
              <Step n={5} title="添加组件，针对应用程序目录。">
                <PkgCommand
                  npm="npx boardui@latest add button --dir app"
                  pnpm="pnpm dlx boardui@latest add button --dir app"
                  yarn="yarn dlx boardui@latest add button --dir app"
                />
              </Step>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Step n={1} title="创建一个项目并添加 React + Tailwind 集成。">
                <Command cmd="npm create astro@latest my-app" />
                <Command cmd="npx astro add react tailwind" />
                <p className="text-body-2-regular text-text-tertiary">
                  # 安装 React 集成和 Tailwind CSS v4 Vite 插件
                </p>
              </Step>
              <Step n={2} title="添加 @/* 导入别名。">
                <FileBlock file="tsconfig.json" code={ASTRO_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="在项目根目录中运行 init。">
                <p className="text-body-regular text-text-secondary">
                  样式和实用程序会自动写入{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">源代码/</code>。
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={4} title="将样式表导入到您的基本布局中。">
                <FileBlock file="src/layouts/Layout.astro" code={ASTRO_LAYOUT_CODE} />
              </Step>
              <Step n={5} title="添加组件并将其水合到 .astro 文件中。">
                <p className="text-body-regular text-text-secondary">
                  交互式组件需要{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">client:*</code>{" "}
                  指令才能在页面上水合：
                </p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
                <FileBlock file="src/pages/index.astro" code={ASTRO_USAGE_CODE} />
              </Step>
            </div>
          )}
          <p className="text-body-regular text-text-secondary">
            用别的东西吗？任何使用 Tailwind CSS v4 运行 React 19 的框架都可以工作——连接{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> 别名，运行{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>，并导入样式表。或者通过以下手动步骤完全跳过 CLI。
          </p>

        </Section>

        <Section title="Monorepos 和自定义别名" id="monorepos">
          <p className="text-body-regular text-text-secondary">
            将组件安装到多个应用程序使用的共享 UI 包中，或匹配项目的现有文件夹并导入别名。添加一个可选的{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> 在目标包的{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> 旁边。没有它，通常的根目录或{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">源代码/</code>{" "}
            布局和 <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            导入保持不变。
          </p>
          <Step n={1} title="配置目标包。">
            <p className="text-body-regular text-text-secondary">
              对于名为{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui</code> 的包（位于{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">packages/ui</code>），创建此配置并将导出合并到其包清单中。使文件扩展名适应包的源或构建输出。
            </p>
            <CodeBlock code={BOARDUI_JSON_CODE} />
            <p className="text-body-regular text-text-secondary">
              路径与此包相关，并且必须保留在其中。为您更改的每个组同时设置路径和别名；省略的组保留默认值。别名是不带通配符的导入前缀，必须通过包导出或 TypeScript 和捆绑器配置进行解析。
            </p>
          </Step>
          <Step n={2} title="从共享包运行 BoardUI。">
            <Command cmd="cd packages/ui" />
            <Command cmd="npx boardui@latest init" />
            <Command cmd="npx boardui@latest add button" />
            <p className="text-body-regular text-text-secondary">
              组件及其 npm 依赖项安装到此包中。例如，导入{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/utils/cx</code> 会变成{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/utils/cx</code>
              。免费和专业组件使用相同的配置。使用 MCP 时，将此包的绝对路径作为{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> 传入。
            </p>
          </Step>
          <Step n={3} title="连接每个消费应用程序。">
            <p className="text-body-regular text-text-secondary">
              将 UI 包添加为每个应用程序的工作区依赖项，并确保其捆绑程序可以编译包的 TypeScript 和 TSX。导入 BoardUI 样式表并将共享源包含在 Tailwind 的源检测中：
            </p>
            <CodeBlock code={CONSUMING_GLOBALS_CODE} />
            <p className="text-body-regular text-text-secondary">
              从根布局或入口点导入此应用程序样式表。调整{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@source</code> 相对于样式表位置的路径。然后组件导入可以使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/components/base/buttons/button</code>
              。
            </p>
          </Step>
          <p className="text-body-regular text-text-secondary">
            安装前配置路径。更改配置不会移动现有文件或更新应用程序的导入。使用配置而不是将其与{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> 或{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code> 组合。全页模板属于消费应用程序：它们的路由和公共资源不会跨工作区包分割。手动复制粘贴会保留原始导入，因此请自行调整。
          </p>
        </Section>

        <Section title="手动安装">
          <p className="text-body-regular text-text-secondary">
            喜欢自己接线吗？确保您有一个设置了 Tailwind CSS v4 的项目，然后按照以下步骤操作。
          </p>
          <Step n={1} title="安装所需的包">
            <Command cmd="npm install react-aria-components tailwind-merge @remixicon/react" />
          </Step>
          <Step n={2} title="创建 样式/主题.css 与设计变量。">
            <FileBlock file="样式/主题.css" code={THEME_CSS} />
          </Step>
          <Step n={3} title="创建 样式/typography.css 与字号比例。">
            <FileBlock file="样式/typography.css" code={TYPOGRAPHY_CSS} />
          </Step>
          <Step n={4} title="创建 样式/globals.css 以导入变量并配置 Tailwind。">
            <FileBlock file="样式/globals.css" code={GLOBALS_CSS} />
          </Step>
          <Step n={5} title="添加 cx 实用程序。">
            <FileBlock file="实用程序/cx.ts" code={CX_TS} />
          </Step>
          <Step n={6} title="在根布局中导入样式表并加载 Inter。">
            <CodeBlock code={LAYOUT_CODE} />
          </Step>
        </Section>
        <Section title="添加组件">
          <p className="text-body-regular text-text-secondary">
            组件位于{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code> 并通过{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            别名导入。从任何组件页面复制代码——或让 CLI 执行——然后导入：
          </p>
          <CodeBlock code={ADD_COMPONENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            使用{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui list</code> 浏览所有内容，或从各个组件页面复制每个组件的安装命令。
          </p>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            一旦您的许可证被激活，Pro 组件和模板就会通过相同的 CLI 进行安装——无需进行压缩操作，无需复制粘贴。您的许可证密钥位于 Lemon Squeezy 收据中（并且位于{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">My Orders</code> 柠檬挤压）。一次购买即可解锁所有内容，其中包括更新。
          </p>
          <p className="text-body-regular text-text-secondary">
            在您的计算机上激活许可证一次：
          </p>
          <Command cmd="npx boardui@latest login YOUR_LICENSE_KEY" />
          <p className="text-body-regular text-text-secondary">
            从那时起，Pro 组件的工作方式与免费组件完全相同——CLI 安装源代码以及它所依赖的任何免费组件：
          </p>
          <Command cmd="npx boardui@latest add agent-progress" />
          <p className="text-body-regular text-text-secondary">
            模板以相同的方式拉取——整个页面、它使用的每个组件及其图像都通过一个命令进入您的项目（
            <code className="font-mono text-caption-1-medium text-text-primary">template-home-dashboard</code>、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-medical-profile</code>、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-chat</code>、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-image-generation</code>、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-profile</code>）：
          </p>
          <Command cmd="npx boardui@latest add template-ai-chat" />
          <p className="text-body-regular text-text-secondary">
            要提取已安装的任何内容的最新版本，请使用{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> 重新运行相同的命令。每个 Pro 组件都标有{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">专业版</code> 徽章上的{" "}
            <Link href="/components" className="text-accent-600 underline">
              组件页面
            </Link>
            。
          </p>
          <p className="text-body-regular text-text-secondary">
            每台登录的机器都会占用许可证的一个席位：一年更新和终身访问各有一个，初创团队版有五个。通过 Lemon Squeezy 购买的许可证保留购买时的上限。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui logout</code>{" "}
            释放当前机器的座位；在 CI 中，跳过{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">login</code> 并设置{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_LICENSE_KEY</code>{" "}
            而是环境变量。您还可以从 Lemon Squeezy 订单中下载完整的项目模板。丢了钥匙？写信给 hi@boardui.com。
          </p>
        </Section>

        <Section title="深色模式">
          <p className="text-body-regular text-text-secondary">
            深色模式是手动且基于类别的。默认为浅色；BoardUI 将手动选择存储在{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> 并且从不读取操作系统首选项。在水合之前运行已保存的主题查找，以便返回的用户不会看到灯光模式闪光灯。
          </p>
          <CodeBlock code={DARK_LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            添加可重复使用的控件，然后放置{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">&lt;ThemeToggle /&gt;</code>{" "}
            在您的侧边栏或设置界面中。它保持可见切换同步并自动保留选择。
          </p>
          <Command cmd="npx boardui@latest add theme-toggle" />
          <p className="text-body-regular text-text-secondary">
            组件仅使用语义实用程序。自定义光值{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">:root</code> 和暗值{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.dark</code> 里面{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">样式/主题.css</code>；避免组件级{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">dark:</code> 覆盖和原始结构颜色。请参阅上的完整映射{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              彩页
            </Link>
            。
          </p>
        </Section>

        <Section title="强调色">
          <p className="text-body-regular text-text-secondary">
            CTA 颜色是由主题决定的，而不是 50 个组件编辑。每个交互式表面 - 主按钮渐变、幻影和链接按钮、复选框、单选按钮、开关、滑块、选项卡、选定的侧边栏项目、聚焦环 - 从一个中读取{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--color-accent-50…950</code>{" "}
            斜坡进入 <code className="font-mono text-caption-1-medium text-text-primary">样式/主题.css</code>，默认为蓝色。主题导入后覆盖这十一个变量，整个系统在浅色和深色模式下重新着色；图表和状态颜色保持自己的色调。
          </p>
          <p className="text-caption-1-semibold text-text-secondary">
            styles/globals.css（或任何导入的样式表）
          </p>
          <CodeBlock code={ACCENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            您不必手动编写这段代码。打开任意组件页面，点击右下角的调色板按钮，实时尝试不同色调，或者选择一个完全自定义的颜色。它会精确落在主按钮渐变起点所在的 accent-500 上，BoardUI 会围绕它生成其余十档。效果满意后，{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Copy theme CSS</code> 准确导出此覆盖。的{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              彩页
            </Link>{" "}
            具有相同的内联控件。
          </p>
        </Section>

        <Section title="技术栈">
          <p className="text-body-regular text-text-secondary">
            BoardUI 组件使用 React 19、TypeScript 5、Tailwind CSS v4 和 React Aria 构建，以实现可访问性。您拥有代码——无需运行时包，无需等待第三方维护人员。图表卡另外使用 Recharts，数据表使用 TanStack Table；当组件需要它们时，CLI 会自动安装它们。
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          返回所有组件
        </Link>
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}

// 模型翻译：Add the @/* import alias to tsconfig.json.
// 模型翻译：Run init.
// 模型翻译：Import the stylesheet in your app entry.
// 模型翻译：Add the @/* import alias.
// 模型翻译：Add the @/* import alias.
// 模型翻译：The plugin handles the stylesheet and the @theme tokens for you:
// 模型翻译：It will prompt you for a few choices: a default style, a base color, and whether to install the design rules. When in doubt, accept the defaults — you can change them later in boardui.json.
// 模型翻译：The init step created src/styles/globals.css for you:
// 模型翻译：For example, the Button:
// 模型翻译：# the default template ships with Tailwind CSS v4 already wired up
// 模型翻译：The template already uses vite-tsconfig-paths, so a tsconfig entry is all you need:
// 模型翻译：# installs the React integration and the Tailwind CSS v4 Vite plugin
// 模型翻译：Styles and utils are written into src/ automatically.
// 模型翻译：Interactive components need a client:* directive to hydrate on the page:
