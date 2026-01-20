/**
 * @jest-environment node
 */
import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';
import mongoose from 'mongoose';

// Ensure we connect to the database before running tests
beforeAll(async () => {
  await connectDB();
});

// Clean up after tests
afterAll(async () => {
  // Option 1: Close connection
  await mongoose.connection.close();
});

describe('Integration: GET /api/products', () => {
  // Use a unique category to isolate this test's data
  const TEST_CATEGORY = 'IntegrationTest_Category_' + Date.now();

  beforeEach(async () => {
    // Seed some test data
    await Product.create({
      name: 'Test Product 1',
      image: '/images/test1.jpg',
      description: 'Description 1',
      brand: 'TestBrand',
      category: TEST_CATEGORY,
      price: 100,
      countInStock: 10,
      rating: 4.5,
      numReviews: 2,
      user: new mongoose.Types.ObjectId(), // Random user ID
    });

    await Product.create({
      name: 'Test Product 2',
      image: '/images/test2.jpg',
      description: 'Description 2',
      brand: 'TestBrand',
      category: TEST_CATEGORY,
      price: 200,
      countInStock: 5,
      rating: 3.0,
      numReviews: 1,
      user: new mongoose.Types.ObjectId(),
    });
  });

  afterEach(async () => {
    // Cleanup test data
    await Product.deleteMany({ category: TEST_CATEGORY });
  });

  it('should return a list of products', async () => {
    // Create a mock request
    // We point to localhost, but the handler only cares about searchParams usually
    const req = new NextRequest(`http://localhost:3000/api/products?category=${TEST_CATEGORY}`);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();

    // Check structure
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('pages');

    // Check content
    const products = data.products;
    expect(products.length).toBe(2);
    expect(products[0].category).toBe(TEST_CATEGORY);
  });

  it('should filter products by keyword', async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/products?category=${TEST_CATEGORY}&keyword=Product 1`
    );

    const response = await GET(req);
    const data = await response.json();

    expect(data.products.length).toBe(1);
    expect(data.products[0].name).toBe('Test Product 1');
  });
});
