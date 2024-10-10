import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    try {
      // Cek apakah email atau username sudah terdaftar
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email atau username sudah terdaftar" });
      }

      // Hash password sebelum menyimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan pengguna ke database
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: "Registrasi berhasil", user });
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat registrasi" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default register;
