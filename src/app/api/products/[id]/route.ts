import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';
import { protect } from '@/lib/authMiddleware';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  // @ts-ignore
  const product = await Product.findById(id);

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  let user;
  try {
    user = await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if (user && user.isAdmin) {
    const { id } = await params;
    // @ts-ignore
    const product = await Product.findById(id);

    if (product) {
      await product.deleteOne();
      return NextResponse.json({ message: 'Product removed' });
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  let user;
  try {
    user = await protect(req);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if (user && user.isAdmin) {
    const { id } = await params;
    const { name, price, description, image, brand, category, countInStock } = await req.json();

    // @ts-ignore
    const product = await Product.findById(id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      return NextResponse.json(updatedProduct);
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
  }
}
