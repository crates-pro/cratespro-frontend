import { NextResponse } from 'next/server';

interface CVE {
  id: string;
  description: string;
  name: string;
  version: string;
  sourceUrl: string;
  startVersion: string;
  endVersion: string;
}

const generateRandomCVE = (): CVE => {
  const randomId = `CVE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}`;
  const randomDescription = `Description for ${randomId}`;
  const randomName = `crate-${Math.floor(Math.random() * 100)}`;
  const randomVersion = `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
  const sourceUrl = 'https://example.com';
  const startVersion = 'v1.0.0';
  const endVersion = 'v2.0.0';

  return {
    id: randomId,
    description: randomDescription,
    name: randomName,
    version: randomVersion,
    sourceUrl,
    startVersion,
    endVersion,
  };
};

export async function GET() {
  try {
    const randomCVEs = Array.from({ length: 7 }, generateRandomCVE);
    return NextResponse.json(randomCVEs);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
