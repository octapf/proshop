import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  // @ts-ignore
  const product = await Product.findById(id);

  if (product) {
    // @ts-ignore
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: id },
    }).limit(4);

    return NextResponse.json(relatedProducts);
  } else {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}
