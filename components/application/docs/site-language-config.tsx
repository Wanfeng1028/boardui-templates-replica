import { useEffect, useState } from "react";
import type { ReactNode } from "react";

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

function starPoints(cx: number, cy: number, r: number): string {
  const inner = r * 0.382;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : inner;
    const angle = ((-90 + i * 36) * Math.PI) / 180;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

export function flagFor(locale: SiteLocale): ReactNode {
  if (locale === "en") {
    const stripes: ReactNode[] = [];
    for (let i = 0; i < 13; i++) {
      stripes.push(
        <rect
          key={i}
          x={0}
          y={(i * 12) / 13}
          width={18}
          height={12 / 13}
          fill={i % 2 === 0 ? "#B22234" : "#fff"}
        />,
      );
    }
    const dots: ReactNode[] = [];
    for (let row = 0; row < 9; row++) {
      const y = ((row + 0.5) * 6.46) / 9;
      const xs =
        row % 2 === 0 ? [0.6, 1.8, 3, 4.2, 5.4, 6.6] : [1.2, 2.4, 3.6, 4.8, 6];
      for (const x of xs) {
        dots.push(
          <circle key={`${row}-${x}`} cx={x} cy={y} r={0.5} fill="#fff" />,
        );
      }
    }
    return (
      <svg
        width={18}
        height={12}
        viewBox="0 0 18 12"
        className="h-3 w-[18px] shrink-0 rounded-[2px]"
        aria-hidden
      >
        {stripes}
        <rect x={0} y={0} width={7.2} height={6.46} fill="#3C3B6E" />
        {dots}
      </svg>
    );
  }
  if (locale === "ar") {
    return (
      <svg
        width={18}
        height={12}
        viewBox="0 0 18 12"
        className="h-3 w-[18px] shrink-0 rounded-[2px]"
        aria-hidden
      >
        <rect x={0} y={0} width={18} height={12} fill="#006C35" />
        <rect x={0} y={5} width={18} height={1.5} fill="#fff" />
        <rect x={4} y={8} width={10} height={1} fill="#fff" />
      </svg>
    );
  }
  if (locale === "ja") {
    return (
      <svg
        width={18}
        height={12}
        viewBox="0 0 18 12"
        className="h-3 w-[18px] shrink-0 rounded-[2px]"
        aria-hidden
      >
        <rect x={0} y={0} width={18} height={12} fill="#fff" />
        <circle cx={9} cy={6} r={3.6} fill="#BC002D" />
      </svg>
    );
  }
  if (locale === "pt-br") {
    return (
      <svg
        width={18}
        height={12}
        viewBox="0 0 18 12"
        className="h-3 w-[18px] shrink-0 rounded-[2px]"
        aria-hidden
      >
        <rect x={0} y={0} width={18} height={12} fill="#009739" />
        <polygon points="9,1 17,6 9,11 1,6" fill="#FEDF00" />
        <circle cx={9} cy={6} r={2.2} fill="#002776" />
      </svg>
    );
  }
  return (
    <svg
      width={18}
      height={12}
      viewBox="0 0 18 12"
      className="h-3 w-[18px] shrink-0 rounded-[2px]"
      aria-hidden
    >
      <rect x={0} y={0} width={18} height={12} fill="#DE2910" />
      <polygon points={starPoints(3.2, 3, 1.6)} fill="#FFDE00" />
      <polygon points={starPoints(6.5, 1.8, 0.6)} fill="#FFDE00" />
      <polygon points={starPoints(7.8, 3.2, 0.6)} fill="#FFDE00" />
      <polygon points={starPoints(7.8, 5.2, 0.6)} fill="#FFDE00" />
      <polygon points={starPoints(6.5, 6.4, 0.6)} fill="#FFDE00" />
    </svg>
  );
}

export function localeFromLanguageTag(tag: string): SiteLocale {
  const primary = tag.split("-")[0].toLowerCase();
  switch (primary) {
    case "zh":
      return "zh-hans";
    case "pt":
      return "pt-br";
    case "ar":
      return "ar";
    case "ja":
      return "ja";
    default:
      return "en";
  }
}

export function localeFromPathname(pathname: string): SiteLocale {
  const first = pathname.replace(/^\//, "").split("/")[0];
  if (
    first === "ar" ||
    first === "ja" ||
    first === "pt-br" ||
    first === "zh-hans"
  ) {
    return first;
  }
  return "en";
}

export function unlocalizedPath(pathname: string): string {
  const prefixes: string[] = ["/ar", "/ja", "/pt-br", "/zh-hans"];
  for (const prefix of prefixes) {
    if (pathname === prefix) return "/";
    if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length);
  }
  return pathname;
}

export function localizedHref(pathname: string, locale: SiteLocale): string {
  const base = unlocalizedPath(pathname);
  const prefix = LOCALES[locale].prefix;
  if (base === "/") return prefix === "" ? "/" : prefix;
  return prefix + base;
}

export function useSiteLanguageAudience(): boolean {
  const [audience, setAudience] = useState<boolean>(false);

  useEffect(() => {
    const compute = (): void => {
      const tags =
        typeof navigator.languages !== "undefined" &&
        navigator.languages.length > 0
          ? navigator.languages
          : [navigator.language];
      setAudience(tags.some((tag) => localeFromLanguageTag(tag) !== "en"));
    };
    compute();
    window.addEventListener("languagechange", compute);
    return () => {
      window.removeEventListener("languagechange", compute);
    };
  }, []);

  return audience;
}

export function setSiteLanguageCookie(locale: SiteLocale): void {
  let cookie = `boardui-language=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  if (typeof location !== "undefined" && location.protocol === "https:") {
    cookie += "; Secure";
  }
  document.cookie = cookie;
}
