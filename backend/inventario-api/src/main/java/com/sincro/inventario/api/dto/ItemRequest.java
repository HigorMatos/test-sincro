package com.sincro.inventario.api.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ItemRequest(
        @NotBlank @Size(max = 120) String nome,
        @NotBlank @Size(max = 60) String sku,
        @Size(max = 255) String descricao,
        @NotNull @Min(0) Integer quantidade,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal preco,
        @NotBlank @Size(max = 30) String status,
        @NotNull Long categoriaId
) {}