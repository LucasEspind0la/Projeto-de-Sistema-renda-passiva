package com.financas.dto;

import com.financas.domain.Divida;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public final class DividaDto {
    private DividaDto() {}

    public record Request(
            @NotBlank @Size(max = 200) String descricao,
            @NotNull @Positive BigDecimal valorTotal,
            @NotNull @PositiveOrZero BigDecimal valorRemanescente,
            @NotNull @PositiveOrZero BigDecimal taxaJurosMensal,
            @NotNull LocalDate dataVencimentoTotal) {}

    public record Response(UUID id, String descricao, BigDecimal valorTotal, BigDecimal valorRemanescente,
                           BigDecimal taxaJurosMensal, LocalDate dataVencimentoTotal) {
        public static Response de(Divida d) {
            return new Response(d.getId(), d.getDescricao(), d.getValorTotal(), d.getValorRemanescente(),
                    d.getTaxaJurosMensal(), d.getDataVencimentoTotal());
        }
    }
}
