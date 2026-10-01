import type { NextConfig } from "next";
import { API_URL } from "./src/infrastructure/config/env";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${API_URL}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
