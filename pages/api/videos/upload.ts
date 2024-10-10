import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const videoUploadDir = path.join(process.cwd(), 'public/uploads/videos');
      const thumbnailUploadDir = path.join(process.cwd(), 'public/uploads/thumbnails');
      const tempUploadDir = path.join(process.cwd(), 'public/uploads/temp');
  
      // Buat folder jika belum ada
      [videoUploadDir, thumbnailUploadDir, tempUploadDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
  
      const form = formidable({
        keepExtensions: true,
        uploadDir: tempUploadDir,
      });
  
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing files:', err); // Logging error
          return res.status(500).json({ error: "Error parsing files" });
        }
  
        console.log('Parsed fields:', fields); // Log parsed fields
  
        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
  
        const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
        const thumbnailFile = Array.isArray(files.thumbnail) ? files.thumbnail[0] : files.thumbnail;
  
        // Pastikan title dan description ada
        if (!title || !description) {
          console.error('Title or description is missing.'); // Logging error
          return res.status(400).json({ error: "Title or description is missing." });
        }
  
        // Pastikan video dan thumbnail diupload
        if (!videoFile || !thumbnailFile) {
          console.error('Video or thumbnail not uploaded.'); // Logging error
          return res.status(400).json({ error: "Video or thumbnail not uploaded." });
        }
  
        const videoPath = path.join(videoUploadDir, videoFile.newFilename);
        const thumbnailPath = path.join(thumbnailUploadDir, thumbnailFile.newFilename);
  
        try {
          // Pindahkan file video ke folder video
          fs.renameSync(videoFile.filepath, videoPath);
          // Pindahkan file thumbnail ke folder thumbnail
          fs.renameSync(thumbnailFile.filepath, thumbnailPath);
  
          const video = await prisma.video.create({
            data: {
              title: title,
              description: description,
              videoUrl: `/uploads/videos/${videoFile.newFilename}`,
              thumbnailUrl: `/uploads/thumbnails/${thumbnailFile.newFilename}`,
              userId: parseInt((session.user as any).id),
            },
          });
          return res.status(201).json(video);
        } catch (error) {
          console.error('Error saving video to database:', error); // Logging error
          return res.status(500).json({ error: "Error saving video to database" });
        }
      });
    } else {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  

export default handler;
