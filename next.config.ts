import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export has no image-optimization endpoint: /_next/image?...
  // requests 404 on Cloudflare Pages, breaking every next/image asset
  // (e.g. the Get Pro logo). Emit the plain asset URL instead.
  images: {
    unoptimized: true,
  },
  // Pin the workspace root to this project so Turbopack never walks up the
  // filesystem looking for a lockfile.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
