import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { usernameOrEmail, password } = req.body;

    try {
      // Cari pengguna berdasarkan username atau email
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        },
      });

      if (!user) {
        return res.status(401).json({ error: "Username/email atau password salah" });
      }

      // Cek apakah password sesuai
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Username/email atau password salah" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || "adadehahahahaha", // Pastikan untuk mengganti ini dengan secret yang aman
        { expiresIn: "1h" } // Token valid selama 1 jam
      );
      
      // Simpan token ke cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "strict",
          maxAge: 60 * 60 * 1, // 1 jam
          path: "/",
        })
      );
      

      res.status(200).json({ message: "Login berhasil", token });
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat login" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default login;
