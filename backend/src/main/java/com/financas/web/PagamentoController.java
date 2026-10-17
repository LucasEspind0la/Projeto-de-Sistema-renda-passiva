package com.financas.web;

import com.financas.dto.PagamentoDto;
import com.financas.service.PagamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
@Tag(name = "Pagamentos")
public class PagamentoController {

    private final PagamentoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registra pagamento de uma dívida (abate o saldo) ou despesa (marca como paga)")
    public PagamentoDto.Response registrar(@AuthenticationPrincipal UUID usuarioId,
                                           @Valid @RequestBody PagamentoDto.Request corpo) {
        return service.registrar(usuarioId, corpo);
    }

    @GetMapping
    public List<PagamentoDto.Response> listar(@AuthenticationPrincipal UUID usuarioId) {
        return service.listar(usuarioId);
    }
}
