import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="wrap">
      <div class="lado-esquerdo">
        <div class="marca">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="rgba(52,211,153,.14)"/>
            <path d="M7 21l5-6 4 3 6-9" stroke="#34d399" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="24" cy="9" r="2.2" fill="#34d399"/>
          </svg>
          <span>Finanças &amp; Renda Passiva</span>
        </div>
        <h1>Construa sua<br><em>liberdade financeira</em>.</h1>
        <ul class="perks">
          <li><span class="dot"></span>Cobertura de independência em tempo real</li>
          <li><span class="dot"></span>Patrimônio por tipo de ativo</li>
          <li><span class="dot"></span>Fluxo de receitas e despesas do mês</li>
        </ul>
      </div>

      <mat-card class="card-login">
        <mat-card-header>
          <mat-card-title>{{ modoRegistro() ? 'Criar conta' : 'Bem-vindo de volta' }}</mat-card-title>
          <mat-card-subtitle>{{ modoRegistro() ? 'Comece a organizar suas finanças' : 'Entre para ver seu painel' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="enviar()" class="form">
            @if (modoRegistro()) {
              <mat-form-field><mat-label>Nome</mat-label><input matInput formControlName="nome"></mat-form-field>
            }
            <mat-form-field><mat-label>E-mail</mat-label><input matInput type="email" formControlName="email"></mat-form-field>
            <mat-form-field><mat-label>Senha</mat-label><input matInput type="password" formControlName="senha"></mat-form-field>
            @if (erro()) { <p class="negativo erro">{{ erro() }}</p> }
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || carregando()">
              {{ modoRegistro() ? 'Cadastrar' : 'Entrar' }}
            </button>
            <button class="alternar" mat-button type="button" (click)="alternar()">
              {{ modoRegistro() ? 'Já tenho conta' : 'Criar uma conta' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .wrap {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      align-items: center;
      gap: 48px;
      max-width: 1080px;
      margin: 0 auto;
      padding: 32px 24px;
      box-sizing: border-box;
    }
    .lado-esquerdo { color: var(--text); }
    .marca { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--muted); margin-bottom: 32px; }
    .marca svg { width: 30px; height: 30px; }
    .lado-esquerdo h1 {
      font-family: Sora, Inter, sans-serif;
      font-size: 42px;
      line-height: 1.12;
      letter-spacing: -0.03em;
      margin: 0 0 16px;
    }
    .lado-esquerdo h1 em { font-style: normal; color: var(--accent); }
    .lado-esquerdo p { color: var(--muted); font-size: 15.5px; line-height: 1.6; max-width: 440px; margin: 0 0 28px; }
    .perks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
    .perks li { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 14px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px rgba(52,211,153,.7); flex-shrink: 0; }
    .card-login { width: 100%; max-width: 400px; justify-self: center; padding: 28px 24px; }
    mat-card-title { font-size: 22px !important; font-weight: 700 !important; }
    .form { display: flex; flex-direction: column; gap: 6px; margin-top: 18px; }
    .erro { font-size: 13px; margin: 4px 0; }
    .alternar { color: var(--muted) !important; align-self: center; }
    .alternar:hover { color: var(--accent) !important; }
    @media (max-width: 860px) {
      .wrap { grid-template-columns: 1fr; gap: 24px; padding-top: 48px; }
      .lado-esquerdo h1 { font-size: 30px; }
      .lado-esquerdo p, .perks { display: none; }
    }
  `],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly modoRegistro = signal(false);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly form = this.fb.group({
    nome: [''],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  alternar(): void {
    this.modoRegistro.update(v => !v);
    this.form.controls.nome.setValidators(this.modoRegistro() ? [Validators.required] : []);
    this.form.controls.nome.updateValueAndValidity();
    this.erro.set(null);
  }

  enviar(): void {
    if (this.form.invalid) return;
    this.carregando.set(true);
    this.erro.set(null);
    const { nome, email, senha } = this.form.getRawValue();
    const req$ = this.modoRegistro()
      ? this.auth.registrar({ nome, email, senha })
      : this.auth.login({ email, senha });

    req$.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: HttpErrorResponse) => {
        this.erro.set(e.error?.detail ?? 'Não foi possível autenticar.');
        this.carregando.set(false);
      },
    });
  }
}