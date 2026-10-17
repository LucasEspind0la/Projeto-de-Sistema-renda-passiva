import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart, registerables } from 'chart.js';
import { FinancialService } from '../../core/financial.service';
import { ResumoFinanceiro, TIPOS_ATIVO } from '../../core/models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, MatCardModule, MatProgressBarModule],
  template: `
    <div class="page">
      <div class="topo">
        <div>
          <h2>Visão geral</h2>
          <p class="page-subtitle">Acompanhe seu progresso rumo à independência financeira.</p>
        </div>
        <label class="mes">Mês <input type="month" [value]="mes()" (change)="mudarMes($any($event.target).value)"></label>
      </div>

      @if (resumo(); as r) {
        <div class="grid cards">
          <mat-card class="kpi kpi-saldo">
            <mat-card-content>
              <span class="chip" style="background: rgba(96,165,250,.14); color: var(--blue)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/></svg>
              </span>
              <span class="rotulo">Saldo atual</span>
              <h1 [class.positivo]="r.saldoAtual >= 0" [class.negativo]="r.saldoAtual < 0">
                {{ r.saldoAtual | currency: 'BRL' }}</h1>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi kpi-renda">
            <mat-card-content>
              <span class="chip" style="background: rgba(52,211,153,.14); color: var(--accent)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l5-6 4 3 7-10"/></svg>
              </span>
              <span class="rotulo">Renda passiva mensal</span>
              <h1 class="positivo">{{ r.rendaPassivaMensal | currency: 'BRL' }}</h1>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi kpi-gastos">
            <mat-card-content>
              <span class="chip" style="background: rgba(248,113,113,.14); color: var(--red)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M5 8h14M5 16h9"/></svg>
              </span>
              <span class="rotulo">Gastos do mês</span>
              <h1>{{ r.gastosMes | currency: 'BRL' }}</h1>
              <small>Fixos: {{ r.gastosFixosMensais | currency: 'BRL' }}</small>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi kpi-patrimonio">
            <mat-card-content>
              <span class="chip" style="background: rgba(251,191,36,.14); color: var(--gold)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>
              </span>
              <span class="rotulo">Patrimônio líquido</span>
              <h1>{{ r.patrimonioLiquido | currency: 'BRL' }}</h1>
              <small>Ativos {{ r.totalAtivos | currency: 'BRL' }} − Dívidas {{ r.totalDividas | currency: 'BRL' }}</small>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="cobertura">
          <mat-card-header><mat-card-subtitle>Cobertura de independência financeira</mat-card-subtitle></mat-card-header>
          <mat-card-content>
            @if (r.coberturaIndependenciaPct === null) {
              <p class="aviso">Cadastre despesas fixas no mês para calcular a cobertura.</p>
            } @else {
              <div class="cobertura-linha">
                <h1>{{ r.coberturaIndependenciaPct | number: '1.0-2' }}%</h1>
                <mat-progress-bar class="barra-cobertura" mode="determinate" [value]="min(r.coberturaIndependenciaPct, 100)" />
              </div>
              <small>Percentual das despesas fixas que a renda passiva já paga.</small>
            }
          </mat-card-content>
        </mat-card>
      } @else {
        <p class="carregando">Carregando…</p>
      }

      <div class="grid graficos">
        <mat-card><mat-card-header><mat-card-subtitle>Fluxo do mês</mat-card-subtitle></mat-card-header>
          <mat-card-content><canvas #fluxo></canvas></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-subtitle>Patrimônio por tipo de ativo</mat-card-subtitle></mat-card-header>
          <mat-card-content><canvas #patrimonio></canvas></mat-card-content></mat-card>
      </div>
    </div>
  `,
  styles: [`
    .topo { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 8px; }
    .mes { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13.5px; font-weight: 500; }
    .mes input {
      background: rgba(148,163,184,.08);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      padding: 8px 12px;
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
    }
    .mes input:focus { border-color: var(--accent); }

    .cards { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); margin-bottom: 16px; }
    .kpi mat-card-content { display: flex; flex-direction: column; gap: 4px; }
    .chip { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 11px; margin-bottom: 8px; }
    .rotulo { color: var(--muted); font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
    .kpi h1 {
      margin: 2px 0 0;
      font-family: Sora, Inter, sans-serif;
      font-weight: 700;
      font-size: 24px;
      letter-spacing: -0.02em;
    }
    .kpi small { color: var(--muted); font-size: 12.5px; }

    .cobertura { margin-bottom: 16px; }
    .cobertura-linha { display: flex; align-items: center; gap: 24px; }
    .cobertura h1 {
      margin: 0;
      font-family: Sora, Inter, sans-serif;
      font-weight: 800;
      font-size: 40px;
      color: var(--accent);
      letter-spacing: -0.03em;
      min-width: 130px;
    }
    .barra-cobertura { flex: 1; --mdc-linear-progress-active-indicator-color: var(--accent); --mdc-linear-progress-track-color: rgba(148,163,184,.12); height: 10px !important; border-radius: 6px; }
    .aviso { color: var(--muted); }

    .graficos { grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); margin-top: 4px; }
    .carregando { color: var(--muted); }
  `],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly api = inject(FinancialService);

  @ViewChild('fluxo', { static: true }) fluxoRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('patrimonio', { static: true }) patrimonioRef!: ElementRef<HTMLCanvasElement>;

  readonly mes = signal(new Date().toISOString().slice(0, 7));
  readonly resumo = signal<ResumoFinanceiro | null>(null);
  private charts: Chart[] = [];

  constructor() {
    effect(() => {
      const r = this.resumo();
      if (r) this.desenhar(r);
    });
  }

  ngOnInit(): void { this.carregar(); }

  ngOnDestroy(): void { this.destruirGraficos(); }

  mudarMes(valor: string): void {
    if (!valor) return;
    this.mes.set(valor);
    this.carregar();
  }

  min(a: number, b: number): number { return Math.min(a, b); }

  private carregar(): void {
    this.api.resumo(this.mes()).subscribe(r => this.resumo.set(r));
  }

  private desenhar(r: ResumoFinanceiro): void {
    this.destruirGraficos();

    this.charts.push(new Chart(this.fluxoRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Receitas', 'Gastos', 'Gastos fixos', 'Renda passiva'],
        datasets: [{
          data: [r.receitasMes, r.gastosMes, r.gastosFixosMensais, r.rendaPassivaMensal],
          backgroundColor: ['#34d399', '#f87171', '#fbbf24', '#60a5fa'],
          borderRadius: 8,
          maxBarThickness: 56,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,.08)' }, ticks: { color: '#8e99ae' } },
          x: { grid: { display: false }, ticks: { color: '#8e99ae' } },
        },
      },
    }));

    const rotulo = (k: string) => TIPOS_ATIVO.find(t => t.valor === k)?.rotulo ?? k;
    const tipos = Object.keys(r.patrimonioPorTipo);
    this.charts.push(new Chart(this.patrimonioRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: tipos.map(rotulo),
        datasets: [{
          data: tipos.map(t => r.patrimonioPorTipo[t]),
          backgroundColor: ['#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#f472b6'],
          borderColor: '#0a0e17',
          borderWidth: 3,
        }],
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { color: '#8e99ae', usePointStyle: true, padding: 16 } } },
        cutout: '62%',
      },
    }));
  }

  private destruirGraficos(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }
}