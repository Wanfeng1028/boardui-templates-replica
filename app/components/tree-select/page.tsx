"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { TreeSelect } from "@/components/base/tree-select/tree-select";
import type { TreeSelectOption } from "@/components/base/tree-select/tree-select";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const COMPANY_OPTIONS: TreeSelectOption[] = [
  {
    value: "company",
    label: "公司",
    children: [
      {
        value: "product",
        label: "产品部",
        children: [
          { value: "growth", label: "增长组" },
          { value: "experience", label: "体验组" },
        ],
      },
      {
        value: "research",
        label: "研发部",
        children: [
          { value: "frontend", label: "前端组" },
          { value: "backend", label: "后端组" },
          { value: "algorithm", label: "算法组" },
        ],
      },
      {
        value: "marketing",
        label: "市场部",
        children: [
          { value: "content", label: "内容组" },
          { value: "ads", label: "投放组" },
        ],
      },
    ],
  },
];

const SMALL_OPTIONS: TreeSelectOption[] = [
  {
    value: "company",
    label: "公司",
    children: [
      {
        value: "research",
        label: "研发部",
        children: [
          { value: "frontend", label: "前端组" },
          { value: "backend", label: "后端组" },
        ],
      },
    ],
  },
];

function EchoValue({ value }: { value: string[] }) {
  const flat = new Map<string, string>();
  const walk = (nodes: TreeSelectOption[]) => {
    for (const node of nodes) {
      flat.set(node.value, node.label);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(COMPANY_OPTIONS);
  walk(SMALL_OPTIONS);

  return (
    <p className="text-body-regular text-text-secondary">
      {value.length === 0
        ? "尚未选择"
        : value.length <= 3
          ? `已选：${value.map((v) => flat.get(v) ?? v).join("、")}`
          : `已选 ${value.length} 项`}
    </p>
  );
}

const INSTALL_CODE = `npx boardui@latest add tree-select`;

/** Tree Select detail page: boardui.com/components/tree-select, in-site. */
export default function TreeSelectPage() {
  const [permissionValue, setPermissionValue] = useState<string[]>([]);
  const [allValue, setAllValue] = useState<string[]>([]);
  const [noneValue, setNoneValue] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string[]>([]);

  return (
    <DocsLayout variant="library" title="Tree Select">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          在可展开的父子列表里勾选一个或多个项目。例如设置数据权限时，用户可以展开“公司 → 部门 → 小组”，再跨不同部门勾选需要开放的范围。勾选一个部门是否会同时选中它下面的小组，由联动规则决定；如果只需沿一条路径选一个结果，用级联选择器 Cascader 更简单。
        </p>
        <Section title="Data permission assignment">
          <p className="text-body-regular text-text-secondary">
            按部门分配权限：展开“公司 → 部门 → 小组”，跨部门勾选需要开放的范围，下方实时回显已选值。
          </p>
          <Demo>
            <TreeSelect
              aria-label="数据权限"
              label="数据权限"
              placeholder="选择部门或小组"
              options={COMPANY_OPTIONS}
              value={permissionValue}
              onChange={(next) => setPermissionValue(next)}
              cascadeRule="all"
              className="w-[280px]"
            />
          </Demo>
          <EchoValue value={permissionValue} />
        </Section>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this tree select component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add tree-select</code>
            <CopyButton text="npx boardui@latest add tree-select" />
          </div>
        </Section>
        <Section title="Parent-child linkage">
          <p className="text-body-regular text-text-secondary">
            父子联动要先定规则。两条规则并排对比：
            <code className="font-mono text-body-2-medium text-text-primary">{`cascadeRule "all"`}</code>{" "}
            勾选部门会同时选中其下全部小组，半选显示半选态；
            <code className="font-mono text-body-2-medium text-text-primary">{`"none"`}</code>{" "}
            仅勾选当前项，不影响下级。页面上的规则说明文字与组件的 showRuleNote 一致。
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Demo>
                <TreeSelect
                  aria-label="联动规则 all"
                  label="cascadeRule all"
                  placeholder="选择部门或小组"
                  options={SMALL_OPTIONS}
                  value={allValue}
                  onChange={(next) => setAllValue(next)}
                  cascadeRule="all"
                  showRuleNote={true}
                  className="w-[240px]"
                />
              </Demo>
              <p className="text-body-regular text-text-secondary">勾选部门会同时选中其下全部小组</p>
              <EchoValue value={allValue} />
            </div>
            <div className="flex flex-col gap-3">
              <Demo>
                <TreeSelect
                  aria-label="联动规则 none"
                  label="cascadeRule none"
                  placeholder="选择部门或小组"
                  options={SMALL_OPTIONS}
                  value={noneValue}
                  onChange={(next) => setNoneValue(next)}
                  cascadeRule="none"
                  showRuleNote={true}
                  className="w-[240px]"
                />
              </Demo>
              <p className="text-body-regular text-text-secondary">仅勾选当前项，不影响下级</p>
              <EchoValue value={noneValue} />
            </div>
          </div>
        </Section>
        <Section title="Search the tree">
          <p className="text-body-regular text-text-secondary">
            树太大时先搜再选：在搜索框输入“前端”过滤，只保留匹配项及其父级路径。
          </p>
          <Demo>
            <TreeSelect
              aria-label="可搜索的树选择"
              label="搜索后再选"
              placeholder="选择部门或小组"
              options={COMPANY_OPTIONS}
              value={searchValue}
              onChange={(next) => setSearchValue(next)}
              cascadeRule="all"
              className="w-[280px]"
            />
          </Demo>
        </Section>
        <Section title="Keyboard navigation">
          <p className="text-body-regular text-text-secondary">
            Tab 聚焦触发器；Enter、Space 或 ArrowDown 打开弹层；Tab 在搜索框与各行复选框之间移动；空格切换勾选；Escape 关闭弹层。
          </p>
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
