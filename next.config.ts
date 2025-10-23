import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "via.placehold.net",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["next/font/google"],
  },
};

export default nextConfig;
