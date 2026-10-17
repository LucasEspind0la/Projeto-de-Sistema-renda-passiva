import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from './api.config';
import {
  Ativo, AtivoReq, Despesa, DespesaReq, Divida, DividaReq,
  PagamentoReq, Receita, ReceitaReq, ResumoFinanceiro,
} from './models';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  private readonly http = inject(HttpClient);

  readonly receitas = this.crud<ReceitaReq, Receita>('receitas');
  readonly despesas = this.crud<DespesaReq, Despesa>('despesas');
  readonly ativos = this.crud<AtivoReq, Ativo>('ativos');
  readonly dividas = this.crud<DividaReq, Divida>('dividas');

  resumo(mes: string) {
    return this.http.get<ResumoFinanceiro>(`${API_URL}/dashboard/resumo`, { params: { mes } });
  }

  registrarPagamento(body: PagamentoReq) {
    return this.http.post(`${API_URL}/pagamentos`, body);
  }

  private crud<Req, Res>(recurso: string) {
    const url = `${API_URL}/${recurso}`;
    return {
      listar: () => this.http.get<Res[]>(url),
      criar: (b: Req) => this.http.post<Res>(url, b),
      atualizar: (id: string, b: Req) => this.http.put<Res>(`${url}/${id}`, b),
      remover: (id: string) => this.http.delete<void>(`${url}/${id}`),
    };
  }
}
