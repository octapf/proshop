import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import generateToken from '@/lib/generateToken';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  // @ts-ignore
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }
}
