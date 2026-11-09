"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <LocaleHtml locale="zh-hans">
      <DocsLayout variant="docs" locale="zh-hans" eyebrow="文档 · 开始使用" title="简介">
        <Section title="什么是 BoardUI？">
          <p className="mb-4">
            BoardUI 是使用 Tailwind CSS 构建并在 Figma 中设计的 React 组件的开源集合。组件通过 Figma MCP 服务器直接从 Figma 主文件进行转换，因此设计和代码保持同步。
          </p>
          <p>跳过设计阶段。只需复制、粘贴和构建。</p>
        </Section>

        <Section title="技术栈">
          <ul className="mb-4 list-disc pl-6">
            <li>反应19</li>
            <li>Next.js 16 (App Router) — 用于展示网站</li>
            <li>Tailwind CSS v4（CSS优先配置通过 @theme）</li>
            <li>打字稿</li>
            <li>React Aria Components — 可访问性原语，根据需要添加每个组件</li>
          </ul>
        </Section>

        <Section title="免费与专业版">
          <ul className="mb-4 list-disc pl-6">
            <li>
              <strong>免费</strong> — 基础组件（按钮、输入、复选框、徽章、头像等）。许可许可。开源。
            </li>
            <li>
              <strong>Pro</strong> — 组合块、页面模板、复杂模式（数据表、命令菜单、图表、仪表盘）。一次性许可费。
            </li>
          </ul>
        </Section>

        <Section title="来源，而非依赖">
          <p className="mb-4">
            BoardUI 不是运行时库。当您添加组件时，其源代码将被复制到您的项目中 - 无需 npm 安装，无需供应商锁定。您拥有代码；随心所欲地修改它。
          </p>
        </Section>

        <Section title="BoardUI 与其他库的比较">
          <p className="mb-4">
            我们用 BoardUI 和另外 9 个库（从 shadcn/ui 到 PrimeReact）构建了同一个设置对话框，并逐一进行了测试。
          </p>
          <p>阅读我们对 10 大 React 设计系统的比较（英文）。</p>
        </Section>

        <Section title="后续步骤">
          <p className="mb-4">前往安装指南设置项目，或浏览组件库。</p>
          <div className="mb-4 flex gap-4">
            <LinkButton href="/installation">安装指南</LinkButton>
            <LinkButton href="/components">组件库</LinkButton>
          </div>
        </Section>

        <Link href="/components" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">
          <RiArrowLeftLine className="size-4" />
          返回所有组件
        </Link>
      </DocsLayout>
    </LocaleHtml>
  );
}
