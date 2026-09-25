import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The evidence register was retired; its company context now lives on the About page.
    return [
      { source: "/evidence", destination: "/about", permanent: true },
      // Apex Foundry is now Auctra.
      { source: "/records/foundry", destination: "/records/auctra", permanent: true },
    ];
  },
};

export default nextConfig;
