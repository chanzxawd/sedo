import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from "next-auth/react";
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import ikon sampah

const VideoDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Mengambil ID dari query
  const [video, setVideo] = useState<any>(null);
  const [commands, setCommands] = useState<any[]>([]);
  const [newCommand, setNewCommand] = useState<string>(''); // State untuk command baru
  const [loading, setLoading] = useState<boolean>(true); // State untuk mengatur loading
  const [userId, setUserId] = useState<string | null>(null); // Menyimpan ID pengguna yang terautentikasi

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

  useEffect(() => {
    const fetchVideoAndCommands = async () => {
      if (!id) return;

      try {
        const videoResponse = await axios.get(`/api/videos/${id}`); // Ganti dengan endpoint yang sesuai
        setVideo(videoResponse.data);

        const commandsResponse = await axios.get(`/api/commands`); // Mengambil commands
        setCommands(commandsResponse.data.filter(cmd => cmd.videoId === id)); // Filter berdasarkan videoId
      } catch (error) {
        console.error('Error fetching video or commands:', error);
      } finally {
        setLoading(false); // Mengatur loading menjadi false setelah selesai fetching
      }
    };

    fetchVideoAndCommands();
  }, [id]);

  useEffect(() => {
    const handleFullscreen = (e: KeyboardEvent) => {
      if (e.key === 'f') {
        const videoElement = document.querySelector<HTMLVideoElement>('#video');
        if (videoElement) {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoElement.requestFullscreen();
          }
        }
      }
    };
    document.addEventListener('keydown', handleFullscreen);
    return () => {
      document.removeEventListener('keydown', handleFullscreen);
    };
  }, []);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommand) return;

    try {
      const response = await axios.post('/api/commands', {
        content: newCommand,
        videoId: id,
        userId,
      });
      setCommands([...commands, response.data]); // Tambahkan command baru ke daftar
      setNewCommand(''); // Reset input
    } catch (error) {
      console.error('Error submitting command:', error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!confirm('Are you sure you want to delete this video?')) return; // Konfirmasi sebelum menghapus
    try {
      await axios.delete(`/api/videos/${id}`); // Endpoint untuk menghapus video
      router.push('/videos'); // Redirect ke halaman video setelah dihapus
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading
  }

  if (!video) {
    return <div className="text-red-500">Video not found.</div>; // Pesan jika video tidak ada
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {video.title}
        {/* Cek jika userId dari sesi sama dengan userId video */}
        {userId === video.userId && (
          <FaTrash 
            className="inline-block ml-2 text-red-600 cursor-pointer hover:text-red-800" 
            onClick={handleDeleteVideo} 
            title="Delete Video" 
            />
        )}
      </h1>
      <video controls id="video" className="w-full h-auto mb-4">
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="mt-4">{video.description}</p>
  
      <form onSubmit={handleCommandSubmit} className="mt-4 text-black">
        <textarea
          value={newCommand}
          onChange={(e) => setNewCommand(e.target.value)}
          placeholder="Add a command..."
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600">
          Submit Command
        </button>
      </form>
  
      <h2 className="text-xl font-bold mt-8">Commands:</h2>
      <ul className="space-y-2">
        {commands.map(command => (
          <div key={command.id} className="flex flex-col">
            <li className="flex flex-col bg-[#303030] p-2 mb-2 rounded">
              <div className="flex items-center">
                <strong className="mr-2">{command.user?.username || 'Unknown User'}:</strong>
                <span className="flex-1">{command.content}</span>
              </div>
              {/* Cek jika command ini memiliki balasan */}
              {commands.filter(cmd => cmd.replyTo === command.id).map(reply => (
                <div key={reply.id} className="flex items-center bg-[#404040] p-2 mb-2 rounded ml-4 mt-2">
                  <strong className="mr-2 text-gray-300">{reply.user?.username || 'Unknown User'} (Reply):</strong>
                  <span className="flex-1">{reply.content}</span>
                </div>
              ))}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default VideoDetailPage;
