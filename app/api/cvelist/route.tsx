import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // 发送 HTTP 请求获取外部数据
    console.log(req);
    const externalApiUrl = 'http://210.28.134.203:6888/api/cvelist'; // 替换为你的外部 API URL
    const externalRes = await fetch(externalApiUrl);
    if (!externalRes.ok) {
      throw new Error('Failed to fetch external data');
    }
    const externalData = await externalRes.json();

    return NextResponse.json(externalData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
