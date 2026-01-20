/**
 * @jest-environment node
 */
import { POST as createOrderHandler } from '@/app/api/orders/route';
import { GET as getOrderHandler } from '@/app/api/orders/[id]/route';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import Product from '@/models/productModel';
import Order from '@/models/orderModel';
import generateToken from '@/lib/generateToken';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Integration: Orders API', () => {
  const TEST_USER = {
    name: 'Order Test User',
    email: `test_order_${Date.now()}@example.com`,
    password: 'password123',
    isAdmin: false,
  };

  let userId: any;
  let token: string;
  let productId: any;

  beforeAll(async () => {
    // 1. Create User
    const user = await User.create(TEST_USER);
    userId = user._id;
    token = generateToken(userId);

    // 2. Create Product
    const product = await Product.create({
      name: 'Test Product for Order',
      image: '/image.jpg',
      brand: 'Test Brand',
      category: 'Test Category',
      description: 'Test Description',
      price: 100,
      countInStock: 10,
      rating: 5,
      numReviews: 1,
      user: userId,
    });
    productId = product._id;
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: TEST_USER.email });
    await Product.findByIdAndDelete(productId);
    await Order.deleteMany({ user: userId });
  });

  let createdOrderId: string;

  it('should create a new order', async () => {
    const orderData = {
      orderItems: [
        {
          name: 'Test Product for Order',
          qty: 2,
          image: '/image.jpg',
          price: 100,
          product: productId,
        },
      ],
      shippingAddress: {
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 200,
      taxPrice: 20,
      shippingPrice: 10,
      totalPrice: 230,
    };

    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const response = await createOrderHandler(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('_id');
    expect(data.orderItems).toHaveLength(1);
    expect(data.totalPrice).toBe(230);

    createdOrderId = data._id;
  });

  it('should get order by ID', async () => {
    expect(createdOrderId).toBeDefined();

    const req = new NextRequest(`http://localhost:3000/api/orders/${createdOrderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Mock params object
    const params = Promise.resolve({ id: createdOrderId });
    // @ts-ignore
    const response = await getOrderHandler(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data._id).toBe(createdOrderId);
    expect(data.user._id).toBe(userId.toString());
  });

  it('should fail to create order with invalid data', async () => {
    const orderData = {
      // Missing orderItems
      shippingAddress: {
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 0,
      totalPrice: 110,
    };

    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const response = await createOrderHandler(req);
    expect(response.status).toBe(400);
  });
});
