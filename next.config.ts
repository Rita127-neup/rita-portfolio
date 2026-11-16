import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // About is part of the home page now.
      { source: "/about", destination: "/#about", permanent: false },
    ];
  },
};

export default nextConfig;
