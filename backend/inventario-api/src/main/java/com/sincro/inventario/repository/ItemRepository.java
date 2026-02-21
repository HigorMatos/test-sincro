package com.sincro.inventario.repository;

import com.sincro.inventario.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("select i from Item i join fetch i.categoria where i.id = :id")
    Optional<Item> findByIdWithCategoria(@Param("id") Long id);

    @Query("select i from Item i join fetch i.categoria")
    List<Item> findAllWithCategoria();

    @Query("select i from Item i join fetch i.categoria where i.categoria.id = :categoriaId")
    List<Item> findAllByCategoriaIdWithCategoria(@Param("categoriaId") Long categoriaId);

    boolean existsByCategoria_Id(Long categoriaId);
}