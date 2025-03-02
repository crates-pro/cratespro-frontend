import { NextResponse } from 'next/server';
import { enableProxy } from "@/proxy-config";

export async function POST() {
    try {
        const config = enableProxy();
        return NextResponse.json({
            success: true,
            proxyEnabled: config.isEnabled
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 