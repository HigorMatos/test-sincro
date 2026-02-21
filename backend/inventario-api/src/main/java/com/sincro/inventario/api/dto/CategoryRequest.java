package com.sincro.inventario.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank String nome,
        String descricao
) {}
