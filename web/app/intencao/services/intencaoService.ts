import { apiFetch } from '@/lib/api';
import { IntencaoInput, IntencaoResponse } from '@/types/intencao';

export const criarIntencao = async (data: IntencaoInput): Promise<IntencaoResponse> => {
  return apiFetch<IntencaoResponse>('/intencoes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};