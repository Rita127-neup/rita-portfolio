import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Publications and Research are one page now, so each study is listed once.
      { source: "/publications", destination: "/research", permanent: false },
    ];
  },
};

export default nextConfig;
