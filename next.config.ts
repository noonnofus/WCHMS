import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.cache = false;
        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com`,
            },
        ],
    },
};

module.exports = nextConfig;
