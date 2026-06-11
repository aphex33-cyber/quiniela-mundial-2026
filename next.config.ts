import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix workspace root detection warning
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
