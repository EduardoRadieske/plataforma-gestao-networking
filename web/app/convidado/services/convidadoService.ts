import { apiFetch } from '@/lib/api';
import { StatusConvite } from '@/types/convite';
import { UsuarioInput, UsuarioResponse } from '@/types/usuario';

export const validarConvite = async (token: string): Promise<StatusConvite> => {
    return apiFetch<StatusConvite>(`/convites/validar/${token}`, {
        method: 'GET',
    });
};

export const registrarConvidado = async (token: string, data: UsuarioInput): Promise<UsuarioResponse> => {
    return apiFetch<UsuarioResponse>(`/auth/register/guest?token=${token}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};