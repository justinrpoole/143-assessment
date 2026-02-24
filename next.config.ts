import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/143-challenge", destination: "/143", permanent: true },
      { source: "/justin", destination: "/about", permanent: true },
      { source: "/organizations", destination: "/corporate", permanent: true },
      { source: "/enterprise", destination: "/corporate", permanent: true },
      { source: "/dashboard", destination: "/portal", permanent: true },
      { source: "/preview-cosmic", destination: "/preview", permanent: true },
    ];
  },
};

export default nextConfig;
