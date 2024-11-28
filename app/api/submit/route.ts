import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const apiUrl = process.env.API_URL; // 读取环境变量
    const formData = await request.formData(); // 解析请求体

    console.log("Request FormData:", formData);

    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'POST',
            body: formData, // 保持 FormData
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to submit data' }, { status: response.status });
        }

        const result = await response.json(); // 确认返回的是 JSON 格式
        return NextResponse.json({ message: 'Submission successful', result });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'An error occurred while submitting data.' }, { status: 500 });
    }
}