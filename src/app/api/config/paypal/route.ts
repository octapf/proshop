
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(process.env.PAYPAL_CLIENT_ID || 'sb');
}
