/** @type {import('next').NextConfig} */

// next.config.mjs
export default {
    output: "standalone",
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};