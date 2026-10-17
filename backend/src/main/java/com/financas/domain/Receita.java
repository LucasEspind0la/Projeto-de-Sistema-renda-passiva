package com.financas.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "receita")
@Getter
@Setter
public class Receita extends EntidadeDoUsuario {

    @Column(nullable = false, length = 200)
    private String descricao;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, length = 80)
    private String categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoReceita tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Recorrencia recorrencia;

    @Column(nullable = false)
    private LocalDate data;
}
