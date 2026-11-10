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
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">خيار</th>
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">الوصف</th>
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
    <LocaleHtml locale="ar">
      <DocsLayout variant="docs" locale="ar" title="CLI">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              الـ <code className="font-mono text-caption-1-medium text-text-primary">boardui</code> تنسخ CLI ملفات مصدر المكوّنات مباشرةً إلى مشروعك — دون حزمة وقت تشغيل، الشيفرة ملكك. تحل كل تبعيات المكوّن الداخلية (الأدوات المساعدة والأيقونات والمكوّنات الأخرى) بشكل متعدٍّ وتثبت أي حزم npm مفقودة باستخدام مدير الحزم الخاص بك.
            </p>
            <Command cmd="npx boardui@latest add button select date-picker" />
          </div>

          <Section title="init">
            <p className="text-body-regular text-text-secondary">
              يُعدّ BoardUI في مشروع Next.js قائم: يثبّت تبعيات وقت التشغيل (
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>،
              Tailwind v4)، ويكتب <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/typography.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/globals.css</code>، و{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">utils/cx.ts</code>، ثم يطبع الأسطر التي يجب إضافتها إلى التخطيط الجذري: استيراد ورقة الأنماط وخط Inter.
            </p>
            <p className="text-body-regular text-text-secondary">
              عندما يترجم المشروع Tailwind v4 بالفعل، كما يفعل create-next-app 16.4 وما بعده عبر{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/turbopack</code>،
              لا يغيّر init إعداد PostCSS. وإلا فإنه يثبّت{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/postcss</code> ويطبع
              سطر <code className="font-mono text-caption-1-medium text-text-primary">postcss.config.mjs</code>. مرّر{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--postcss</code> لإعداد PostCSS في الحالتين.
            </p>
            <Command cmd="npx boardui@latest init" />
            <OptionTable rows={INIT_OPTIONS} />
          </Section>

          <Section title="إضافة">
            <p className="text-body-regular text-text-secondary">
              يضيف مكوّناً واحداً أو أكثر. بشكل افتراضي، تحتفظ الملفات بنفس البنية الموجودة في هذا الموقع (
              <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">components/application/…</code>
              ) تستخدم الاستيرادات <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
              alias، ويتم تخطي الملفات الموجودة ما لم تمرر{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. شغّله
              بدون وسيطات للحصول على منتقٍ تفاعلي.
            </p>
            <Command cmd="npx boardui@latest add            # interactive picker" />
            <Command cmd="npx boardui@latest add table pagination" />
            <Command cmd="npx boardui@latest add --all" />
            <OptionTable rows={ADD_OPTIONS} />
          </Section>

<Section title="CI والسكربتات ووكلاء البرمجة">
          <p className="text-body-regular text-text-secondary">
            يسأل <code className="font-mono text-caption-1-medium text-text-primary">init</code> و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">add</code> قبل تثبيت الحزم أو
            تعديل الملفات الموجودة. وعند عدم وجود طرفية للإجابة، كما في CI أو سكربت أو وكيل برمجة، يتوقفان
            برمز الخروج 1 بدلًا من التخمين. مرّر{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> لقبول
            الإعدادات الافتراضية: تثبيت الاعتماديات والإبقاء على الملفات الموجودة. أضف{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> لاستبدال
            الملفات الموجودة، واذكر أسماء المكونات أو مرّر{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--all</code> بدلًا من
            استخدام أداة الاختيار.
          </p>
          <Command cmd="npx boardui@latest init --yes" />
          <Command cmd="npx boardui@latest add button select --yes" />
        </Section>

        <Section title="مسارات مخصصة والمستودعات المتعددة">
          <p className="text-body-regular text-text-secondary">
            إضافة خيار{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> بجانب
            حزمة الوجهة{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> لتهيئة
            وجهة الملفات وأسماء الاستيراد المختصرة التي تستخدمها. كلاهما{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">إضافة</code> قراءته، بما في
            ذلك مكوّنات Pro. بدونه، سيظل الجذر الحالي و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">src/</code> تعمل التخطيطات
            كما كانت من قبل.
          </p>
          <p className="text-body-regular text-text-secondary">
            تهيئة المقترن <code className="font-mono text-caption-1-medium text-text-primary">paths</code>{" "}
            و <code className="font-mono text-caption-1-medium text-text-primary">aliases</code> إدخالات
            للمكوّنات، والأدوات المساعدة، والخطافات، والأنماط، أو المكتبة. شغّل CLI داخل الحزمة الوجهة حتى
            تُثبَّت تبعيات npm هناك أيضاً. لا يمكن دمج التعيينات المُهيَّأة مع{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> أو{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code> ؛ تبقى تلك
            العلامات متاحة للمشاريع غير المهيّأة. لا يُهاجر تغيير الإعداد الملفات المثبَّتة مسبقًا.
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              تهيئة حزمة واجهة مستخدم مشتركة والتطبيقات المستهلكة
            </LinkButton>
          </div>
        </Section>

        <Section title="قائمة">
          <p className="text-body-regular text-text-secondary">
            يطبع كل مكوّن متاح مجمّعاً حسب النوع — المكوّنات الأساسية، وكتل التطبيق، والأسس.
          </p>
          <Command cmd="npx boardui@latest list" />
        </Section>

        <Section title="مهارة">
          <p className="text-body-regular text-text-secondary">
            يثبّت مهارة وكيل BoardUI (<code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
            بالإضافة إلى الكتالوج، والتخصيص، ومراجع الأنماط) حتى تحمّل مساعدات الذكاء الاصطناعي مثل Claude
            Code وCodex معرفة BoardUI في كل جلسة. الافتراضي هو{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>؛
            أعد التشغيل باستخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--force</code> للتحديث.
          </p>
          <Command cmd="npx boardui@latest skill" />
          <OptionTable rows={SKILL_OPTIONS} />
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              مهارة وكيل BoardUI
            </LinkButton>
          </div>
        </Section>

        <Section title="تحديث المكوّنات">
          <p className="text-body-regular text-text-secondary">
            المكوّنات المثبّتة هي نسخ ملكك لتعديلها، ولن تُمسّ بصمت. لسحب أحدث إصدار من مكوّن من السجل، أعد
            تشغيل <code className="font-mono text-caption-1-medium text-text-primary">إضافة</code> مع{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>.
          </p>
          <Command cmd="npx boardui@latest add button --overwrite" />
        </Section>

        <Section title="قياس مجهول الهوية">
          <p className="text-body-regular text-text-secondary">
            بعد نجاح <code className="font-mono text-caption-1-medium text-text-primary">init</code> ،
            يُرسل CLI حدثًا مجهولًا يحتوي على إصداره ومدير الحزم الخاص بك وما إذا كان{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--pro</code> تم
            استخدامه. بعد نجاح{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">إضافة</code> ، يرسل أسماء
            المكوّنات التي طلبتها صراحةً، دون التبعيات المحلولة تلقائيًا. بعد نجاح{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">مهارة</code> عند التثبيت،
            يُرسل موضع وضع المهارة (مشروع، أو عام، أو مجلد الوكلاء)، دون إرسال المسار نفسه. يتيح معرّف
            عشوائي في مجلد إعدادات المستخدم بنظام التشغيل لديك التمييز بين عمليات التشغيل المتكررة. لا يُرسل
            BoardUI مسارات المشاريع، أو الشيفرة المصدرية، أو أسماء التبعيات، أو عناوين البريد الإلكتروني، أو
            وسائط الأوامر الأخرى، أو بيانات القياس عن بُعد لـ{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">قائمة</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            تعطيل القياس عن بُعد عبر ضبط{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            أو <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            تُحتفظ بالأحداث كعدادات مدى الحياة وحاويات يومية مجهولة تُستخدم لإعداد تقارير الاتجاهات اليومية
            والأسبوعية والشهرية. لا تنتهي صلاحية الحاويات اليومية تلقائياً.
          </p>
        </Section>

        <Section title="التوافق مع shadcn">
          <p className="text-body-regular text-text-secondary">
            يستخدم السجل مخطط عنصر shadcn، لذا يمكن تثبيت كل مكوّن أيضاً باستخدام shadcn CLI إذا كنت تفضل
            ذلك:
          </p>
          <CodeBlock code="npx shadcn@latest add https://www.boardui.com/r/button.json" />
        </Section>

        <Link
          href="/docs/introduction"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          العودة إلى المقدمة
        </Link>
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}
