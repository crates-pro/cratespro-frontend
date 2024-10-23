import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db'; // 导入数据库连接池

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json(); // 解析请求体中的 JSON 数据

        if (!content) {
            return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
        }

        const client = await pool.connect(); // 获取数据库连接
        // 假设我们将内容插入到名为 'submissions' 的表中
        await client.query('INSERT INTO submissions (content) VALUES ($1)', [content]);
        client.release(); // 释放连接

        return NextResponse.json({ message: '内容提交成功！' }, { status: 200 });
    } catch (error) {
        console.error('提交错误:', error);
        return NextResponse.json({ error: '内部服务器错误' }, { status: 500 });
    }
}