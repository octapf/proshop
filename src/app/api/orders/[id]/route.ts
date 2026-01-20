import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import { protect } from '@/lib/authMiddleware';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  const { id } = await params;

  // @ts-ignore
  const order = await Order.findById(id).populate('user', 'name email');

  if (order) {
    return NextResponse.json(order);
  } else {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
}
