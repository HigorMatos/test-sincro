package com.sincro.inventario.service;

import com.sincro.inventario.api.dto.ItemRequest;
import com.sincro.inventario.api.dto.ItemResponse;
import com.sincro.inventario.domain.Category;
import com.sincro.inventario.domain.Item;
import com.sincro.inventario.exception.CategoryInvalidException;
import com.sincro.inventario.exception.ItemNotFoundException;
import com.sincro.inventario.repository.CategoryRepository;
import com.sincro.inventario.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;

    public ItemService(ItemRepository itemRepository, CategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
    }

    public ItemResponse create(ItemRequest request) {
        Category categoria = categoryRepository.findById(request.categoriaId())
                .orElseThrow(() -> new CategoryInvalidException(request.categoriaId()));

        Item item = new Item(
                request.nome(),
                request.sku(),
                request.descricao(),
                request.quantidade(),
                request.preco(),
                request.status(),
                categoria
        );

        return toResponse(itemRepository.save(item));
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> findAll(Long categoriaId) {
        var items = (categoriaId == null)
                ? itemRepository.findAllWithCategoria()
                : itemRepository.findAllByCategoriaIdWithCategoria(categoriaId);

        return items.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ItemResponse findById(Long id) {
        Item item = itemRepository.findByIdWithCategoria(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
        return toResponse(item);
    }

    public ItemResponse update(Long id, ItemRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));

        Category categoria = categoryRepository.findById(request.categoriaId())
                .orElseThrow(() -> new CategoryInvalidException(request.categoriaId()));

        item.setNome(request.nome());
        item.setSku(request.sku());
        item.setDescricao(request.descricao());
        item.setQuantidade(request.quantidade());
        item.setPreco(request.preco());
        item.setStatus(request.status());
        item.setCategoria(categoria);

        Item saved = itemRepository.save(item);

        Item savedWithCategoria = itemRepository.findByIdWithCategoria(saved.getId())
                .orElseThrow(() -> new ItemNotFoundException(saved.getId()));

        return toResponse(savedWithCategoria);
    }

    public void delete(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
        itemRepository.delete(item);
    }

    private ItemResponse toResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getNome(),
                item.getSku(),
                item.getDescricao(),
                item.getQuantidade(),
                item.getPreco(),
                item.getStatus(),
                item.getCategoria().getId(),
                item.getCategoria().getNome()
        );
    }
}