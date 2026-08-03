import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keystatic's local reader (createReader) reads content/ off disk at runtime.
  // Next's file tracer can't see these dynamic reads, so without this the
  // content/ files are dropped from the serverless function bundle on Vercel —
  // reads succeed locally but return null in production.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
