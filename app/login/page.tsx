"use client";

import { useStarterBase } from "@/components/application/app-shell/app-shell";
import { DocumentTitle } from "@/components/application/app-shell/document-title";

import { AuthCard } from "@/components/application/auth/auth-card";

/** The starter's sign-in screen, reached from the sidebar and from Log out. */
export default function LoginPage() {
  const base = useStarterBase();
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background-full p-6">
      <DocumentTitle />
      <AuthCard switchHref={`${base}/signup`} />
    </main>
  );
}
