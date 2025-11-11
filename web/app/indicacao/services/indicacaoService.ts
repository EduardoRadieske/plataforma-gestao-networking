import { apiFetch, LevelApi } from '@/lib/api';
import { IndicacaoInput, IndicacaoResponse } from '@/types/indicacao';
import { UsuarioResponse } from '@/types/usuario';

export const criarIndicacao = async (data: IndicacaoInput): Promise<IndicacaoResponse> => {
  return apiFetch<IndicacaoResponse>('/indicacoes', {
    method: 'POST',
    body: JSON.stringify(data),
  }, LevelApi.PRIVATE);
};

export const buscarIndicacoes = async (): Promise<IndicacaoResponse[]> => {
  return apiFetch<IndicacaoResponse[]>('/indicacoes', {
    method: 'GET',
  }, LevelApi.PRIVATE);
};

export const alterarIndicacao = async (id: number, data: any ): Promise<IndicacaoResponse[]> => {
  return apiFetch<IndicacaoResponse[]>(`/indicacoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, LevelApi.PRIVATE);
};

export const buscarUsuarios = async (): Promise<UsuarioResponse[]> => {
  return apiFetch<UsuarioResponse[]>('/auth/users', {
    method: 'GET',
  }, LevelApi.PRIVATE);
};