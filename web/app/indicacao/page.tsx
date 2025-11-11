'use client';

import { useEffect, useState } from 'react';
import { buscarIndicacoes, alterarIndicacao, buscarUsuarios } from './services/indicacaoService';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { usuarioLogado } from '@/lib/user';
import { IndicacaoForm } from './components/IndicacaoForm';

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const userId = usuarioLogado().id;

  const carregarIndicacoes = async () => {
    try {
      const dados = await buscarIndicacoes();
      setIndicacoes(dados);

      const users = await buscarUsuarios();
      setUsuarios(users);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar indicações: ' + err);
    }
  };

  useEffect(() => {
    carregarIndicacoes();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await alterarIndicacao(id, { status });
      await carregarIndicacoes();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-start bg-gray-50 py-10 px-4 relative">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">🤝 Indicações</h1>
        <Button onClick={() => setShowForm(true)}>+ Nova Indicação</Button>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-3">{error}</p>
      )}

      <div className="w-full max-w-3xl space-y-4">
        {indicacoes.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhuma indicação encontrada.</p>
        ) : (
          indicacoes.map((ind) => (
            <Card key={ind.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-blue-700">{ind.contato}</h2>
                  <p className="text-gray-600 text-sm">{ind.descricao}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Criado em: {new Date(ind.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={ind.status}
                    onChange={(e) => handleStatusChange(ind.id, e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-sm"
                  >
                    <option value="NOVA">Nova</option>
                    <option value="EM_CONTATO">Em Contato</option>
                    <option value="FECHADA">Fechada</option>
                    <option value="RECUSADA">Recusada</option>
                  </select>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <IndicacaoForm
          usuarios={usuarios.filter((u) => u.id !== userId)}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            carregarIndicacoes();
          }}
        />
      )}
    </main>
  );
}
