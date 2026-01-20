import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import generateToken from '@/lib/generateToken';
import { protect } from '@/lib/authMiddleware';
import { registerSchema } from '@/lib/validators/auth';

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // @ts-ignore
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // @ts-ignore
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      return NextResponse.json(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  let user;
  try {
    // @ts-ignore
    user = await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if (user && user.isAdmin) {
    // @ts-ignore
    const users = await User.find({});
    return NextResponse.json(users);
  } else {
    return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
  }
}
