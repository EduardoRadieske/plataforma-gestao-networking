'use client';

import { useState } from 'react';
import { criarIndicacao } from '../services/indicacaoService';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export function IndicacaoForm({ usuarios, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    idIndicado: '',
    contato: '',
    descricao: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await criarIndicacao({
        idIndicado: Number(formData.idIndicado),
        contato: formData.contato,
        descricao: formData.descricao,
      });
      setSuccess(true);
      setFormData({ idIndicado: '', contato: '', descricao: '' });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar indicação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <Card className="relative w-full max-w-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <img
            src="/close.svg"
            alt="Fechar"
            className="w-5 h-5 opacity-80 hover:opacity-100 transition"
          />
        </button>

        <h2 className="text-lg font-bold text-blue-600 mb-4 text-center">
          Nova Indicação
        </h2>

        {success ? (
          <p className="text-green-600 text-center mb-3">
            🎉 Indicação criada com sucesso!
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Membro indicado
              </label>
              <select
                name="idIndicado"
                value={formData.idIndicado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione...</option>
                {usuarios.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Empresa / Contato Indicado"
              name="contato"
              value={formData.contato}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Descrição da Oportunidade
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva brevemente a oportunidade..."
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button type="submit" loading={loading} className="w-full">
              Criar Indicação
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
