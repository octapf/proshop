import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function GET() {
  try {
    await connectDB();

    // @ts-ignore
    const categories = await Product.distinct('category');
    // @ts-ignore
    const brands = await Product.distinct('brand');
    // @ts-ignore
    const maxPriceProduct = await Product.findOne().sort({ price: -1 }).select('price');

    return NextResponse.json({
      categories,
      brands,
      maxPrice: maxPriceProduct ? maxPriceProduct.price : 1000,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
