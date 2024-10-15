import axios        from "axios";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");

  const RegisterHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users/register", {
        username,
        email,
        password,
      });

      setMessage(response.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Error registering user");
    }
  };

  return (
    <div className = "flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white p-4">
    <h1  className = "text-2xl font-bold mb-6">Register</h1>
      <form
        className = "bg-[#303030] p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit  = {RegisterHandler}
      >
        <div   className = "mb-4">
        <label htmlFor   = "username" className = "block text-sm font-medium">
            Username
          </label>
          <input
            type      = "text"
            id        = "username"
            value     = {username}
            onChange  = {(e) => setUsername(e.target.value)}
            className = "mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
            required
          />
        </div>
        <div   className = "mb-4">
        <label htmlFor   = "email" className = "block text-sm font-medium">
            Email
          </label>
          <input
            type      = "email"
            id        = "email"
            value     = {email}
            onChange  = {(e) => setEmail(e.target.value)}
            className = "mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
            required
          />
        </div>
        <div   className = "mb-4">
        <label htmlFor   = "password" className = "block text-sm font-medium">
            Password
          </label>
          <input
            type      = "password"
            id        = "password"
            value     = {password}
            onChange  = {(e) => setPassword(e.target.value)}
            className = "mt-1 p-2 border border-gray-600 bg-[#424242] rounded w-full text-white"
            required
          />
        </div>
        {message && <p className="text-red-500">{message}</p>}
        <button
          type      = "submit"
          className = "w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <a href="/auth/signin" className="text-blue-500">Sign in</a>
      </p>
    </div>
  );
}
