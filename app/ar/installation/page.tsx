"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";
import { LocaleHtml } from "@/components/application/docs/locale-html";
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
      {copied ? "تم النسخ" : "نسخ"}
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
  Vite: "Vite",
  "React Router": "React Router",
  Astro: "Astro",
};
export default function InstallationPage() {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>("Next.js");
  return (
    <LocaleHtml locale="ar">
      <DocsLayout variant="library" title="التثبيت" locale="ar">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            يعمل BoardUI مع أي إعداد React 19 + Tailwind CSS v4. اختر إطار العمل أدناه للحصول على
            دليل خطوة بخطوة، أو اتبع الخطوات اليدوية لنسخ الأساسيات بنفسك.
          </p>
          <p className="text-body-regular text-text-secondary">
            تخطَّ الخطوات أدناه: اتصل بخادم BoardUI MCP ودع وكيلك يثبّت كل شيء.
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              ابدأ مع MCP
            </LinkButton>
          </div>
        </div>

        <Section title="البدء السريع">
          <p className="text-body-regular text-text-secondary">
            هل تستخدم حزمة واجهة مستخدم مشتركة أو أسماء مستعارة مخصصة للاستيراد؟ اتبع إعداد
            monorepo والأسماء المستعارة قبل تشغيل أول عملية تثبيت. الإعداد القياسي أدناه لا يحتاج
            إلى ملف تهيئة.
          </p>
          <p className="text-body-regular text-text-secondary">
            في أي مشروع React + Tailwind v4،{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> يثبّت
            الحزم المطلوبة، ويكتب السمة والطباعة والأنماط العامة بالإضافة إلى{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx</code> الأداة،
            ويطبع الأسطر المتبقية التي يجب إضافتها إلى التخطيط الجذري:
          </p>
          <Command cmd="npx boardui@latest init" />
          <p className="text-body-regular text-text-secondary">
            ثم أضف أي مكوّن — تُحلّ التبعيات الداخلية وحزم npm تلقائياً:
          </p>
          <Command cmd="npx boardui@latest add button select date-picker" />
          <p className="text-body-regular text-text-secondary">
            هل تشغّل CLI من CI أو سكربت أو وكيل برمجة؟ أضف{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> إلى
            الأمرين. فعند عدم وجود طرفية للإجابة عن المطالبات، يتوقف CLI برمز الخروج 1 بدلًا من
            التخمين، ويجيب{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> عنها
            بالإعدادات الافتراضية: تثبيت الاعتماديات والإبقاء على الملفات الموجودة.
          </p>
        </Section>
        <Section title="أدلة الأطر">
          <p className="text-body-regular text-text-secondary">
            إعداد كامل من مجلد فارغ. تختلف الخطوات فقط في طريقة ربط كل إطار لـ Tailwind، و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/</code> اسم مستعار للاستيراد، و
            ورقة الأنماط العامة.
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
              <Step n={1} title="أنشئ مشروعًا (تخطَّ هذه الخطوة إن كان لديك مشروع).">
                <p className="text-body-regular text-text-secondary">
                  الإعدادات الافتراضية لـ create-next-app — TypeScript وTailwind CSS والـ{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias — مطابقة
                  الإعداد الافتراضي لـ BoardUI.
                </p>
                <Command cmd="npx create-next-app@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # TypeScript: Yes · Tailwind CSS: Yes · import alias: @/* (the defaults)
                </p>
              </Step>
              <Step n={2} title="تشغيل init في جذر المشروع.">
                <p className="text-body-regular text-text-secondary">
                  يثبّت <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>،{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>، و{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>،
                  ويكتب styles/ و utils/.
                </p>
                <Command cmd="npx boardui@latest init" />
              </Step>
              <Step n={3} title="استورد ورقة الأنماط وحمّل خط Inter في التخطيط الجذري.">
                <p className="text-body-regular text-text-secondary">
                  تقرأ سمة BoardUI خطّها من{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--font-inter</code>، لذا
                  حمّل Inter باستخدام <code className="font-mono text-caption-1-medium text-text-primary">next/font</code>{" "}
                  بدلًا من خطوط Geist في create-next-app وضع متغيّرها على{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">&lt;html&gt;</code>.
                  ومن دونه يُعرض النص بخط النظام.
                </p>
                <CodeBlock code={LAYOUT_CODE} />
              </Step>
              <Step n={4} title="أضف المكوّنات.">
                <Command cmd="npx boardui@latest add button" />
              </Step>
            </div>
          ) : framework === "Vite" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="أنشئ مشروعًا (تخطَّ هذه الخطوة إن كان لديك مشروع).">
                <Command cmd="npm create vite@latest my-app -- --template react-ts" />
              </Step>
              <Step n={2} title="ثبّت Tailwind CSS v4 وسجّل إضافة Vite.">
                <p className="text-body-regular text-text-secondary">
                  تتولى الإضافة أمر ورقة الأنماط ورموز{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@theme</code> نيابةً عنك:
                </p>
                <Command cmd="npm install tailwindcss @tailwindcss/vite" />
                <FileBlock file="vite.config.ts" code={VITE_CONFIG_CODE} />
              </Step>
              <Step n={3} title="أضف اسم الاستيراد المستعار @/* إلى tsconfig.json.">
                <FileBlock file="tsconfig.json" code={VITE_TSCONFIG_CODE} />
              </Step>
              <Step n={4} title="شغّل init.">
                <p className="text-body-regular text-text-secondary">
                  سيطالبك بالاختيار بين بضعة أمور: النمط الافتراضي، واللون الأساسي، وما إذا كنت تريد تثبيت
                  قواعد التصميم. عند الشك، اقبل الإعدادات الافتراضية — يمكنك تغييرها لاحقًا في{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>.
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={5} title="استورد ورقة الأنماط في نقطة دخول تطبيقك.">
                <p className="text-body-regular text-text-secondary">
                  أنشأت خطوة init الملف{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/styles/globals.css</code>{" "}
                  نيابةً عنك:
                </p>
                <FileBlock file="main.tsx" code={VITE_MAIN_CODE} />
              </Step>
              <Step n={6} title="أضف المكوّنات.">
                <p className="text-body-regular text-text-secondary">على سبيل المثال، Button:</p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
              </Step>
            </div>
          ) : framework === "React Router" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="أنشئ مشروعًا (تخطَّ هذه الخطوة إن كان لديك مشروع).">
                <p className="text-body-regular text-text-secondary">
                  React Router v7 هو الخلف لـ Remix — تنطبق هذه الخطوات على كليهما.
                </p>
                <Command cmd="npx create-react-router@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # القالب الافتراضي يشحن مع Tailwind CSS v4 مُوصّلًا مسبقًا
                </p>
              </Step>
              <Step n={2} title="أضف اسم الاستيراد المستعار @/*.">
                <p className="text-body-regular text-text-secondary">
                  يستخدم القالب بالفعل{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">vite-tsconfig-paths</code>
                  ، لذا يكفي إدخال في tsconfig:
                </p>
                <FileBlock file="tsconfig.json" code={RR_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="تشغيل init مع تحديد مجلد التطبيق.">
                <PkgCommand
                  npm="npx boardui@latest init --dir app"
                  pnpm="pnpm dlx boardui@latest init --dir app"
                  yarn="yarn dlx boardui@latest init --dir app"
                />
              </Step>
              <Step n={4} title="استورد ورقة الأنماط في المسار الجذري.">
                <FileBlock file="app/root.tsx" code={RR_ROOT_CODE} />
              </Step>
              <Step n={5} title="أضف المكوّنات مستهدفاً مجلد التطبيق.">
                <PkgCommand
                  npm="npx boardui@latest add button --dir app"
                  pnpm="pnpm dlx boardui@latest add button --dir app"
                  yarn="yarn dlx boardui@latest add button --dir app"
                />
              </Step>
            </div>

          ) : (
            <div className="flex flex-col gap-4">
              <Step n={1} title="أنشئ مشروعًا وأضف تكاملات React + Tailwind.">
                <Command cmd="npm create astro@latest my-app" />
                <Command cmd="npx astro add react tailwind" />
                <p className="text-body-2-regular text-text-tertiary">
                  # يثبّت تكامل React وإضافة Tailwind CSS v4 لـ Vite
                </p>
              </Step>
              <Step n={2} title="أضف الاسم المستعار للاستيراد @/*.">
                <FileBlock file="tsconfig.json" code={ASTRO_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="تشغيل init في جذر المشروع.">
                <p className="text-body-regular text-text-secondary">
                  تُكتب الأنماط والأدوات في{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/</code> تلقائيًا.
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={4} title="استورد ورقة الأنماط في التخطيط الأساسي.">
                <FileBlock file="src/layouts/Layout.astro" code={ASTRO_LAYOUT_CODE} />
              </Step>
              <Step n={5} title="أضف المكوّنات وضخّها في ملفات .astro.">
                <p className="text-body-regular text-text-secondary">
                  تحتاج المكوّنات التفاعلية إلى توجيه{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">client:*</code> لتُضخّ
                  في الصفحة:
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
            تستخدم شيئًا آخر؟ أي إطار عمل يشغّل React 19 مع Tailwind CSS v4 يعمل — قم بتوصيل{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias، شغّل{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>، واستيراد
            ورقة الأنماط. أو تجاوز CLI بالكامل باستخدام الخطوات اليدوية أدناه.
          </p>

        </Section>

        <Section title="Monorepos والأسماء المستعارة المخصصة" id="monorepos">
          <p className="text-body-regular text-text-secondary">
            ثبّت المكوّنات في حزمة واجهة مستخدم مشتركة تستخدمها تطبيقات متعددة، أو طابق المجلدات الموجودة
            وأسماء الاستيراد المستعارة في مشروعك. أضف اختياريًا{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> بجانب حزمة
            الوجهة{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code>. بدونه،
            يعمل الجذر المعتاد أو <code className="font-mono text-caption-1-medium text-text-primary">src/</code>{" "}
            التخطيط و <code className="font-mono text-caption-1-medium text-text-primary">@/</code> تبقى
            عمليات الاستيراد كما هي.
          </p>
          <Step n={1} title="تهيئة حزمة الوجهة.">
            <p className="text-body-regular text-text-secondary">
              لحزمة باسم{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui</code> في{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">packages/ui</code>، أنشئ
              هذا الإعداد وادمج الصادرات في بيان الحزمة الخاص به. كيّف امتدادات الملفات وفق مصدر حزمتك أو
              مخرجات البناء.
            </p>
            <CodeBlock code={BOARDUI_JSON_CODE} />
            <p className="text-body-regular text-text-secondary">
              المسارات نسبية إلى هذه الحزمة ويجب أن تبقى داخلها. حدّد مساراً واسماً مستعاراً لكل مجموعة
              تغيّرها؛ المجموعات المحذوفة تحتفظ بإعداداتها الافتراضية. الأسماء المستعارة هي بادئات استيراد بدون
              أحرف بدل ويجب أن تُحلَّل عبر صادرات الحزمة أو إعداد TypeScript والحزمة المجمِّعة.
            </p>
          </Step>
          <Step n={2} title="تشغيل BoardUI من الحزمة المشتركة.">
            <Command cmd="cd packages/ui" />
            <Command cmd="npx boardui@latest init" />
            <Command cmd="npx boardui@latest add button" />
            <p className="text-body-regular text-text-secondary">
              تُثبَّت المكوّنات واعتماديات npm الخاصة بها في هذه الحزمة. على سبيل المثال، استيراد{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/utils/cx</code> يصبح{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/utils/cx</code>
              . تستخدم مكوّنات المجاني وPro الإعداد نفسه. مع MCP، مرّر المسار المطلق لهذه الحزمة
              بوصفه <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code>.
            </p>
          </Step>
          <Step n={3} title="ربط كل تطبيق مستهلك.">
            <p className="text-body-regular text-text-secondary">
              أضف حزمة واجهة المستخدم كتبعية مساحة عمل لكل تطبيق وتأكد من أن أداة التجميع الخاصة به يمكنها تجميع
              TypeScript وTSX الخاصة بالحزمة. استورد ورقة أنماط BoardUI وأدرج المصدر المشترك
              في اكتشاف مصدر Tailwind:
            </p>
            <CodeBlock code={CONSUMING_GLOBALS_CODE} />
            <p className="text-body-regular text-text-secondary">
              استورد ورقة أنماط التطبيق هذه من التخطيط الجذري أو نقطة الدخول. اضبط{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@source</code> مسار نسبي
              إلى موقع ورقة الأنماط. يمكن لاستيرادات المكوّنات بعد ذلك استخدام{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/components/base/buttons/button</code>
              .
            </p>
          </Step>
          <p className="text-body-regular text-text-secondary">
            هيّئ المسارات قبل التثبيت. تغيير الإعداد لا ينقل الملفات الموجودة ولا يحدّث استيرادات تطبيقك.
            استخدم الإعداد بدلاً من دمجه مع{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> أو{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code>. تنتمي القوالب
            الكاملة للصفحة إلى التطبيق المستهلك: لا تُوزَّع مساراتها والأصول العامة عبر حزم مساحة العمل.
            يحافظ النسخ اليدوي على الاستيرادات الأصلية، لذا عدّلها بنفسك.
          </p>
        </Section>
        <Section title="التثبيت اليدوي">
          <p className="text-body-regular text-text-secondary">
            تفضّل توصيل الأمور بنفسك؟ تأكد من أن لديك مشروعًا مع إعداد Tailwind CSS v4، ثم
            اتبع هذه الخطوات.
          </p>
          <Step n={1} title="ثبّت الحزم المطلوبة">
            <Command cmd="npm install react-aria-components tailwind-merge @remixicon/react" />
          </Step>
          <Step n={2} title="إنشاء styles/theme.css مع رموز التصميم.">
            <FileBlock file="styles/theme.css" code={THEME_CSS} />
          </Step>
          <Step n={3} title="إنشاء styles/typography.css مع مقياس الخط.">
            <FileBlock file="styles/typography.css" code={TYPOGRAPHY_CSS} />
          </Step>
          <Step n={4} title="إنشاء styles/globals.css كنقطة دخول Tailwind الخاصة بك.">
            <FileBlock file="styles/globals.css" code={GLOBALS_CSS} />
          </Step>
          <Step n={5} title="أضف utils/cx.ts أداة دمج الفئات.">
            <FileBlock file="utils/cx.ts" code={CX_TS} />
          </Step>
          <Step n={6} title="استورد ورقة الأنماط وحمّل خط Inter في التخطيط الجذري.">
            <CodeBlock code={LAYOUT_CODE} />
          </Step>
        </Section>
        <Section title="إضافة مكوّن">
          <p className="text-body-regular text-text-secondary">
            المكوّنات موجودة تحت{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code> والاستيراد
            عبر <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            alias. انسخ الشيفرة من أي صفحة مكوّن — أو دع CLI يقوم بذلك — ثم استورد:
          </p>
          <CodeBlock code={ADD_COMPONENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            تصفح كل شيء باستخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui list</code>، أو
            انسخ أوامر التثبيت لكل مكوّن على حدة من صفحات المكوّنات الفردية.
          </p>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            تُثبَّت مكوّنات وقوالب Pro عبر نفس CLI بمجرد تفعيل ترخيصك — دون الحاجة إلى التعامل مع ملفات مضغوطة
            أو نسخ ولصق. مفتاح ترخيصك موجود في إيصال Lemon Squeezy الخاص بك (وتحت{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">My Orders</code> على Lemon
            Squeezy). عملية شراء واحدة تفتح كل شيء، مع تضمين التحديثات.
          </p>
          <p className="text-body-regular text-text-secondary">
            فعّل الترخيص على جهازك مرة واحدة:
          </p>
          <Command cmd="npx boardui@latest login YOUR_LICENSE_KEY" />
          <p className="text-body-regular text-text-secondary">
            من تلك اللحظة، تعمل مكوّنات المدفوع تماماً مثل المجانية — يثبّت CLI المصدر بالإضافة إلى أي
            مكوّنات مجانية تعتمد عليها:
          </p>
          <Command cmd="npx boardui@latest add agent-progress" />
          <p className="text-body-regular text-text-secondary">
            تُسحب القوالب بالطريقة ذاتها — تصل الصفحة الكاملة وكل مكوّن تستخدمه وصورها إلى مشروعك بأمر واحد (
            <code className="font-mono text-caption-1-medium text-text-primary">template-home-dashboard</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-medical-profile</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-chat</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-image-generation</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-profile</code>):
          </p>
          <Command cmd="npx boardui@latest add template-ai-chat" />
          <p className="text-body-regular text-text-secondary">
            لسحب أحدث إصدار من أي شيء قمت بتثبيته بالفعل، أعد تشغيل نفس الأمر مع{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. كل مكوّن Pro
            مُعلَّم بـ{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">PRO</code> شارة على{" "}
            <Link href="/components" className="text-accent-600 underline">
              صفحة المكوّنات
            </Link>
            .
          </p>
          <p className="text-body-regular text-text-secondary">
            يشغل كل جهاز تسجّل الدخول عليه مقعدًا واحدًا من مقاعد ترخيصك: مقعد واحد في سنة واحدة من التحديثات ووصول
            مدى الحياة، وخمسة مقاعد في غير محدود للشركات الناشئة. وتحتفظ التراخيص المشتراة عبر Lemon Squeezy بالحد
            الذي بيعت به.{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui logout</code>{" "}
            يحرّر مقعد الجهاز الحالي؛ في بيئة CI، تخطَّ{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">login</code> واضبط{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_LICENSE_KEY</code>{" "}
            متغير البيئة بدلاً من ذلك. تتوفر القوالب أيضاً كتنزيلات مشاريع كاملة من طلبك على Lemon Squeezy. هل
            فقدت مفتاحك؟ تواصل مع hi@boardui.com.
          </p>
        </Section>

        <Section title="المظهر الداكن">
          <p className="text-body-regular text-text-secondary">
            الوضع الداكن يدوي ومعتمد على الفئة. الوضع الفاتح هو الافتراضي؛ يخزّن BoardUI الاختيار اليدوي تحت{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> ولا يقرأ
            تفضيل نظام التشغيل أبداً. شغّل البحث عن الثيم المحفوظ قبل الترطيب حتى لا يرى المستخدمون
            العائدون وميضاً في الوضع الفاتح.
          </p>
          <CodeBlock code={DARK_LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            أضف عنصر التحكم القابل لإعادة الاستخدام، ثم ضع{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">&lt;ThemeToggle /&gt;</code>{" "}
            في الشريط الجانبي أو واجهة الإعدادات. يحافظ على تزامن أزرار التبديل المرئية ويحفظ
            الاختيار تلقائيًا.
          </p>
          <Command cmd="npx boardui@latest add theme-toggle" />
          <p className="text-body-regular text-text-secondary">
            تستخدم المكوّنات الأدوات الدلالية فقط. خصّص قيم الوضع الفاتح في{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">:root</code> والقيم الداكنة في{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.dark</code> داخل{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>؛ تجنّب
            استخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">dark:</code> التجاوزات والألوان
            الهيكلية الخام. راجع التعيين الكامل في{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              صفحة الألوان
            </Link>
            .
          </p>
        </Section>

        <Section title="لون التمييز">
          <p className="text-body-regular text-text-secondary">
            لون CTA هو قرار تصميمي، وليس خمسين تعديلاً على المكوّنات. كل سطح تفاعلي - تدرجات الأزرار الأساسية،
            وأزرار Ghost وLink، ومربعات الاختيار، وأزرار الراديو، والمفاتيح، والشرائح، وعلامات التبويب،
            وعنصر الشريط الجانبي المحدد، وحلقات التركيز - يقرأ من{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--color-accent-50…950</code>{" "}
            تصاعد تدريجي <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>،
            والتي تكون زرقاء افتراضيًا. تجاوز هذه المتغيرات الأحد عشر بعد استيراد السمة وسيُعاد
            تلوين النظام بأكمله في وضعَي الفاتح والداكن؛ وتحتفظ المخططات وألوان الحالة بدرجاتها الخاصة.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">
            styles/globals.css (أو أي ورقة أنماط مستوردة)
          </p>
          <CodeBlock code={ACCENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            لا يتعين عليك كتابة هذه الكتلة يدويًا. افتح أي صفحة مكوّن، واضغط زر لوحة الألوان في
            الزاوية السفلية، وجرّب درجات الألوان مباشرةً، أو اختر لونًا مخصصًا بالكامل. يقع هذا اللون تمامًا على
            accent-500، حيث يبدأ تدرّج الأزرار الأساسية، ويبني BoardUI الدرجات العشر الأخرى
            حوله. عندما يبدو مناسبًا،{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Copy theme CSS</code> يُصدّر
            هذا التجاوز بالضبط. و{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              صفحة الألوان
            </Link>{" "}
            يحتوي على نفس عناصر التحكم مضمّنة.
          </p>
        </Section>

        <Section title="مجموعة التقنيات">
          <p className="text-body-regular text-text-secondary">
            مكوّنات BoardUI مبنية باستخدام React 19 وTypeScript 5 وTailwind CSS v4 وReact Aria لإمكانية
            الوصول. أنت تمتلك الشيفرة — لا حزمة وقت تشغيل، ولا جهات صيانة خارجية تنتظرها. تستخدم بطاقات
            المخططات إضافةً إلى ذلك Recharts، وتستخدم جداول البيانات TanStack Table؛ يقوم CLI بتثبيتها
            تلقائيًا عند الحاجة إليها.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          العودة إلى جميع المكوّنات
        </Link>
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}

// 模型翻译：The plugin handles the stylesheet and the @theme tokens for you:
// 模型翻译：Add the @/* import alias to tsconfig.json.
// 模型翻译：Run init.
// 模型翻译：It will prompt you for a few choices: a default style, a base color, and whether to install the design rules. When in doubt, accept the defaults — you can change them later in boardui.json.
// 模型翻译：Import the stylesheet in your app entry.
// 模型翻译：The init step created src/styles/globals.css for you:
// 模型翻译：For example, the Button:
// 模型翻译：# the default template ships with Tailwind CSS v4 already wired up
// 模型翻译：Add the @/* import alias.
// 模型翻译：The template already uses vite-tsconfig-paths, so a tsconfig entry is all you need:
// 模型翻译：Add the @/* import alias.
// 模型翻译：# installs the React integration and the Tailwind CSS v4 Vite plugin
// 模型翻译：Styles and utils are written into src/ automatically.
// 模型翻译：Interactive components need a client:* directive to hydrate on the page:
