package com.financas.service;

import com.financas.domain.Divida;
import com.financas.dto.DividaDto;
import com.financas.exception.RegraNegocioException;
import com.financas.repository.DividaRepository;
import com.financas.repository.RepositorioDoUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DividaService extends CrudService<Divida, DividaDto.Request, DividaDto.Response> {

    private final DividaRepository repository;

    @Override protected RepositorioDoUsuario<Divida> repo() { return repository; }

    @Override protected Divida nova() { return new Divida(); }

    @Override
    protected void aplicar(Divida d, DividaDto.Request in) {
        if (in.valorRemanescente().compareTo(in.valorTotal()) > 0) {
            throw new RegraNegocioException("O valor remanescente não pode exceder o valor total da dívida.");
        }
        d.setDescricao(in.descricao());
        d.setValorTotal(in.valorTotal());
        d.setValorRemanescente(in.valorRemanescente());
        d.setTaxaJurosMensal(in.taxaJurosMensal());
        d.setDataVencimentoTotal(in.dataVencimentoTotal());
    }

    @Override protected DividaDto.Response paraResposta(Divida d) { return DividaDto.Response.de(d); }
}
