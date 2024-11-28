import { NextRequest, NextResponse } from "next/server";
type Params = Promise<{ cratename: string, version: string }>
export async function GET(req: NextRequest, props: { params: Params }) {
    try {
        const params = await props.params
        const { cratename, version } = params;
        const externalApiUrl = `http://210.28.134.203:6888/api/crates/${cratename}/${version}/dependents`; // 替换为你的外部 API URL
        const externalRes = await fetch(externalApiUrl);
        if (!externalRes.ok) {
            throw new Error('Failed to fetch external data');
        }
        const externalData = await externalRes.json();
        console.log('External API Response:', externalData);
        return NextResponse.json(externalData);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }
}