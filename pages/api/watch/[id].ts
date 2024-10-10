import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req;

  if (req.method === "GET") {
    try {
      const video = await prisma.video.findUnique({
        where: { id: id as string }, // Menggunakan ID string untuk mendapatkan video
      });

      if (video) {
        return res.status(200).json(video);
      } else {
        return res.status(404).json({ error: "Video not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error fetching video" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
