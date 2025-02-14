/** @type {import('next').NextConfig} */

// next.config.mjs
export default {
    output: "standalone",
    reactStrictMode: true,
    images: {
        domains: ['avatars.githubusercontent.com'], // 允许 GitHub 头像
    },
};