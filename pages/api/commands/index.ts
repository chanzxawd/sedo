// pages/api/commands.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'GET') {
    try {
      const commands = await prisma.comment.findMany({ 
        include: { user: true }, // Menyertakan informasi pengguna
      });
      res.status(200).json(commands);
    } catch (error) {
      console.error('Error fetching commands:', error);
      res.status(500).json({ message: 'Failed to fetch commands' });
    }
  } else if (method === 'POST') {
    const { content, videoId, userId } = req.body; // Mengambil data dari request body
    if (!content || !videoId || !userId) {
      return res.status(400).json({ message: 'Content, videoId, and userId are required' });
    }
    try {
      const command = await prisma.comment.create({
        data: {
          content,
          videoId,
          userId: Number(userId),
        },
        include: { user: true }, // Menyertakan informasi pengguna saat membuat command
      });
      res.status(201).json(command);
    } catch (error) {
      console.error('Error creating command:', error);
      res.status(500).json({ message: 'Failed to create command' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
