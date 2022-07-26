/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["assets.coingecko.com"],
  },
  experimental: { nftTracing: true },
};

module.exports = nextConfig;
