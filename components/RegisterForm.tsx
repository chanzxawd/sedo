import { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      // Reset form fields
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Register</h2>
      {message && <p className="text-red-500">{message}</p>}
      <div className="mb-4">
        <label className="block text-sm">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
