import { NextRequest, NextResponse } from 'next/server';
import { getProxyConfig } from '@/proxy-config';

export async function GET(request: NextRequest) {
    try {
        const url = request.nextUrl.searchParams.get('url');

        if (!url) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        const { isEnabled, httpsAgent } = getProxyConfig();

        const fetchOptions: RequestInit = {};
        if (isEnabled && url.includes('githubusercontent.com')) {
            // 使用 @ts-expect-error 代替 @ts-ignore
            // @ts-expect-error - agent 属性在浏览器端 RequestInit 类型中不存在
            fetchOptions.agent = httpsAgent;
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const headers = new Headers();
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=86400');

        return new NextResponse(buffer, {
            status: 200,
            headers
        });
    } catch (error) {
        console.error('Error proxying image:', error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
} 