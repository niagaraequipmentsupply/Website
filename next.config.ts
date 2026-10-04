import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: { remotePatterns: [], minimumCacheTTL: 60 * 60 * 24 * 7 },
  poweredByHeader: false,
  // Baseline security headers (Cloudflare terminates TLS in front of Railway; these pass through to the browser).
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  // Canonical host: send www.<domain> to the apex so analytics and search see one URL.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.niagaraequipment.com" }], destination: "https://niagaraequipment.com/:path*", permanent: true }];
  },
};

export default withPayload(nextConfig);
