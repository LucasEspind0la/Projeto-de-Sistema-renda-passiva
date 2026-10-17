package com.financas.web;

import com.financas.dto.DespesaDto;
import com.financas.service.DespesaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/despesas")
@Tag(name = "Despesas")
public class DespesaController extends CrudController<DespesaDto.Request, DespesaDto.Response> {

    public DespesaController(DespesaService service) {
        super(service);
    }
}
