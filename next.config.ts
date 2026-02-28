import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  i18n: {
    locales: ["en", "zh", "zh_HK"],
    defaultLocale: "en",
  },
};

export default nextConfig;
