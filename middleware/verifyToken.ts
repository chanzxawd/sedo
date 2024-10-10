import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const verifyToken = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Token tidak tersedia' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adadehahahahaha');
    (req as any).user = decoded; // Simpan info pengguna ke req
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token tidak valid' });
  }
};

export default verifyToken;
