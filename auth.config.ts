import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    trustHost: true,
    providers: [],
} satisfies NextAuthConfig;