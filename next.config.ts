import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Pin the workspace root to this project so Turbopack never walks up the
  // filesystem looking for a lockfile.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
