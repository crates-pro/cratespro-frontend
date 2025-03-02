import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { setupGlobalFetch } from "@/proxy-config"

// 设置全局 fetch 拦截器（但不启用代理）
setupGlobalFetch();

// 打印环境变量（开发环境调试用）
console.log('Environment Config:', {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    PROXY_ENABLED: !!process.env.HTTPS_PROXY,
    PROXY_URL: process.env.HTTPS_PROXY || 'Not configured'
});

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
    throw new Error('Missing GITHUB_ID or GITHUB_SECRET environment variable')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    trustHost: true,
    debug: true,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('signIn!!!!!!!!!!:', user, account, profile, email, credentials);
            console.log('Sign in callback executed');
            return true;
        },
        async redirect({ url, baseUrl }) {

            console.log('redirect!!!!!!!!!!:', url, baseUrl);
            return baseUrl;
        },
        async session({ session, user, token }) {
            console.log('session!!!!!!!!!!:', session, user, token);
            return session;
        },
        async jwt({ token, user, account, profile }) {
            console.log('jwt!!!!!!!!!!:', token, user, account, profile);
            return token;
        }
    },
    events: {
        async signIn(message) {
            console.log('signIn event:', message);
        },
        async signOut(message) {
            console.log('signOut:', message);
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    }
})