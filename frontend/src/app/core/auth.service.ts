import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from './api.config';
import { LoginReq, RegistroReq, TokenRes } from './models';

const TOKEN_KEY = 'financas.token';
const NOME_KEY = 'financas.nome';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly nome = signal<string | null>(localStorage.getItem(NOME_KEY));
  readonly autenticado = computed(() => !!this.token());

  login(body: LoginReq) {
    return this.http.post<TokenRes>(`${API_URL}/auth/login`, body).pipe(tap(r => this.guardar(r)));
  }

  registrar(body: RegistroReq) {
    return this.http.post<TokenRes>(`${API_URL}/auth/registro`, body).pipe(tap(r => this.guardar(r)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NOME_KEY);
    this.token.set(null);
    this.nome.set(null);
    this.router.navigate(['/login']);
  }

  private guardar(r: TokenRes): void {
    localStorage.setItem(TOKEN_KEY, r.token);
    localStorage.setItem(NOME_KEY, r.nome);
    this.token.set(r.token);
    this.nome.set(r.nome);
  }
}
