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
        domains: [
            'avatars.githubusercontent.com',  // GitHub 头像域名
            'github.com',
            'avatar.vercel.sh',
            'githubusercontent.com'
        ],
    },
};