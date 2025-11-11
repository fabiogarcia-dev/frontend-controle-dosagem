import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Search() {
  const [data, setData] = useState('');
  const [resultadosHoje, setResultadosHoje] = useState([]);
  const [resultadosHistorico, setResultadosHistorico] = useState([]);
  const navigate = useNavigate();

  const hoje = dayjs().tz('America/Manaus').format('DD/MM/YYYY');

  const carregarHoje = async () => {
    try {
      const res = await api.get('/services/dia');
      const todos = [...res.data.abertas, ...res.data.concluidas];
      setResultadosHoje(todos);
    } catch (err) {
      console.error('Erro ao carregar tarefas do dia:', err);
    }
  };

  useEffect(() => {
    carregarHoje();
  }, []);

  const buscar = async () => {
    if (!data) return;
    try {
      const res = await api.get(`/services/historico?data=${data}`);
      const todos = [...res.data.abertas, ...res.data.concluidas];
      setResultadosHistorico(todos);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    }
  };

  const sair = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black font-sans px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        {/* ✅ Botões de navegação */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Painel
          </button>
          <button
            onClick={sair}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
          Tarefas do Dia ({hoje})
        </h2>

        <div className="text-center sm:text-left">
          <button
            onClick={carregarHoje}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🔄 Atualizar
          </button>
        </div>

        {resultadosHoje.length === 0 ? (
          <p className="text-gray-500 text-center sm:text-left">
            Nenhuma tarefa registrada hoje.
          </p>
        ) : (
          <div className="space-y-4">
            {resultadosHoje.map(r => (
              <div key={r.id} className="border border-gray-200 rounded p-4 bg-gray-50">
                <p className="font-semibold text-blue-700 break-words">{r.obra}</p>
                <p className="text-sm text-gray-700 mt-1 break-words">
                  <span className="font-medium">Betoneira:</span> {r.betoneira} |{' '}
                  <span className="font-medium">Slump:</span> {r.slump} L |{' '}
                  <span className="font-medium">Corte de água:</span> {r.corte_agua} L |{' '}
                  <span className="font-medium">Aditivo:</span> {r.aditivo} L |{' '}
                  <span className="font-medium">Status:</span> {r.status}
                </p>
                {r.observacao && (
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    <span className="font-medium">Observação:</span> {r.observacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <hr className="my-8 border-gray-300" />

        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Pesquisar Histórico</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded w-full sm:w-auto"
          />
          <button
            onClick={buscar}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Buscar
          </button>
        </div>

        {resultadosHistorico.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2 text-center sm:text-left">
              Resultados de {dayjs(data).format('DD/MM/YYYY')}
            </h3>
            {resultadosHistorico.map(r => (
              <div key={r.id} className="border border-gray-200 rounded p-4 bg-gray-50">
                <p className="font-semibold text-blue-700 break-words">{r.obra}</p>
                <p className="text-sm text-gray-700 mt-1 break-words">
                  <span className="font-medium">Betoneira:</span> {r.betoneira} |{' '}
                  <span className="font-medium">Slump:</span> {r.slump} L |{' '}
                  <span className="font-medium">Corte de água:</span> {r.corte_agua} L |{' '}
                  <span className="font-medium">Aditivo:</span> {r.aditivo} L |{' '}
                  <span className="font-medium">Status:</span> {r.status} |{' '}
                  <span className="font-medium">Concluído:</span>{' '}
                  {r.dataConclusao
                    ? dayjs(r.dataConclusao).tz('America/Manaus').format('DD/MM/YYYY')
                    : '—'}
                </p>
                {r.observacao && (
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    <span className="font-medium">Observação:</span> {r.observacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}