import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const { data: session } = useSession();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!title || !description || !videoFile || !thumbnailFile) {
      alert("Semua field harus diisi!");
      return;
    }

    // Cek tipe file
    if (videoFile.type !== "video/mp4") {
      alert("Hanya file video dengan format .mp4 yang diperbolehkan.");
      return;
    }

    if (!thumbnailFile.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan untuk thumbnail.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      const response = await axios.post("/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      setMsg("Upload successful")
      // Reset form setelah upload berhasil
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Terjadi kesalahan saat mengupload video. Silakan coba lagi.");
    }
  };

  return (
    <>
      {session ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#212121] text-white">
          <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
          <form onSubmit={handleUpload} className="bg-[#303030] p-6 rounded-lg shadow-lg w-full max-w-md">
            {msg && <div className="mb-4 text-red-500">{msg}</div>}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="video" className="block text-sm font-medium">Video File</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="mt-1 border border-gray-600 bg-[#424242] rounded w-full text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="thumbnail" className="block text-sm font-medium">Thumbnail</label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="mt-1 border border-gray-600 bg-[#424242] rounded w-full text-white"
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
              Upload
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white p-4">
          <h1 className="text-2xl font-bold mb-6">Please Login</h1>
        </div>
      )}
    </>
  );};

export default UploadPage;
