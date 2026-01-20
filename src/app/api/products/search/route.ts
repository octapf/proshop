import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  // Limit to 5 suggestions, selecting only what's needed
  // @ts-ignore
  const products = await Product.find({
    name: { $regex: query, $options: 'i' },
  })
    .select('_id name image price category')
    .limit(5);

  return NextResponse.json(products);
}
