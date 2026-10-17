package com.financas.web;

import com.financas.dto.DividaDto;
import com.financas.service.DividaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dividas")
@Tag(name = "Dívidas")
public class DividaController extends CrudController<DividaDto.Request, DividaDto.Response> {

    public DividaController(DividaService service) {
        super(service);
    }
}
