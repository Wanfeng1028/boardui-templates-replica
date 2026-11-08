"use client";

// RTL demos for the /rtl docs page.
//
// Every Arabic / Hebrew string below is the live boardui.com/rtl page's own
// translation, keyed by the English source string (harness probes,
// 2026-11-08). Nothing here is translated by hand.
//
// Notes on what the probes could not settle:
// - "Account options" opens a menu on the original; the menu items could not
//   be captured (three probe runs hit hydration timeouts), so it renders as
//   a plain button here.
// - The nested "English support" panel is a faithful reconstruction of the
//   MIXED_CODE example on the same page (a nested DirectionProvider), not a
//   captured live panel.

import { useCallback, useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
import { AuthCard } from "@/components/application/auth/auth-card";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { DateRangePicker } from "@/components/base/date-picker/date-range-picker";
import { InputOtp } from "@/components/base/input-otp/input-otp";
import { Radio, RadioGroup } from "@/components/base/radio/radio";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { Select, SelectItem } from "@/components/base/select/select";
import { Slider } from "@/components/base/slider/slider";
import { Switch } from "@/components/base/switch/switch";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { TemplateCopyProvider } from "@/components/foundations/template-copy/template-copy";

export type RtlLang = "ar" | "he" | "en";

const RTL_LOCALES: Record<RtlLang, string> = {
  ar: "ar",
  he: "he",
  en: "en-US",
};

const RTL_COPY: Record<"ar" | "he", Record<string, string>> = {
  ar: {
    "Sign in to BoardUI Pro": "تسجيل الدخول إلى BoardUI Pro",
    "Your license unlocks every Pro component and template.":
      "يتيح لك ترخيصك الوصول إلى جميع مكونات وقوالب Pro.",
    Email: "البريد الإلكتروني",
    Password: "كلمة المرور",
    "Remember me": "تذكرني",
    "Forgot password?": "نسيت كلمة المرور؟",
    "Sign in": "تسجيل الدخول",
    "or continue with": "أو تابع باستخدام",
    "New here?": "جديد هنا؟",
    "Create an account": "إنشاء حساب",
    "Continue with Google": "المتابعة باستخدام Google",
    "Continue with GitHub": "المتابعة باستخدام GitHub",
    "Continue with Figma": "المتابعة باستخدام Figma",
    Profile: "الملف الشخصي",
    Security: "الأمان",
    "Edit your account preferences": "تعديل تفضيلات حسابك",
    "Design team": "فريق التصميم",
    "Development team": "فريق التطوير",
    "Account options": "خيارات الحساب",
    Daily: "يومي",
    Weekly: "أسبوعي",
    Monthly: "شهري",
    Yearly: "سنوي",
    Volume: "مستوى الصوت",
    "Verification code": "رمز التحقق",
    "Email notifications": "إشعارات البريد الإلكتروني",
    "Product updates": "تحديثات المنتج",
    "Date range picker": "اختيار نطاق التواريخ",
    "Choose a start and end date, or use one of the preset ranges.":
      "اختر تاريخ البداية والنهاية، أو استخدم إحدى الفترات المحددة مسبقًا.",
    "Select date range": "اختيار الفترة",
    Starter: "البداية",
    "For side projects and experiments.": "للمشاريع الجانبية والتجارب.",
    "For growing teams that need more.": "للفرق المتنامية التي تحتاج إلى المزيد.",
    "Visitors by country": "الزوار حسب البلد",
    Visitors: "الزوار",
    "Manage your account and preferences in one place.":
      "إدارة حسابك وتفضيلاتك من مكان واحد.",
  },
  he: {
    "Sign in to BoardUI Pro": "כניסה ל־BoardUI Pro",
    "Your license unlocks every Pro component and template.":
      "הרישיון שלכם מעניק גישה לכל רכיבי ותבניות Pro.",
    Email: "דוא״ל",
    Password: "סיסמה",
    "Remember me": "זכרו אותי",
    "Forgot password?": "שכחתם את הסיסמה?",
    "Sign in": "כניסה",
    "or continue with": "או המשיכו עם",
    "New here?": "חדשים כאן?",
    "Create an account": "יצירת חשבון",
    "Continue with Google": "המשך עם Google",
    "Continue with GitHub": "המשך עם GitHub",
    "Continue with Figma": "המשך עם Figma",
    Profile: "פרופיל",
    Security: "אבטחה",
    "Edit your account preferences": "עריכת העדפות החשבון",
    "Design team": "צוות עיצוב",
    "Development team": "צוות פיתוח",
    "Account options": "אפשרויות חשבון",
    Daily: "יומי",
    Weekly: "שבועי",
    Monthly: "חודשי",
    Yearly: "שנתי",
    Volume: "עוצמת הקול",
    "Verification code": "קוד אימות",
    "Email notifications": "התראות בדוא״ל",
    "Product updates": "עדכוני מוצר",
    "Date range picker": "בחירת טווח תאריכים",
    "Choose a start and end date, or use one of the preset ranges.":
      "בחרו תאריך התחלה וסיום, או השתמשו באחד מטווחי התאריכים המוגדרים מראש.",
    "Select date range": "בחירת טווח תאריכים",
    Starter: "מתחילים",
    "For side projects and experiments.": "לפרויקטים צדדיים ולניסויים.",
    "For growing teams that need more.": "לצוותים בצמיחה שצריכים יותר.",
    "Visitors by country": "מבקרים לפי מדינה",
    Visitors: "מבקרים",
    "Manage your account and preferences in one place.":
      "ניהול החשבון וההעדפות במקום אחד.",
  },
};

const VISITORS: Record<RtlLang, { country: string; value: number }[]> = {
  en: [
    { country: "United States", value: 5980 },
    { country: "United Kingdom", value: 3020 },
    { country: "Canada", value: 820 },
  ],
  ar: [
    { country: "السعودية", value: 5980 },
    { country: "مصر", value: 3020 },
    { country: "الإمارات", value: 820 },
  ],
  he: [
    { country: "ישראל", value: 5980 },
    { country: "ארצות הברית", value: 3020 },
    { country: "בריטניה", value: 820 },
  ],
};

const RTL_TEMPLATES: { slug: string; label: string }[] = [
  { slug: "dashboard", label: "Home Dashboard" },
  { slug: "calendar", label: "Calendar" },
  { slug: "ai-chat", label: "AI Chat" },
  { slug: "project-board", label: "Project Board" },
  { slug: "multi-agent-chat", label: "Multi-agent Chat" },
  { slug: "finance", label: "Finance" },
  { slug: "marketing", label: "Marketing" },
  { slug: "hr", label: "HR Management" },
  { slug: "medical-profile", label: "Medical Profile" },
  { slug: "ai-profile", label: "AI Profile" },
  { slug: "ai-image-generation", label: "AI Image Generation" },
];

function useRtlTranslate(lang: RtlLang) {
  return useCallback(
    (text: string) => (lang === "en" ? text : RTL_COPY[lang][text] ?? text),
    [lang],
  );
}

function RtlLangSwitcher({
  lang,
  onChange,
}: {
  lang: RtlLang;
  onChange: (lang: RtlLang) => void;
}) {
  return (
    <SegmentedControl
      aria-label="Example language"
      selectedKeys={[lang]}
      onSelectionChange={(keys) => {
        const [key] = keys;
        if (key === "ar" || key === "he" || key === "en") onChange(key);
      }}
    >
      <SegmentedControlItem id="ar">Arabic</SegmentedControlItem>
      <SegmentedControlItem id="he">Hebrew</SegmentedControlItem>
      <SegmentedControlItem id="en">English</SegmentedControlItem>
    </SegmentedControl>
  );
}

function ProLogoMark() {
  return (
    <span className="relative block size-10" aria-hidden>
      <img
        src="/brand/boardui_pro.png"
        alt=""
        className="theme-logo-light absolute inset-0 size-10 rounded-[10px] object-contain"
      />
      <img
        src="/brand/boardui_pro_dark.png"
        alt=""
        className="theme-logo-dark absolute inset-0 size-10 rounded-[10px] object-contain"
      />
    </span>
  );
}

function RtlLoginCard({ lang }: { lang: RtlLang }) {
  const translate = useRtlTranslate(lang);
  return (
    <DirectionProvider locale={RTL_LOCALES[lang]}>
      <TemplateCopyProvider translate={translate}>
        <AuthCard
          centered
          headingLevel={2}
          title="Sign in to BoardUI Pro"
          description="Your license unlocks every Pro component and template."
          layout="grid"
          providers={["google", "github", "figma"]}
          logo={<ProLogoMark />}
          className="max-w-none"
        />
      </TemplateCopyProvider>
    </DirectionProvider>
  );
}

function SettingsCard({ t }: { t: (text: string) => string }) {
  const [tab, setTab] = useState<"profile" | "security">("profile");
  const [frequency, setFrequency] = useState("daily");
  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-xs sm:p-8 dark:bg-background-secondary-default">
      <Tabs
        selectedKey={tab}
        onSelectionChange={(key) => {
          if (key === "profile" || key === "security") setTab(key);
        }}
      >
        <TabList aria-label={t("Edit your account preferences")}>
          <Tab id="profile">{t("Profile")}</Tab>
          <Tab id="security">{t("Security")}</Tab>
        </TabList>
        <TabPanel id="profile" className="flex flex-col gap-5 pt-5">
          <SettingsBody t={t} frequency={frequency} setFrequency={setFrequency} heading={t("Edit your account preferences")} />
        </TabPanel>
        <TabPanel id="security" className="flex flex-col gap-5 pt-5">
          <SettingsBody t={t} frequency={frequency} setFrequency={setFrequency} heading={t("Verification code")} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

function SettingsBody({
  t,
  frequency,
  setFrequency,
  heading,
}: {
  t: (text: string) => string;
  frequency: string;
  setFrequency: (value: string) => void;
  heading: string;
}) {
  return (
    <>
      <h3 className="text-title-2-medium text-text-primary">{heading}</h3>
      <Select
        aria-label={t("Design team")}
        defaultSelectedKey="design"
        className="w-full"
      >
        <SelectItem id="design" textValue={t("Design team")}>
          {t("Design team")}
        </SelectItem>
        <SelectItem id="development" textValue={t("Development team")}>
          {t("Development team")}
        </SelectItem>
      </Select>
      <Button
        variant="secondary"
        className="w-full justify-between"
        trailingIcon={RiArrowDownSLine}
      >
        {t("Account options")}
      </Button>
      <SegmentedControl
        aria-label={t("Edit your account preferences")}
        selectedKeys={[frequency]}
        onSelectionChange={(keys) => {
          const [key] = keys;
          if (typeof key === "string") setFrequency(key);
        }}
      >
        <SegmentedControlItem id="daily">{t("Daily")}</SegmentedControlItem>
        <SegmentedControlItem id="weekly">{t("Weekly")}</SegmentedControlItem>
        <SegmentedControlItem id="monthly">{t("Monthly")}</SegmentedControlItem>
        <SegmentedControlItem id="yearly">{t("Yearly")}</SegmentedControlItem>
      </SegmentedControl>
      <Button variant="secondary">{t("Edit your account preferences")}</Button>
      <Slider
        label={t("Volume")}
        defaultValue={40}
        minValue={0}
        maxValue={100}
      />
      <div className="flex flex-col gap-2">
        <span className="text-body-medium text-text-primary">
          {t("Verification code")}
        </span>
        <InputOtp length={6} defaultValue="123456" aria-label={t("Verification code")} />
      </div>
      <div className="flex flex-col gap-3">
        <Switch defaultSelected>{t("Email notifications")}</Switch>
        <Switch defaultSelected>{t("Product updates")}</Switch>
      </div>
    </>
  );
}

function DateRangeCard({ t }: { t: (text: string) => string }) {
  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-xs sm:p-8 dark:bg-background-secondary-default">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-title-2-medium text-text-primary">
          {t("Date range picker")}
        </h3>
        <p className="text-body-regular text-text-secondary">
          {t("Choose a start and end date, or use one of the preset ranges.")}
        </p>
      </div>
      <DateRangePicker aria-label={t("Select date range")} />
      <RadioGroup aria-label={t("Date range picker")} defaultValue="starter" className="flex flex-col gap-2">
        <Radio value="starter">
          <span className="flex flex-col">
            <span className="text-body-medium text-text-primary">
              {t("Starter")}
            </span>
            <span className="text-body-2-regular text-text-tertiary">
              {t("For side projects and experiments.")}
            </span>
          </span>
        </Radio>
        <Radio value="pro">
          <span className="flex flex-col">
            <span className="text-body-medium text-text-primary">Pro</span>
            <span className="text-body-2-regular text-text-tertiary">
              {t("For growing teams that need more.")}
            </span>
          </span>
        </Radio>
      </RadioGroup>
    </div>
  );
}

function VisitorsCard({ t, lang }: { t: (text: string) => string; lang: RtlLang }) {
  const rows = VISITORS[lang];
  const max = rows[0].value;
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-xs sm:p-8 dark:bg-background-secondary-default">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-title-2-medium text-text-primary">
          {t("Visitors by country")}
        </h3>
        <Chip variant="caption" color="neutral">
          PRO
        </Chip>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-title-2-medium text-text-primary">
          {t("Visitors by country")}
        </p>
        <p className="text-caption-1-medium uppercase text-text-tertiary">
          {t("Visitors")}
        </p>
        {rows.map((row) => (
          <div key={row.country} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-body-medium text-text-primary">
                {row.country}
              </span>
              <span className="text-body-medium text-text-primary tabular-nums">
                {row.value.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  backgroundColor: "var(--color-chart-1)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RtlComponentDemo() {
  const [lang, setLang] = useState<RtlLang>("ar");
  const [englishOpen, setEnglishOpen] = useState(false);
  const translate = useRtlTranslate(lang);
  const t = translate;
  const dir = lang === "en" ? "ltr" : "rtl";
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <RtlLangSwitcher lang={lang} onChange={setLang} />
        <span className="text-caption-1-medium text-text-tertiary">
          {dir === "rtl" ? "Right to left" : "Left to right"}
        </span>
      </div>
      <DirectionProvider locale={RTL_LOCALES[lang]}>
        <TemplateCopyProvider translate={translate}>
          <div
            dir={dir}
            lang={RTL_LOCALES[lang]}
            className="contents font-sans [&_*]:tracking-normal"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <RtlLoginCard lang={lang} />
              <SettingsCard t={t} />
              <DateRangeCard t={t} />
              <VisitorsCard t={t} lang={lang} />
            </div>
            <p className="text-body-regular text-text-secondary">
              {t("Manage your account and preferences in one place.")}{" "}
              <bdi dir="ltr">sara@example.com</bdi>
            </p>
            <div>
              <Button
                variant="secondary"
                aria-expanded={englishOpen}
                onClick={() => setEnglishOpen((open) => !open)}
              >
                English support
              </Button>
            </div>
            {englishOpen ? (
              <div dir="ltr" lang="en-US">
                <RtlLoginCard lang="en" />
              </div>
            ) : null}
          </div>
        </TemplateCopyProvider>
      </DirectionProvider>
    </div>
  );
}

export function RtlTemplateDemo() {
  const [lang, setLang] = useState<RtlLang>("ar");
  const [template, setTemplate] = useState("dashboard");
  const dir = lang === "en" ? "ltr" : "rtl";
  const selected = RTL_TEMPLATES.find((item) => item.slug === template) ?? RTL_TEMPLATES[0];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <RtlLangSwitcher lang={lang} onChange={setLang} />
        <span className="text-caption-1-medium text-text-tertiary">
          {dir === "rtl" ? "Right to left" : "Left to right"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label="Template"
          selectedKey={template}
          onSelectionChange={(key) => {
            if (typeof key === "string") setTemplate(key);
          }}
          className="w-[240px]"
        >
          {RTL_TEMPLATES.map((item) => (
            <SelectItem key={item.slug} id={item.slug} textValue={item.label}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Button variant="secondary">Desktop</Button>
      </div>
      <div className="flex justify-center overflow-hidden rounded-3xl border border-border-button-default">
        <div className="h-[650px] w-full max-w-full">
          <iframe
            title={selected.label}
            src={`/templates/${selected.slug}?locale=${RTL_LOCALES[lang]}`}
            className="size-full border-0 bg-background-full"
          />
        </div>
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        Chat Starter has no template route on this site yet, so it is not in
        the list. Template pages are English-only for now; the switcher flips
        the surrounding layout, not the embedded template copy.
      </p>
    </div>
  );
}

const PROVIDER_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";
import { TemplateCopyProvider } from "@/components/foundations/template-copy/template-copy";
import { AuthCard } from "@/components/application/auth/auth-card";

// Supply translate from your application's Arabic message catalog.
export function Example({ translate }: { translate: (text: string) => string }) {
  return (
    <DirectionProvider locale="ar">
      <TemplateCopyProvider translate={translate}>
        <AuthCard
          centered
          headingLevel={2}
          title="Sign in to BoardUI Pro"
          description="Your license unlocks every Pro component and template."
          layout="grid"
          providers={["google", "github", "figma"]}
        />
      </TemplateCopyProvider>
    </DirectionProvider>
  );
}`;

export function RtlProviderDemo() {
  const [lang, setLang] = useState<RtlLang>("ar");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const dir = lang === "en" ? "ltr" : "rtl";
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          aria-label="Preview or code"
          selectedKeys={[view]}
          onSelectionChange={(keys) => {
            const [key] = keys;
            if (key === "preview" || key === "code") setView(key);
          }}
        >
          <SegmentedControlItem id="preview">Preview</SegmentedControlItem>
          <SegmentedControlItem id="code">Code</SegmentedControlItem>
        </SegmentedControl>
        <div className="flex items-center gap-3">
          <RtlLangSwitcher lang={lang} onChange={setLang} />
          <span className="text-caption-1-medium text-text-tertiary">
            {dir === "rtl" ? "Right to left" : "Left to right"}
          </span>
        </div>
      </div>
      {view === "preview" ? (
        <div
          dir={dir}
          lang={RTL_LOCALES[lang]}
          className="contents font-sans [&_*]:tracking-normal"
        >
          <RtlLoginCard lang={lang} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard.writeText(PROVIDER_CODE);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied" : "Copy code"}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
            {PROVIDER_CODE}
          </pre>
        </div>
      )}
    </div>
  );
}
