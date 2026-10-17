package com.financas.web;

import com.financas.dto.ReceitaDto;
import com.financas.service.ReceitaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/receitas")
@Tag(name = "Receitas")
public class ReceitaController extends CrudController<ReceitaDto.Request, ReceitaDto.Response> {

    public ReceitaController(ReceitaService service) {
        super(service);
    }
}
