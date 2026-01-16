
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';
import { protect } from '@/lib/authMiddleware';

export async function GET(req: NextRequest) {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('pageNumber')) || 1;
    const pageSize = 10;
    
    // Filtering
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 1000000;
    const rating = Number(searchParams.get('rating')) || 0;

    const query: any = {};

    if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
        query.category = category;
    }
    if (brand) {
        query.brand = brand;
    }
    if (minPrice || maxPrice !== 1000000) {
        query.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (rating) {
        query.rating = { $gte: rating };
    }

    // @ts-ignore
    const count = await Product.countDocuments(query);
    // @ts-ignore
    const products = await Product.find(query)
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
