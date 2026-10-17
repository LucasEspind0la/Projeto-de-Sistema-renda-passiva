package com.financas.dto;

import jakarta.validation.constraints.*;

import java.time.Instant;

public final class AuthDto {
    private AuthDto() {}

    public record RegistroRequest(@NotBlank @Size(max = 120) String nome,
                                  @NotBlank @Email @Size(max = 160) String email,
                                  @NotBlank @Size(min = 8, max = 72) String senha) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String senha) {}

    public record TokenResponse(String token, String nome, Instant expiraEm) {}
}
