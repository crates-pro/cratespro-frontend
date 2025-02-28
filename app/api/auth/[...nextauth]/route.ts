import { handlers } from "@/app/auth"
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getProxyConfig } from "@/proxy-config"

const TIMEOUT_DURATION = 60000;

// 定义超时 Promise 的类型
type TimeoutPromise = Promise<never>

export async function GET(request: NextRequest): Promise<Response> {
    try {
        const { isEnabled } = getProxyConfig();

        if (isEnabled) {
            // 使用超时机制
            const timeoutPromise: TimeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_DURATION)
            );
            const response = await Promise.race([handlers.GET(request), timeoutPromise]);
            return response instanceof Response ? response : NextResponse.json(response);
        } else {
            // 不使用超时机制
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