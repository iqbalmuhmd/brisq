import type { NextConfig } from "next";

const gatewayUrl = process.env.GATEWAY_URL;

if (!gatewayUrl) {
  throw new Error("GATEWAY_URL is not set.");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${gatewayUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
