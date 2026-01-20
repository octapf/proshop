import mongoose from 'mongoose';
import User from './src/models/userModel';
import connectDB from './src/lib/db';
import dotenv from 'dotenv';

dotenv.config();

const testDuplicate = async () => {
  await connectDB();
  const email = `dup${Date.now()}@example.com`;

  console.log(`Creating user 1: ${email}`);
  // @ts-ignore
  await User.create({ name: 'User1', email, password: '123' });

  console.log('Searching for user...');
  // @ts-ignore
  const found = await User.findOne({ email });
  console.log('Found:', found ? 'YES' : 'NO');

  console.log(`Creating user 2: ${email}`);
  try {
    // @ts-ignore
    await User.create({ name: 'User2', email, password: '123' });
    console.log('WARNING: User 2 created successfully (Duplicate!)');
  } catch (e: any) {
    console.log('Caught expected error:', e.message);
  }

  process.exit();
};

testDuplicate();
