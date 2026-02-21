"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categoriesApi, itemsApi } from "@/lib/api";
import type { Category, Item, ItemStatus } from "@/lib/types";

function moneyBR(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);
}

const pageWrap: React.CSSProperties = { padding: 28, color: "#fff" };

const h1Style: React.CSSProperties = { fontSize: 44, fontWeight: 800, margin: 0, letterSpacing: -0.5 };
const subStyle: React.CSSProperties = { marginTop: 6, opacity: 0.75 };

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  marginTop: 10,
};

const primaryBtn: React.CSSProperties = {
  background: "#1e66ff",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  textDecoration: "none",
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const bar: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  display: "grid",
  gridTemplateColumns: "1fr 220px 200px 140px",
  gap: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
  outline: "none",
};

const selectStyle: React.CSSProperties = inputStyle;

const grid: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  padding: 18,
  textDecoration: "none",
  color: "#fff",
};

const badge: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  background: "rgba(30,102,255,0.20)",
  border: "1px solid rgba(30,102,255,0.40)",
  color: "#dfe9ff",
};

const muted: React.CSSProperties = { opacity: 0.75 };
const hr: React.CSSProperties = { height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" };

export default function ItemsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [status, setStatus] = useState<ItemStatus | "all">("all");

  async function loadAll() {
    try {
      setError(null);
      setLoading(true);
      const [it, cat] = await Promise.all([itemsApi.list(), categoriesApi.list()]);
      setItems(it);
      setCategories(cat);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return items.filter((it) => {
      const matchesQ =
        !qq ||
        it.nome.toLowerCase().includes(qq) ||
        it.sku.toLowerCase().includes(qq) ||
        (it.descricao ?? "").toLowerCase().includes(qq);

      const matchesCategory = categoryId === "all" ? true : it.categoriaId === categoryId;
      const matchesStatus = status === "all" ? true : it.status === status;

      return matchesQ && matchesCategory && matchesStatus;
    });
  }, [items, q, categoryId, status]);

  return (
    <div style={pageWrap}>
      <div style={topRow}>
        <div>
          <h1 style={h1Style}>Itens do Inventário</h1>
          <div style={subStyle}>Gerencie os itens do seu estoque</div>
        </div>

        <Link href="/items/new" style={primaryBtn}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Novo Item
        </Link>
      </div>

      <div style={bar}>
        <input
          style={inputStyle}
          placeholder="Buscar por nome, SKU..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          style={selectStyle}
          value={categoryId}
          onChange={(e) => {
            const v = e.target.value;
            setCategoryId(v === "all" ? "all" : Number(v));
          }}
        >
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="all">Todos os status</option>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>

        <button
          onClick={loadAll}
          style={{
            ...inputStyle,
            cursor: "pointer",
            fontWeight: 800,
            background: "rgba(255,255,255,0.06)",
          }}
          type="button"
        >
          Recarregar
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 14, color: "#ffb3b3" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ marginTop: 18, opacity: 0.8 }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ marginTop: 18, opacity: 0.8 }}>Nenhum item encontrado.</div>
      ) : (
        <div style={grid}>
          {filtered.map((it) => (
            <Link key={it.id} href={`/items/${it.id}`} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{it.nome}</div>
                <span style={badge}>{it.status === "ACTIVE" ? "Ativo" : "Inativo"}</span>
              </div>

              <div style={{ marginTop: 8, ...muted }}>SKU: {it.sku}</div>

              {it.descricao ? <div style={{ marginTop: 10, ...muted }}>{it.descricao}</div> : null}

              <div style={hr} />

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ ...muted, fontSize: 12 }}>Quantidade</div>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>
                    {it.quantidade} <span style={{ fontSize: 14, fontWeight: 800, opacity: 0.85 }}>un</span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ ...muted, fontSize: 12 }}>Preço Unit.</div>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>{moneyBR(it.preco)}</div>
                </div>
              </div>

              <div style={{ marginTop: 10, ...muted }}>
                Categoria: {it.categoriaNome ?? "—"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}