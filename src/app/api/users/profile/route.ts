import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import { protect } from '@/lib/authMiddleware';
import generateToken from '@/lib/generateToken';

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const user = await protect(req);
        if (user) {
             return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
             });
        }
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
}

export async function PUT(req: NextRequest) {
    await connectDB();
    try {
        const user = await protect(req);
        if (user) {
            const { name, email, password } = await req.json();

            user.name = name || user.name;
            user.email = email || user.email;
            if (password) {
                user.password = password;
            }

            const updatedUser = await user.save();

            return NextResponse.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            });
        }
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
}
