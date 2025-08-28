import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/guides",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/guide/:slug",
        permanent: true,
      },
      {
        source: "/guides/:slug",
        destination: "/guide/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
