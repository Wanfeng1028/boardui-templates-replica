"use client";

import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cx } from "@/utils/cx";
import {
  useGlassConfig,
  rgba,
  useOffstageNear,
  type GlassConfig,
} from "./glass-config";

export const LIQUID_GLASS_RESET =
  "relative z-10 border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent active:border-transparent active:bg-transparent";

export function useLiquidGlassHost(overrides: Partial<GlassConfig>) {
  const config = { ...useGlassConfig(), ...overrides };
  return {
    className: "lg-host group relative",
    style: {
      "--lg-ms": `${config.hoverMs}ms`,
      "--lg-shadow": `0 ${config.shadowY}px ${config.shadowBlur}px ${rgba(config.shadowColor, config.shadowOpacity)}`,
      "--lg-shadow-hover": `0 ${config.hoverShadowY}px ${config.hoverShadowBlur}px ${rgba(config.shadowColor, config.hoverShadowOpacity)}`,
      "--lg-lift": `${config.hoverLift}px`,
      "--lg-scale": config.hoverScale,
    } as CSSProperties,
  };
}

type SurfaceProps = {
  radius?: number | "full";
  interactive?: boolean;
  refract?: boolean;
  className?: string;
} & Partial<GlassConfig>;

export function LiquidGlassSurface({
  radius = 10,
  interactive = false,
  refract = true,
  className,
  ...overrides
}: SurfaceProps) {
  const config = { ...useGlassConfig(), ...overrides };
  const {
    frost,
    saturate,
    refraction,
    depth,
    splay,
    dispersion,
    tintColor,
    tintOpacity,
    sheenColor,
    sheenOpacity,
    sheenAngle,
    rimWidth,
    rimAngle,
    rimOpacity,
    rimHighlight,
    rimHighlightOpacity,
    rimShadow,
    rimShadowOpacity,
    rimBounce,
    rimBounceOpacity,
    hoverMs,
    hoverTintOpacity,
    hoverSheenOpacity,
    hoverRimOpacity,
  } = config;

  const filterId = `lg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const near = useOffstageNear();
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    if (near !== true) return;
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const next = { w: Math.round(r.width), h: Math.round(r.height) };
      setSize(prev =>
        prev.w === next.w && prev.h === next.h ? prev : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

  const radiusPx = radius === "full" ? size.h / 2 : radius;

  const map = useMemo(() => {
    if (!size.w || !size.h) return null;
    const inset = Math.min(4 + 8 * splay, size.h / 2 - 1);
    const blur = Math.max(1, 7 * depth);
    const innerRx = Math.max(0, radiusPx - inset);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.w}" height="${size.h}"><defs><linearGradient id="x" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgb(255,0,0)"/><stop offset="1" stop-color="rgb(0,0,0)"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(0,0,255)"/><stop offset="1" stop-color="rgb(0,0,0)"/></linearGradient></defs><rect width="${size.w}" height="${size.h}" fill="black"/><rect width="${size.w}" height="${size.h}" fill="url(#x)"/><rect width="${size.w}" height="${size.h}" fill="url(#y)" style="mix-blend-mode:screen"/><rect x="${inset}" y="${inset}" width="${size.w - 2 * inset}" height="${size.h - 2 * inset}" rx="${innerRx}" fill="rgb(128,0,128)" style="filter:blur(${blur}px)"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [size.w, size.h, splay, depth, radiusPx]);

  const disp = 56 * refraction;
  const spread = 0.16 * disp * dispersion;

  const backdropStyle: CSSProperties = {
    backdropFilter: `blur(${frost}px) saturate(${saturate}%)`,
    WebkitBackdropFilter: `blur(${frost}px) saturate(${saturate}%)`,
  };

  return (
    <span
      ref={ref}
      aria-hidden
      className={cx("pointer-events-none absolute inset-0", className)}
      style={
        {
          "--lg-ms": `${hoverMs}ms`,
          "--lg-tint": rgba(tintColor, tintOpacity),
          "--lg-tint-hover": rgba(tintColor, hoverTintOpacity),
          "--lg-sheen": sheenOpacity,
          "--lg-sheen-hover": hoverSheenOpacity,
          "--lg-rim-width": `${rimWidth}px`,
          "--lg-rim-angle": `${rimAngle}deg`,
          "--lg-rim-o": rimOpacity,
          "--lg-rim-o-hover": hoverRimOpacity,
          "--lg-rim-hi": rgba(rimHighlight, rimHighlightOpacity),
          "--lg-rim-sh": rgba(rimShadow, rimShadowOpacity),
          "--lg-rim-bounce": rgba(rimBounce, rimBounceOpacity),
          "--lg-rim-dim": rgba(rimHighlight, 0.11 * rimHighlightOpacity),
        } as CSSProperties
      }
    >
      {refract && map && (
        <svg
          aria-hidden
          className="pointer-events-none absolute size-0"
        >
          <filter
            id={filterId}
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={map}
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={disp + spread}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispR"
            />
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="chanR"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={disp}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispG"
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="chanG"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={disp - spread}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispB"
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="chanB"
            />
            <feBlend in="chanR" in2="chanG" mode="screen" result="chanRG" />
            <feBlend in="chanRG" in2="chanB" mode="screen" />
          </filter>
        </svg>
      )}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[inherit]"
        style={backdropStyle}
      />
      {refract && map && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit]"
          style={{ backdropFilter: `url(#${filterId})` }}
        />
      )}
      <span
        aria-hidden
        className={cx(
          "lg-tint absolute inset-0 rounded-[inherit]",
          interactive && "lg-hover",
        )}
      />
      <span
        aria-hidden
        className={cx(
          "lg-sheen absolute inset-0 rounded-[inherit]",
          interactive && "lg-hover",
        )}
        style={{
          background: `linear-gradient(${sheenAngle}deg, ${rgba(sheenColor, 1)} 0%, ${rgba(sheenColor, 0)} 30%, ${rgba(sheenColor, 0)} 68%, ${rgba(sheenColor, 0.32)} 100%)`,
        }}
      />
      <span
        aria-hidden
        className={cx("landing-glass-stroke", interactive && "lg-hover")}
      />
    </span>
  );
}

type ChipProps = {
  children: ReactNode;
  className?: string;
  radius?: number | "full";
  refract?: boolean;
} & Partial<GlassConfig>;

export function LiquidGlassChip({
  children,
  className,
  radius = 10,
  refract = true,
  ...rest
}: ChipProps) {
  const host = useLiquidGlassHost(rest);
  return (
    <span
      className={cx(host.className, "inline-flex rounded-2lg", className)}
      style={host.style}
    >
      <LiquidGlassSurface
        radius={radius}
        refract={refract}
        interactive
        className="rounded-[inherit]"
        {...rest}
      />
      {children}
    </span>
  );
}
