package com.financas.dto;

import com.financas.domain.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public final class ReceitaDto {
    private ReceitaDto() {}

    public record Request(
            @NotBlank @Size(max = 200) String descricao,
            @NotNull @Positive BigDecimal valor,
            @NotBlank @Size(max = 80) String categoria,
            @NotNull TipoReceita tipo,
            @NotNull Recorrencia recorrencia,
            @NotNull LocalDate data) {}

    public record Response(UUID id, String descricao, BigDecimal valor, String categoria,
                           TipoReceita tipo, Recorrencia recorrencia, LocalDate data) {
        public static Response de(Receita r) {
            return new Response(r.getId(), r.getDescricao(), r.getValor(), r.getCategoria(),
                    r.getTipo(), r.getRecorrencia(), r.getData());
        }
    }
}
