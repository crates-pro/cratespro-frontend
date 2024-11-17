import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { CrateInfo } from '@/app/lib/crate_info';

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

    const versions = versionsRes.rows.map((row) => row.version);

    client.release();

    const crateInfo: CrateInfo = {
      id: programInfo.id,
      name: programInfo.name,
      //description: programInfo.description,
      description: "The ark-curve-constraint-tests crate is a comprehensive testing suite designed for validating the constraint systems of elliptic curves in the Arkworks ecosystem. It ensures that cryptographic curves are implemented correctly and efficiently within constraint systems, which are crucial for zero-knowledge proofs and other cryptographic protocols.",
      repository: programInfo.github_url,
      documentation: programInfo.doc_url,
      downloads: programInfo.downloads,
      cratesio: programInfo.cratesio,
      publishedDate: '2024.8.24'
    }

    return NextResponse.json({
      crateInfo: crateInfo,
      versions: versions, // 添加版本信息
      vulnerabilities: [], // 如果有漏洞信息，可以在这里添加查询逻辑
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

