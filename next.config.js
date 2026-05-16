/** @type {import('next').NextConfig} */
const isMobileBuild = process.env.NEXT_EXPORT === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isMobileBuild && {
    output: "export",
    trailingSlash: true,
  }),
  images: { unoptimized: true },
};

module.exports = nextConfig;