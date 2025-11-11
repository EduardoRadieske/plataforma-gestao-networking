export interface IndicacaoInput {
  idIndicado: number;
  contato: string;
  descricao: string;
}

export interface IndicacaoResponse extends IndicacaoInput {
  id: number;
  idIndicador: string;
  criadoEm: string;
}