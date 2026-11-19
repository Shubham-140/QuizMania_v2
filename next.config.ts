import type { NextConfig } from "next";
import { allowedImageHosts } from "./lib/images";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
