import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  // Static export: this sub-project ships only the Auralis landing page
  // (no API routes / dashboard), compiled once and served as static files
  // under /normal-mode on the main site.
  output: "export",
  // Served from a subpath on the host site, not the domain root — without
  // this, every /_next/... asset URL would be root-absolute and 404.
  basePath: "/normal-mode",
  images: {
    unoptimized: true,
  },
  // Pin the workspace root to this folder — the parent repo has its own
  // package-lock.json, which Next.js would otherwise mistake for the root.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
