package com.financas.dto;

import com.financas.domain.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public final class DespesaDto {
    private DespesaDto() {}

    public record Request(
            @NotBlank @Size(max = 200) String descricao,
            @NotNull @Positive BigDecimal valor,
            @NotBlank @Size(max = 80) String categoria,
            @NotNull TipoDespesa tipo,
            @NotNull LocalDate dataVencimento,
            @NotNull StatusDespesa status) {}

    public record Response(UUID id, String descricao, BigDecimal valor, String categoria,
                           TipoDespesa tipo, LocalDate dataVencimento, StatusDespesa status) {
        public static Response de(Despesa d) {
            return new Response(d.getId(), d.getDescricao(), d.getValor(), d.getCategoria(),
                    d.getTipo(), d.getDataVencimento(), d.getStatus());
        }
    }
}
