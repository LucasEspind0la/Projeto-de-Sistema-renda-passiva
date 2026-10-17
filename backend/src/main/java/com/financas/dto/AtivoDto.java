package com.financas.dto;

import com.financas.domain.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public final class AtivoDto {
    private AtivoDto() {}

    public record Request(
            @NotBlank @Size(max = 120) String nome,
            @NotNull TipoAtivo tipo,
            @NotNull @PositiveOrZero BigDecimal valorInvestido,
            @NotNull @PositiveOrZero BigDecimal valorAtual,
            BigDecimal rentabilidadeEstimada,
            PeriodicidadeRentabilidade periodicidadeRentabilidade,
            @PositiveOrZero BigDecimal proventosMensais) {}

    public record Response(UUID id, String nome, TipoAtivo tipo, BigDecimal valorInvestido,
                           BigDecimal valorAtual, BigDecimal rentabilidadeEstimada,
                           PeriodicidadeRentabilidade periodicidadeRentabilidade,
                           BigDecimal proventosMensais) {
        public static Response de(Ativo a) {
            return new Response(a.getId(), a.getNome(), a.getTipo(), a.getValorInvestido(),
                    a.getValorAtual(), a.getRentabilidadeEstimada(),
                    a.getPeriodicidadeRentabilidade(), a.getProventosMensais());
        }
    }
}
