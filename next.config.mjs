/** @type {import('next').NextConfig} */

// next.config.mjs



export default {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/newpage',
                permanent: true, // 301 redirection
            },
        ];
    },
};

