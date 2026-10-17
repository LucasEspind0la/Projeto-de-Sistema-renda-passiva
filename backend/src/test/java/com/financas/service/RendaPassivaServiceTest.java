package com.financas.service;

import com.financas.domain.*;
import com.financas.dto.ResumoFinanceiroDto;
import com.financas.repository.AtivoRepository;
import com.financas.repository.DespesaRepository;
import com.financas.repository.DividaRepository;
import com.financas.repository.ReceitaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RendaPassivaServiceTest {

    private static final UUID USUARIO = UUID.randomUUID();
    private static final YearMonth MES = YearMonth.of(2026, 10);

    @Mock ReceitaRepository receitas;
    @Mock DespesaRepository despesas;
    @Mock AtivoRepository ativos;
    @Mock DividaRepository dividas;
    @InjectMocks RendaPassivaService service;

    @Test
    void calculaSaldoPatrimonioRendaPassivaECobertura() {
        when(receitas.findByUsuarioIdAndDataLessThanEqual(any(), any())).thenReturn(List.of(
                receita("5000", Recorrencia.MENSAL, LocalDate.of(2026, 1, 5)),   // conta
                receita("2000", Recorrencia.UNICA, LocalDate.of(2026, 9, 10)),   // outro mês: não conta
                receita("1200", Recorrencia.ANUAL, LocalDate.of(2025, 10, 15)))); // anual em outubro: conta
        when(despesas.findByUsuarioIdAndDataVencimentoBetween(any(), any(), any())).thenReturn(List.of(
                despesa("1500", TipoDespesa.FIXO, "Moradia"),
                despesa("100", TipoDespesa.FIXO, "Internet"),
                despesa("400", TipoDespesa.VARIAVEL, "Lazer")));
        when(ativos.findByUsuarioId(USUARIO)).thenReturn(List.of(
                ativo(TipoAtivo.FIIS, "10000", "100"),
                ativo(TipoAtivo.ACOES, "5000", "50")));
        when(dividas.findByUsuarioId(USUARIO)).thenReturn(List.of(divida("3000")));

        ResumoFinanceiroDto r = service.calcularResumo(USUARIO, MES);

        assertThat(r.receitasMes()).isEqualByComparingTo("6200");
        assertThat(r.gastosMes()).isEqualByComparingTo("2000");
        assertThat(r.saldoAtual()).isEqualByComparingTo("4200");
        assertThat(r.totalAtivos()).isEqualByComparingTo("15000");
        assertThat(r.patrimonioLiquido()).isEqualByComparingTo("12000");
        assertThat(r.rendaPassivaMensal()).isEqualByComparingTo("150");
        assertThat(r.gastosFixosMensais()).isEqualByComparingTo("1600");
        assertThat(r.coberturaIndependenciaPct()).isEqualByComparingTo("9.38"); // 150 / 1600 * 100
        assertThat(r.patrimonioPorTipo()).containsOnlyKeys(TipoAtivo.FIIS, TipoAtivo.ACOES);
    }

    @Test
    void coberturaENulaQuandoNaoHaGastosFixos() {
        when(receitas.findByUsuarioIdAndDataLessThanEqual(any(), any())).thenReturn(List.of());
        when(despesas.findByUsuarioIdAndDataVencimentoBetween(any(), any(), any()))
                .thenReturn(List.of(despesa("50", TipoDespesa.VARIAVEL, "Lazer")));
        when(ativos.findByUsuarioId(USUARIO)).thenReturn(List.of(ativo(TipoAtivo.FIIS, "1000", "10")));
        when(dividas.findByUsuarioId(USUARIO)).thenReturn(List.of());

        ResumoFinanceiroDto r = service.calcularResumo(USUARIO, MES);

        assertThat(r.coberturaIndependenciaPct()).isNull();
        assertThat(r.saldoAtual()).isEqualByComparingTo("-50");
    }

    @Test
    void coberturaPodeUltrapassarCemPorCento() {
        assertThat(service.calcularCobertura(new BigDecimal("3000"), new BigDecimal("2000")))
                .isEqualByComparingTo("150.00");
    }

    // ---------- fixtures ----------
    private Receita receita(String valor, Recorrencia rec, LocalDate data) {
        Receita r = new Receita();
        r.setValor(new BigDecimal(valor));
        r.setRecorrencia(rec);
        r.setData(data);
        return r;
    }

    private Despesa despesa(String valor, TipoDespesa tipo, String categoria) {
        Despesa d = new Despesa();
        d.setValor(new BigDecimal(valor));
        d.setTipo(tipo);
        d.setCategoria(categoria);
        return d;
    }

    private Ativo ativo(TipoAtivo tipo, String valorAtual, String proventos) {
        Ativo a = new Ativo();
        a.setTipo(tipo);
        a.setValorAtual(new BigDecimal(valorAtual));
        a.setProventosMensais(new BigDecimal(proventos));
        return a;
    }

    private Divida divida(String remanescente) {
        Divida d = new Divida();
        d.setValorRemanescente(new BigDecimal(remanescente));
        return d;
    }
}
