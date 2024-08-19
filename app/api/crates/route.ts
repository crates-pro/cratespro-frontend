// /home/rust/workspace/cratespro-frontend/app/api/programs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT name, description FROM programs');
    client.release();

    const programs = res.rows;

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
