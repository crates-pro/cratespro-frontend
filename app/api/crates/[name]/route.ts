// /home/rust/workspace/cratespro-frontend/app/api/crates/[name]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const client = await pool.connect();

    // Fetch program info by name
    const programRes = await client.query(
      'SELECT * FROM programs WHERE name = \$1',
      [name]
    );

    if (programRes.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    const programInfo = programRes.rows[0];

    client.release();

    return NextResponse.json({
      crateInfo: {
        id: programInfo.id,
        name: programInfo.name,
        description: programInfo.description,
        namespace: programInfo.namespace,
        maxVersion: programInfo.max_version,
        githubUrl: programInfo.github_url,
        megaUrl: programInfo.mega_url,
        docUrl: programInfo.doc_url,
        programType: programInfo.program_type,
        downloads: programInfo.downloads,
        cratesio: programInfo.cratesio,
      },
      dependencies: [], // 如果有依赖关系，可以在这里添加查询逻辑
      vulnerabilities: [], // 如果有漏洞信息，可以在这里添加查询逻辑
      versions: [], // 如果有版本信息，可以在这里添加查询逻辑
      benchmarks: [], // 如果有基准测试信息，可以在这里添加查询逻辑
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
