package com.financas.service;

import com.financas.domain.*;
import com.financas.dto.PagamentoDto;
import com.financas.exception.RecursoNaoEncontradoException;
import com.financas.exception.RegraNegocioException;
import com.financas.repository.DespesaRepository;
import com.financas.repository.DividaRepository;
import com.financas.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository pagamentos;
    private final DividaRepository dividas;
    private final DespesaRepository despesas;

    @Transactional
    public PagamentoDto.Response registrar(UUID usuarioId, PagamentoDto.Request in) {
        if ((in.dividaId() == null) == (in.despesaId() == null)) {
            throw new RegraNegocioException("Informe exatamente um destino: dívida ou despesa.");
        }

        if (in.dividaId() != null) {
            Divida divida = dividas.findByIdAndUsuarioId(in.dividaId(), usuarioId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Dívida não encontrada."));
            if (in.valorPago().compareTo(divida.getValorRemanescente()) > 0) {
                throw new RegraNegocioException("Pagamento maior que o valor remanescente da dívida.");
            }
            divida.setValorRemanescente(divida.getValorRemanescente().subtract(in.valorPago()));
        } else {
            Despesa despesa = despesas.findByIdAndUsuarioId(in.despesaId(), usuarioId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Despesa não encontrada."));
            despesa.setStatus(StatusDespesa.PAGO);
        }

        Pagamento p = new Pagamento();
        p.setUsuarioId(usuarioId);
        p.setDividaId(in.dividaId());
        p.setDespesaId(in.despesaId());
        p.setValorPago(in.valorPago());
        p.setDataPagamento(in.dataPagamento());
        p.setObservacao(in.observacao());
        return PagamentoDto.Response.de(pagamentos.save(p));
    }

    @Transactional(readOnly = true)
    public List<PagamentoDto.Response> listar(UUID usuarioId) {
        return pagamentos.findByUsuarioId(usuarioId).stream().map(PagamentoDto.Response::de).toList();
    }
}
