// /home/rust/workspace/next-learn/dashboard/starter-example/app/api/crates/[name]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
interface CrateInfo {
    name: string;
    versions: string[];
    description: string;
    repository: string;
    downloads: number;
    maintainers: Maintainer[];
    documentation: string;
    publishedDate: string;
    licenses: string[];
    dependencyLicenses: Record<string, number>;
    links: Record<string, string>;
    dependencies: Dependency[];
    vulnerabilities: Vulnerability[];
}

interface Maintainer {
    name: string;
    email: string;
}

interface Dependency {
    name: string;
    version: string;
}

interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: string;
}



export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;
  
    try {
      const client = await pool.connect();
      const res = await client.query(
        'SELECT * FROM crates WHERE name = \$1',
        [name]
      );
      client.release();
  
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Crate not found' }, { status: 404 });
      }
  
      const crate = res.rows[0];
      const crateInfo: CrateInfo = {
        name: crate.name,
        versions: crate.versions,
        description: crate.description,
        repository: crate.repository,
        downloads: crate.downloads,
        maintainers: JSON.parse(crate.maintainers),
        documentation: crate.documentation,
        publishedDate: crate.published_date,
        licenses: crate.licenses.split(','),
        dependencyLicenses: JSON.parse(crate.dependency_licenses),
        links: JSON.parse(crate.links),
        dependencies: JSON.parse(crate.dependencies),
        vulnerabilities: JSON.parse(crate.vulnerabilities),
      };
  
      return NextResponse.json(crateInfo);
    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
