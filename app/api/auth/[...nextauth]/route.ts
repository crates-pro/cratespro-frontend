import { handlers } from "@/app/auth"
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getProxyConfig, disableProxy } from "@/proxy-config"
import { HttpsProxyAgent } from "https-proxy-agent"

const TIMEOUT_DURATION = 60000;

// 扩展 RequestInit 类型以包含 Node.js 特定选项
interface ExtendedRequestInit extends RequestInit {
    agent?: HttpsProxyAgent;
    timeout?: number;
}

export async function GET(request: NextRequest): Promise<Response> {
    try {
        const { isEnabled, httpsAgent } = getProxyConfig();
        const nextauthUrl = process.env.NEXTAUTH_URL || '';

        // 检查是否是回调请求
        if (request.url.includes('/api/auth/callback')) {
            console.log('Callback request detected:', request.url);

            // 处理请求
            const response = await handlers.GET(request);

            // 如果是成功的回调（通常是 302 重定向）
            if (response instanceof Response && response.status === 302) {
                const location = response.headers.get('location');

                // 检查重定向 URL 是否匹配 NEXTAUTH_URL
                if (location && (
                    location === nextauthUrl ||
                    location.startsWith(nextauthUrl + '/') ||
                    location === '/' ||
                    !location.includes('/api/auth')
                )) {
                    console.log('Redirecting to app URL, disabling proxy:', location);
                    // 在响应发送后禁用代理
                    setTimeout(() => {
                        disableProxy();
                    }, 100);
                }
            }

            return response instanceof Response ? response : NextResponse.json(response);
        }

        // 处理其他认证请求
        if (isEnabled && request.url.includes('/api/auth')) {
            console.log('Auth request with proxy:', request.url);
            const originalFetch = global.fetch;

            global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
                const inputStr = typeof input === 'string' ? input : input.toString();

                // 只对 GitHub OAuth 相关 URL 使用代理
                if (inputStr.includes('github.com/login/oauth') ||
                    inputStr.includes('api.github.com/user')) {

                    console.log('Using proxy for fetch request:', inputStr);
                    const extendedInit: ExtendedRequestInit = {
                        ...init,
                        agent: httpsAgent,
                        timeout: TIMEOUT_DURATION,
                    };
                    return originalFetch(input, extendedInit);
                } else {
                    // 其他请求不使用代理
                    return originalFetch(input, init);
                }
            };

            try {
                const response = await handlers.GET(request);
                return response instanceof Response ? response : NextResponse.json(response);
            } finally {
                // 请求完成后恢复原始的 fetch
                global.fetch = originalFetch;
            }
        } else {
            // 非认证请求或代理未启用
            const response = await handlers.GET(request);
            return response instanceof Response ? response : NextResponse.json(response);
        }
    } catch (error) {
        console.error('Auth GET Error:', error);
        return NextResponse.json(
            {
                error: 'Authentication error',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const { isEnabled, httpsAgent } = getProxyConfig();
        const nextauthUrl = process.env.NEXTAUTH_URL || '';

        // 检查是否是回调请求
        if (request.url.includes('/api/auth/callback')) {
            console.log('Callback POST request detected:', request.url);

            // 处理请求
            const response = await handlers.POST(request);

            // 如果是成功的回调（通常是 302 重定向）
            if (response instanceof Response && response.status === 302) {
                const location = response.headers.get('location');

                // 检查重定向 URL 是否匹配 NEXTAUTH_URL
                if (location && (
                    location === nextauthUrl ||
                    location.startsWith(nextauthUrl + '/') ||
                    location === '/' ||
                    !location.includes('/api/auth')
                )) {
                    console.log('POST: Redirecting to app URL, disabling proxy:', location);
                    // 在响应发送后禁用代理
                    setTimeout(() => {
                        disableProxy();
                    }, 100);
                }
            }

            return response instanceof Response ? response : NextResponse.json(response);
        }

        // 处理其他认证请求
        if (isEnabled && request.url.includes('/api/auth')) {
            console.log('Auth POST request with proxy:', request.url);
            const originalFetch = global.fetch;

            global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
                const inputStr = typeof input === 'string' ? input : input.toString();

                // 只对 GitHub OAuth 相关 URL 使用代理
                if (inputStr.includes('github.com/login/oauth') ||
                    inputStr.includes('api.github.com/user')) {

                    console.log('Using proxy for POST fetch request:', inputStr);
                    const extendedInit: ExtendedRequestInit = {
                        ...init,
                        agent: httpsAgent,
                        timeout: TIMEOUT_DURATION,
                    };
                    return originalFetch(input, extendedInit);
                } else {
                    // 其他请求不使用代理
                    return originalFetch(input, init);
                }
            };

            try {
                const response = await handlers.POST(request);
                return response instanceof Response ? response : NextResponse.json(response);
            } finally {
                // 请求完成后恢复原始的 fetch
                global.fetch = originalFetch;
            }
        } else {
            // 非认证请求或代理未启用
            const response = await handlers.POST(request);
            return response instanceof Response ? response : NextResponse.json(response);
        }
    } catch (error) {
        console.error('Auth POST Error:', error);
        return NextResponse.json(
            {
                error: 'Authentication error',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}