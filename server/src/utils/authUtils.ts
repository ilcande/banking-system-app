const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET!, {
    expiresIn: '7 days',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET!);
};
