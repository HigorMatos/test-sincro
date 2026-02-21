package com.sincro.inventario.exception;

public class CategoryInvalidException extends RuntimeException {
    public CategoryInvalidException(Long id) {
        super("Categoria inválida/inexistente: " + id);
    }
}