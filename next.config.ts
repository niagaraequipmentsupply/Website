import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: { remotePatterns: [] },
  // Canonical host: send www.<domain> to the apex so analytics and search see one URL.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.niagaraequipment.com" }], destination: "https://niagaraequipment.com/:path*", permanent: true }];
  },
};

export default withPayload(nextConfig);
