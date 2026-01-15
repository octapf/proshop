import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import { protect } from '@/lib/authMiddleware';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    let user;
    try {
        user = await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (user && user.isAdmin) {
        const { id } = await params;
        const userToDelete = await User.findById(id);

        if (userToDelete) {
             await userToDelete.deleteOne();
             return NextResponse.json({ message: 'User removed' });
        } else {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
    } else {
        return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    let user;
    try {
        user = await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (user && user.isAdmin) {
        const { id } = await params;
        const userFound = await User.findById(id).select('-password');
        if (userFound) {
            return NextResponse.json(userFound);
        } else {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
    } else {
       return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    let user;
    try {
        user = await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (user && user.isAdmin) {
        const { id } = await params;
        const userToUpdate = await User.findById(id);
        
        if (userToUpdate) {
            const { name, email, isAdmin } = await req.json();

            userToUpdate.name = name || userToUpdate.name;
            userToUpdate.email = email || userToUpdate.email;
            userToUpdate.isAdmin = isAdmin === undefined ? userToUpdate.isAdmin : isAdmin;

            const updatedUser = await userToUpdate.save();

            return NextResponse.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
             return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

    } else {
        return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
    }
}
