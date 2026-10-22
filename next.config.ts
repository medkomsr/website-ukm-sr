import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.12"],
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // These directives do not depend on Next's inline rendering scripts.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
          },
          // Stage source restrictions before enforcement; Studio and media need host verification.
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://i.ytimg.com",
              "font-src 'self' data:",
              "media-src 'self' blob: https://cdn.sanity.io",
              "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://www.youtube.com https://www.youtube-nocookie.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.sanity.io",
              "worker-src 'self' blob:",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  cacheComponents: true,
  // Preserve this existing app's prefetch behavior while upgrading Cache Components.
  partialPrefetching: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/**`,
      },
    ],
  },
};

export default nextConfig;
