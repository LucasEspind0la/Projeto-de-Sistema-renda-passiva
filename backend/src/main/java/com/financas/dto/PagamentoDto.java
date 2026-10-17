package com.financas.dto;

import com.financas.domain.Pagamento;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public final class PagamentoDto {
    private PagamentoDto() {}

    /** Informe dividaId OU despesaId (exatamente um). */
    public record Request(
            UUID dividaId,
            UUID despesaId,
            @NotNull @Positive BigDecimal valorPago,
            @NotNull LocalDate dataPagamento,
            @Size(max = 500) String observacao) {}

    public record Response(UUID id, UUID dividaId, UUID despesaId, BigDecimal valorPago,
                           LocalDate dataPagamento, String observacao) {
        public static Response de(Pagamento p) {
            return new Response(p.getId(), p.getDividaId(), p.getDespesaId(), p.getValorPago(),
                    p.getDataPagamento(), p.getObservacao());
        }
    }
}
