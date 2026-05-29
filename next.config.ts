import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  eslint: {
    // Lint is run explicitly via `npm run lint`; keep build resilient.
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
