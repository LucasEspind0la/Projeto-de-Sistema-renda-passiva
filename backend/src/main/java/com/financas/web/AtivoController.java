package com.financas.web;

import com.financas.dto.AtivoDto;
import com.financas.service.AtivoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ativos")
@Tag(name = "Ativos")
public class AtivoController extends CrudController<AtivoDto.Request, AtivoDto.Response> {

    public AtivoController(AtivoService service) {
        super(service);
    }
}
