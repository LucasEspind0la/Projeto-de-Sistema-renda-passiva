package com.financas.dto;

import com.financas.domain.TipoAtivo;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Snapshot financeiro do mês. {@code coberturaIndependenciaPct} é nulo quando
 * não há gastos fixos no mês (a razão não é definida).
 */
public record ResumoFinanceiroDto(
        String mes,
        BigDecimal receitasMes,
        BigDecimal gastosMes,
        BigDecimal saldoAtual,
        BigDecimal totalAtivos,
        BigDecimal totalDividas,
        BigDecimal patrimonioLiquido,
        BigDecimal rendaPassivaMensal,
        BigDecimal gastosFixosMensais,
        BigDecimal coberturaIndependenciaPct,
        Map<TipoAtivo, BigDecimal> patrimonioPorTipo,
        Map<String, BigDecimal> gastosPorCategoria) {}
