import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = () => { const value=process.env.JWT_SECRET; if(!value || value.length<32) throw new Error('JWT_SECRET must contain at least 32 characters'); return value; };

export const signToken = (payload) => {
  return jwt.sign(payload, secret(), { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret(), { algorithms: ['HS256'] });
  } catch (error) {
    return null;
  }
};

export const getAuthUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  
  return verifyToken(token);
};
