import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { DirectionProvider } from "@/components/foundations/direction/direction";

import "@/styles/globals.css";

// Inter, loaded from files bundled in the repo (app/fonts/inter/) via
// next/font/local — no network fetch, so the sandboxed build works. The
// original loads Inter + JetBrains Mono via next/font/google; the OTFs
// here are the full Inter family (2,852 glyphs each, weights 400/500/600/
// 700 — the only weights the type ramp uses), copied from the machine's
// installed fonts. JetBrains Mono is NOT available anywhere on this
// machine, so --font-mono-source stays a system stack (see theme.css).
const inter = localFont({
  src: [
    { path: "./fonts/inter/Inter-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/inter/Inter-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/inter/Inter-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/inter/Inter-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.boardui.com"),
  title: {
    template: "%s | BoardUI",
    default: "BoardUI - React Design System for Dashboards",
  },
  description:
    "Build agentic products and data-rich dashboards with 103 React components (19 chart cards), 10 Pro templates, Tailwind CSS, and editable source code.",
  openGraph: {
    title: "BoardUI - React Design System for Dashboards",
    description:
      "Build agentic products and data-rich dashboards with 103 React components (19 chart cards), 10 Pro templates, Tailwind CSS, and editable source code.",
    type: "website",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "BoardUI React design system components and dashboard templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoardUI - React Design System for Dashboards",
    description:
      "Build agentic products and data-rich dashboards with 103 React components (19 chart cards), 10 Pro templates, Tailwind CSS, and editable source code.",
    images: ["/og_image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-US"
      dir="ltr"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Applies the stored theme before first paint, so a dark-mode visitor
            never sees a light flash. The key matches the theme toggle. */}
        <Script id="boardui-theme" strategy="beforeInteractive">
          {`(function(){try{var dark=localStorage.getItem("boardui:theme")==="dark";document.documentElement.classList.toggle("dark",dark)}catch(e){document.documentElement.classList.remove("dark")}})();`}
        </Script>
        <DirectionProvider locale="en-US">{children}</DirectionProvider>
      </body>
    </html>
  );
}
