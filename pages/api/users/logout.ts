import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const logout = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 0, // Menghapus cookie
      sameSite: 'strict',
      path: '/',
    })
  );
  res.status(200).json({ message: 'Logout berhasil' });
};

export default logout;
