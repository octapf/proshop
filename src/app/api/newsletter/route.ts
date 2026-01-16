import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Newsletter from '@/models/newsletterModel';

export async function POST(req: NextRequest) {
    await connectDB();
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
        return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    try {
        const exists = await Newsletter.findOne({ email });
        if (exists) {
            return NextResponse.json({ message: 'Email already subscribed' }, { status: 400 });
        }

        const news = new Newsletter({ email });
        await news.save();

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
