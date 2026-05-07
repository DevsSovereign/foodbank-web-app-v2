import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foodbank-asset.s3.amazonaws.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "foodbank-asset.s3.us-east-1.amazonaws.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "jy0s2swu0k.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
