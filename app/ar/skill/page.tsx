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

/** Agent Skills page, mirroring boardui.com/skill. */
export default function SkillPage() {
  return (
    <LocaleHtml locale="ar">
      <DocsLayout variant="library" hidePrevNext locale="ar" title="مهارات الوكيل">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              أمر واحد يمنح مساعدك الذكي معرفة كاملة بـ BoardUI: كل مكوّن وقالب، وقواعد التصميم، والتخصيص،
              والأنماط، والحركة. يقوم Claude Code وCodex والوكلاء الآخرون القادرون على المهارات بتحميله
              تلقائياً ويبنون بمكوّنات BoardUI الحقيقية بدلاً من اختراع بدائل.
            </p>
            <p className="text-body-regular text-text-secondary">
              تتبع المهارات المفتوحة{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              standard: ملف markdown يكتشفه وكيلك بنفسه، دون الحاجة إلى خادم. يُجلب المحتوى حديثاً من
              boardui.com عند كل عملية تثبيت.
            </p>
          </div>

          <Section title="تثبيت">
            <p className="text-body-regular text-text-secondary">
              أمر واحد، يُشغَّل من جذر مشروعك. اختر التبويب لتحديد مكان الحفظ: الكتابة الافتراضية تذهب إلى{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>{" "}
              في المشروع، بحيث تنتقل المهارة مع مستودعك ويلتقطها جميع وكلاء فريقك. يغطّي الخيار العام ودليل
              الوكلاء عمليات التثبيت على مستوى المستخدم والعملاء مثل Codex أو Gemini.
            </p>
            <CodeTabs
              tabs={[
                { value: "Project (default)", code: "npx boardui@latest skill" },
                { value: "عالمي", code: "npx boardui@latest skill --global" },
                { value: "Codex & Gemini", code: "npx boardui@latest skill --client codex" },
                { value: "Custom path", code: "npx boardui@latest skill --path .agents/skills/boardui" },
              ]}
            />
            <p className="text-body-regular text-text-secondary">
              هل أنت متصل بالفعل بخادم BoardUI MCP؟ فقط اطلب من وكيلك تشغيل{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code> ، دون
              الحاجة إلى طرفية.
            </p>
          </Section>

          <Section title="ما بالداخل">
            <p className="text-body-regular text-text-secondary">
              خفيف <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code> يحمّله
              الوكيل دائماً، بالإضافة إلى الملفات المرجعية التي يقرأها عند الطلب (الإفصاح التدريجي، وفق معيار
              المهارات):
            </p>
            <SubSection title="SKILL.md">
              <p className="text-body-regular text-text-secondary">
                The core file your agent always loads: the build workflow (detect setup, discover, install,
                compose, verify), a digest of the design rules, guidance on choosing the right component for
                the job, known gotchas, and how Pro licensing works.
              </p>
            </SubSection>
            <SubSection title="references/components.md">
              <p className="text-body-regular text-text-secondary">
                The full catalog, generated from the live registry: every component and template with
                description, install command, and a usage example.
              </p>
            </SubSection>
            <SubSection title="references/theming.md">
              <p className="text-body-regular text-text-secondary">
                Token architecture, the semantic color families, the composite type scale, dark mode
                mechanics, and how to rebrand the accent ramp.
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

          <Section title="إلى أين تذهب لكل عميل">
            <p className="text-body-regular text-text-secondary">
              يكتشف Claude Code المهارات في{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/</code>{" "}
              (التثبيت الافتراضي) وفي{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.claude/skills/</code> (
              <code className="font-mono text-caption-1-medium text-text-primary">--global</code>). يقرأ Codex
              وGemini CLI والعملاء الآخرون الذين يشتركون في اتفاقية الوكلاء{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.agents/skills/</code> (
              <code className="font-mono text-caption-1-medium text-text-primary">--client codex</code>). أي
              شيء آخر: <code className="font-mono text-caption-1-medium text-text-primary">--path</code> يضع
              المجلد في أي مكان يبحث عنه العميل. تُحمَّل المهارات عند بدء الجلسة، لذا أعد تشغيل وكيلك أو افتح
              محادثة جديدة بعد التثبيت.
            </p>
          </Section>

          <Section title="التحديث">
            <p className="text-body-regular text-text-secondary">
              تحمل المهارة ختم إصدار في بياناتها الأمامية، ويعيد السجل بناءها عند كل نشر: تظهر المكوّنات
              الجديدة في الكتالوج تلقائياً. أعد تشغيل التثبيت مع{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--force</code> للتحديث في
              مكانه؛ يطبع الأمر الإصدارات المثبتة والمُجلَبة حتى تتمكن من رؤية ما تغيّر.
            </p>
            <PkgCommand
              npm="npx boardui@latest skill --force"
              pnpm="pnpm dlx boardui@latest skill --force"
              yarn="yarn dlx boardui@latest skill --force"
            />
          </Section>

          <Section title="المهارة مقابل MCP">
            <p className="text-body-regular text-text-secondary">
              يكمّلان بعضهما البعض. المهارة هي المعرفة التي يمتلكها الوكيل دائماً: الكتالوج والقواعد
              والأنماط، تُحمَّل في كل جلسة دون أي إعداد. و خادم MCP هي أداة حية: مصدر كامل للمكوّن عند الطلب،
              تثبيت بدون طرفية، تهيئة المشروع، وتفعيل ترخيص Pro في المحادثة. أفضل إعداد: تثبيت كليهما. تجعل
              المهارة الوكيل يخطط بمكوّنات BoardUI الحقيقية؛ أما MCP فيتيح له التنفيذ.
            </p>
            <div>
              <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
                خادم MCP
              </LinkButton>
            </div>
          </Section>

          <Section title="BoardUI Pro">
            <p className="text-body-regular text-text-secondary">
              يغطي كتالوج المهارة مكوّنات وقوالب BoardUI Pro أيضاً، مُعلَّمة بـ PRO، مع أمثلة استخدام عامة
              لكن دون مصدر أبداً. بتفعيل ترخيص Pro مرة واحدة ({" "}
              <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest login &lt;key&gt;</code>
              ، أدخل مفتاح ترخيص Lemon Squeezy الخاص بك)، يقوم وكيلك بتثبيت عناصر Pro تمامًا كالعناصر
              المجانية. بدونه، يعرف ما هو متاح ويوجهك إلى التسعير بدلاً من التخمين بمكوّن مشابه.
            </p>
            <div>
              <LinkButton href="/pricing" trailingIcon={RiArrowRightSLine}>
                التسعير
              </LinkButton>
            </div>
          </Section>

          <PrevNext
            prev={{ href: "/mcp", label: "خادم MCP", sub: "الوكلاء يقومون بالتثبيت نيابةً عنك" }}
            next={{ href: "/rtl", label: "دعم RTL" }}
            locale="ar"
          />
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}