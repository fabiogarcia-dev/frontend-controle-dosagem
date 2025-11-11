import { useState } from 'react';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('loginDate', new Date());
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Usuário ou senha inválidos');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 px-4 overflow-hidden">
      {/* Imagem de fundo com opacidade */}
      <img
        src="/bg-login.jpg"
        alt="Fundo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Formulário de login */}
      <div className="relative z-10 w-100 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white bg-opacity-90 p-6 sm:p-8 rounded shadow-md flex flex-col items-center">
        <img
          src="/logo-usemix.png"
          alt="Logo"
          className="w-full max-h-24 object-contain mb-6"
        />
        <h2 className="text-2xl font-semibold mb-6 text-black text-center">Login</h2>

        <input
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}