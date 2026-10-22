import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 blocks dev assets/HMR for any origin other than localhost, which
  // leaves client-only pages like /keystatic blank when opened via 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  // Keystatic's local reader (createReader) reads content/ off disk at runtime.
  // Next's file tracer can't see these dynamic reads, so without this the
  // content/ files are dropped from the serverless function bundle on Vercel —
  // reads succeed locally but return null in production.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
