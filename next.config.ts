import type { NextConfig } from "next";

const API_URL = process.env.API_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Ponte same-origin: cookies first-party, sem CORS e sem
      // necessidade de route handlers em app/api/**
      { source: "/api/auth/:path*", destination: `${API_URL}/api/auth/:path*` },
      { source: "/api/upload/:path*", destination: `${API_URL}/api/upload/:path*` },
      // Avatares servidos pela API (usado pelo next/image e pela UI)
      { source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Não quebra inline scripts do Next (diferente de uma CSP completa)
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
      // Avatares com nomes imutáveis (UUID) => cache agressivo seguro
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
