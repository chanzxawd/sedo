import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";

// Prisma Client
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser Next.js
  },
};

// Fungsi untuk mem-parsing form dengan Promises
const parseForm = (req: IncomingMessage): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req);

      // Dapatkan userId dari session/login atau dari request (ini contoh hardcoded userId)
      const userId = 1; // Harusnya ini berasal dari pengguna yang sedang login

      const video = await prisma.video.create({
        data: {
          title: fields.title as unknown as string,
          description: fields.description as unknown as string | undefined,
          thumbnailUrl: `/public/uploads/thumbnails/${(files.thumbnail as unknown as File).originalFilename}`,
          videoUrl: `/public/uploads/videos/${(files.video as unknown as File).originalFilename}`,
          userId: userId, // Masukkan userId yang valid
        },
      });

      res.status(201).json({ message: "Upload successful", video });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error uploading video" });
    }
  } else if (req.method === "GET") {
    try {
      const dataVideos = await prisma.video.findMany();
      res.status(200).json(dataVideos);
    } catch (error) {
      res.status(500).json({ error: "Error fetching videos" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
