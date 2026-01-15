
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';
import { protect } from '@/lib/authMiddleware';

export async function GET(req: NextRequest) {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('pageNumber')) || 1;
    const pageSize = 10;
    const keywordParam = searchParams.get('keyword');

    const keyword = keywordParam
        ? {
            name: {
                $regex: keywordParam,
                $options: 'i',
            },
        }
        : {};

    // @ts-ignore
    const count = await Product.countDocuments({ ...keyword });
    // @ts-ignore
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    return NextResponse.json({ products, page, pages: Math.ceil(count / pageSize) });
}

export async function POST(req: NextRequest) {
    await connectDB();
    
    let user;
    try {
        user = await protect(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (user && user.isAdmin) {
        const product = new Product({
            name: 'Sample name',
            price: 0,
            user: user._id,
            image: '/images/sample.jpg',
            brand: 'Sample brand',
            category: 'Sample category',
            countInStock: 0,
            numReviews: 0,
            description: 'Sample description',
        });

        const createdProduct = await product.save();
        return NextResponse.json(createdProduct, { status: 201 });
    } else {
        return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
    }
}
