
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import { protect } from '@/lib/authMiddleware';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    await connectDB();
    
    let user;
    try {
        user = await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (!user.isAdmin) {
        return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
    }

    const { id } = await params;
    const order = await Order.findById(id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        return NextResponse.json(updatedOrder);
    } else {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
}
