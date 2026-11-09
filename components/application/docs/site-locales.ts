export type SiteLocale = "en" | "ar" | "ja" | "pt-br" | "zh-hans";

export interface LocaleConfig {
  label: string;
  compactLabel: string;
  bcp47: string;
  prefix: string;
  languageLabel: string;
  audienceCountries: string[];
  direction: "ltr" | "rtl";
}

export const LOCALES: Record<SiteLocale, LocaleConfig> = {
  en: {
    label: "English",
    compactLabel: "EN",
    bcp47: "en-US",
    prefix: "",
    languageLabel: "Site language",
    audienceCountries: [],
    direction: "ltr",
  },
  ar: {
    label: "العربية",
    compactLabel: "العربية",
    bcp47: "ar",
    prefix: "/ar",
    languageLabel: "لغة الموقع",
    audienceCountries: ["SA"],
    direction: "rtl",
  },
  ja: {
    label: "日本語",
    compactLabel: "日本語",
    bcp47: "ja-JP",
    prefix: "/ja",
    languageLabel: "サイトの言語",
    audienceCountries: ["JP"],
    direction: "ltr",
  },
  "pt-br": {
    label: "Português (BR)",
    compactLabel: "PT-BR",
    bcp47: "pt-BR",
    prefix: "/pt-br",
    languageLabel: "Idioma do site",
    audienceCountries: ["BR"],
    direction: "ltr",
  },
  "zh-hans": {
    label: "简体中文",
    compactLabel: "简体中文",
    bcp47: "zh-Hans",
    prefix: "/zh-hans",
    languageLabel: "网站语言",
    audienceCountries: ["CN", "HK", "TW", "MO"],
    direction: "ltr",
  },
};

export const LOCALE_IDS: SiteLocale[] = ["en", "ar", "ja", "pt-br", "zh-hans"];

