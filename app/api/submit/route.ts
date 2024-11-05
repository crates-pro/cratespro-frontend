import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const apiUrl = process.env.API_URL; // 读取环境变量，获取后端服务的基础 URL
    const body = await request.json(); // 解析请求体

    try {
        const response = await fetch(`${apiUrl}/submit`, { //向后端发送服务请求
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), // 将请求体发送到后端
        });
        //请求失败直接返回
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to submit data' }, { status: 500 });
        }
        //解析成功的响应
        const result = await response.json();
        return NextResponse.json({ message: 'Submission successful', data: result });
    } catch {
        return NextResponse.json({ error: 'An error occurred while submitting data.' }, { status: 500 });
    }
}