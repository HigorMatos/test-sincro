package com.sincro.inventario.api.controller;

import com.sincro.inventario.api.dto.ItemRequest;
import com.sincro.inventario.api.dto.ItemResponse;
import com.sincro.inventario.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    /**
     * POST /api/items
     * Cria um item (categoryId obrigatório).
     * Retorna 201 Created.
     */
    @PostMapping
    public ResponseEntity<ItemResponse> create(@RequestBody @Valid ItemRequest request) {
        ItemResponse created = service.create(request);
        URI location = URI.create("/api/items/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    /**
     * GET /api/items
     * GET /api/items?categoriaId={id}
     * Lista itens (com filtro opcional por categoria).
     * Retorna 200 OK.
     */
    @GetMapping
    public ResponseEntity<List<ItemResponse>> findAll(
            @RequestParam(name = "categoriaId", required = false) Long categoriaId
    ) {
        return ResponseEntity.ok(service.findAll(categoriaId));
    }

    /**
     * GET /api/items/{id}
     * Busca item por id.
     * Retorna 200 OK ou 404.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /**
     * PUT /api/items/{id}
     * Atualiza item por id.
     * Retorna 200 OK ou 404.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid ItemRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /**
     * DELETE /api/items/{id}
     * Remove item por id.
     * Retorna 204 No Content ou 404.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}