package com.sincro.inventario.api.dto;

import java.math.BigDecimal;

public record ItemResponse(
        Long id,
        String nome,
        String sku,
        String descricao,
        Integer quantidade,
        BigDecimal preco,
        String status,
        Long categoriaId,
        String categoriaNome
) {}