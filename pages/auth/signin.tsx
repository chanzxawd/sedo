import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

const SignInPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      usernameOrEmail,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/"); // Arahkan ke halaman utama setelah berhasil login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="bg-[#303030] p-6 rounded-lg shadow-lg w-full max-w-md">
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label htmlFor="usernameOrEmail" className="block text-sm font-medium">Username or Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Login</button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign up</a>
      </p>
    </div>
  );
  
};

export default SignInPage;
