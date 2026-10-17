package com.financas.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/** Base de toda entidade que pertence a um usuário (isolamento de dados por tenant). */
@MappedSuperclass
@Getter
@Setter
public abstract class EntidadeDoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "usuario_id", nullable = false, updatable = false)
    private UUID usuarioId;
}
