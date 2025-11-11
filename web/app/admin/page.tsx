'use client';

import { useEffect, useState } from 'react';
import { buscarIntencoes, aprovarIntencao, recusarIntencao } from './services/adminService';
import { IntencaoResponse } from '@/types/intencao';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function AdminPage() {
  const [intencoes, setIntencoes] = useState<IntencaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  const carregarIntencoes = async () => {
    try {
      setLoading(true);
      const data = await buscarIntencoes();
      setIntencoes(data);
    } catch (err) {
      setError('Erro ao carregar intenções: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcao = async (id: number, tipo: 'aprovar' | 'recusar') => {
    try {
      setProcessing(id);

      switch(tipo) {
        case 'aprovar':
            await aprovarIntencao(id);
            break;
        case 'recusar':
            await recusarIntencao(id);
            break;
      }

      await carregarIntencoes();
    } catch (err) {
      setError('Erro ao atualizar intenção: ' + err);
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    carregarIntencoes();
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] p-6 max-w-5xl mx-auto">
        <div className="flex gap-1">
            <img src="/file.svg" alt="Arquivo" className="w-5 h-5 inline-block mt-1" />
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Área Administrativa</h1>
        </div>

      {loading && <p className="text-gray-500">Carregando intenções...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && intencoes.filter((item) => item.status === 'PENDENTE').length === 0 && (
        <p className="text-gray-600">Nenhuma intenção pendente.</p>
      )}

      <div className="grid gap-4">
        {intencoes.filter((item) => item.status === 'PENDENTE').map((item) => (
          <Card key={item.id} className="p-5 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <div className="flex gap-1">
                    <img src="/globe.svg" alt="Globo" className="w-5 h-5 inline-block mt-1" />
                    <h2 className="font-semibold text-lg text-gray-800">{item.nome}</h2>
                </div>
                <p className="text-sm text-gray-600">{item.email}</p>
                <p className="text-sm text-gray-600">{item.empresa}</p>
                {item.mensagem && (
                  <p className="text-sm text-gray-700 mt-1 italic">"{item.mensagem}"</p>
                )}
                <p
                  className={`mt-2 text-sm font-medium ${
                    item.status === 'APROVADA'
                      ? 'text-green-600'
                      : item.status === 'RECUSADA'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  Status: {item.status}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAcao(item.id, 'aprovar')}
                  disabled={processing === item.id || item.status !== 'PENDENTE'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing === item.id ? '...' : 'Aprovar'}
                </Button>

                <Button
                  onClick={() => handleAcao(item.id, 'recusar')}
                  disabled={processing === item.id || item.status !== 'PENDENTE'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {processing === item.id ? '...' : 'Recusar'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}