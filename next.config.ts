import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import pkg from "./package.json" with { type: "json" };

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable the SW in dev so it doesn't cache while iterating.
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Serwist injects a webpack config; this empty block tells Next the Turbopack
  // dev server is intentional (Serwist is disabled in dev anyway).
  turbopack: {},
  env: { NEXT_PUBLIC_APP_VERSION: pkg.version },
};

export default withSerwist(nextConfig);
