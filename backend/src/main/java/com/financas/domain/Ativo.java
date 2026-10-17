package com.financas.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "ativo")
@Getter
@Setter
public class Ativo extends EntidadeDoUsuario {

    @Column(nullable = false, length = 120)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private TipoAtivo tipo;

    @Column(name = "valor_investido", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorInvestido;

    @Column(name = "valor_atual", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorAtual;

    @Column(name = "rentabilidade_estimada", precision = 9, scale = 4)
    private BigDecimal rentabilidadeEstimada;

    @Enumerated(EnumType.STRING)
    @Column(name = "periodicidade_rentabilidade", length = 10)
    private PeriodicidadeRentabilidade periodicidadeRentabilidade;

    @Column(name = "proventos_mensais", nullable = false, precision = 15, scale = 2)
    private BigDecimal proventosMensais = BigDecimal.ZERO;
}
