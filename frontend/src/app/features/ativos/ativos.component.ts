import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinancialService } from '../../core/financial.service';
import { Ativo, AtivoReq, TIPOS_ATIVO } from '../../core/models';

@Component({
  selector: 'app-ativos',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="page">
      <h2>Ativos</h2>
      <p class="page-subtitle">Carteira de investimentos e proventos mensais.</p>
      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="salvar()">
            <div class="form-row">
              <mat-form-field><mat-label>Nome</mat-label><input matInput formControlName="nome"></mat-form-field>
              <mat-form-field><mat-label>Tipo</mat-label>
                <mat-select formControlName="tipo">
                  @for (t of tipos; track t.valor) { <mat-option [value]="t.valor">{{ t.rotulo }}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field><mat-label>Valor investido</mat-label><input matInput type="number" step="0.01" formControlName="valorInvestido"></mat-form-field>
              <mat-form-field><mat-label>Valor atual</mat-label><input matInput type="number" step="0.01" formControlName="valorAtual"></mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field><mat-label>Rentabilidade estimada (%)</mat-label><input matInput type="number" step="0.01" formControlName="rentabilidadeEstimada"></mat-form-field>
              <mat-form-field><mat-label>Periodicidade</mat-label>
                <mat-select formControlName="periodicidadeRentabilidade">
                  <mat-option [value]="null">—</mat-option>
                  <mat-option value="ANUAL">% a.a.</mat-option>
                  <mat-option value="MENSAL">% a.m.</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field><mat-label>Proventos mensais (R$)</mat-label><input matInput type="number" step="0.01" formControlName="proventosMensais"></mat-form-field>
            </div>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
              {{ editandoId() ? 'Atualizar' : 'Adicionar' }}
            </button>
            @if (editandoId()) { <button mat-button type="button" (click)="cancelar()">Cancelar</button> }
          </form>
        </mat-card-content>
      </mat-card>

      <table class="simple" style="margin-top: 16px">
        <thead><tr><th>Nome</th><th>Tipo</th><th class="num">Investido</th><th class="num">Atual</th><th class="num">Proventos/mês</th><th></th></tr></thead>
        <tbody>
          @for (a of ativos(); track a.id) {
            <tr>
              <td>{{ a.nome }}</td><td>{{ rotulo(a.tipo) }}</td>
              <td class="num">{{ a.valorInvestido | currency: 'BRL' }}</td>
              <td class="num">{{ a.valorAtual | currency: 'BRL' }}</td>
              <td class="num">{{ a.proventosMensais | currency: 'BRL' }}</td>
              <td class="num">
                <span class="acoes">
                  <button mat-button (click)="editar(a)">Editar</button>
                  <button mat-button color="warn" (click)="remover(a)">Excluir</button>
                </span>
              </td>
            </tr>
          } @empty { <tr><td colspan="6">Nenhum ativo cadastrado.</td></tr> }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    mat-card { padding: 12px 8px 16px; }
    .acoes button { margin-left: 4px; }
  `],
})
export class AtivosComponent implements OnInit {
  private readonly api = inject(FinancialService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly tipos = TIPOS_ATIVO;
  readonly ativos = signal<Ativo[]>([]);
  readonly editandoId = signal<string | null>(null);

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    tipo: ['FIIS' as AtivoReq['tipo'], Validators.required],
    valorInvestido: [0, [Validators.required, Validators.min(0)]],
    valorAtual: [0, [Validators.required, Validators.min(0)]],
    rentabilidadeEstimada: [null as number | null],
    periodicidadeRentabilidade: [null as AtivoReq['periodicidadeRentabilidade']],
    proventosMensais: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void { this.carregar(); }

  rotulo(tipo: string): string { return this.tipos.find(t => t.valor === tipo)?.rotulo ?? tipo; }

  salvar(): void {
    const corpo = this.form.getRawValue() as AtivoReq;
    const id = this.editandoId();
    const req$ = id ? this.api.ativos.atualizar(id, corpo) : this.api.ativos.criar(corpo);
    req$.subscribe({
      next: () => { this.cancelar(); this.carregar(); },
      error: (e: HttpErrorResponse) => this.snack.open(e.error?.detail ?? 'Erro ao salvar.', 'OK', { duration: 4000 }),
    });
  }

  editar(a: Ativo): void {
    this.editandoId.set(a.id);
    this.form.reset({ ...a });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form.reset({ tipo: 'FIIS', valorInvestido: 0, valorAtual: 0, proventosMensais: 0 });
  }

  remover(a: Ativo): void {
    if (!confirm(`Excluir "${a.nome}"?`)) return;
    this.api.ativos.remover(a.id).subscribe(() => this.carregar());
  }

  private carregar(): void { this.api.ativos.listar().subscribe(l => this.ativos.set(l)); }
}