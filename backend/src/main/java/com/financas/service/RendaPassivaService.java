package com.financas.service;

import com.financas.domain.*;
import com.financas.dto.ResumoFinanceiroDto;
import com.financas.repository.AtivoRepository;
import com.financas.repository.DespesaRepository;
import com.financas.repository.DividaRepository;
import com.financas.repository.ReceitaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Núcleo do domínio: concentra as regras de cálculo financeiro.
 * <ul>
 *   <li>Saldo Atual = Receitas do mês − Gastos do mês</li>
 *   <li>Patrimônio Líquido = Σ valor atual dos ativos − Σ valor remanescente das dívidas</li>
 *   <li>Renda Passiva Mensal = Σ proventos mensais estimados dos ativos</li>
 *   <li>Cobertura = Renda Passiva Mensal / Gastos Fixos do mês × 100</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class RendaPassivaService {

    private static final BigDecimal CEM = BigDecimal.valueOf(100);

    private final ReceitaRepository receitas;
    private final DespesaRepository despesas;
    private final AtivoRepository ativos;
    private final DividaRepository dividas;

    @Transactional(readOnly = true)
    public ResumoFinanceiroDto calcularResumo(UUID usuarioId, YearMonth mes) {
        LocalDate inicio = mes.atDay(1);
        LocalDate fim = mes.atEndOfMonth();

        BigDecimal receitasMes = somar(
                receitas.findByUsuarioIdAndDataLessThanEqual(usuarioId, fim).stream()
                        .filter(r -> ocorreNoMes(r, mes)).toList(),
                Receita::getValor);

        List<Despesa> despesasMes = despesas.findByUsuarioIdAndDataVencimentoBetween(usuarioId, inicio, fim);
        BigDecimal gastosMes = somar(despesasMes, Despesa::getValor);
        BigDecimal gastosFixos = somar(
                despesasMes.stream().filter(d -> d.getTipo() == TipoDespesa.FIXO).toList(),
                Despesa::getValor);

        List<Ativo> listaAtivos = ativos.findByUsuarioId(usuarioId);
        BigDecimal totalAtivos = somar(listaAtivos, Ativo::getValorAtual);
        BigDecimal rendaPassiva = somar(listaAtivos, Ativo::getProventosMensais);
        BigDecimal totalDividas = somar(dividas.findByUsuarioId(usuarioId), Divida::getValorRemanescente);

        return new ResumoFinanceiroDto(
                mes.toString(),
                receitasMes,
                gastosMes,
                receitasMes.subtract(gastosMes),
                totalAtivos,
                totalDividas,
                totalAtivos.subtract(totalDividas),
                rendaPassiva,
                gastosFixos,
                calcularCobertura(rendaPassiva, gastosFixos),
                agrupar(listaAtivos, Ativo::getTipo, Ativo::getValorAtual),
                agrupar(despesasMes, Despesa::getCategoria, Despesa::getValor));
    }

    /** Percentual das despesas fixas já coberto pela renda passiva; nulo se não há gastos fixos. */
    BigDecimal calcularCobertura(BigDecimal rendaPassiva, BigDecimal gastosFixos) {
        if (gastosFixos.signum() == 0) {
            return null;
        }
        return rendaPassiva.multiply(CEM).divide(gastosFixos, 2, RoundingMode.HALF_UP);
    }

    /** Receitas únicas contam só no mês da data; mensais a partir dela; anuais no mesmo mês de cada ano. */
    boolean ocorreNoMes(Receita r, YearMonth mes) {
        YearMonth origem = YearMonth.from(r.getData());
        if (origem.isAfter(mes)) {
            return false;
        }
        return switch (r.getRecorrencia()) {
            case UNICA -> origem.equals(mes);
            case MENSAL -> true;
            case ANUAL -> origem.getMonth() == mes.getMonth();
        };
    }

    private <T> BigDecimal somar(Collection<T> itens, Function<T, BigDecimal> valor) {
        return itens.stream()
                .map(valor)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private <T, K> Map<K, BigDecimal> agrupar(Collection<T> itens, Function<T, K> chave, Function<T, BigDecimal> valor) {
        return itens.stream().collect(Collectors.groupingBy(chave, LinkedHashMap::new,
                Collectors.reducing(BigDecimal.ZERO, valor, BigDecimal::add)));
    }
}
