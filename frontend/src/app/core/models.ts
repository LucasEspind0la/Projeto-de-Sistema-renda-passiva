export type TipoReceita = 'ATIVA' | 'PASSIVA';
export type Recorrencia = 'UNICA' | 'MENSAL' | 'ANUAL';
export type TipoDespesa = 'FIXO' | 'VARIAVEL';
export type StatusDespesa = 'PAGO' | 'PENDENTE';
export type TipoAtivo = 'ACOES' | 'FIIS' | 'RENDA_FIXA' | 'IMOVEIS' | 'CRIPTO';
export type Periodicidade = 'ANUAL' | 'MENSAL';

export const TIPOS_ATIVO: { valor: TipoAtivo; rotulo: string }[] = [
  { valor: 'ACOES', rotulo: 'Ações' },
  { valor: 'FIIS', rotulo: 'FIIs' },
  { valor: 'RENDA_FIXA', rotulo: 'Renda Fixa' },
  { valor: 'IMOVEIS', rotulo: 'Imóveis' },
  { valor: 'CRIPTO', rotulo: 'Cripto' },
];

export interface LoginReq { email: string; senha: string; }
export interface RegistroReq extends LoginReq { nome: string; }
export interface TokenRes { token: string; nome: string; expiraEm: string; }

export interface ReceitaReq {
  descricao: string; valor: number; categoria: string;
  tipo: TipoReceita; recorrencia: Recorrencia; data: string;
}
export interface Receita extends ReceitaReq { id: string; }

export interface DespesaReq {
  descricao: string; valor: number; categoria: string;
  tipo: TipoDespesa; dataVencimento: string; status: StatusDespesa;
}
export interface Despesa extends DespesaReq { id: string; }

export interface AtivoReq {
  nome: string; tipo: TipoAtivo; valorInvestido: number; valorAtual: number;
  rentabilidadeEstimada: number | null; periodicidadeRentabilidade: Periodicidade | null;
  proventosMensais: number;
}
export interface Ativo extends AtivoReq { id: string; }

export interface DividaReq {
  descricao: string; valorTotal: number; valorRemanescente: number;
  taxaJurosMensal: number; dataVencimentoTotal: string;
}
export interface Divida extends DividaReq { id: string; }

export interface PagamentoReq {
  dividaId?: string; despesaId?: string; valorPago: number;
  dataPagamento: string; observacao?: string;
}

export interface ResumoFinanceiro {
  mes: string;
  receitasMes: number; gastosMes: number; saldoAtual: number;
  totalAtivos: number; totalDividas: number; patrimonioLiquido: number;
  rendaPassivaMensal: number; gastosFixosMensais: number;
  coberturaIndependenciaPct: number | null;
  patrimonioPorTipo: Record<string, number>;
  gastosPorCategoria: Record<string, number>;
}
