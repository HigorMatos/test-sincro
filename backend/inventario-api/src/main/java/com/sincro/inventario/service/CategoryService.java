package com.sincro.inventario.service;

import com.sincro.inventario.api.dto.CategoryRequest;
import com.sincro.inventario.api.dto.CategoryResponse;
import com.sincro.inventario.domain.Category;
import com.sincro.inventario.exception.CategoryHasItemsException;
import com.sincro.inventario.exception.CategoryNotFoundException;
import com.sincro.inventario.repository.CategoryRepository;
import com.sincro.inventario.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;
    private final ItemRepository itemRepository;

    public CategoryService(CategoryRepository repository, ItemRepository itemRepository) {
        this.repository = repository;
        this.itemRepository = itemRepository;
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category(request.nome(), request.descricao());
        Category saved = repository.save(category);
        return new CategoryResponse(saved.getId(), saved.getNome(), saved.getDescricao());
    }

    public List<CategoryResponse> findAll() {
        return repository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getNome(), c.getDescricao()))
                .toList();
    }

    public CategoryResponse findById(Long id) {
        Category c = repository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
        return new CategoryResponse(c.getId(), c.getNome(), c.getDescricao());
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        category.setNome(request.nome());
        category.setDescricao(request.descricao());

        Category saved = repository.save(category);
        return new CategoryResponse(saved.getId(), saved.getNome(), saved.getDescricao());
    }

    public void delete(Long id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        if (itemRepository.existsByCategoria_Id(id)) {
            throw new CategoryHasItemsException(id);
        }

        repository.delete(category);
    }
}