import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    const endpoint = process.env.CRATES_PRO_INTERNAL_HOST;
    const apiUrl = `${endpoint}/api/submitUserinfo`;
    const requestBody = await request.json();



    console.log("Request Body new!:", requestBody);
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 确保发送 JSON
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                requestBody
            }), // 发送 name 字段
        });
        console.log("response:", response);
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to submit data' }, { status: response.status });
        }

        const result = await response.json(); // 确认返回的是 JSON 格式
        console.log("results:", result);
        return NextResponse.json({ message: 'Submission successful', code: 2012, data: result });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'An error occurred while submitting data.' }, { status: 500 });
    }
}