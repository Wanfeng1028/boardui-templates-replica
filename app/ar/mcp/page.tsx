"use client";

import { useState } from "react";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { ButtonLink } from "@/components/base/buttons/button";
import { LocaleHtml } from "@/components/application/docs/locale-html";
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
      {copied ? "تم النسخ" : "نسخ"}
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
          {copied ? "تم النسخ" : "نسخ الأمر"}
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
  "“ جهّز BoardUI في هذا المشروع وأضف الزر والقائمة المختارة ومنتقي التاريخ. ”",
  "“ اشتريت BoardUI Pro. مفتاح الترخيص هو XXXX. فعّله وثبّت قالب دردشة الذكاء الاصطناعي. ”",
  "“ ابنِ صفحة تسجيل دخول باستخدام بطاقة المصادقة والأزرار الاجتماعية من BoardUI. ”",
  "“ فعّل RTL للعربية والعبرية في مشروع BoardUI هذا، بما يشمل كتل Pro والقوالب. ”",
  "“ ما الخصائص التي يقبلها زر BoardUI؟ أرني الأنواع التي تتضمن أيقونات. ”",
  "“ أضف جدول بيانات BoardUI واربطه بنقطة النهاية /api/orders. ”",
  "“ أرني رموز سمة BoardUI، ثم عدّل الزر الأساسي ليناسب علامتي التجارية. ”",
  "“ ابنِ لوحة إيرادات باستخدام بطاقات إحصاءات BoardUI ومخطط مساحة وقائمة أشرطة. ”",
];

