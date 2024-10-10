import { NextApiRequest, NextApiResponse } from 'next';
import verifyToken from '../../middleware/verifyToken';

const protectedData = (req: NextApiRequest, res: NextApiResponse) => {
  verifyToken(req, res, () => {
    res.status(200).json({ message: 'Ini adalah data yang dilindungi', user: (req as any).user });
  });
};

export default protectedData;
