import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import { protect } from '@/lib/authMiddleware';

export async function GET(req: NextRequest) {
  await connectDB();

  let user;
  try {
    user = await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  // @ts-ignore
  const orders = await Order.find({ user: user._id });

  return NextResponse.json(orders, { status: 200 });
}
