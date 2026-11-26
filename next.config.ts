import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Demo build: every surface runs on in-memory mock data, so we keep the
  // classic rendering model (no Cache Components) for simplicity.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  devIndicators: false,
  images: {
    qualities: [70, 80, 90],
  },
};

export default nextConfig;
