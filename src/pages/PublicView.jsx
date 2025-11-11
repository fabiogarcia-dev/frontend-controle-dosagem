import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function PublicView() {
  const [abertas, setAbertas] = useState([]);
  const [erro, setErro] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function carregarTarefas() {
      try {
        const res = await axios.get('http://localhost:3001/services/dia', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAbertas(res.data.abertas);
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
        setErro('Não foi possível carregar as tarefas');
      }
    }

    carregarTarefas();

    const intervalo = setInterval(() => {
      carregarTarefas();
    }, 30000);

    return () => clearInterval(intervalo);
  }, [token]);

  async function concluirServico(id) {
    try {
      await axios.post(`http://localhost:3001/services/concluir/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAbertas(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erro ao concluir serviço:', err);
    }
  }

  function sair() {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black font-sans px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-center sm:text-left">Dosagens Pendentes</h1>
          <button
            onClick={sair}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>

        <p className="mb-4 text-center sm:text-left text-gray-600">
          Data local: {dayjs().tz('America/Manaus').format('DD/MM/YYYY HH:mm')}
        </p>

        {erro && (
          <p className="text-red-600 font-medium mb-4 text-center sm:text-left">{erro}</p>
        )}

        {abertas.length === 0 ? (
          <p className="text-gray-500 text-center sm:text-left">Nenhuma tarefa pendente hoje.</p>
        ) : (
          <ul className="space-y-4">
            {abertas.map(servico => (
              <li
                key={servico.id}
                className="border border-gray-200 rounded p-4 bg-gray-50"
              >
                <p className="font-semibold text-lg text-blue-700 break-words">{servico.obra}</p>
                <p className="text-sm text-gray-700 mt-1 break-words">
                  <span className="font-medium">Betoneira:</span> {servico.betoneira} |{' '}
                  <span className="font-medium">Slump:</span> {servico.slump} L |{' '}
                  <span className="font-medium">Corte de água:</span> {servico.corte_agua} L |{' '}
                  <span className="font-medium">Aditivo:</span> {servico.aditivo} L
                </p>
                {servico.observacao && (
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    <span className="font-medium">Observação:</span> {servico.observacao}
                  </p>
                )}
                <button
                  onClick={() => concluirServico(servico.id)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Concluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PublicView;