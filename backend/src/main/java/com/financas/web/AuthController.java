package com.financas.web;

import com.financas.dto.AuthDto;
import com.financas.service.AuthService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação")
@SecurityRequirements
public class AuthController {

    private final AuthService service;

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthDto.TokenResponse registrar(@Valid @RequestBody AuthDto.RegistroRequest corpo) {
        return service.registrar(corpo);
    }

    @PostMapping("/login")
    public AuthDto.TokenResponse login(@Valid @RequestBody AuthDto.LoginRequest corpo) {
        return service.login(corpo);
    }
}
