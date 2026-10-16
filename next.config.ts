import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: { remotePatterns: [], minimumCacheTTL: 60 * 60 * 24 * 7 },
  poweredByHeader: false,
  // Baseline security headers (Cloudflare terminates TLS in front of Railway; these pass through to the browser).
  async headers() {
    // Uploads and static artwork change rarely and have unique names; a month at the browser and at Cloudflare's edge
    // keeps repeat views and Google's image fetches off the origin (Payload's own default is four hours).
    const longCache = { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" };
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/api/media/file/:path*", headers: [longCache] },
      { source: "/api/documents/file/:path*", headers: [longCache] },
      { source: "/images/:path*", headers: [longCache] },
      { source: "/brand/:path*", headers: [longCache] },
      // The home hero background is the LCP image on phones; announcing it in the response headers (and via
      // Cloudflare Early Hints when enabled) starts the download before the HTML is parsed.
      { source: "/", headers: [{ key: "Link", value: '</images/bg/hero-shards.webp>; rel=preload; as=image; imagesrcset="/images/bg/hero-shards-768.webp 768w, /images/bg/hero-shards-1280.webp 1280w, /images/bg/hero-shards.webp 1920w"; imagesizes="100vw"' }] },
    ];
  },
  // Canonical host: send www.<domain> to the apex so analytics and search see one URL.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.niagaraequipment.com" }], destination: "https://niagaraequipment.com/:path*", permanent: true }];
  },
};

export default withPayload(nextConfig);
