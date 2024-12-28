
import { NextRequest, NextResponse } from "next/server";
type Params = Promise<{ nsfront: string, nsbehind: string, cratename: string, version: string }>
export async function GET(req: NextRequest, props: { params: Params }) {
    try {
        const params = await props.params
        const { nsfront, nsbehind, cratename, version } = params;
        console.log('graph data:', nsfront, nsbehind, cratename, version);
        const externalApiUrl = `http://210.28.134.203:6888/api/graph/${cratename}/${version}/direct`;

        const externalRes = await fetch(externalApiUrl);
        if (!externalRes.ok) {
            throw new Error('Failed to fetch external data');
        }
        const externalData = await externalRes.json();
        console.log('graph dataaaaaaaaaa:', externalData);
        return NextResponse.json(externalData);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }
}