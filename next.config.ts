import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: { remotePatterns: [] },
};

export default withPayload(nextConfig);
