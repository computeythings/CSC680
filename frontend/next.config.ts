import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,
  trailingSlash: true,
  images: { unoptimized: true },
  output: 'export',
   async rewrites() {
        return [
            {
                source: '/api/:path*', // Match any requests to /api/*
                destination: `http://localhost:8000/api/:path*`, // Proxy to your backend server
            },
        ];
    },
};

export default nextConfig;
