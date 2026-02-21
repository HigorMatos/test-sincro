package com.sincro.inventario.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 60)
    private String sku;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal preco;

    @Column(nullable = false, length = 30)
    private String status;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category categoria;

    public Item() {}

    public Item(String nome, String sku, String descricao, Integer quantidade, BigDecimal preco, String status, Category categoria) {
        this.nome = nome;
        this.sku = sku;
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.preco = preco;
        this.status = status;
        this.categoria = categoria;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getSku() { return sku; }
    public String getDescricao() { return descricao; }
    public Integer getQuantidade() { return quantidade; }
    public BigDecimal getPreco() { return preco; }
    public String getStatus() { return status; }
    public Category getCategoria() { return categoria; }

    public void setNome(String nome) { this.nome = nome; }
    public void setSku(String sku) { this.sku = sku; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    public void setStatus(String status) { this.status = status; }
    public void setCategoria(Category categoria) { this.categoria = categoria; }
}