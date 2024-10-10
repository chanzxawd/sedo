// components/VideoList.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getSession } from "next-auth/react";

interface Video {
  id: string; // Menggunakan string sebagai ID
  title: string;
  thumbnailUrl: string;
  description: string;
  userId: string; // Menyimpan ID pengguna yang mengupload video
}

const VideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // Menyimpan ID pengguna yang terautentikasi
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Mengelola status dropdown

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/videos"); // Endpoint untuk mendapatkan video
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession(); // Mendapatkan sesi pengguna
      if (session) {
        const userId = (session.user as { id: string }).id; // Casting ke tipe yang diharapkan
        setUserId(userId);
      }
    };

    fetchSession();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/videos/${id}`); // Endpoint untuk menghapus video
      setVideos(videos.filter((video) => video.id !== id)); // Update state
      setOpenDropdown(null); // Menutup dropdown setelah menghapus
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#212121] text-white">
      <h1 className="text-3xl font-bold mb-6">List Video</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="block">
            <div className="border border-gray-600 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 bg-[#303030]">
              <Link href={`/watch/${video.id}`}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-2 text-white">
                    {video.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {video.description.slice(0, 60)}...
                  </p>{" "}
                  {/* Deskripsi singkat */}
                </div>
              </Link>
              {userId === video.userId && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Menghindari efek dari klik lain
                      toggleDropdown(video.id);
                    }}
                    className="flex items-center p-2 text-gray-300 hover:text-gray-100" // Perubahan warna teks
                  >
                    <i className="fas fa-ellipsis-v text-white"></i>{" "}
                    {/* Ikon putih */}
                  </button>
                  {openDropdown === video.id && (
                    <div>
                      <div className="absolute translate-x-[1.5em] translate-y-[-5.3em] z-[100] mt-2 w-48 rounded-md shadow-lg bg-[#424242] ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white"
                        >
                          <i className="fa-solid fa-trash mr-2"></i>
                          Hapus
                        </button>
                      </div>
                    </div>
                    </div>
                  )}
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
