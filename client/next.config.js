/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["placehold.co", "localhost", "127.0.0.1", "quantri-zbeauty.tranhuuhiep2004.id.vn"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "quantri-zbeauty.tranhuuhiep2004.id.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "quantri-zbeauty.tranhuuhiep2004.id.vn",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig; 