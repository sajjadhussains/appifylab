import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5001',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'appifylab-o3i9.onrender.com',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
