
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import connectDB from "@/lib/db";
import Order from "@/models/orderModel";
import { protect } from "@/lib/authMiddleware";

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    await connectDB();
    try {
         await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    // @ts-ignore
    const order = await Order.findById(orderId);

    if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const preference = new Preference(client);

    const items = order.orderItems.map((item: any) => ({
        id: item.product.toString(),
        title: item.name,
        quantity: Number(item.qty),
        unit_price: Number(item.price),
        currency_id: 'USD'
    }));

    if (order.shippingPrice > 0) {
        items.push({
            id: 'shipping',
            title: 'Shipping',
            quantity: 1,
            unit_price: Number(order.shippingPrice),
            currency_id: 'USD'
        });
    }

    if (order.taxPrice > 0) {
        items.push({
            id: 'tax',
            title: 'Tax',
            quantity: 1,
            unit_price: Number(order.taxPrice),
            currency_id: 'USD'
        });
    }

    try {
        const result = await preference.create({
            body: {
                items: items,
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${orderId}?payment_status=approved`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${orderId}?payment_status=failure`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${orderId}?payment_status=pending`,
                },
                auto_return: "approved",
                external_reference: orderId
            }
        });

        return NextResponse.json({ id: result.id });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
