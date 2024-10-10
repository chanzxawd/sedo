import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Extend the DefaultSession to include the user id
interface CustomSession extends DefaultSession {
  user: {
    id: string; // Menambahkan properti id
  } & DefaultSession["user"];
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: {
          label: "Username or Email",
          type: "text",
          placeholder: "your_username_or_email",
        },
        password: { label: "Password", type: "password" },
      },

      // Fungsi authorize untuk memverifikasi pengguna
      async authorize(credentials) {
        const { usernameOrEmail, password } = credentials;

        // Cari pengguna berdasarkan username atau email
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
          },
        });

        // Jika pengguna tidak ditemukan, lempar error
        if (!user) {
          throw new Error("Username/email atau password salah");
        }

        // Cek apakah password sesuai
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Username/email atau password salah");
        }

        // Kembalikan objek pengguna yang sudah terautentikasi
        return { id: user.id.toString(), username: user.username, email: user.email }; // Mengonversi id ke string
      },
    }),
  ],
  adapter: PrismaAdapter(prisma), // Menggunakan Prisma sebagai adapter
  session: {
    strategy: "jwt", // Menggunakan JWT untuk sesi
  },
  callbacks: {
    // Callback untuk menyimpan ID pengguna dalam token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Menyimpan ID pengguna dalam token
      }
      return token;
    },
    // Callback untuk menyimpan ID pengguna dalam sesi
    async session({ session, token }) {
        session.user = { ...session.user, id: token.id as number }; // Pastikan id didefinisikan sebagai number
        return session; // Kembalikan sesi yang telah diperbarui
      },
  },
  pages: {
    signIn: "/auth/signin", // Rute untuk halaman login
  },
});
