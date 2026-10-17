package com.financas.service;

import com.financas.domain.Despesa;
import com.financas.dto.DespesaDto;
import com.financas.repository.DespesaRepository;
import com.financas.repository.RepositorioDoUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DespesaService extends CrudService<Despesa, DespesaDto.Request, DespesaDto.Response> {

    private final DespesaRepository repository;

    @Override protected RepositorioDoUsuario<Despesa> repo() { return repository; }

    @Override protected Despesa nova() { return new Despesa(); }

    @Override
    protected void aplicar(Despesa d, DespesaDto.Request in) {
        d.setDescricao(in.descricao());
        d.setValor(in.valor());
        d.setCategoria(in.categoria());
        d.setTipo(in.tipo());
        d.setDataVencimento(in.dataVencimento());
        d.setStatus(in.status());
    }

    @Override protected DespesaDto.Response paraResposta(Despesa d) { return DespesaDto.Response.de(d); }
}
