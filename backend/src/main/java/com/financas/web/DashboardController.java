package com.financas.web;

import com.financas.dto.ResumoFinanceiroDto;
import com.financas.service.RendaPassivaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {

    private final RendaPassivaService service;

    @GetMapping("/resumo")
    @Operation(summary = "Saldo, patrimônio líquido, renda passiva e cobertura de independência financeira")
    public ResumoFinanceiroDto resumo(@AuthenticationPrincipal UUID usuarioId,
                                      @RequestParam(required = false)
                                      @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes) {
        return service.calcularResumo(usuarioId, mes != null ? mes : YearMonth.now());
    }
}
