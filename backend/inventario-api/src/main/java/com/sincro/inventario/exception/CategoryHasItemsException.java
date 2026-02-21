package com.sincro.inventario.exception;

public class CategoryHasItemsException extends RuntimeException {
    public CategoryHasItemsException(Long id) {
        super("Não é possível deletar. Categoria possui itens vinculados: " + id);
    }
}