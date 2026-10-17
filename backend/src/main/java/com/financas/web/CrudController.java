package com.financas.web;

import com.financas.service.CrudService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** Endpoints CRUD padrão; subclasses só definem o @RequestMapping base. */
public abstract class CrudController<I, O> {

    private final CrudService<?, I, O> service;

    protected CrudController(CrudService<?, I, O> service) {
        this.service = service;
    }

    @GetMapping
    public List<O> listar(@AuthenticationPrincipal UUID usuarioId) {
        return service.listar(usuarioId);
    }

    @GetMapping("/{id}")
    public O buscar(@AuthenticationPrincipal UUID usuarioId, @PathVariable UUID id) {
        return service.buscar(usuarioId, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public O criar(@AuthenticationPrincipal UUID usuarioId, @Valid @RequestBody I corpo) {
        return service.criar(usuarioId, corpo);
    }

    @PutMapping("/{id}")
    public O atualizar(@AuthenticationPrincipal UUID usuarioId, @PathVariable UUID id, @Valid @RequestBody I corpo) {
        return service.atualizar(usuarioId, id, corpo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@AuthenticationPrincipal UUID usuarioId, @PathVariable UUID id) {
        service.remover(usuarioId, id);
    }
}
