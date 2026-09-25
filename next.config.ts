import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Journal images: Vercel Blob in production, the local studio folder in development.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    localPatterns: [{ pathname: "/api/media/**", search: "" }],
    qualities: [75],
  },
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
