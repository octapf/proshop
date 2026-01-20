import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'abc1234', {
    expiresIn: '30d',
  });
};

export default generateToken;
