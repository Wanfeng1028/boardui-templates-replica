import type { Metadata } from "next";
import Script from "next/script";
import { DirectionProvider } from "@/components/foundations/direction/direction";

import "@/styles/globals.css";

// REPLICA NOTE: the upstream starter loads Inter + JetBrains Mono via
// next/font/google, which requires fetching Google Fonts at build time.
// This sandboxed build cannot reach Google Fonts (Turbopack fails with
// "Can't resolve '@vercel/turbopack-next/internal/font/google/font'"),
// so the fonts are plain system stacks defined as --font-inter /
// --font-mono-source in styles/theme.css instead. Visual difference:
// Inter is replaced by the system sans font; metrics are the same.

export const metadata: Metadata = {
  title: "Chat",
  description: "A streaming AI chat on your own model key, built with BoardUI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-US"
      dir="ltr"
      className="h-full antialiased"
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
