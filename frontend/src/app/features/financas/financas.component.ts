import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { FinancialService } from '../../core/financial.service';
import { Despesa, DespesaReq, Divida, DividaReq, Receita, ReceitaReq } from '../../core/models';

const hoje = () => new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-financas',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="page">
      <h2>Finanças</h2>
      <p class="page-subtitle">Receitas, despesas e dívidas do mês.</p>
      <mat-tab-group>

        <mat-tab label="Receitas">
          <form [formGroup]="receitaForm" (ngSubmit)="salvarReceita()" class="aba">
            <div class="form-row">
              <mat-form-field><mat-label>Descrição</mat-label><input matInput formControlName="descricao"></mat-form-field>
              <mat-form-field><mat-label>Valor</mat-label><input matInput type="number" step="0.01" formControlName="valor"></mat-form-field>
              <mat-form-field><mat-label>Categoria</mat-label><input matInput formControlName="categoria"></mat-form-field>
              <mat-form-field><mat-label>Tipo</mat-label>
                <mat-select formControlName="tipo"><mat-option value="ATIVA">Ativa</mat-option><mat-option value="PASSIVA">Passiva</mat-option></mat-select></mat-form-field>
              <mat-form-field><mat-label>Recorrência</mat-label>
                <mat-select formControlName="recorrencia"><mat-option value="UNICA">Única</mat-option><mat-option value="MENSAL">Mensal</mat-option><mat-option value="ANUAL">Anual</mat-option></mat-select></mat-form-field>
              <mat-form-field><mat-label>Data</mat-label><input matInput type="date" formControlName="data"></mat-form-field>
            </div>
            <button mat-flat-button color="primary" [disabled]="receitaForm.invalid">Adicionar receita</button>
          </form>
          <table class="simple">
            <thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Recorrência</th><th>Data</th><th class="num">Valor</th><th></th></tr></thead>
            <tbody>
              @for (r of receitas(); track r.id) {
                <tr><td>{{ r.descricao }}</td><td>{{ r.categoria }}</td><td>{{ r.tipo }}</td><td>{{ r.recorrencia }}</td>
                  <td>{{ r.data | date: 'dd/MM/yyyy' }}</td><td class="num">{{ r.valor | currency: 'BRL' }}</td>
                  <td><button mat-button color="warn" (click)="remover(api.receitas.remover(r.id))">Excluir</button></td></tr>
              } @empty { <tr><td colspan="7">Nenhuma receita.</td></tr> }
            </tbody>
          </table>
        </mat-tab>

        <mat-tab label="Despesas">
          <form [formGroup]="despesaForm" (ngSubmit)="salvarDespesa()" class="aba">
            <div class="form-row">
              <mat-form-field><mat-label>Descrição</mat-label><input matInput formControlName="descricao"></mat-form-field>
              <mat-form-field><mat-label>Valor</mat-label><input matInput type="number" step="0.01" formControlName="valor"></mat-form-field>
              <mat-form-field><mat-label>Categoria</mat-label><input matInput formControlName="categoria"></mat-form-field>
              <mat-form-field><mat-label>Tipo</mat-label>
                <mat-select formControlName="tipo"><mat-option value="FIXO">Fixo</mat-option><mat-option value="VARIAVEL">Variável</mat-option></mat-select></mat-form-field>
              <mat-form-field><mat-label>Vencimento</mat-label><input matInput type="date" formControlName="dataVencimento"></mat-form-field>
              <mat-form-field><mat-label>Status</mat-label>
                <mat-select formControlName="status"><mat-option value="PENDENTE">Pendente</mat-option><mat-option value="PAGO">Pago</mat-option></mat-select></mat-form-field>
            </div>
            <button mat-flat-button color="primary" [disabled]="despesaForm.invalid">Adicionar despesa</button>
          </form>
          <table class="simple">
            <thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Vencimento</th><th>Status</th><th class="num">Valor</th><th></th></tr></thead>
            <tbody>
              @for (d of despesas(); track d.id) {
                <tr><td>{{ d.descricao }}</td><td>{{ d.categoria }}</td><td>{{ d.tipo }}</td>
                  <td>{{ d.dataVencimento | date: 'dd/MM/yyyy' }}</td><td>{{ d.status }}</td><td class="num">{{ d.valor | currency: 'BRL' }}</td>
                  <td>
                    @if (d.status === 'PENDENTE') { <button mat-button (click)="pagarDespesa(d)">Pagar</button> }
                    <button mat-button color="warn" (click)="remover(api.despesas.remover(d.id))">Excluir</button>
                  </td></tr>
              } @empty { <tr><td colspan="7">Nenhuma despesa.</td></tr> }
            </tbody>
          </table>
        </mat-tab>

        <mat-tab label="Dívidas">
          <form [formGroup]="dividaForm" (ngSubmit)="salvarDivida()" class="aba">
            <div class="form-row">
              <mat-form-field><mat-label>Descrição</mat-label><input matInput formControlName="descricao"></mat-form-field>
              <mat-form-field><mat-label>Valor total</mat-label><input matInput type="number" step="0.01" formControlName="valorTotal"></mat-form-field>
              <mat-form-field><mat-label>Valor remanescente</mat-label><input matInput type="number" step="0.01" formControlName="valorRemanescente"></mat-form-field>
              <mat-form-field><mat-label>Juros (% a.m.)</mat-label><input matInput type="number" step="0.01" formControlName="taxaJurosMensal"></mat-form-field>
              <mat-form-field><mat-label>Vencimento final</mat-label><input matInput type="date" formControlName="dataVencimentoTotal"></mat-form-field>
            </div>
            <button mat-flat-button color="primary" [disabled]="dividaForm.invalid">Adicionar dívida</button>
          </form>
          <table class="simple">
            <thead><tr><th>Descrição</th><th class="num">Total</th><th class="num">Remanescente</th><th class="num">Juros a.m.</th><th>Vence em</th><th></th></tr></thead>
            <tbody>
              @for (d of dividas(); track d.id) {
                <tr><td>{{ d.descricao }}</td><td class="num">{{ d.valorTotal | currency: 'BRL' }}</td>
                  <td class="num">{{ d.valorRemanescente | currency: 'BRL' }}</td><td class="num">{{ d.taxaJurosMensal }}%</td>
                  <td>{{ d.dataVencimentoTotal | date: 'dd/MM/yyyy' }}</td>
                  <td>
                    <button mat-button (click)="pagarDivida(d)">Pagar</button>
                    <button mat-button color="warn" (click)="remover(api.dividas.remover(d.id))">Excluir</button>
                  </td></tr>
              } @empty { <tr><td colspan="6">Nenhuma dívida.</td></tr> }
            </tbody>
          </table>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .aba { padding: 20px 0; display: block; }
    table.simple { margin-top: 8px; }
  `],
})
export class FinancasComponent implements OnInit {
  readonly api = inject(FinancialService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly receitas = signal<Receita[]>([]);
  readonly despesas = signal<Despesa[]>([]);
  readonly dividas = signal<Divida[]>([]);

  readonly receitaForm = this.fb.group({
    descricao: ['', Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    categoria: ['', Validators.required],
    tipo: ['ATIVA' as ReceitaReq['tipo'], Validators.required],
    recorrencia: ['MENSAL' as ReceitaReq['recorrencia'], Validators.required],
    data: [hoje(), Validators.required],
  });

  readonly despesaForm = this.fb.group({
    descricao: ['', Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    categoria: ['', Validators.required],
    tipo: ['FIXO' as DespesaReq['tipo'], Validators.required],
    dataVencimento: [hoje(), Validators.required],
    status: ['PENDENTE' as DespesaReq['status'], Validators.required],
  });

  readonly dividaForm = this.fb.group({
    descricao: ['', Validators.required],
    valorTotal: [0, [Validators.required, Validators.min(0.01)]],
    valorRemanescente: [0, [Validators.required, Validators.min(0)]],
    taxaJurosMensal: [0, [Validators.required, Validators.min(0)]],
    dataVencimentoTotal: [hoje(), Validators.required],
  });

  ngOnInit(): void { this.carregarTudo(); }

  salvarReceita(): void {
    this.executar(this.api.receitas.criar(this.receitaForm.getRawValue()), () => this.receitaForm.patchValue({ descricao: '', valor: 0 }));
  }

  salvarDespesa(): void {
    this.executar(this.api.despesas.criar(this.despesaForm.getRawValue()), () => this.despesaForm.patchValue({ descricao: '', valor: 0 }));
  }

  salvarDivida(): void {
    this.executar(this.api.dividas.criar(this.dividaForm.getRawValue()), () => this.dividaForm.patchValue({ descricao: '', valorTotal: 0, valorRemanescente: 0 }));
  }

  pagarDespesa(d: Despesa): void {
    this.executar(this.api.registrarPagamento({ despesaId: d.id, valorPago: d.valor, dataPagamento: hoje() }));
  }

  pagarDivida(d: Divida): void {
    const texto = prompt(`Valor pago em "${d.descricao}" (restam ${d.valorRemanescente}):`);
    const valor = Number(texto?.replace(',', '.'));
    if (!texto || !(valor > 0)) return;
    this.executar(this.api.registrarPagamento({ dividaId: d.id, valorPago: valor, dataPagamento: hoje() }));
  }

  remover(req$: Observable<unknown>): void {
    if (confirm('Excluir este registro?')) this.executar(req$);
  }

  private executar(req$: Observable<unknown>, aoSucesso?: () => void): void {
    req$.subscribe({
      next: () => { aoSucesso?.(); this.carregarTudo(); },
      error: (e: HttpErrorResponse) => this.snack.open(e.error?.detail ?? 'Erro ao processar.', 'OK', { duration: 4000 }),
    });
  }

  private carregarTudo(): void {
    this.api.receitas.listar().subscribe(l => this.receitas.set(l));
    this.api.despesas.listar().subscribe(l => this.despesas.set(l));
    this.api.dividas.listar().subscribe(l => this.dividas.set(l));
  }
}