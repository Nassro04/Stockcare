import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false, // 307 Temporary Redirect (prevents caching issues during dev)
      },
    ];
  },
};

export default nextConfig;
