// app/api/crates/[name]/[version]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

interface CrateVersionInfo {
  name: string;
  version: string;
  documentation: string;
  dependencies: Dependency[];
}

interface Dependency {
  name: string;
  version: string;
}
export async function GET(req: NextRequest, { params }: { params: { name: string, version: string } }) {
  const { name, version } = params;
  const nameAndVersion = `${name}/${version}`;

  try {
    const client = await pool.connect();

    // 查询 program_versions 表
    const versionRes = await client.query(
      'SELECT * FROM program_versions WHERE name_and_version = \$1',
      [nameAndVersion]
    );

    // 查询 program_dependencies 表
    const dependenciesRes = await client.query(
      'SELECT dependency_name, dependency_version FROM program_dependencies WHERE name_and_version = \$1',
      [nameAndVersion]
    );

    client.release();

    if (versionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Crate not found' }, { status: 404 });
    }

    const versionInfo = versionRes.rows[0];
    const dependencies = dependenciesRes.rows.map((row: any) => ({
      name: row.dependency_name,
      version: row.dependency_version,
    }));

    const crateVersionInfo: CrateVersionInfo = {
      name: versionInfo.name,
      version: versionInfo.version,
      documentation: versionInfo.documentation,
      dependencies: dependencies,
    };

    return NextResponse.json(crateVersionInfo);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}