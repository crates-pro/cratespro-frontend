import { handlers } from "@/app/auth"
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getProxyConfig } from "@/proxy-config"
import { HttpsProxyAgent } from "https-proxy-agent"

const TIMEOUT_DURATION = 60000;

// 扩展 RequestInit 类型以包含 Node.js 特定选项
interface ExtendedRequestInit extends RequestInit {
    agent?: HttpsProxyAgent;
    timeout?: number;
}

// 定义超时 Promise 的类型
type TimeoutPromise = Promise<never>

export async function GET(request: NextRequest): Promise<Response> {
    try {
        const { isEnabled, httpsAgent } = getProxyConfig();

        // 只在认证请求时使用代理
        if (isEnabled && request.url.includes('/api/auth')) {
            console.log('originalFetch!!!!!!!!!!:', global.fetch);
            const originalFetch = global.fetch;
            global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
                const extendedInit: ExtendedRequestInit = {
                    ...init,
                    agent: httpsAgent,
                    timeout: TIMEOUT_DURATION,
                };
                return originalFetch(input, extendedInit);
            };

            try {
                const response = await handlers.GET(request);
                return response instanceof Response ? response : NextResponse.json(response);
            } finally {
                // 请求完成后恢复原始的 fetch
                global.fetch = originalFetch;
            }
        } else {
            // 非认证请求使用普通 fetch
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
        const { isEnabled } = getProxyConfig();

        if (isEnabled) {
            // 使用超时机制
            const timeoutPromise: TimeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_DURATION)
            );
            const response = await Promise.race([handlers.POST(request), timeoutPromise]);
            return response instanceof Response ? response : NextResponse.json(response);
        } else {
            // 不使用超时机制
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