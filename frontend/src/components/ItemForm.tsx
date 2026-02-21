"use client";

import { useEffect, useState } from "react";
import type { Category, ItemRequest } from "@/lib/types";
import { categoriesApi } from "@/lib/api";

type Props = {
  initial?: Partial<ItemRequest>;
  submitText: string;
  onSubmit: (data: ItemRequest) => Promise<void>;
  onCancel: () => void;
};

export default function ItemForm({ initial, submitText, onSubmit, onCancel }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [nome, setNome] = useState(initial?.nome ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [quantidade, setQuantidade] = useState<number>(initial?.quantidade ?? 0);
  const [preco, setPreco] = useState<number>(initial?.preco ?? 0);
  const [status, setStatus] = useState<string>(initial?.status ?? "ACTIVE");
  const [categoriaId, setCategoriaId] = useState<number | "">(initial?.categoriaId ?? "");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cats = await categoriesApi.list();
        setCategories(cats);
      } catch (e: any) {
        alert(e.message ?? "Erro ao carregar categorias");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!categoriaId) {
      alert("Selecione uma categoria.");
      return;
    }

    const payload: ItemRequest = {
      nome: nome.trim(),
      sku: sku.trim(),
      descricao: descricao?.trim() ? descricao.trim() : null,
      quantidade: Number(quantidade),
      preco: Number(preco),
      status,
      categoriaId: Number(categoriaId),
    };

    setSaving(true);
    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_360px]">
      {/* Coluna esquerda */}
      <div className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="font-semibold">Informações Básicas</h2>
          <p className="text-sm text-white/60">Dados principais do item</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-1">
              <label className="text-sm text-white/70">Nome *</label>
              <input
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-white/25"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do item"
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-sm text-white/70">SKU / Código *</label>
              <input
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-white/25"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Código único do item"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/70">Descrição</label>
              <textarea
                className="mt-1 w-full min-h-[90px] rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-white/25"
                value={descricao ?? ""}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o item em detalhes"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="font-semibold">Classificação</h2>
          <p className="text-sm text-white/60">Categoria do item</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/70">Categoria *</label>
              <select
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : "")}
                disabled={loadingCats}
                required
              >
                <option value="">{loadingCats ? "Carregando..." : "Selecione uma categoria"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="opacity-50">
              <label className="text-sm text-white/70">Localização</label>
              <select className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2" disabled>
                <option>Não usado no desafio</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="font-semibold">Estoque e Preço</h2>
          <p className="text-sm text-white/60">Quantidade e valores</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm text-white/70">Quantidade *</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                required
              />
            </div>

            <div className="opacity-50">
              <label className="text-sm text-white/70">Estoque Mínimo *</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"
                value={0}
                disabled
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Preço Unitário *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"
                value={preco}
                onChange={(e) => setPreco(Number(e.target.value))}
                required
              />
            </div>
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold">Status</h3>
          <select
            className="mt-3 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 opacity-60">
          <h3 className="font-semibold">Imagens</h3>
          <p className="text-sm text-white/60">Não usado no desafio</p>
          <div className="mt-3 rounded-xl border border-dashed border-white/15 p-6 text-center text-white/60">
            Clique para adicionar imagens
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
        >
          {saving ? "Salvando..." : submitText}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full px-4 py-3 rounded-lg border border-white/10 hover:bg-white/5"
        >
          Cancelar
        </button>
      </aside>
    </form>
  );
}