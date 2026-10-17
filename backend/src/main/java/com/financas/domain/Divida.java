package com.financas.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "divida")
@Getter
@Setter
public class Divida extends EntidadeDoUsuario {

    @Column(nullable = false, length = 200)
    private String descricao;

    @Column(name = "valor_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "valor_remanescente", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorRemanescente;

    @Column(name = "taxa_juros_mensal", nullable = false, precision = 7, scale = 4)
    private BigDecimal taxaJurosMensal = BigDecimal.ZERO;

    @Column(name = "data_vencimento_total", nullable = false)
    private LocalDate dataVencimentoTotal;
}
