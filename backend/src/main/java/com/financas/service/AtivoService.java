package com.financas.service;

import com.financas.domain.Ativo;
import com.financas.dto.AtivoDto;
import com.financas.repository.AtivoRepository;
import com.financas.repository.RepositorioDoUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AtivoService extends CrudService<Ativo, AtivoDto.Request, AtivoDto.Response> {

    private final AtivoRepository repository;

    @Override protected RepositorioDoUsuario<Ativo> repo() { return repository; }

    @Override protected Ativo nova() { return new Ativo(); }

    @Override
    protected void aplicar(Ativo a, AtivoDto.Request in) {
        a.setNome(in.nome());
        a.setTipo(in.tipo());
        a.setValorInvestido(in.valorInvestido());
        a.setValorAtual(in.valorAtual());
        a.setRentabilidadeEstimada(in.rentabilidadeEstimada());
        a.setPeriodicidadeRentabilidade(in.periodicidadeRentabilidade());
        a.setProventosMensais(in.proventosMensais() == null ? BigDecimal.ZERO : in.proventosMensais());
    }

    @Override protected AtivoDto.Response paraResposta(Ativo a) { return AtivoDto.Response.de(a); }
}
