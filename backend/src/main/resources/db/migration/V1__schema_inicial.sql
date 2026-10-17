-- Todas as PKs são UUID; todo dado financeiro pertence a um usuário (FK + índice).
CREATE TABLE usuario (
    id         UUID PRIMARY KEY,
    nome       VARCHAR(120) NOT NULL,
    email      VARCHAR(160) NOT NULL UNIQUE,
    senha_hash VARCHAR(100) NOT NULL,
    criado_em  TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE receita (
    id          UUID PRIMARY KEY,
    usuario_id  UUID           NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    descricao   VARCHAR(200)   NOT NULL,
    valor       NUMERIC(15, 2) NOT NULL CHECK (valor > 0),
    categoria   VARCHAR(80)    NOT NULL,
    tipo        VARCHAR(10)    NOT NULL CHECK (tipo IN ('ATIVA', 'PASSIVA')),
    recorrencia VARCHAR(10)    NOT NULL CHECK (recorrencia IN ('UNICA', 'MENSAL', 'ANUAL')),
    data        DATE           NOT NULL
);
CREATE INDEX idx_receita_usuario_data ON receita (usuario_id, data);

CREATE TABLE despesa (
    id               UUID PRIMARY KEY,
    usuario_id       UUID           NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    descricao        VARCHAR(200)   NOT NULL,
    valor            NUMERIC(15, 2) NOT NULL CHECK (valor > 0),
    categoria        VARCHAR(80)    NOT NULL,
    tipo             VARCHAR(10)    NOT NULL CHECK (tipo IN ('FIXO', 'VARIAVEL')),
    data_vencimento  DATE           NOT NULL,
    status           VARCHAR(10)    NOT NULL CHECK (status IN ('PAGO', 'PENDENTE'))
);
CREATE INDEX idx_despesa_usuario_venc ON despesa (usuario_id, data_vencimento);

CREATE TABLE ativo (
    id                          UUID PRIMARY KEY,
    usuario_id                  UUID           NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    nome                        VARCHAR(120)   NOT NULL,
    tipo                        VARCHAR(15)    NOT NULL CHECK (tipo IN ('ACOES', 'FIIS', 'RENDA_FIXA', 'IMOVEIS', 'CRIPTO')),
    valor_investido             NUMERIC(15, 2) NOT NULL CHECK (valor_investido >= 0),
    valor_atual                 NUMERIC(15, 2) NOT NULL CHECK (valor_atual >= 0),
    rentabilidade_estimada      NUMERIC(9, 4),
    periodicidade_rentabilidade VARCHAR(10)    CHECK (periodicidade_rentabilidade IN ('ANUAL', 'MENSAL')),
    proventos_mensais           NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (proventos_mensais >= 0)
);
CREATE INDEX idx_ativo_usuario ON ativo (usuario_id);

CREATE TABLE divida (
    id                     UUID PRIMARY KEY,
    usuario_id             UUID           NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    descricao              VARCHAR(200)   NOT NULL,
    valor_total            NUMERIC(15, 2) NOT NULL CHECK (valor_total > 0),
    valor_remanescente     NUMERIC(15, 2) NOT NULL CHECK (valor_remanescente >= 0),
    taxa_juros_mensal      NUMERIC(7, 4)  NOT NULL DEFAULT 0 CHECK (taxa_juros_mensal >= 0),
    data_vencimento_total  DATE           NOT NULL
);
CREATE INDEX idx_divida_usuario ON divida (usuario_id);

-- Um pagamento quita exatamente uma dívida OU uma despesa.
CREATE TABLE pagamento (
    id              UUID PRIMARY KEY,
    usuario_id      UUID           NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    divida_id       UUID REFERENCES divida (id) ON DELETE CASCADE,
    despesa_id      UUID REFERENCES despesa (id) ON DELETE CASCADE,
    valor_pago      NUMERIC(15, 2) NOT NULL CHECK (valor_pago > 0),
    data_pagamento  DATE           NOT NULL,
    observacao      VARCHAR(500),
    CONSTRAINT ck_pagamento_um_destino
        CHECK ((divida_id IS NOT NULL)::int + (despesa_id IS NOT NULL)::int = 1)
);
CREATE INDEX idx_pagamento_usuario_data ON pagamento (usuario_id, data_pagamento);
