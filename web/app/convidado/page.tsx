'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { validarConvite, registrarConvidado } from './services/convidadoService';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function ConvidadoPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(true);
  const [validando, setValidando] = useState(false);
  const [success, setSuccess] = useState(false);
  const [conviteValido, setConviteValido] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const validar = async () => {
      if (!token) {
        setError('Token de convite ausente.');
        setLoading(false);
        return;
      }

      try {
        const result = await validarConvite(token);

        if (result?.valido) {
          setConviteValido(true);
        } else {
          setError('Convite inválido ou expirado.');
        }
      } catch (err: any) {
        setError('Erro ao validar convite: ' +  err);
      } finally {
        setLoading(false);
      }
    };

    validar();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setValidando(true);
    setError('');

    try {
      await registrarConvidado(token, formData);
      
      setSuccess(true);
      setFormData({ nome: '', email: '', password: '' });
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar convidado.');
    } finally {
      setValidando(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center text-blue-600">
          Cadastro de Convidado
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Validando convite...</p>
        ) : !conviteValido ? (
          <p className="text-center text-red-500">{error || 'Convite inválido.'}</p>
        ) : success ? (
          <p className="text-green-600 text-center">
            🎉 Cadastro concluído com sucesso!  
            <br />
            Agora você já pode fazer login.
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
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button type="submit" loading={validando} className="w-full">
              Finalizar Cadastro
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}