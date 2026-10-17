package com.financas.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pagamento")
@Getter
@Setter
public class Pagamento extends EntidadeDoUsuario {

    @Column(name = "divida_id")
    private UUID dividaId;

    @Column(name = "despesa_id")
    private UUID despesaId;

    @Column(name = "valor_pago", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorPago;

    @Column(name = "data_pagamento", nullable = false)
    private LocalDate dataPagamento;

    @Column(length = 500)
    private String observacao;
}
