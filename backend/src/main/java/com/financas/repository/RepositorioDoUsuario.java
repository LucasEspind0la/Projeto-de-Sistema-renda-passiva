package com.financas.repository;

import com.financas.domain.EntidadeDoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@NoRepositoryBean
public interface RepositorioDoUsuario<E extends EntidadeDoUsuario> extends JpaRepository<E, UUID> {

    List<E> findByUsuarioId(UUID usuarioId);

    Optional<E> findByIdAndUsuarioId(UUID id, UUID usuarioId);
}
