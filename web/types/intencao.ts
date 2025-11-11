export interface IntencaoInput {
  nome: string;
  email: string;
  empresa: string;
  mensagem: string;
}

export interface IntencaoResponse extends IntencaoInput {
  id: number;
  status: string;
  criado_em: string;
}