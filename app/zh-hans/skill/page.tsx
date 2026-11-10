"use client";

import { RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { CodeTabs, PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";

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

/** Agent Skills page, mirroring boardui.com/zh-hans/skill. */
export default function SkillPage() {
  return (
    <LocaleHtml locale="zh-hans">
      <DocsLayout variant="library" hidePrevNext locale="zh-hans" title="智能体技能">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              一个命令即可让您的 AI 助手全面了解 BoardUI：每个组件和模板、设计规则、主题、模式和动作。
              Claude Code、Codex 和其他具有技能的智能体会自动加载它并使用真实的 BoardUI
              组件进行构建，而不是发明相似的组件。
            </p>
            <p className="text-body-regular text-text-secondary">
              技能跟随开放{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              标准：您的智能体自行发现的降价，无需服务器。每次安装时都会从 boardui.com 获取新鲜内容。
            </p>
          </div>

          <Section title="安装">
            <p className="text-body-regular text-text-secondary">
              从项目根目录运行一个命令。选择它应该存在的位置的选项卡：默认写入{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>{" "}
              在项目中，因此该技能会依赖于您的存储库，并且整个团队的智能体都会选择它。 Global
              和智能体目录涵盖用户范围的安装和客户端，例如 Codex 或 Gemini。
            </p>
            <CodeTabs
              tabs={[
                { value: "Project (default)", code: "npx boardui@latest skill" },
                { value: "全球", code: "npx boardui@latest skill --global" },
                { value: "Codex & Gemini", code: "npx boardui@latest skill --client codex" },
                { value: "Custom path", code: "npx boardui@latest skill --path .agents/skills/boardui" },
              ]}
            />
            <p className="text-body-regular text-text-secondary">
              已连接到 BoardUI MCP 服务器？只需要求您的智能体运行即可{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>{" "}
              ，无需终端。
            </p>
          </Section>

          <Section title="里面有什么">
            <p className="text-body-regular text-text-secondary">
              一个精瘦的{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              智能体始终加载以及按需读取的参考文件（根据技能标准逐步披露）：
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

          <Section title="每个客户的去向">
            <p className="text-body-regular text-text-secondary">
              克劳德·科德 (Claude Code) 发现了该项目的技能{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/</code>{" "}
              （默认安装）并在{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.claude/skills/</code>{" "}(
              <code className="font-mono text-caption-1-medium text-text-primary">--global</code>{" "}）。
              Codex、Gemini CLI 和共享智能体约定的其他客户端读取{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.agents/skills/</code>{" "}(
              <code className="font-mono text-caption-1-medium text-text-primary">--client codex</code>{" "}）。
              还有什么：{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--path</code>{" "}
              将文件夹放在客户看到的任何地方。会话开始时会加载技能，因此请在安装后重新启动智能体或打开新的聊天。
            </p>
          </Section>

          <Section title="更新中">
            <p className="text-body-regular text-text-secondary">
              该技能在其前面带有版本标记，并且注册表会在每次部署时重建它：新组件会自动出现在目录中。重新运行安装{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--force</code>{" "}
              就地更新；该命令打印已安装和获取的版本，以便您可以查看更改的内容。
            </p>
            <PkgCommand
              npm="npx boardui@latest skill --force"
              pnpm="pnpm dlx boardui@latest skill --force"
              yarn="yarn dlx boardui@latest skill --force"
            />
          </Section>

          <Section title="技能 vs MCP">
            <p className="text-body-regular text-text-secondary">
              他们相辅相成。技能是智能体始终拥有的知识：目录、规则、模式，以零设置加载每个会话。的 MCP 服务器
              是实时工具：按需提供完整组件源、无需终端即可安装、项目初始化以及在聊天中激活
              Pro 许可证。最佳设置：两者都安装。该技能使用真实的BoardUI组件进行智能体规划； MCP 让它执行。
            </p>
            <div>
              <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
                MCP 服务器
              </LinkButton>
            </div>
          </Section>

          <Section title="BoardUI Pro">
            <p className="text-body-regular text-text-secondary">
              该技能的目录也涵盖了 Pro 组件和模板，标记为 PRO，带有公共使用示例，但从未提供来源。专业版许可证激活一次（
              <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest login &lt;key&gt;</code>
              ，输入您的 Lemon Squeezy 收据），您的智能体会像安装免费项目一样安装专业项目。没有一个，它知道存在什么并给你指出{" "}
              定价 而不是猜测相似的人。
            </p>
            <div>
              <LinkButton href="/pricing" trailingIcon={RiArrowRightSLine}>
                定价
              </LinkButton>
            </div>
          </Section>

          <PrevNext
            locale="zh-hans"
            prev={{ href: "/mcp", label: "MCP 服务器", sub: "智能体为您安装" }}
            next={{ href: "/rtl", label: "RTL 支持" }}
          />
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
