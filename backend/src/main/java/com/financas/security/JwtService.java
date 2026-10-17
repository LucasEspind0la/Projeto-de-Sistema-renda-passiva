package com.financas.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtService {

    private final SecretKey chave;
    private final Duration validade;

    public JwtService(@Value("${app.jwt.secret}") String segredo,
                      @Value("${app.jwt.expiration-minutes}") long minutos) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.validade = Duration.ofMinutes(minutos);
    }

    public Instant calcularExpiracao() {
        return Instant.now().plus(validade);
    }

    public String gerar(UUID usuarioId, String email, Instant expiraEm) {
        return Jwts.builder()
                .subject(usuarioId.toString())
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(Date.from(expiraEm))
                .signWith(chave)
                .compact();
    }

    /** Retorna o id do usuário se o token for válido e não expirado. */
    public Optional<UUID> validar(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(chave).build().parseSignedClaims(token).getPayload();
            return Optional.of(UUID.fromString(claims.getSubject()));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
