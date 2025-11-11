export interface UsuarioInput {
  nome: string;
  email: string;
  password: string;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
}