import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import { protect } from '@/lib/authMiddleware';
import { orderCreateSchema } from '@/lib/validators/order';

export async function POST(req: NextRequest) {
  await connectDB();

  // Check for auth, but don't fail immediately if not present
  let user = null;
  try {
    user = await protect(req);
  } catch {
    // Not authorized, but might be guest
  }

  const body = await req.json();

  const validation = orderCreateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { message: 'Validation failed', errors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    guestInfo,
  } = validation.data;

  // If no user and no guest info, fail
  if (!user && !guestInfo) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const order = new Order({
    orderItems,
    // @ts-ignore
    user: user ? user._id : undefined,
    guestInfo: guestInfo || undefined,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // @ts-ignore
  const createdOrder = await order.save();

  return NextResponse.json(createdOrder, { status: 201 });
}

export async function GET(req: NextRequest) {
  await connectDB();

  let user;
  try {
    user = await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if (user && user.isAdmin) {
    const orders = await Order.find({}).populate('user', 'id name');
    return NextResponse.json(orders);
  } else {
    return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
  }
}
