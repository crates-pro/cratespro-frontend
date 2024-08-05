// /home/rust/workspace/next-learn/dashboard/starter-example/app/api/crates/[name]/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface CrateInfo {
    name: string;
    version: string;
    description: string;
    repository: string;
    downloads: number;
    maintainers: Maintainer[];
    documentation: string;
    publishedDate: string;
    licenses: string[];
    dependencyLicenses: Record<string, number>;
    links: Record<string, string>;
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
    severity: 'low' | 'medium' | 'high';
}

const crateInfo: CrateInfo = {
    name: 'example-crate',
    version: '1.0.0',
    description: 'This is an example crate.',
    repository: 'https://github.com/example/example-crate',
    downloads: 12345,
    maintainers: [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
    ],
    documentation: 'https://docs.example.com/example-crate',
    publishedDate: '2023-01-01',
    licenses: ['MIT', 'Apache-2.0'],
    dependencyLicenses: {
        'MIT': 5,
        'Apache-2.0': 3,
    },
    links: {
        homepage: 'https://example.com',
        repository: 'https://github.com/example/example-crate',
    },
};

const dependencies: Dependency[] = [
    { name: 'dep1', version: '1.0.0' },
    { name: 'dep2', version: '2.0.0' },
];

const vulnerabilities: Vulnerability[] = [
    {
        id: 'VULN-001',
        title: 'Example Vulnerability',
        description: 'This is an example vulnerability.',
        severity: 'high',
    },
];

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;

    if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'Invalid crate name' }, { status: 400 });
    }

    // Here you can add logic to fetch the actual data based on the crate name
    // For now, we'll return the example data

    return NextResponse.json({
        crateInfo,
        dependencies,
        vulnerabilities,
    });
}

export async function POST(req: NextRequest) {
    return NextResponse.json({ error: 'Method POST Not Allowed' }, { status: 405 });
}
