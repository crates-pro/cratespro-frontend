import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { Vulnerability } from '@/components/VulnerabilitiesList';

interface CrateVersionInfo {
  name: string;
  version: string;
  documentation: string;
  dependencies: Dependency[];
  vulnerabilities: Vulnerability[];
}

interface Dependency {
  name: string;
  version: string;
}

function generateRandomVulnerabilities(): Vulnerability[] {
  const severities: Vulnerability['severity'][] = ['low', 'medium', 'high'];
  const randomVulnerabilities: Vulnerability[] = [];

  const numberOfVulnerabilities = Math.floor(Math.random() * 5); // 0 to 4 vulnerabilities

  for (let i = 0; i < numberOfVulnerabilities; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    randomVulnerabilities.push({
      id: `vul-${i}`,
      title: `Random Vulnerability ${i + 1}`,
      description: `This is a randomly generated vulnerability of ${severity} severity.`,
      severity,
    });
  }

  return randomVulnerabilities;
}

export async function GET(req: NextRequest, { params }: { params: { name: string, version: string } }) {
  const { name, version } = params;
  const nameAndVersion = `${name}/${version}`;

  try {
    const client = await pool.connect();

    const versionRes = await client.query(
      'SELECT * FROM program_versions WHERE name_and_version = \$1',
      [nameAndVersion]
    );

    const dependenciesRes = await client.query(
      'SELECT dependency_name, dependency_version FROM program_dependencies WHERE name_and_version = \$1',
      [nameAndVersion]
    );

    client.release();

    if (versionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Crate not found' }, { status: 404 });
    }

    const versionInfo = versionRes.rows[0];
    const dependencies = dependenciesRes.rows.map((row) => ({
      name: row.dependency_name,
      version: row.dependency_version,
    }));

    const vulnerabilities = generateRandomVulnerabilities();

    const crateVersionInfo: CrateVersionInfo = {
      name: versionInfo.name,
      version: versionInfo.version,
      documentation: versionInfo.documentation,
      dependencies: dependencies,
      vulnerabilities: vulnerabilities
    };

    return NextResponse.json(crateVersionInfo);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
