import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User from '@/models/userModel';

interface DecodedToken {
  id: string;
}

export const protect = async (req: NextRequest) => {
  let token;

  if (req.headers.get('authorization') && req.headers.get('authorization')?.startsWith('Bearer')) {
    try {
      token = req.headers.get('authorization')?.split(' ')[1];
      if (!token) throw new Error('Not authorized, no token');

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc1234') as DecodedToken;

      // @ts-ignore
      const user = await User.findById(decoded.id).select('-password');
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    throw new Error('Not authorized, no token');
  }
};
