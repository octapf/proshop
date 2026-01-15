import { NextResponse } from 'next/server';

export async function GET() {
    const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;
    
    if (!publicKey) {
        return NextResponse.json({ message: 'Mercado Pago Public Key missing' }, { status: 500 });
    }
    
    return NextResponse.json(publicKey);
}
