import type { NextConfig } from "next";

const nextConfig: NextConfig = {};
module.exports = {
  allowedDevOrigins: ["10.249.76.177"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
