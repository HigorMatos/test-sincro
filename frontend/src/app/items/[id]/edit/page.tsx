"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categoriesApi, itemsApi } from "@/lib/api";
import type { Category, Item, ItemRequest } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [item, setItem] = useState<Item | null>(null);

  const [form, setForm] = useState<ItemRequest>({
    nome: "",
    sku: "",
    descricao: "",
    quantidade: 0,
    preco: 0,
    status: "ACTIVE",
    categoriaId: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [cats, it] = await Promise.all([categoriesApi.list(), itemsApi.get(id)]);
        setCategories(cats);
        setItem(it);
        setForm({
          nome: it.nome,
          sku: it.sku,
          descricao: it.descricao || "",
          quantidade: it.quantidade,
          preco: it.preco,
          status: it.status,
          categoriaId: it.categoriaId,
        });
      } catch (e: any) {
        setErr(e?.message || "Falha ao carregar item.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const canSave = useMemo(() => {
    return (
      form.nome.trim().length > 0 &&
      form.sku.trim().length > 0 &&
      form.categoriaId > 0 &&
      form.quantidade >= 0 &&
      form.preco >= 0
    );
  }, [form]);

  async function submit() {
    setSaving(true);
    setErr(null);
    try {
      const updated = await itemsApi.update(id, {
        ...form,
        descricao: form.descricao?.trim() ? form.descricao : null,
      });
      router.push(`/items/${updated.id}`);
    } catch (e: any) {
      setErr(e?.message || "Falha ao atualizar item.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Carregando...</div>;
  if (err) return <div style={{ padding: 24 }}>{err}</div>;
  if (!item) return <div style={{ padding: 24 }}>Item não encontrado.</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Link href={`/items/${id}`} style={{ textDecoration: "none", color: "white", opacity: 0.85 }}>
        ← Voltar
      </Link>

      <h1 style={{ fontSize: 42, fontWeight: 900, margin: "12px 0 4px" }}>Editar Item</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Atualize as informações do item</p>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <section style={card}>
            <h2 style={h2}>Informações Básicas</h2>
            <p style={{ margin: "6px 0 0", opacity: 0.8 }}>Dados principais do item</p>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700 }}>Nome *</label>
                <input
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700 }}>SKU / Código *</label>
                <input
                  value={form.sku}
                  onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontWeight: 700 }}>Descrição</label>
              <textarea
                value={form.descricao || ""}
                onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              />
            </div>
          </section>

          <section style={card}>
            <h2 style={h2}>Classificação</h2>
            <p style={{ margin: "6px 0 0", opacity: 0.8 }}>Categoria do item</p>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontWeight: 700 }}>Categoria *</label>
              <select
                value={form.categoriaId}
                onChange={(e) => setForm((p) => ({ ...p, categoriaId: Number(e.target.value) }))}
                style={inputStyle}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section style={card}>
            <h2 style={h2}>Estoque e Preço</h2>
            <p style={{ margin: "6px 0 0", opacity: 0.8 }}>Quantidade e valores</p>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700 }}>Quantidade *</label>
                <input
                  type="number"
                  value={form.quantidade}
                  onChange={(e) => setForm((p) => ({ ...p, quantidade: Number(e.target.value) }))}
                  style={inputStyle}
                  min={0}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700 }}>Preço Unitário *</label>
                <input
                  type="number"
                  value={form.preco}
                  onChange={(e) => setForm((p) => ({ ...p, preco: Number(e.target.value) }))}
                  style={inputStyle}
                  min={0}
                  step="0.01"
                />
              </div>
            </div>
          </section>
        </div>

        <aside style={{ ...card, position: "sticky", top: 16 }}>
          <h2 style={{ ...h2, marginBottom: 6 }}>Ações</h2>
          <div style={{ opacity: 0.8, marginBottom: 12 }}>Salvar alterações</div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 700 }}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              style={inputStyle}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>

          <button
            onClick={submit}
            disabled={!canSave || saving}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: !canSave || saving ? "rgba(29,78,216,0.35)" : "#1d4ed8",
              color: "white",
              cursor: !canSave || saving ? "not-allowed" : "pointer",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            {saving ? "Atualizando..." : "Atualizar Item"}
          </button>

          <Link
            href={`/items/${id}`}
            style={{
              display: "block",
              marginTop: 10,
              textAlign: "center",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Cancelar
          </Link>
        </aside>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  padding: 16,
};

const h2: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "white",
  outline: "none",
};