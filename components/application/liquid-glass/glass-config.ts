"use client";
import { createContext, useContext } from "react";
import { useThemeMode } from "@/components/application/theme/theme-toggle";

export type GlassConfig = { frost: number; saturate: number; refraction: number; depth: number; splay: number; dispersion: number; tintColor: string; tintOpacity: number; sheenColor: string; sheenOpacity: number; sheenAngle: number; rimWidth: number; rimAngle: number; rimOpacity: number; rimHighlight: string; rimHighlightOpacity: number; rimShadow: string; rimShadowOpacity: number; rimBounce: string; rimBounceOpacity: number; shadowColor: string; shadowOpacity: number; shadowBlur: number; shadowY: number; hoverMs: number; hoverTintOpacity: number; hoverSheenOpacity: number; hoverRimOpacity: number; hoverLift: number; hoverScale: number; hoverShadowOpacity: number; hoverShadowBlur: number; hoverShadowY: number; };

export const GLASS_DEFAULTS: GlassConfig = { frost: 6, saturate: 160, refraction: 1, depth: 1, splay: 1.09, dispersion: 1.15, tintColor: "#ffffff", tintOpacity: 0.06, sheenColor: "#ffffff", sheenOpacity: 0.5, sheenAngle: 155, rimWidth: 0.3, rimAngle: 134, rimOpacity: 1, rimHighlight: "#000000", rimHighlightOpacity: 0.1, rimShadow: "#bababa", rimShadowOpacity: 0.38, rimBounce: "#ffffff", rimBounceOpacity: 0.48, shadowColor: "#000000", shadowOpacity: 0.045, shadowBlur: 13, shadowY: -2, hoverMs: 220, hoverTintOpacity: 0.28, hoverSheenOpacity: 0.68, hoverRimOpacity: 1, hoverLift: -2, hoverScale: 1, hoverShadowOpacity: 0.06, hoverShadowBlur: 20, hoverShadowY: 2 };

export const GLASS_DARK_DEFAULTS: GlassConfig = { ...GLASS_DEFAULTS, sheenOpacity: 0.12, sheenAngle: 150, rimOpacity: 0.67, rimBounceOpacity: 0.31 };

export function rgba(hex: string, opacity: number): string {
  const digits = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim())?.[1];
  if (!digits) return `rgb(0 0 0 / ${opacity})`;
  const full = digits.length === 3 ? digits.split("").map((digit) => digit + digit).join("") : digits;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgb(${r} ${g} ${b} / ${opacity})`;
}

export function useGlassConfig(): GlassConfig {
  return useThemeMode() === "dark" ? GLASS_DARK_DEFAULTS : GLASS_DEFAULTS;
}

export const OffstageNearContext = createContext<boolean>(true);

export function useOffstageNear(): boolean {
  return useContext(OffstageNearContext);
}
