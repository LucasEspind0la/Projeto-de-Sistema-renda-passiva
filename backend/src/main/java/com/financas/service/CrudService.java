package com.financas.service;

import com.financas.domain.EntidadeDoUsuario;
import com.financas.exception.RecursoNaoEncontradoException;
import com.financas.repository.RepositorioDoUsuario;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Template Method: o fluxo CRUD (sempre filtrado por usuário) é fixo;
 * cada agregado só define como mapear DTO <-> entidade.
 */
public abstract class CrudService<E extends EntidadeDoUsuario, I, O> {

    protected abstract RepositorioDoUsuario<E> repo();

    protected abstract E nova();

    protected abstract void aplicar(E entidade, I entrada);

    protected abstract O paraResposta(E entidade);

    @Transactional(readOnly = true)
    public List<O> listar(UUID usuarioId) {
        return repo().findByUsuarioId(usuarioId).stream().map(this::paraResposta).toList();
    }

    @Transactional(readOnly = true)
    public O buscar(UUID usuarioId, UUID id) {
        return paraResposta(obter(usuarioId, id));
    }

    @Transactional
    public O criar(UUID usuarioId, I entrada) {
        E entidade = nova();
        entidade.setUsuarioId(usuarioId);
        aplicar(entidade, entrada);
        return paraResposta(repo().save(entidade));
    }

    @Transactional
    public O atualizar(UUID usuarioId, UUID id, I entrada) {
        E entidade = obter(usuarioId, id);
        aplicar(entidade, entrada);
        return paraResposta(entidade);
    }

    @Transactional
    public void remover(UUID usuarioId, UUID id) {
        repo().delete(obter(usuarioId, id));
    }

    protected E obter(UUID usuarioId, UUID id) {
        return repo().findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Registro não encontrado."));
    }
}
