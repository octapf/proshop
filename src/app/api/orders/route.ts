
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import { protect } from '@/lib/authMiddleware';

export async function POST(req: NextRequest) {
    await connectDB();
    
    let user;
    try {
        user = await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = await req.json();

    if (orderItems && orderItems.length === 0) {
        return NextResponse.json({ message: 'No order items' }, { status: 400 });
    } else {
        const order = new Order({
            orderItems,
            // @ts-ignore
            user: user._id,
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
