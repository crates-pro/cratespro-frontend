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

    // Fetch versions from program_versions table
    const versionsRes = await client.query(
      'SELECT version FROM program_versions WHERE name = \$1',
      [name]
    );

    const versions = versionsRes.rows.map((row: any) => row.version);

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
      versions: versions, // 添加版本信息
      vulnerabilities: [], // 如果有漏洞信息，可以在这里添加查询逻辑
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

