/** @type {import('next').NextConfig} */

// next.config.mjs

export default {

    async redirects() {
        return [
            {
                source: '/',
                destination: '/programs',
                permanent: true, // 301 redirection
            },
        ];
    },
};
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//         ppr: 'incremental',
//     },
// }

// module.exports = nextConfig