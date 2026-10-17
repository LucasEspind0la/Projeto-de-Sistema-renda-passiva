package com.financas.service;

import com.financas.domain.Usuario;
import com.financas.dto.AuthDto;
import com.financas.exception.CredenciaisInvalidasException;
import com.financas.exception.RegraNegocioException;
import com.financas.repository.UsuarioRepository;
import com.financas.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @Transactional
    public AuthDto.TokenResponse registrar(AuthDto.RegistroRequest in) {
        String email = in.email().trim().toLowerCase();
        if (usuarios.existsByEmail(email)) {
            throw new RegraNegocioException("E-mail já cadastrado.");
        }
        Usuario u = new Usuario();
        u.setNome(in.nome().trim());
        u.setEmail(email);
        u.setSenhaHash(encoder.encode(in.senha()));
        return emitirToken(usuarios.save(u));
    }

    @Transactional(readOnly = true)
    public AuthDto.TokenResponse login(AuthDto.LoginRequest in) {
        Usuario u = usuarios.findByEmail(in.email().trim().toLowerCase())
                .filter(x -> encoder.matches(in.senha(), x.getSenhaHash()))
                .orElseThrow(() -> new CredenciaisInvalidasException("E-mail ou senha inválidos."));
        return emitirToken(u);
    }

    private AuthDto.TokenResponse emitirToken(Usuario u) {
        Instant expira = jwt.calcularExpiracao();
        return new AuthDto.TokenResponse(jwt.gerar(u.getId(), u.getEmail(), expira), u.getNome(), expira);
    }
}
