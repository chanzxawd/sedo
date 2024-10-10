import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        usernameOrEmail,
        password,
      });
      setMessage(response.data.message);
      // Redirect or perform other actions after successful login
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Login</h2>
      {message && <p className="text-red-500">{message}</p>}
      <div className="mb-4">
        <label className="block text-sm">Username or Email</label>
        <input
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
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
        Login
      </button>
    </form>
  );
};

export default LoginForm;
