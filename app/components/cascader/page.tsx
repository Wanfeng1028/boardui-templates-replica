"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Cascader, type CascaderOption } from "@/components/base/cascader/cascader";

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

const REGION_OPTIONS: CascaderOption[] = [
  {
    value: "guangdong",
    label: "广东省",
    children: [
      {
        value: "shenzhen",
        label: "深圳市",
        children: [
          { value: "nanshan", label: "南山区" },
          { value: "futian", label: "福田区" },
          { value: "baoan", label: "宝安区" },
        ],
      },
      {
        value: "guangzhou",
        label: "广州市",
        children: [
          { value: "tianhe", label: "天河区" },
          { value: "haizhu", label: "海珠区" },
          { value: "yuexiu", label: "越秀区" },
        ],
      },
    ],
  },
  {
    value: "zhejiang",
    label: "浙江省",
    children: [
      {
        value: "hangzhou",
        label: "杭州市",
        children: [
          { value: "xihu", label: "西湖区" },
          { value: "binjiang", label: "滨江区" },
          { value: "yuhang", label: "余杭区" },
        ],
      },
      {
        value: "ningbo",
        label: "宁波市",
        children: [
          { value: "yinzhou", label: "鄞州区" },
          { value: "haishu", label: "海曙区" },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏省",
    children: [
      {
        value: "nanjing",
        label: "南京市",
        children: [
          { value: "xuanwu", label: "玄武区" },
          { value: "qinhuai", label: "秦淮区" },
        ],
      },
      {
        value: "suzhou",
        label: "苏州市",
        children: [
          { value: "gusu", label: "姑苏区" },
          { value: "wujiang", label: "吴江区" },
        ],
      },
    ],
  },
];

const FULL_PATH_CODE = `const [address, setAddress] = useState<string[]>([]);
const [addressLabels, setAddressLabels] = useState<string[]>([]);

{/* The trigger echoes the full path, e.g. "广东省 / 深圳市 / 南山区" */}
<Cascader
  aria-label="收货地址"
  placeholder="请选择"
  options={regionOptions}
  value={address}
  onChange={(value, path) => {
    setAddress(value);
    setAddressLabels(path.map((o) => o.label));
    // path is the array of option objects: province → city → district
  }}
  className="w-[280px]"
/>`;

/** Cascader detail page: boardui.com/components/cascader, in-site. */
export default function CascaderPage() {
  const [address, setAddress] = useState<string[]>([]);
  const [addressLabels, setAddressLabels] = useState<string[]>([]);

  return (
    <DocsLayout variant="library" title="Cascader">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          选地址那种级联选择器 - 先选省、再选市、再选区，一层层点下去，常见于省、市、区选择。例如填写收货地址时，先选
          &ldquo;广东省&rdquo;，再选&ldquo;深圳市&rdquo;，最后选&ldquo;南山区&rdquo;，完成后触发器回显整条路径。若需要同时选择多个地区，用树选择
          Tree Select 更合适。
        </p>
        <Demo>
          <div className="flex flex-col items-center gap-3">
            <Cascader
              aria-label="收货地址"
              placeholder="请选择"
              options={REGION_OPTIONS}
              value={address}
              onChange={(value, path) => {
                setAddress(value);
                setAddressLabels(path.map((o) => o.label));
              }}
              className="w-[280px]"
            />
            <p className="text-body-regular text-text-secondary">
              {addressLabels.length > 0
                ? `已选：${addressLabels.join(" / ")}`
                : "尚未选择"}
            </p>
          </div>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this cascader component using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add cascader</code>
            <CopyButton text="npx boardui@latest add cascader" />
          </div>
        </Section>
        <Section title="Step through levels">
          <p className="text-body-regular text-text-secondary">
            点开一级再选下一级：带有子项的行会显示右箭头，悬停或按下即展开下一列，逐级深入直到叶子节点。下面的演示默认展开到&ldquo;广东省&rdquo;。
          </p>
          <Demo>
            <Cascader
              aria-label="收货地址"
              placeholder="请选择"
              options={REGION_OPTIONS}
              defaultValue={["guangdong"]}
              className="w-[280px]"
            />
          </Demo>
        </Section>
        <Section title="Full path echo">
          <p className="text-body-regular text-text-secondary">
            选中叶子后触发器回显整条路径，各级名称由{" "}
            <code className="font-mono text-body-2-medium text-text-primary">separator</code>{" "}
            连接，同时 <code className="font-mono text-body-2-medium text-text-primary">onChange</code>{" "}
            会带回选中值数组和对应的选项对象数组。
          </p>
          <Code code={FULL_PATH_CODE} />
        </Section>
        <Section title="Keyboard navigation">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-body-2-medium text-text-primary">Tab</code> 聚焦触发器，
            <code className="font-mono text-body-2-medium text-text-primary">Enter</code> /{" "}
            <code className="font-mono text-body-2-medium text-text-primary">Space</code> /{" "}
            <code className="font-mono text-body-2-medium text-text-primary">ArrowDown</code> 打开弹层；列内用上下箭头移动焦点，
            <code className="font-mono text-body-2-medium text-text-primary">Enter</code> 选中叶子节点，
            <code className="font-mono text-body-2-medium text-text-primary">ArrowRight</code> 展开带子项的行，
            <code className="font-mono text-body-2-medium text-text-primary">Escape</code> 关闭弹层。
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
