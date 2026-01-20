/**
 * @jest-environment node
 */
import { POST as registerHandler } from '@/app/api/users/route';
import { POST as loginHandler } from '@/app/api/users/login/route';
import { GET as profileHandler, PUT as updateProfileHandler } from '@/app/api/users/profile/route';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import mongoose from 'mongoose';

// Ensure database connection
beforeAll(async () => {
  await connectDB();
});

// Clean up DB connection
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Integration: Auth Flow (Register -> Login -> Profile)', () => {
  const TEST_USER = {
    name: 'Integration Test User',
    email: `test_int_${Date.now()}@example.com`,
    password: 'password123',
  };

  let authToken: string;

  // Cleanup specific user after tests
  afterAll(async () => {
    await User.deleteMany({ email: TEST_USER.email });
  });

  it('should register a new user', async () => {
    const req = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(TEST_USER),
    });

    const response = await registerHandler(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('_id');
    expect(data).toHaveProperty('name', TEST_USER.name);
    expect(data).toHaveProperty('email', TEST_USER.email);
    expect(data).toHaveProperty('token');
    expect(data.isAdmin).toBe(false);

    // Verify user is in DB
    const dbUser = await User.findOne({ email: TEST_USER.email });
    expect(dbUser).toBeTruthy();
  });

  it('should login the user and return a token', async () => {
    const req = new NextRequest('http://localhost:3000/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
    });

    const response = await loginHandler(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('token');
    authToken = data.token; // Save for next test
  });

  it('should get user profile with valid token', async () => {
    expect(authToken).toBeDefined();

    const req = new NextRequest('http://localhost:3000/api/users/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const response = await profileHandler(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('email', TEST_USER.email);
  });

  it('should fail to access profile without token', async () => {
    const req = new NextRequest('http://localhost:3000/api/users/profile', {
      method: 'GET',
    });

    const response = await profileHandler(req);
    expect(response.status).toBe(401);
  });

  it('should update user profile', async () => {
    const newName = 'Updated Integration Name';
    const req = new NextRequest('http://localhost:3000/api/users/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: newName,
      }),
    });

    const response = await updateProfileHandler(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe(newName);

    // Verify update in DB
    const dbUser = await User.findOne({ email: TEST_USER.email });
    // @ts-ignore
    expect(dbUser.name).toBe(newName);
  });
});
