package com.financas.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "despesa")
@Getter
@Setter
public class Despesa extends EntidadeDoUsuario {

    @Column(nullable = false, length = 200)
    private String descricao;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, length = 80)
    private String categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoDespesa tipo;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusDespesa status;
}
