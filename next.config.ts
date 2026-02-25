import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["web-push"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/143-challenge", destination: "/143", permanent: true },
      { source: "/justin", destination: "/about", permanent: true },
      { source: "/corporate", destination: "/organizations", permanent: true },
      { source: "/dashboard", destination: "/portal", permanent: true },
      { source: "/preview-cosmic", destination: "/preview", permanent: true },
    ];
  },
};

export default nextConfig;
