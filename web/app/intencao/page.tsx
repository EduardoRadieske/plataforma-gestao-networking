'use client';

import { useState } from 'react';
import { criarIntencao } from './services/intencaoService';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function IntencaoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    mensagem: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      await criarIntencao(formData);

      setSuccess(true);
      setFormData({ nome: '', email: '', empresa: '', mensagem: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Intenção de Participação</h1>

        {success ? (
          <p className="text-green-600 text-center">
            🎉 Sua intenção foi enviada com sucesso!
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <FormInput
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Por que você quer participar?
              </label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button type="submit" loading={loading} className="w-full">
              Enviar Intenção
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}