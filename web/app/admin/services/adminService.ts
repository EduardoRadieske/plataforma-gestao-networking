import { apiFetch, LevelApi } from '@/lib/api';
import { IntencaoResponse } from '@/types/intencao';

export const buscarIntencoes = async (): Promise<IntencaoResponse[]> => {
  return apiFetch<IntencaoResponse[]>('/intencoes', {
    method: 'GET',
  }, LevelApi.PRIVATE);
};

export const aprovarIntencao = async (id: number): Promise<IntencaoResponse> => {
  return apiFetch<IntencaoResponse>(`/intencoes/${id}/aprovar`, {
    method: 'PUT',
  }, LevelApi.PRIVATE);
};

export const recusarIntencao = async (id: number): Promise<IntencaoResponse> => {
  return apiFetch<IntencaoResponse>(`/intencoes/${id}/recusar`, {
    method: 'PUT',
  }, LevelApi.PRIVATE);
};