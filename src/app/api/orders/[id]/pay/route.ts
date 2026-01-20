import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import { protect } from '@/lib/authMiddleware';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // @ts-ignore
  const order = await Order.findById(id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: body.id,
      status: body.status,
      update_time: body.update_time,
      email_address: body.payer.email_address,
    };

    const updatedOrder = await order.save();
    return NextResponse.json(updatedOrder);
  } else {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
}