const CLIENTS = ["Claude Code", "Cursor", "VS Code", "Codex", "عملاء آخرون"] as const;

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
export default function McpPage() {
  const [client, setClient] = useState<(typeof CLIENTS)[number]>("Claude Code");
  return (
    <LocaleHtml locale="ar">
    <DocsLayout variant="library" hidePrevNext title="خادم MCP" locale="ar">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            يوفر BoardUI خادم MCP، مما يتيح لوكلاء الذكاء الاصطناعي القيام بالتثبيت نيابةً عنك. يمكن لـ
            Claude Code وCursor وVS Code وCodex وأي عميل MCP تصفح السجل وقراءة شيفرة المكوّنات وأمثلة
            الاستخدام الحقيقية، وإعداد مشروع جديد، وكتابة ملفات المكوّنات مباشرةً فيه. لا حاجة للتنقل بين
            الطرفيات، فقط صف ما تريد بناءه.
          </p>
          <p className="text-body-regular text-text-secondary">
            يعمل الخادم محلياً عبر stdio باستخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx</code>، لا شيء مستضاف.
            تعمل المكوّنات المجانية بدون أي إعداد؛ يُفعَّل BoardUI Pro في نفس المحادثة بمجرد تفعيل وكيلك
            لمفتاح الترخيص.
          </p>
          <p className="text-body-regular text-text-secondary">
            قاعدة واحدة لكل عميل أدناه: تُربط أدوات MCP عند بدء الجلسة. إذا سجّلت الخادم في منتصف الجلسة،
            أعد تشغيل العميل أو افتح محادثة جديدة، وإلا سيظهر متصلاً دون أدوات متاحة.
          </p>
        </div>

        <Section title="الإعداد">
          <p className="text-body-regular text-text-secondary">
            اختر عميلك. يُثبَّت Cursor وVS Code بنقرة واحدة؛ ويتطلب Claude Code وCodex أمرًا واحدًا.
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
                أمر واحد في مجلد مشروعك. أضف{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">--scope user</code>{" "}
                لتفعيله لكل مشروع، وأعد تشغيل Claude Code (أو افتح جلسة جديدة) بعد ذلك حتى ترتبط الأدوات.
              </p>
              <Command cmd="claude mcp add boardui -- npx -y boardui@latest mcp" />
            </>
          ) : client === "Cursor" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                ثبّته بنقرة واحدة، أو أضف الخادم إلى{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.cursor/mcp.json</code>{" "}
                بنفسك، ثم فعّله ضمن Settings, Tools &amp; MCP.
              </p>
              <div>
                <ButtonLink href={CURSOR_INSTALL_URL}>إضافة إلى Cursor</ButtonLink>
              </div>
              <FileBlock file=".cursor/mcp.json" code={MCP_STDIO_CODE} />
            </>
          ) : client === "VS Code" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                ثبّته بنقرة واحدة، أو أضف الخادم إلى{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.vscode/mcp.json</code>{" "}
                واضغط Start بجانبه.
              </p>
              <div>
                <ButtonLink href={VSCODE_INSTALL_URL}>إضافة إلى VS Code</ButtonLink>
              </div>
              <FileBlock file=".vscode/mcp.json" code={VSCODE_MCP_CODE} />
            </>
          ) : (
            <>
              <p className="text-body-regular text-text-secondary">
                يستخدم Windsurf وZed وCline وكل عميل MCP آخر خادم stdio نفسه. وجّههم إلى هذا الإعداد حيثما
                يحتفظون بخوادم MCP:
              </p>
              <FileBlock file="mcp.json" code={MCP_STDIO_CODE} />
            </>
          )}
        </Section>
<Section title="Monorepos والأسماء المستعارة المخصصة">
          <p className="text-body-regular text-text-secondary">
            يقرأ خادم MCP المحلي نفس الخيار{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> كـ CLI. ضعه بجانب{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> الخاص بحزمة الوجهة ومرّر المسار المطلق لتلك الحزمة بوصفه{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> إلى{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code>،{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_components</code>، و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>. تُثبَّت الملفات وتبعيات npm في تلك الحزمة، مع أسماء مستعارة للاستيراد المُهيَّأة.
          </p>
          <p className="text-body-regular text-text-secondary">
            مرر نفس{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> إلى{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">get_component</code> و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">get_usage_examples</code> لمطابقة المصدر والأمثلة. بدونها، تُعيد أدوات القراءة هذه استيرادات السجل الأصلية. لا تزال صادرات الحزمة وأنماط كل تطبيق تحتاج إلى إعداد.
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              إعداد حزمة واجهة مستخدم مشتركة
            </LinkButton>
          </div>
        </Section>

        <Section title="جرّب أن تسأل وكيلك">
          <p className="text-body-regular text-text-secondary">
            بمجرد الاتصال، تحدث مع وكيلك بلغة عادية. بعض نقاط البداية:
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
<Section title="الأدوات">
          <p className="text-body-regular text-text-secondary">ما يعرضه الخادم لوكيلك:</p>
          <div className="overflow-x-auto rounded-xl border border-border-button-default">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-separator-border bg-background-secondary-default">
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">الأداة</th>
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">ما الذي يفعله</th>
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

        <Section title="قواعد تصميم دائمة التشغيل">
          <p className="text-body-regular text-text-secondary">
            أدوات MCP تعمل عند الطلب: لا يرى الوكيل سمتك إلا عندما يفكر في السؤال عنها، والنموذج الذي لا
            يسأل أبداً يخترع تباعده وألوانه وطباعته بنفسه. لذا{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code> (و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>) يثبّت أيضاً
            أسس التصميم كملفات تعليمات دائمة تحمّلها الوكلاء في كل جلسة: قسم محاط بسياج في{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AGENTS.md</code>{" "}
            وقاعدة Cursor في{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.cursor/rules/boardui.mdc</code>
            . تثبّت رموز الألوان الدلالية ومقياس النوع المركّب واصطلاحات التباعد ونصف القطر والوضع الداكن
            و <code className="font-mono text-caption-1-medium text-text-primary">cx()</code>،
            وتُحدِّث عمليات إعادة التشغيل القسم في مكانه دون المساس ببقية ملفك.
          </p>
          <p className="text-body-regular text-text-secondary">
            هل هيّأت مشروعك قبل وجود هذه الميزة؟ اطلب من وكيلك تشغيل{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            هل تريد معرفة أعمق يتم تحميلها دائمًا، مع الكتالوج الكامل والتخصيص وأنماط الصفحات؟ ثبّت
            مهارة وكيل BoardUI إلى جانب MCP (
            <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>، أو{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui skill</code>).
          </p>
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              مهارة وكيل BoardUI
            </LinkButton>
          </div>
        </Section>

        <Section title="BoardUI Pro عبر MCP">
          <p className="text-body-regular text-text-secondary">
            تظهر مكوّنات وقوالب Pro في{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">list_components</code> لكل
            مستخدم. بدون ترخيص، يحصل وكيلك على الوصف ومثال استخدام عام وتعليمات الشراء بدلاً من المصدر.
            بعد شراء Pro، الصق مفتاح الترخيص من بريد الشراء في المحادثة؛ يُفعّله الوكيل باستخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">activate_license</code> (مقعد
            واحد، يُصدر في أي وقت مع{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">deactivate_license</code>) ومن
            ثَمّ تُثبَّت عناصر Pro تماماً كالعناصر المجانية. يُتحقق من المفتاح على جانب الخادم عند كل تنزيل
            Pro.
          </p>
          <p className="text-body-regular text-text-secondary">
            سبق تسجيل الدخول باستخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui login</code>؟ يستخدم
            خادم MCP الترخيص المخزَّن نفسه، لا شيء يستدعي الإعادة.
          </p>
        </Section>

        <Section title="قياس مجهول الهوية">
          <p className="text-body-regular text-text-secondary">
            تُبلّغ عمليات التثبيت الناجحة عن نفس الأحداث المجهولة التي يرسلها CLI (أسماء المكوّنات، ومدير
            الحزم، والإصدار)، مُصنَّفةً كمدفوعة بـ MCP. لا مسارات مشاريع ولا موجّهات ولا شيفرة مصدر. عطّل
            ذلك بـ{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            أو <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> في
            بيئة الخادم.
          </p>
        </Section>

        <Section title="استخدام MCP الخاص بـ shadcn بدلاً من ذلك">
          <p className="text-body-regular text-text-secondary">
            يتحدث سجل BoardUI بمخطط shadcn، لذا إذا كان وكيلك يشغّل بالفعل خادم shadcn MCP يمكنك الوصول
            إلى BoardUI من خلاله: أضف مساحة الاسم إلى{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components.json</code> واطلب{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@boardui/button</code>.
            يظل خادم BoardUI أعلاه المسار الأكثر ثراءً، مع أمثلة الاستخدام وإعداد المشروع وترخيص Pro.
          </p>
          <FileBlock file="components.json" code={SHADCN_MCP_CODE} />
        </Section>

        <Section title="خلف الكواليس">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest mcp</code>{" "}
            يشغّل المحرك ذاته الذي يستخدمه CLI، متحدثاً عبر MCP فوق stdio. يجلب السجل العام من boardui.com،
            ويحل تبعيات المكوّنات بشكل متعدي، ويكتب الملفات باستخدام التخطيط الافتراضي أو{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> التعيينات.
            يمكنك أيضاً تشغيله يدوياً للتحقق من الإعداد:
          </p>
          <PkgCommand npm="npx boardui@latest mcp" pnpm="pnpm dlx boardui@latest mcp" yarn="yarn dlx boardui@latest mcp" />
        </Section>

        <PrevNext
          prev={{ href: "/installation", label: "التثبيت", sub: "أدلة إعداد الإطار" }}
          next={{ href: "/skill", label: "مهارات الوكيل", sub: "معرفة لوكيلك الذكي" }}
          locale="ar"
        />
      </div>
    </DocsLayout>
  </LocaleHtml>
  );
}
