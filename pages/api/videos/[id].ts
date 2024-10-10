// pages/api/videos/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { unlinkSync } from "fs";
import { join } from "path";
import { getSession } from 'next-auth/react'; // Jika menggunakan next-auth untuk autentikasi

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query; // Mengambil ID dari query

  if (req.method === 'GET') {
    try {
      // Mengambil video berdasarkan ID
      const video = await prisma.video.findUnique({
        where: { id: String(id) }, // Pastikan ID dikonversi ke string
      });

      if (!video) {
        // Mengembalikan pesan kesalahan jika video tidak ditemukan
        return res.status(404).json({ error: 'Video not found' });
      }

      // Mengembalikan data video jika ditemukan
      return res.status(200).json(video);
    } catch (error) {
      console.error('Error fetching video:', error);
      // Mengembalikan pesan kesalahan untuk kesalahan server
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    const session = await getSession({ req }); // Mendapatkan sesi pengguna

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' }); // Jika tidak ada sesi, kembalikan error
    }

    try {
      // Mengambil video berdasarkan ID untuk mendapatkan URL file
      const video = await prisma.video.findUnique({
        where: { id: String(id) },
      });

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Memeriksa apakah pengguna saat ini adalah pemilik video
      if (video.userId && session.user && session.user.id && video.userId !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden' }); // Kembalikan error jika bukan pemilik
      }

      // Menghapus semua komentar terkait video
      await prisma.comment.deleteMany({
        where: { videoId: String(id) }, // Hapus komentar berdasarkan videoId
      });

      // Menghapus video dari database
      await prisma.video.delete({
        where: { id: String(id) },
      });

      // Menghapus file video dari sistem file
      const videoPath = join(process.cwd(), 'public', video.videoUrl);
      const thumbnailPath = join(process.cwd(), 'public', video.thumbnailUrl as string);
      unlinkSync(videoPath); // Menghapus file video
      unlinkSync(thumbnailPath); // Menghapus file thumbnail

      return res.status(204).end(); // Mengembalikan status 204 No Content
    } catch (error) {
      console.error('Error deleting video:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Mengatur header untuk metode yang diizinkan
  res.setHeader("Allow", ["GET", "DELETE"]);
  // Mengembalikan pesan kesalahan untuk metode yang tidak diizinkan
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
