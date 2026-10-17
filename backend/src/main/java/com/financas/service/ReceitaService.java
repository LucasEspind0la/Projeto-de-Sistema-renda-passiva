package com.financas.service;

import com.financas.domain.Receita;
import com.financas.dto.ReceitaDto;
import com.financas.repository.ReceitaRepository;
import com.financas.repository.RepositorioDoUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceitaService extends CrudService<Receita, ReceitaDto.Request, ReceitaDto.Response> {

    private final ReceitaRepository repository;

    @Override protected RepositorioDoUsuario<Receita> repo() { return repository; }

    @Override protected Receita nova() { return new Receita(); }

    @Override
    protected void aplicar(Receita r, ReceitaDto.Request in) {
        r.setDescricao(in.descricao());
        r.setValor(in.valor());
        r.setCategoria(in.categoria());
        r.setTipo(in.tipo());
        r.setRecorrencia(in.recorrencia());
        r.setData(in.data());
    }

    @Override protected ReceitaDto.Response paraResposta(Receita r) { return ReceitaDto.Response.de(r); }
}
