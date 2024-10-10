import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: number | null | string; // Ganti dengan tipe yang sesuai
  }

  interface Session {
    user: User & {
      id?: number | null | string; // Tambahkan properti id ke dalam user
      username?: string;
    };
  }
  interface JWT {
    id?: number | string | null; // Tambahkan ini agar token memiliki ID
  }
}
