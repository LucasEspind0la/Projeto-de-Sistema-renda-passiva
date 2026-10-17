# Finanças & Renda Passiva

Gestão financeira pessoal com foco em renda passiva e independência financeira.

```
financas/
├── docker-compose.yml     # PostgreSQL 16
├── backend/               # Spring Boot 3.3.4 / Java 21
└── frontend/              # Angular 17 (standalone + signals)
```

## Tecnologias

- **Backend:** Java 21, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Bean Validation, Lombok
- **Autenticação:** JWT (jjwt 0.12.6)
- **Banco de dados:** PostgreSQL 16 com migrations Flyway
- **Frontend:** Angular 17 (standalone + signals)
- **Infra:** Docker Compose

## Como rodar

```bash
# 1) Banco
docker compose up -d

# 2) Backend  (http://localhost:8080 — Swagger em /swagger-ui.html)
cd backend && mvn spring-boot:run
# Em produção defina JWT_SECRET (>= 32 caracteres), DB_URL, DB_USER, DB_PASSWORD, CORS_ORIGINS

# 3) Frontend (http://localhost:4200)
cd frontend && npm install && npm start
```

Testes do backend: `cd backend && mvn test`

## Regras de cálculo (`RendaPassivaService`)

| Métrica | Fórmula |
|---|---|
| Saldo atual | Receitas do mês − Gastos do mês |
| Patrimônio líquido | Σ valor atual dos ativos − Σ valor remanescente das dívidas |
| Renda passiva mensal | Σ proventos mensais estimados dos ativos |
| Cobertura de independência | Renda passiva ÷ Gastos fixos do mês × 100 (nula se não há gastos fixos) |

Receitas contam por recorrência: **única** só no mês da data; **mensal** a partir da data; **anual** todo ano no mesmo mês.
Gastos do mês = despesas com vencimento dentro do mês consultado.

## Decisões de arquitetura

- **Layered** (web → service → repository → domain) com DTOs `record` e validação Bean Validation.
- `CrudService` / `CrudController` genéricos (Template Method) evitam duplicar CRUD; cada agregado só define o mapeamento.
- **Multi-tenant por usuário**: toda consulta filtra por `usuario_id` (vindo do JWT, nunca do corpo da requisição).
- `BigDecimal` / `NUMERIC(15,2)` em todo valor monetário; PKs `UUID`; schema via Flyway (`V1__schema_inicial.sql`).
- Erros padronizados em `ProblemDetail` (RFC 7807) via `@RestControllerAdvice`.
- Frontend: interceptor anexa o Bearer token e trata 401 (logout), 403 e 5xx globalmente.
