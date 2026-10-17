package com.financas.repository;

import com.financas.domain.Despesa;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DespesaRepository extends RepositorioDoUsuario<Despesa> {
    List<Despesa> findByUsuarioIdAndDataVencimentoBetween(UUID usuarioId, LocalDate inicio, LocalDate fim);
}
