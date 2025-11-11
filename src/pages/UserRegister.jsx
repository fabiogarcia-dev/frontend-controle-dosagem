import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function UserRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const perfil = localStorage.getItem('role');

  if (perfil !== 'admin') {
    navigate('/public');
    return null;
  }

  const registrar = async () => {
    if (!username || !password) {
      setMensagem('Preencha todos os campos');
      return;
    }

    try {
      await api.post(
        '/auth/register',
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem('✅ Usuário criado com sucesso!');
      setUsername('');
      setPassword('');
      setRole('user');
    } catch (err) {
      console.error(err);
      setMensagem('❌ Erro ao criar usuário');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black font-sans">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Cadastro de Usuário</h2>

        {mensagem && (
          <div className="mb-4 text-sm text-center text-blue-700 bg-blue-100 border border-blue-300 px-4 py-2 rounded">
            {mensagem}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>

        <button
          onClick={registrar}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Criar Usuário
        </button>
      </div>
    </div>
  );
}