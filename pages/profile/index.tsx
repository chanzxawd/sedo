import { useSession, getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

interface UserProfile {
  username: string;
  email: string;
}

interface ProfileProps {
  userProfile: UserProfile | null; // Menyimpan data pengguna dari database
}

export default function Profile({ userProfile }: ProfileProps) {
  // Mengambil session dari hook useSession
  const { data: session, status } = useSession();

  // Jika session masih loading
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Jika pengguna belum login
  if (!session) {
    return <div className="text-red-500 font-bold text-center">Anda belum login. Silakan login terlebih dahulu.</div>;
  }

  // Jika userProfile tidak ada
  if (!userProfile) {
    return <div className="text-red-500 font-bold text-center">Data pengguna tidak ditemukan.</div>;
  }

  // Menampilkan data pengguna
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="w-full p-4 border border-gray-700 rounded-lg bg-gray-900">
        <p className="mb-2"><strong className="text-blue-400">Username:</strong> {userProfile.username}</p>
        <p className="mb-2"><strong className="text-blue-400">Email:</strong> {userProfile.email}</p>
      </div>
    </div>
  );
}

// SSR untuk mengambil session dan data pengguna secara aman di server-side
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // Jika pengguna belum login, arahkan ke halaman login
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Mengambil data pengguna dari database menggunakan Prisma
  const userProfile = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id as string, 10) }, // Menggunakan ID dari session
    select: {
      username: true,
      email: true,
    },
  });

  return {
    props: {
      session, // Session akan diteruskan ke komponen di sisi klien
      userProfile, // Data pengguna dari database
    },
  };
};
