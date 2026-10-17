import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    @if (auth.autenticado()) {
      <mat-toolbar>
        <span class="brand">
          <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="rgba(52,211,153,.12)"/>
            <path d="M7 21l5-6 4 3 6-9" stroke="#34d399" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="24" cy="9" r="2.2" fill="#34d399"/>
          </svg>
          <span class="brand-name">Finanças<small>&amp; renda passiva</small></span>
        </span>
        <span style="flex: 1"></span>
        <nav class="nav">
          <a mat-button routerLink="/dashboard" routerLinkActive="ativo">Dashboard</a>
          <a mat-button routerLink="/ativos" routerLinkActive="ativo">Ativos</a>
          <a mat-button routerLink="/financas" routerLinkActive="ativo">Finanças</a>
        </nav>
        <button class="btn-sair" mat-button (click)="auth.logout()">Sair · {{ auth.nome() }}</button>
      </mat-toolbar>
    }
    <router-outlet />
  `,
  styles: [`
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-mark { width: 32px; height: 32px; display: block; }
    .brand-name {
      font-family: Sora, Inter, sans-serif;
      font-weight: 700;
      font-size: 17px;
      letter-spacing: -0.01em;
      line-height: 1.1;
      display: flex;
      flex-direction: column;
    }
    .brand-name small {
      font-family: Inter, sans-serif;
      font-weight: 500;
      font-size: 10.5px;
      color: var(--muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .nav { display: flex; gap: 4px; margin-right: 12px; }
    .nav a { color: var(--muted) !important; border-radius: 10px !important; font-weight: 500; }
    .nav a:hover { color: var(--text) !important; background: rgba(148,163,184,.10); }
    .nav a.ativo { color: var(--accent) !important; background: rgba(52, 211, 153, 0.12); }
    .btn-sair {
      color: var(--muted) !important;
      border: 1px solid var(--border) !important;
      border-radius: 10px !important;
      font-weight: 500;
    }
    .btn-sair:hover {
      color: var(--red) !important;
      border-color: rgba(248,113,113,.4) !important;
      background: rgba(248,113,113,.06) !important;
    }
    @media (max-width: 680px) {
      .brand-name small, .nav { display: none; }
    }
  `],
})
export class AppComponent {
  readonly auth = inject(AuthService);
}