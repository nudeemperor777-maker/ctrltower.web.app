import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include the dashboard seed data + state files in the serverless function bundle
  // so fs.readFileSync works on Vercel (which tree-shakes to only traced files).
  outputFileTracingIncludes: {
    "/jarvis": ["./data/dashboard/**/*", "./state/**/*"],
    "/ctrltower": ["./data/dashboard/**/*", "./state/**/*"],
    "/controltower": ["./data/dashboard/**/*", "./state/**/*"],
  },
};

export default nextConfig;
