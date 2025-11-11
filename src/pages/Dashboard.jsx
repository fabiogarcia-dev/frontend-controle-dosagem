import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

function Dashboard() {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    betoneira: '',
    obra: '',
    slump: '',
    corte_agua: '',
    aditivo: '',
    dataAt: dayjs().tz('America/Manaus').format('YYYY-MM-DD'),
    observacao: ''
  });
  const [notificacao, setNotificacao] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  function normalizarNumero(valor) {
    return valor.replace(',', '.');
  }

  function validarCampos() {
    const campos = ['betoneira', 'obra', 'slump', 'corte_agua', 'aditivo'];
    for (const campo of campos) {
      if (!formData[campo] || formData[campo].trim() === '') {
        setNotificacao(`❌ O campo "${campo}" é obrigatório.`);
        setTimeout(() => setNotificacao(''), 4000);
        return false;
      }
    }
    return true;
  }

  async function salvarServico() {
    if (!validarCampos()) return;

    try {
      await axios.post('http://localhost:3001/services', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormVisible(false);
      setFormData({
        betoneira: '',
        obra: '',
        slump: '',
        corte_agua: '',
        aditivo: '',
        dataAt: dayjs().tz('America/Manaus').format('YYYY-MM-DD'),
        observacao: ''
      });

      setNotificacao('✅ Serviço lançado com sucesso!');
      setTimeout(() => setNotificacao(''), 4000);
    } catch (err) {
      console.error('Erro ao salvar serviço:', err);
      setNotificacao('❌ Erro ao lançar serviço.');
      setTimeout(() => setNotificacao(''), 4000);
    }
  }

  function sair() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black font-sans px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-center sm:text-left">Cadastro de Dosagem</h1>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <button
              onClick={() => navigate('/public')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Painel
            </button>
            <button
              onClick={() => navigate('/search')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Histórico
            </button>
            <button
              onClick={sair}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>

        <p className="mb-4 text-center sm:text-left">
          Data local: {dayjs().tz('America/Manaus').format('DD/MM/YYYY HH:mm')}
        </p>

        {notificacao && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center sm:text-left">
            {notificacao}
          </div>
        )}

        <div className="text-center sm:text-left">
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mb-4"
          >
            {formVisible ? 'Cancelar' : 'Adicionar Serviço'}
          </button>
        </div>

        {formVisible && (
          <div className="bg-white p-4 rounded shadow-md space-y-4 max-w-3xl mx-auto">
            <input
              placeholder="Betoneira"
              value={formData.betoneira}
              onChange={e => setFormData({ ...formData, betoneira: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              placeholder="Obra"
              value={formData.obra}
              onChange={e => setFormData({ ...formData, obra: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              placeholder="Slump (litros)"
              value={formData.slump}
              onChange={e => setFormData({ ...formData, slump: normalizarNumero(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              placeholder="Corte de Água (litros)"
              value={formData.corte_agua}
              onChange={e => setFormData({ ...formData, corte_agua: normalizarNumero(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              placeholder="Aditivo (litros)"
              value={formData.aditivo}
              onChange={e => setFormData({ ...formData, aditivo: normalizarNumero(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={formData.dataAt}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
            />
            <textarea
              placeholder="Observação (opcional)"
              value={formData.observacao}
              onChange={e => setFormData({ ...formData, observacao: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={salvarServico}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;