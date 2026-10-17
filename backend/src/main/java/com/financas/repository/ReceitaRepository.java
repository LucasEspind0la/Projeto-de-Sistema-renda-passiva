package com.financas.repository;

import com.financas.domain.Receita;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReceitaRepository extends RepositorioDoUsuario<Receita> {
    List<Receita> findByUsuarioIdAndDataLessThanEqual(UUID usuarioId, LocalDate limite);
}
